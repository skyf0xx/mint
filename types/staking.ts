// types/staking.ts
import { JWK } from '@/lib/wallet-actions';

/**
 * Represents a user's staking position in a liquidity pool
 */
// types/staking.ts (update to the existing interface)
export interface StakingPosition {
    /** Unique identifier for the position */
    id: string;

    /** Token symbol (e.g., qAR, wAR, NAB) */
    token: string;

    /** Contract address of the token */
    tokenAddress: string;

    /** Initial amount of tokens staked */
    initialAmount: string;

    /** Current value of the position in token terms */
    currentValue: string;

    /** Date when the position was created */
    stakedDate: Date;

    /** Current IL protection percentage (0-50%) */
    ilProtectionPercentage: number;

    /** LP tokens received when staking */
    lpTokens: string;

    /** Estimated rewards accrued */
    estimatedRewards: string;

    /** Time staked as formatted string (e.g., "14d 6h") */
    timeStaked: string;

    /** Final price ratio at the time of unstaking (token/MINT) */
    finalPriceRatio?: number;

    /** Initial price ratio at the time of staking (token/MINT) */
    initialPriceRatio?: number;
}

/**
 * Information about a supported token
 */
export interface TokenInfo {
    /** Contract address of the token */
    address: string;

    /** Full name of the token */
    name: string;

    /** Symbol of the token (e.g., qAR) */
    symbol: string;

    /** Number of decimal places for the token */
    decimals: number;

    /** User's current balance of this token */
    balance?: string;

    /** Current price of the token in USD or reference currency */
    price?: string;

    /** AMM address for this token's liquidity pool */
    ammAddress?: string;
}

/**
 * Form data for staking operation
 */
export interface StakingFormData {
    /** Address of the token to stake */
    tokenAddress: string;

    /** Symbol of the token to stake */
    token: string;

    /** Amount to stake */
    amount: string;
}

/**
 * Form data for unstaking operation
 */
export interface UnstakingFormData {
    /** ID of the position to unstake from */
    positionId: string;

    /** Amount to unstake */
    amount: string;
}

/**
 * Information about impermanent loss protection calculation
 */
export interface ILProtectionInfo {
    /** Amount of impermanent loss in token terms */
    impermanentLoss: string;

    /** Percentage of IL that is covered (0-50%) */
    coveragePercentage: number;

    /** Amount of compensation for IL in token terms */
    compensationAmount: string;
}

/**
 * Status of a transaction
 */
export type TransactionStatus = 'idle' | 'pending' | 'success' | 'error';

/**
 * State of a transaction
 */
export interface TransactionState {
    /** Current status of the transaction */
    status: TransactionStatus;

    /** Transaction ID if available */
    txId?: string;

    /** Informational message about the transaction */
    message: string;

    /** Error object if transaction failed */
    error?: Error;
}

/**
 * Available views in the staking app
 */
export type AppView =
    | 'dashboard'
    | 'staking'
    | 'unstaking'
    | 'position-details';

/**
 * Names of protocol events
 */
export type StakingEventName =
    | 'Stake-Complete'
    | 'Unstake-Started'
    | 'Unstake-Complete';

/**
 * State of a staking event
 */
export interface StakingEvent {
    /** Unique ID of the event */
    id: string;

    /** Type of event */
    type: StakingEventName;

    /** Timestamp when the event occurred */
    timestamp: number;

    /** Additional event data */
    data?: Record<string, never>;
}

/**
 * Structure for API requests and responses
 */
export interface ApiRequest {
    action: string;
    tags: { name: string; value: string }[];
    target?: string;
    data?: string;
}

/**
 * Dashboard metrics data
 */
// Add to types/staking.ts
export interface DashboardMetrics {
    /** Total value staked across all positions */
    totalStaked: string;

    /** Total tokens staked by symbol */
    totalTokens: string;

    /** Average IL protection percentage */
    averageILProtection: number;

    /** Number of active staking positions */
    positionsCount: number;

    /** Age of oldest staking position */
    oldestPosition: string;
}

/**
 * Options for a token selector
 */
export interface TokenOption {
    /** Token symbol */
    value: string;

    /** Display label */
    label: string;

    /** Token icon URL */
    icon?: string;

    /** User's balance of this token */
    balance?: string;
}

/**
 * Parameters for IL protection calculation
 */
export interface ILProtectionParams {
    /** Initial deposit amount */
    initialAmount: string;

    /** Current position value */
    currentValue: string;

    /** Number of days the position has been staked */
    daysStaked: number;

    /** Final price ratio (token/MINT) */
    finalPriceRatio: number;
}

/**
 * User settings for the staking app
 */
export interface StakingUserSettings {
    /** Preferred token for staking */
    preferredToken?: string;

    /** Whether to show advanced metrics */
    showAdvancedMetrics: boolean;

    /** Notification preferences */
    notifications: {
        stakeComplete: boolean;
        unstakeComplete: boolean;
        ilProtectionUpdates: boolean;
    };
}

/**
 * Error response from the API
 */
export interface ApiError {
    /** Error code */
    code: string;

    /** Error message */
    message: string;

    /** Additional error details */
    details?: Record<string, never>;
}

/**
 * Wallet connection options
 */
export interface WalletConnectionOptions {
    /** Required permissions */
    permissions: string[];

    /** Wallet provider (e.g., 'arweave', 'arconnect') */
    provider?: string;

    /** JWK key for signing transactions */
    jwk?: JWK;
}
