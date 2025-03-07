// services/staking-service.ts

import { sendMessage } from '@/lib/messages';
import { dryrun, result } from '@permaweb/aoconnect';
import { StakingPosition, TokenInfo, ILProtectionInfo } from '@/types/staking';
import { adjustDecimalString, withRetry } from '@/lib/utils';
import {
    CACHE_EXPIRY,
    generateCacheKey,
    getFromCache,
    setCache,
} from '@/lib/cache';

// Constants
const MINT_PROCESS = 'TO_UPDATE';
const MAX_VESTING_DAYS = 30;
const MAX_COVERAGE_PERCENTAGE = 50;
const MAX_COMPENSATION_CAP = 50000; // 50,000 MINT tokens maximum compensation

// Helper function to process messages with or without cache
async function sendAndGetResult(
    target: string,
    tags: { name: string; value: string }[],
    signer = false,
    cacheExpiry: number | false = false,
    data = ''
) {
    let response;
    let cached;
    let cacheKey = '';

    // Check cache if caching is enabled
    if (cacheExpiry) {
        cacheKey = generateCacheKey(target, tags);
        cached = await getFromCache(cacheKey);
    }

    if (cached) {
        return cached;
    }

    // Execute the operation based on whether signing is required
    if (signer === false) {
        response = await dryrun({
            process: target,
            tags,
            data,
        });
    } else {
        const messageId = await sendMessage(target, tags, signer, data);
        if (!messageId) {
            throw new Error('Failed to send message');
        }

        response = await result({
            message: messageId,
            process: target,
        });
    }

    // Cache the result if caching is enabled
    if (cacheExpiry) {
        setCache(cacheKey, response, cacheExpiry);
    }

    return response;
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
                CACHE_EXPIRY.HOUR
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
                    ammAddress: string;
                }) => ({
                    address: token.address,
                    name: token.name || token.symbol,
                    symbol: token.symbol,
                    decimals: token.decimals || 8,
                    ammAddress: token.ammAddress,
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
export async function getTokenBalance(
    tokenAddress: string,
    userAddress: string
): Promise<{ balance: string; symbol: string; decimals: number } | null> {
    try {
        const response = await sendAndGetResult(
            tokenAddress,
            [
                { name: 'Action', value: 'Balance' },
                { name: 'Target', value: userAddress },
            ],
            false,
            false // Don't cache balance as it changes frequently
        );

        if (!response?.Messages?.[0]?.Tags) {
            throw new Error('Invalid response format for token balance');
        }

        // Extract data from tags
        const tags = response.Messages[0].Tags;
        const balance = tags.find(
            (tag: { name: string }) => tag.name === 'Balance'
        )?.value;
        const symbol = tags.find(
            (tag: { name: string }) => tag.name === 'Ticker'
        )?.value;
        const decimals = Number(
            tags.find((tag: { name: string }) => tag.name === 'Denomination')
                ?.value || '8'
        );

        if (!balance || !symbol) {
            throw new Error('Missing balance or symbol in response');
        }

        // Adjust balance with proper decimal places
        const adjustedBalance = adjustDecimalString(balance, decimals);

        return {
            balance: adjustedBalance,
            symbol,
            decimals,
        };
    } catch (error) {
        console.error(
            `Error fetching balance for token ${tokenAddress}:`,
            error
        );
        return null;
    }
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
            [
                { name: 'Action', value: 'Get-All-Positions' },
                { name: 'User', value: userAddress },
            ],
            false,
            CACHE_EXPIRY.MINUTE * 5
        );

        if (!response?.Messages?.[0]?.Data) {
            return []; // No positions or invalid response
        }

        const positionsData = JSON.parse(response.Messages[0].Data);

        // Map API response to our StakingPosition interface
        return positionsData.map(
            (pos: {
                stakedDate: string | number | Date;
                id: string;
                token: string;
                tokenAddress: string;
                initialAmount: string;
                currentValue: string;
                lpTokens: string;
                estimatedRewards: string;
                initialPriceRatio: string;
                finalPriceRatio: string;
            }) => {
                // Calculate IL protection percentage based on staking date
                const stakedDate = new Date(pos.stakedDate);
                const now = new Date();
                const daysStaked = Math.floor(
                    (now.getTime() - stakedDate.getTime()) /
                        (1000 * 60 * 60 * 24)
                );
                const ilProtectionPercentage = Math.min(
                    (daysStaked / MAX_VESTING_DAYS) * MAX_COVERAGE_PERCENTAGE,
                    MAX_COVERAGE_PERCENTAGE
                );

                return {
                    id: pos.id,
                    token: pos.token,
                    tokenAddress: pos.tokenAddress,
                    initialAmount: pos.initialAmount,
                    currentValue: pos.currentValue,
                    stakedDate,
                    ilProtectionPercentage,
                    lpTokens: pos.lpTokens,
                    estimatedRewards: pos.estimatedRewards || '0',
                    initialPriceRatio: pos.initialPriceRatio,
                    finalPriceRatio: pos.finalPriceRatio,
                };
            }
        );
    } catch (error) {
        console.error('Error fetching user positions:', error);
        return [];
    }
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
            CACHE_EXPIRY.MINUTE * 2 // Cache for 2 minutes
        );

        if (!response?.Messages?.[0]?.Data) {
            throw new Error('Position not found or invalid response');
        }

        const positionData = JSON.parse(response.Messages[0].Data);

        // Calculate IL protection percentage
        const stakedDate = new Date(positionData.stakedDate);
        const now = new Date();
        const daysStaked = Math.floor(
            (now.getTime() - stakedDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        const ilProtectionPercentage = Math.min(
            (daysStaked / MAX_VESTING_DAYS) * MAX_COVERAGE_PERCENTAGE,
            MAX_COVERAGE_PERCENTAGE
        );

        return {
            id: positionData.id,
            token: positionData.token,
            tokenAddress: positionData.tokenAddress,
            initialAmount: positionData.initialAmount,
            currentValue: positionData.currentValue,
            stakedDate,
            ilProtectionPercentage,
            lpTokens: positionData.lpTokens,
            estimatedRewards: positionData.estimatedRewards || '0',
            initialPriceRatio: positionData.initialPriceRatio,
            finalPriceRatio: positionData.finalPriceRatio,
        };
    } catch (error) {
        console.error(
            `Error fetching position details for ${positionId}:`,
            error
        );
        return null;
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
): Promise<string> {
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
        const decimals = token?.decimals || 8;

        // Remove decimal point and format for blockchain
        const formattedAmount = amount.replace('.', '').padEnd(decimals, '0');

        // Send staking transaction
        const messageId = await sendMessage(
            tokenAddress,
            [
                { name: 'Action', value: 'Credit-Notice' },
                { name: 'X-User-Request', value: 'Stake' },
                { name: 'Qty', value: formattedAmount },
            ],
            true // Use real signer
        );

        if (!messageId) {
            throw new Error('Failed to initiate staking transaction');
        }

        return messageId;
    } catch (error) {
        console.error('Error staking tokens:', error);
        throw error;
    }
}

