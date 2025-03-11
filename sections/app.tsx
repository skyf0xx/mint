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
        fetchPositionDetails,
    } = useStakingStore();

    // Initialize staking data
    useStakingInit(address);

    // Local state for educational modal
    const [showILModal, setShowILModal] = React.useState(false);

    // Load position details when a position is selected
    useEffect(() => {
        if (connected && address && selectedPositionId) {
            fetchPositionDetails(selectedPositionId, address);
        }
    }, [connected, address, selectedPositionId]);

    // Event handlers
    const handleStartStaking = () => {
        setView('staking');
    };

    const handleViewPosition = (id: string) => {
        selectPosition(id);
        setView('position-details');
    };

    const handleStakeSubmit = async (tokenAddress: string, amount: string) => {
        return await stakeToken(tokenAddress, amount);
    };

    const handleUnstakeSubmit = async (positionId: string) => {
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
                            setView('unstaking');
                        }}
                        onShowILInfo={handleShowILInfo}
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
                            selectPosition(id);
                            setView('unstaking');
                        }}
                        isLoading={isLoading}
                    />
                );
        }
    };

    return (
        <section
            id="app"
            className="py-24 bg-gradient-to-b from-white to-gray-50"
        >
            <div className="container mx-auto px-4">
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
                        Provide liquidity with just one token and get protection
                        against impermanent loss
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
