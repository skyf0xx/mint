import React, { useEffect } from 'react';
import {
    useArweaveWalletStore,
    useArweaveWalletInit,
} from '@/hooks/use-wallet';
import { motion } from 'framer-motion';
import ConnectCard from '@/components/app/connect-card';
import Dashboard from '@/components/app/dashboard';
import StakingForm from '@/components/app/staking/staking-form';
import UnstakeForm from '@/components/app/unstaking/unstake-form';
import PositionDetailView from '@/components/app/position/position-detail-view';
import LoadingState from '@/components/app/shared/loading-state';
import { useStakingStore, useStakingInit } from '@/store/staking-store';
import { StakingPosition } from '@/types/staking';
import ILProtectionModal from '@/components/app/education/il-protection-modal';
import MaintenanceMessage from '@/components/app/shared/maintenance-message';

const App = () => {
    // Initialize wallet
    useArweaveWalletInit();

    // Get wallet state
    const { address, connected } = useArweaveWalletStore();

    // Get staking state
    const {
        currentView,
        setView,
        selectedPositionId,
        selectPosition,
        userPositions,
        isLoading,
        stakeToken,
        unstakePosition,
        isInMaintenance,
        checkMaintenanceStatus,
    } = useStakingStore();

    useEffect(() => {
        // Force browser to recalculate layout which can help with scrollbar issues
        document.documentElement.style.overflow = 'auto';
        document.body.style.overflow = 'auto';
    }, [currentView]);

    // Initialize staking data
    useStakingInit(address);

    // Local state for educational modal
    const [showILModal, setShowILModal] = React.useState(false);

    // Event handlers
    const handleStartStaking = () => {
        // First check maintenance status before allowing staking
        checkMaintenanceStatus().then((isInMaintenance) => {
            if (!isInMaintenance) {
                setView('staking');
            }
        });
    };

    const handleViewPosition = (id: string) => {
        selectPosition(id);
        setView('position-details');
    };

    const handleStakeSubmit = async (tokenAddress: string, amount: string) => {
        // Check maintenance status before submitting
        const maintenanceActive = await checkMaintenanceStatus();
        if (maintenanceActive) {
            return false;
        }
        return await stakeToken(tokenAddress, amount);
    };

    const handleUnstakeSubmit = async (positionId: string) => {
        // Check maintenance status before submitting
        const maintenanceActive = await checkMaintenanceStatus();
        if (maintenanceActive) {
            return false;
        }
        return await unstakePosition(positionId);
    };

    const handleShowILInfo = () => {
        setShowILModal(true);
    };

    // Find the selected position if we're in position details or unstaking view
    const selectedPosition = userPositions.find(
        (p) => p.id === selectedPositionId
    );

    // Render the appropriate view
    const renderContent = () => {
        if (!connected) {
            return <ConnectCard />;
        }

        if (isLoading && currentView !== 'dashboard') {
            return <LoadingState message="Loading your staking data..." />;
        }

        // Show maintenance message for staking/unstaking views when in maintenance mode
        if (
            isInMaintenance &&
            (currentView === 'staking' || currentView === 'unstaking')
        ) {
            return <MaintenanceMessage />;
        }

        switch (currentView) {
            case 'staking':
                return (
                    <StakingForm
                        onCancel={() => setView('dashboard')}
                        onSubmit={handleStakeSubmit}
                        onShowILInfo={handleShowILInfo}
                    />
                );
            case 'unstaking':
                if (!selectedPosition) {
                    return <LoadingState message="Loading position data..." />;
                }

                return (
                    <UnstakeForm
                        position={selectedPosition as StakingPosition}
                        onCancel={() => setView('dashboard')}
                        onUnstake={handleUnstakeSubmit}
                        onShowILInfo={handleShowILInfo}
                    />
                );
            case 'position-details':
                if (!selectedPosition) {
                    return (
                        <LoadingState message="Loading position details..." />
                    );
                }

                return (
                    <PositionDetailView
                        position={selectedPosition as StakingPosition}
                        onBack={() => setView('dashboard')}
                        onUnstake={() => {
                            // Check maintenance status before allowing unstaking
                            checkMaintenanceStatus().then((isInMaintenance) => {
                                if (!isInMaintenance) {
                                    setView('unstaking');
                                }
                            });
                        }}
                        onShowILInfo={handleShowILInfo}
                        isInMaintenance={isInMaintenance}
                    />
                );
            case 'dashboard':
            default:
                return (
                    <Dashboard
                        address={address}
                        positions={userPositions}
                        onStartStaking={handleStartStaking}
                        onViewPosition={handleViewPosition}
                        onUnstake={(id) => {
                            // Check maintenance status before allowing unstaking
                            checkMaintenanceStatus().then((isInMaintenance) => {
                                if (!isInMaintenance) {
                                    selectPosition(id);
                                    setView('unstaking');
                                }
                            });
                        }}
                        isLoading={isLoading}
                        isInMaintenance={isInMaintenance}
                    />
                );
        }
    };

    return (
        <section
            id="app"
            className="py-24 bg-gradient-to-b from-white to-gray-50"
        >
            <div className="container mx-auto px-4 overflow-x-auto overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto text-center mb-12"
                >
                    <h2 className="text-4xl font-bold mb-4">
                        <span className="relative">
                            <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-600 to-primary-700">
                                Single-Sided Staking
                            </span>
                            <motion.span
                                className="absolute inset-x-0 bottom-0 h-3 bg-accent/10 -rotate-1"
                                initial={{ scaleX: 0 }}
                                whileInView={{ scaleX: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                            />
                        </span>
                    </h2>
                    <p className="text-xl text-gray-600 leading-relaxed">
                        Provide{' '}
                        <span className="font-bold">liquidity on Botega</span>{' '}
                        with just one token and get protection against
                        impermanent loss
                    </p>
                </motion.div>

                {renderContent()}

                {/* Educational modal for impermanent loss protection */}
                <ILProtectionModal
                    isOpen={showILModal}
                    onClose={() => setShowILModal(false)}
                />
            </div>
        </section>
    );
};

export default App;