/**
 * Unstakes tokens from a position
 * @param positionId ID of the position to unstake from
 * @param tokenAddress Address of the token being unstaked
 * @param amount Amount to unstake
 * @returns Transaction ID if successful
 */
export async function unstakeTokens(
    positionId: string,
    tokenAddress: string,
    amount: string
): Promise<string> {
    try {
        // Format the amount according to token decimals
        const allowedTokens = await getAllowedTokens();
        const token = allowedTokens.find((t) => t.address === tokenAddress);
        const decimals = token?.decimals || 8;

        // Remove decimal point and format for blockchain
        const formattedAmount = amount.replace('.', '').padEnd(decimals, '0');

        // Send unstaking transaction
        const messageId = await sendMessage(
            MINT_PROCESS,
            [
                { name: 'Action', value: 'Unstake' },
                { name: 'Token', value: tokenAddress },
                { name: 'Position-ID', value: positionId },
                { name: 'Amount', value: formattedAmount },
            ],
            true // Use real signer
        );

        if (!messageId) {
            throw new Error('Failed to initiate unstaking transaction');
        }

        return messageId;
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
 * Fetches the current price ratio for a token/MINT pair
 * @param tokenAddress Address of the token
 * @returns Current price ratio or null if unavailable
 */
export async function getCurrentPriceRatio(
    tokenAddress: string
): Promise<number | null> {
    try {
        const response = await sendAndGetResult(
            MINT_PROCESS,
            [
                { name: 'Action', value: 'Get-Price-Ratio' },
                { name: 'Token', value: tokenAddress },
            ],
            false,
            CACHE_EXPIRY.MINUTE * 5 // Cache for 5 minutes as prices change
        );

        if (!response?.Messages?.[0]?.Data) {
            throw new Error('Invalid response format for price ratio');
        }

        return parseFloat(response.Messages[0].Data);
    } catch (error) {
        console.error(
            `Error fetching price ratio for token ${tokenAddress}:`,
            error
        );
        return null;
    }
}

/**
 * Calculates historical price data for a position
 * @param positionId ID of the position
 * @param userAddress User's wallet address
 * @returns Array of price data points or empty array if unavailable
 */
export async function getPositionPriceHistory(
    positionId: string,
    userAddress: string
) {
    try {
        const response = await sendAndGetResult(
            MINT_PROCESS,
            [
                { name: 'Action', value: 'Get-Position-History' },
                { name: 'Position-ID', value: positionId },
                { name: 'User', value: userAddress },
            ],
            false,
            CACHE_EXPIRY.HOUR // Cache for an hour
        );

        if (!response?.Messages?.[0]?.Data) {
            return []; // No history or invalid response
        }

        return JSON.parse(response.Messages[0].Data);
    } catch (error) {
        console.error(
            `Error fetching price history for position ${positionId}:`,
            error
        );
        return [];
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
                totalStaked: '0',
                averageILProtection: 0,
                totalEarned: '0',
            };
        }

        // Calculate total staked value
        const totalStaked = positions
            .reduce((sum, pos) => sum + parseFloat(pos.currentValue), 0)
            .toFixed(2);

        // Calculate average IL protection
        const averageILProtection =
            positions.reduce(
                (sum, pos) => sum + pos.ilProtectionPercentage,
                0
            ) / positions.length;

        // Calculate total estimated rewards
        const totalEarned = positions
            .reduce((sum, pos) => sum + parseFloat(pos.estimatedRewards), 0)
            .toFixed(2);

        return {
            totalStaked,
            averageILProtection,
            totalEarned,
        };
    } catch (error) {
        console.error('Error calculating dashboard metrics:', error);
        return {
            totalStaked: '0',
            averageILProtection: 0,
            totalEarned: '0',
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
