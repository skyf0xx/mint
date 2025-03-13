// services/staking-service.ts

import { StakingPosition, TokenInfo, ILProtectionInfo } from '@/types/staking';
import { withRetry } from '@/lib/utils';
import { CACHE_EXPIRY, deleteFromCache, generateCacheKey } from '@/lib/cache';
import {
    getBalance,
    MINT_PROCESS,
    sendAndGetResult,
} from '@/lib/wallet-actions';
import { createDataItemSigner } from '@permaweb/aoconnect';
import BigNumber from 'bignumber.js';

// Constants
const MAX_VESTING_DAYS = 30;
const MAX_COVERAGE_PERCENTAGE = 50;
const MAX_COMPENSATION_CAP = 50000; // TODO: get these constants from the protocol

function symbolFromName(name: string): string {
    const match = name.match(/\(([^)]+)\)/);
    return match ? match[1] : '';
}

function extractName(name: string): string {
    return name.split('(')[0].trim();
}

function protectionPercentage(timeStaked: string): number {
    const daysStaked = calculateDaysFromTimeStaked(timeStaked);
    return Math.min(
        (daysStaked / MAX_VESTING_DAYS) * MAX_COVERAGE_PERCENTAGE,
        MAX_COVERAGE_PERCENTAGE
    );
}

function convertForBlockchain(numberStr: string, exponent: number): string {
    try {
        const num = new BigNumber(numberStr);
        const multiplier = new BigNumber(10).pow(exponent);
        return num.times(multiplier).toString();
    } catch (error) {
        // Handle invalid input
        console.error('Invalid number format:', error);
        return '0';
    }
}

/**
 * Fetches all tokens supported by the staking protocol
 * @returns Array of token information
 */
export async function getAllowedTokens(): Promise<TokenInfo[]> {
    try {
        return await withRetry(async () => {
            const response = await sendAndGetResult(
                MINT_PROCESS,
                [{ name: 'Action', value: 'Get-Allowed-Tokens' }],
                false,
                CACHE_EXPIRY.DAY
            );
            if (!response?.Messages?.[0]?.Data) {
                throw new Error('Invalid response format for allowed tokens');
            }

            const tokens = JSON.parse(response.Messages[0].Data);

            // Validate token data and ensure required fields
            return tokens.map(
                (token: {
                    address: string;
                    name: string;
                    symbol: string;
                    decimals: string;
                    amm: string;
                }) => ({
                    address: token.address,
                    name: extractName(token.name),
                    symbol: symbolFromName(token.name),
                    decimals: token.decimals || 8,
                    ammAddress: token.amm,
                })
            );
        });
    } catch (error) {
        console.error('Error fetching allowed tokens:', error);
        return [];
    }
}

/**
 * Gets token balance for the provided address
 * @param tokenAddress Token contract address
 * @param userAddress User's wallet address
 * @returns Token balance and symbol information
 */
const tokenInfo = [
    //TODO: get token info from protocol in the future
    {
        tokenAddress: 'NG-0lVX882MG5nhARrSzyprEK6ejonHpdUmaaMPsHE8',
        symbol: 'qAR',
        decimals: 12,
    },
    {
        tokenAddress: 'xU9zFkq3X2ZQ6olwNVvr1vUWIjc3kXTWr7xKQD6dh10',
        symbol: 'wAR',
        decimals: 12,
    },
    {
        tokenAddress: 'OsK9Vgjxo0ypX_HLz2iJJuh4hp3I80yA9KArsJjIloU',
        symbol: 'NAB',
        decimals: 8,
    },
    {
        tokenAddress: '0syT13r0s0tgPmIed95bJnuSqaD29HQNN8D3ElLSrsc',
        symbol: 'AO',
        decimals: 12,
    },
    {
        tokenAddress: '7zH9dlMNoxprab9loshv3Y7WG45DOny_Vrq9KrXObdQ',
        symbol: 'USDC',
        decimals: 6,
    },
];

export async function getTokenBalance(
    tokenAddress: string,
    userAddress: string
): Promise<{ balance: string; symbol: string; decimals: number } | null> {
    try {
        const token = tokenInfo.find((t) => t.tokenAddress === tokenAddress);
        if (!token) {
            throw new Error('Token not found in staking service');
        }

        const balanceData = await getBalance(
            userAddress,
            tokenAddress,
            token.decimals
        );
        if (!balanceData) return null;

        return {
            balance: balanceData.balance,
            symbol: token.symbol,
            decimals: token.decimals,
        };
    } catch (error) {
        console.error('Error fetching token balance:', error);
        return null;
    }
}

