// types/staking-store.ts
import {
    Transaction,
    TransactionStage,
} from '@/components/app/dashboard/transaction/transaction-status';
import {
    DashboardMetrics,
    StakingPosition,
    TokenInfo,
    AppView,
} from '@/types/staking';
import { UserRewards, RewardsSummary } from '@/services/rewards-service';

export interface StakingState {
    // Data states
    availableTokens: TokenInfo[];
    userPositions: StakingPosition[];
    selectedPositionId: string | null;
    dashboardMetrics: DashboardMetrics;

    //Rewards
    userRewards: UserRewards | null;
    rewardsSummary: RewardsSummary | null;
    isLoadingRewards: boolean;
    fetchUserRewards: (userAddress: string) => Promise<UserRewards | null>;
    fetchRewardsSummary: () => Promise<RewardsSummary | null>;
    clearRewardsData: () => void;

    // UI states
    isLoading: boolean;
    isStaking: boolean;
    isUnstaking: boolean;
    currentView: AppView;
    isInMaintenance: boolean;
    checkingMaintenance: boolean;

    pollingInterval: NodeJS.Timeout | null;
    pollingNextTime: number | null;

    transactions: Transaction[];
    getTransactions: (userAddress: string) => Transaction[];
    updateTransactionStage: (id: string, stage: TransactionStage) => void;
    removeTransaction: (id: string) => void;
    removeCompletedTransactions: () => void;
    checkTransactionStatus: (id: string) => Promise<void>;

    pendingOperations: PendingOperation[];

    // Maintenance mode actions
    checkMaintenanceStatus: () => Promise<boolean>;

    // Other actions
    getPendingOperations: (userAddress: string) => void;
    triggerManualCheck: (userAddress: string) => Promise<void>;
    startPolling: (userAddress: string) => void;
    stopPolling: (userAddress: string) => void;
    checkPendingStakes: (userAddress: string) => Promise<void>;

    fetchTokens: () => Promise<TokenInfo[]>;
    fetchPositions: (userAddress: string) => Promise<StakingPosition[]>;
    fetchDashboardMetrics: (userAddress: string) => Promise<DashboardMetrics>;

    fetchTokenBalance: (
        tokenAddress: string,
        userAddress: string
    ) => Promise<string | null>;

    selectPosition: (positionId: string | null) => void;
    setView: (view: AppView) => void;

    stakeToken: (tokenAddress: string, amount: string) => Promise<boolean>;
    unstakePosition: (tokenAddress: string) => Promise<boolean>;

    checkBalance: (
        tokenAddress: string,
        amount: string,
        userAddress: string
    ) => Promise<boolean>;
    resetLoadingState: () => void;
}

export interface PendingOperation {
    id: string;
    type: 'stake' | 'unstake';
    tokenAddress: string;
    amount?: string;
    timestamp: number;
    userAddress: string;
    positionId?: string;
    failureReason?: string;
    failedAt?: number;
}
