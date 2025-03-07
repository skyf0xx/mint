// components/app/index.tsx
import React, { useState } from 'react';
import {
    useArweaveWalletStore,
    useArweaveWalletInit,
} from '@/hooks/use-wallet';
import { motion } from 'framer-motion';
import ConnectCard from '@/components/app/connect-card';
import Dashboard from '@/components/app/dashboard';
import StakingForm from '@/components/app/staking/staking-form';
import UnstakeForm from '@/components/app/unstaking/unstake-form';

// Define the possible app view states
type AppView = 'dashboard' | 'staking' | 'unstaking' | 'position-details';

const App = () => {
    // Initialize wallet
    useArweaveWalletInit();

    // Get wallet state
    const { address, connected } = useArweaveWalletStore();

    // Local state
    const [currentView, setCurrentView] = useState<AppView>('dashboard');
    const [selectedPositionId, setSelectedPositionId] = useState<string | null>(
        null
    );

    // Mock positions data - in real implementation this would come from an API
    const [positions, setPositions] = useState<any[]>([]);

    // Mock position for unstaking view
    const mockPosition = {
        id: '123',
        token: 'qAR',
        initialAmount: '100',
        currentValue: '94.2',
        stakedDays: 24,
        ilProtectionPercentage: 40,
    };

    // Event handlers
    const handleStartStaking = () => {
        setCurrentView('staking');
    };

    const handleViewPosition = (id: string) => {
        setSelectedPositionId(id);
        setCurrentView('position-details');
    };

    const handleStakeSubmit = async (token: string, amount: string) => {
        // In a real implementation, this would call the API to stake tokens
        console.log(`Staking ${amount} ${token}`);

        // Mock adding a new position
        const newPosition = {
            id: Date.now().toString(),
            token,
            amount,
            stakedDate: new Date(),
            ilProtectionPercentage: 0,
        };

        setPositions([...positions, newPosition]);
        setCurrentView('dashboard');

        // This would be a real API call in production
        await new Promise((resolve) => setTimeout(resolve, 1000));
    };

    const handleUnstakeSubmit = async (positionId: string, amount: string) => {
        // In a real implementation, this would call the API to unstake tokens
        console.log(`Unstaking ${amount} from position ${positionId}`);

        // Mock removing the position
        setPositions(positions.filter((p) => p.id !== positionId));
        setCurrentView('dashboard');

        // This would be a real API call in production
        await new Promise((resolve) => setTimeout(resolve, 1000));
    };

    // Render the appropriate view
    const renderContent = () => {
        if (!connected) {
            return <ConnectCard />;
        }

        switch (currentView) {
            case 'staking':
                return (
                    <StakingForm
                        onCancel={() => setCurrentView('dashboard')}
                        onSubmit={handleStakeSubmit}
                    />
                );
            case 'unstaking':
                return (
                    <UnstakeForm
                        position={mockPosition}
                        onCancel={() => setCurrentView('dashboard')}
                        onUnstake={handleUnstakeSubmit}
                    />
                );
            case 'position-details':
                // This would be implemented later
                return <div>Position Details (to be implemented)</div>;
            case 'dashboard':
            default:
                return (
                    <Dashboard
                        address={address}
                        positions={positions}
                        onStartStaking={handleStartStaking}
                        onViewPosition={handleViewPosition}
                        onUnstake={(id) => {
                            setSelectedPositionId(id);
                            setCurrentView('unstaking');
                        }}
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
            </div>
        </section>
    );
};

export default App;