function getPostionTags(userAddress: string) {
    return [
        { name: 'Action', value: 'Get-All-Positions' },
        { name: 'User', value: userAddress },
    ];
}

export async function deleteUserPositionsCache(userAddress: string) {
    const tags = getPostionTags(userAddress);
    const cacheKey =
        generateCacheKey(MINT_PROCESS, tags) +
        (userAddress ? '-' + userAddress : '');
    deleteFromCache(cacheKey);
}

/**
 * Retrieves all staking positions for a user
 * @param userAddress User's wallet address
 * @returns Array of staking positions
 */
export async function getUserPositions(
    userAddress: string
): Promise<StakingPosition[]> {
    try {
        const response = await sendAndGetResult(
            MINT_PROCESS,
            getPostionTags(userAddress),
            false,
            CACHE_EXPIRY.MINUTE * 5,
            userAddress
        );

        if (!response?.Messages?.[0]?.Data) {
            return []; // No positions or invalid response
        }

        const positionsData = JSON.parse(response.Messages[0].Data);
        const positions: StakingPosition[] = [];

        // The contract returns positions as an object with token addresses as keys
        for (const [tokenAddress, posData] of Object.entries(positionsData)) {
            const position = posData as {
                name: string;
                amount: string;
                formattedAmount: string;
                lpTokens: string;
                formattedLpTokens: string;
                mintAmount: string;
                timeStaked: string;
                amm: string;
            };

            positions.push({
                id: `${tokenAddress}-${Date.now()}`, // Generate unique ID
                tokenName: extractName(position.name),
                tokenSymbol: symbolFromName(position.name),
                tokenAddress: tokenAddress,
                tokenAmount: position.amount,
                formattedTokenAmount: position.formattedAmount,
                lpTokens: position.lpTokens,
                formattedLpTokens: position.formattedLpTokens,
                mintAmount: position.mintAmount,
                timeStaked: position.timeStaked,
                stakedDate: calculateStakedDate(position.timeStaked),
                amm: position.amm,
                ilProtectionPercentage: protectionPercentage(
                    position.timeStaked
                ),
            });
        }

        return positions;
    } catch (error) {
        console.error('Error fetching user positions:', error);
        return [];
    }
}

// Helper function to calculate days from timeStaked string
function calculateDaysFromTimeStaked(timeStaked: string): number {
    // Parse timeStaked format (e.g., "14d 6h")
    const dayMatch = timeStaked.match(/(\d+)d/);
    return dayMatch ? parseInt(dayMatch[1]) : 0;
}

// Helper function to calculate staked date from timeStaked string
function calculateStakedDate(timeStaked: string): Date {
    const days = calculateDaysFromTimeStaked(timeStaked);
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
}

/**
 * Gets detailed information about a specific position
 * @param positionId Position identifier
 * @param userAddress User's wallet address
 * @returns Detailed position information or null if not found
 */
export async function getPositionDetails(
    positionId: string,
    userAddress: string
): Promise<StakingPosition | null> {
    try {
        const response = await sendAndGetResult(
            MINT_PROCESS,
            [
                { name: 'Action', value: 'Get-Position' },
                { name: 'Position-ID', value: positionId },
                { name: 'User', value: userAddress },
            ],
            false,
            CACHE_EXPIRY.MINUTE * 2, // Cache for 2 minutes
            userAddress
        );

        if (!response?.Messages?.[0]?.Data) {
            throw new Error('Position not found or invalid response');
        }

        const positionData = JSON.parse(response.Messages[0].Data);

        // Calculate IL protection percentage
        const stakedDate = new Date(positionData.stakedDate);
        const now = new Date();

        // Format timeStaked string
        const timeStaked = formatTimeStaked(stakedDate, now);

        // Extract token details
        const tokenSymbol =
            positionData.tokenSymbol || symbolFromName(positionData.token);
        const tokenName =
            positionData.tokenName || extractName(positionData.token);

        return {
            id: positionData.id,
            tokenName: tokenName,
            tokenSymbol: tokenSymbol,
            tokenAddress: positionData.tokenAddress,
            tokenAmount: positionData.tokenAmount || positionData.initialAmount,
            formattedTokenAmount:
                positionData.formattedTokenAmount || positionData.initialAmount,
            lpTokens: positionData.lpTokens,
            formattedLpTokens:
                positionData.formattedLpTokens || positionData.lpTokens,
            mintAmount: positionData.mintAmount,
            stakedDate,
            timeStaked,
            amm: positionData.amm,
            ilProtectionPercentage: protectionPercentage(
                positionData.timeStaked
            ),
        };
    } catch (error) {
        console.error(
            `Error fetching position details for ${positionId}:`,
            error
        );
        return null;
    }
}

// Helper function to format time staked
function formatTimeStaked(stakedDate: Date, now: Date = new Date()): string {
    const diffMs = now.getTime() - stakedDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(
        (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);

    if (diffDays > 0) {
        return `${diffDays}d ${diffHours}h ${diffMinutes}m ${diffSeconds}s`;
    } else if (diffHours > 0) {
        return `${diffHours}h ${diffMinutes}m ${diffSeconds}s`;
    } else {
        return `${diffMinutes}m ${diffSeconds}s`;
    }
}

/**
 * Stakes tokens into the protocol
 * @param tokenAddress Address of the token to stake
 * @param amount Amount to stake
 * @returns Transaction ID if successful
 */
export async function stakeTokens(
    tokenAddress: string,
    amount: string
): Promise<boolean> {
    try {
        // First, verify the token is supported
        const allowedTokens = await getAllowedTokens();
        const isAllowed = allowedTokens.some(
            (token) => token.address === tokenAddress
        );

        if (!isAllowed) {
            throw new Error('Token not supported for staking');
        }

        // Format the amount according to token decimals
        const token = allowedTokens.find((t) => t.address === tokenAddress);
        const decimals = token?.decimals;

        if (!decimals) {
            throw new Error('Token decimals not found');
        }

        const formattedAmount = convertForBlockchain(amount, decimals);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const signer = createDataItemSigner((globalThis as any).arweaveWallet);
        const result = await sendAndGetResult(
            tokenAddress,
            [
                { name: 'Action', value: 'Transfer' },
                { name: 'X-User-Request', value: 'Stake' },
                { name: 'Quantity', value: formattedAmount },
                { name: 'Recipient', value: MINT_PROCESS },
            ],
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            signer as any,
            false
        );

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((result as any).Error) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            throw new Error((result as any).Error);
        }

        if (result.Messages && result.Messages.length > 0) {
            const errorTag = result.Messages[0].Tags.find(
                (tag) => tag.name === 'Error'
            );
            if (errorTag) {
                throw new Error(errorTag.value);
            }
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error staking tokens:', error);
        throw error;
    }
}

/**
 * Unstakes tokens from a position
 * @param tokenAddress Address of the token being unstaked
 * @returns Transaction ID if successful
 */
export async function unstakeTokens(tokenAddress: string): Promise<boolean> {
    try {
        // Format the amount according to token decimals
        const allowedTokens = await getAllowedTokens();
        const token = allowedTokens.find((t) => t.address === tokenAddress);
        const decimals = token?.decimals;
        if (!decimals) {
            throw new Error('Token decimals not found');
        }

        // Create signer using the wallet
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const signer = createDataItemSigner((globalThis as any).arweaveWallet);

        // Send unstaking transaction with proper signer
        const result = await sendAndGetResult(
            MINT_PROCESS,
            [
                { name: 'Action', value: 'Unstake' },
                { name: 'Token', value: tokenAddress },
            ],
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            signer as any,
            false
        );

        // Handle error in result
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((result as any).Error) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            throw new Error((result as any).Error);
        }

        // Check for error tags in the response
        if (result.Messages && result.Messages.length > 0) {
            const errorTag = result.Messages[0].Tags.find(
                (tag) => tag.name === 'Error'
            );
            if (errorTag) {
                throw new Error(errorTag.value);
            }
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error unstaking tokens:', error);
        throw error;
    }
}

/**
 * Calculates impermanent loss protection based on days staked and other factors
 * @param daysStaked Number of days the position has been staked
 * @param impermanentLossAmount Amount of impermanent loss in token units
 * @param finalPriceRatio Final price ratio of token/MINT
 * @returns Impermanent loss protection information
 */
export function calculateILProtection(
    daysStaked: number,
    impermanentLossAmount: string,
    finalPriceRatio: number
): ILProtectionInfo {
    // Calculate coverage percentage (linear vesting up to 50%)
    const coveragePercentage = Math.min(
        (daysStaked / MAX_VESTING_DAYS) * MAX_COVERAGE_PERCENTAGE,
        MAX_COVERAGE_PERCENTAGE
    );

    // Calculate compensation amount based on the formula in the brief
    // MINT_comp = min(IL_X * Coverage% * R_final, COMP_CAP)
    const ilAmount = parseFloat(impermanentLossAmount);
    const compensation = Math.min(
        ilAmount * (coveragePercentage / 100) * finalPriceRatio,
        MAX_COMPENSATION_CAP
    );

    return {
        impermanentLoss: impermanentLossAmount,
        coveragePercentage,
        compensationAmount: compensation.toFixed(2),
    };
}

/**
 * Gets insurance information for impermanent loss protection
 * @returns Details about the insurance mechanism
 */
export async function getInsuranceInfo() {
    try {
        const response = await sendAndGetResult(
            MINT_PROCESS,
            [{ name: 'Action', value: 'Get-Insurance-Info' }],
            false,
            CACHE_EXPIRY.DAY // Cache for a day as this rarely changes
        );

        if (!response?.Messages?.[0]?.Data) {
            throw new Error('Invalid response format for insurance info');
        }

        return JSON.parse(response.Messages[0].Data);
    } catch (error) {
        console.error('Error fetching insurance information:', error);

        // Return default insurance information
        return {
            vestingPeriod: MAX_VESTING_DAYS,
            maxCoverage: MAX_COVERAGE_PERCENTAGE,
            compensationCap: MAX_COMPENSATION_CAP,
            description:
                'Impermanent loss protection vests linearly over 30 days to a maximum of 50% coverage. Compensation is capped at 50,000 MINT tokens per user.',
        };
    }
}

/**
 * Fetches dashboard metrics for a user
 * @param userAddress User's wallet address
 * @returns Dashboard metrics or default values if unavailable
 */
export async function getDashboardMetrics(userAddress: string) {
    try {
        const positions = await getUserPositions(userAddress);

        if (positions.length === 0) {
            return {
                totalTokens: '0',
                positionsCount: 0,
                oldestPosition: '0d',
            };
        }

        // Group tokens by symbol for better display
        const tokenGroups = positions.reduce((groups, pos) => {
            if (!groups[pos.tokenSymbol]) {
                groups[pos.tokenSymbol] = 0;
            }
            groups[pos.tokenSymbol] += parseFloat(pos.formattedTokenAmount);
            return groups;
        }, {} as Record<string, number>);

        // Format token totals for display
        const totalTokens = Object.entries(tokenGroups)
            .map(([token, amount]) => `${amount.toFixed(2)} ${token}`)
            .join(', ');

        // Count positions
        const positionsCount = positions.length;

        // Find the oldest position (for IL vesting context)
        const oldestPosition =
            positions
                .map((pos) => pos.timeStaked)
                .sort((a, b) => {
                    const daysA = calculateDaysFromTimeStaked(a);
                    const daysB = calculateDaysFromTimeStaked(b);
                    return daysB - daysA; // Descending order
                })[0] || '0d';

        return {
            totalTokens,
            positionsCount,
            oldestPosition,
        };
    } catch (error) {
        console.error('Error calculating dashboard metrics:', error);
        return {
            totalTokens: '0',
            positionsCount: 0,
            oldestPosition: '0d',
        };
    }
}

/**
 * Verifies if a wallet has sufficient balance for staking
 * @param tokenAddress Token contract address
 * @param amount Amount to stake
 * @param userAddress User's wallet address
 * @returns Boolean indicating if balance is sufficient
 */
export async function checkSufficientBalance(
    tokenAddress: string,
    amount: string,
    userAddress: string
): Promise<boolean> {
    try {
        const balanceInfo = await getTokenBalance(tokenAddress, userAddress);

        if (!balanceInfo) {
            return false;
        }

        return parseFloat(balanceInfo.balance) >= parseFloat(amount);
    } catch (error) {
        console.error('Error checking balance:', error);
        return false;
    }
}
