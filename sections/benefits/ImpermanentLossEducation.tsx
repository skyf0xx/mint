import { motion } from 'framer-motion';

const ImpermanentLossEducation = () => (
    <div className="mt-10 bg-primary/5 rounded-xl p-6 border border-primary/10">
        <h3 className="text-xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-600 to-primary-700">
            Understanding Impermanent Loss
        </h3>

        <div className="space-y-6">
            <div className="bg-white rounded-lg p-5 shadow-sm">
                <h4 className="text-lg font-semibold mb-2 text-gray-800">
                    What is Impermanent Loss?
                </h4>
                <p className="text-gray-600">
                    Impermanent loss occurs when the price of tokens in a
                    liquidity pool changes compared to when they were deposited.
                    The more the prices diverge, the greater the loss compared
                    to simply holding the assets.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-5 shadow-sm">
                    <h4 className="text-lg font-semibold mb-2 text-gray-800">
                        Without Protection
                    </h4>
                    <div className="h-32 relative rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden">
                        <div className="absolute left-0 w-full h-20">
                            <motion.div
                                className="absolute left-1/3 top-0 h-full w-1 bg-primary/30"
                                animate={{ height: [20, 60, 30, 50] }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    times: [0, 0.3, 0.7, 1],
                                }}
                            />

                            <motion.div
                                className="absolute right-1/3 top-0 h-full w-1 bg-red-400"
                                animate={{ height: [10, 20, 40, 30] }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    times: [0, 0.3, 0.7, 1],
                                }}
                            >
                                <motion.div
                                    className="absolute -left-14 w-12 h-5 rounded-sm bg-red-500 flex items-center justify-center"
                                    animate={{
                                        top: [15, 5, 15],
                                        opacity: [0.5, 1, 0.5],
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        delay: 2,
                                    }}
                                >
                                    <span className="text-white text-xs">
                                        -100% IL
                                    </span>
                                </motion.div>
                            </motion.div>

                            <div className="absolute bottom-0 w-full h-0.5 bg-gray-300" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-5 shadow-sm border border-primary/10">
                    <h4 className="text-lg font-semibold mb-2 text-primary-600">
                        With MINT Protection
                    </h4>
                    <div className="h-32 relative rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden">
                        <div className="absolute left-0 w-full h-20">
                            <motion.div
                                className="absolute left-1/3 top-0 h-full w-1 bg-primary/30"
                                animate={{ height: [20, 60, 30, 50] }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    times: [0, 0.3, 0.7, 1],
                                }}
                            />

                            <motion.div
                                className="absolute right-1/3 top-0 h-full w-1 bg-red-400/50"
                                animate={{ height: [10, 20, 40, 30] }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    times: [0, 0.3, 0.7, 1],
                                }}
                            >
                                <motion.div
                                    className="absolute -left-14 w-12 h-5 rounded-sm bg-red-500/50 flex items-center justify-center"
                                    animate={{
                                        top: [15, 5, 15],
                                        opacity: [0.5, 1, 0.5],
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        delay: 2,
                                    }}
                                >
                                    <span className="text-white text-xs">
                                        -50% IL
                                    </span>
                                </motion.div>

                                <motion.div
                                    className="absolute -right-16 w-12 h-5 rounded-sm bg-primary flex items-center justify-center"
                                    animate={{
                                        top: [15, 5, 15],
                                        opacity: [0.5, 1, 0.5],
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        delay: 2,
                                    }}
                                >
                                    <span className="text-white text-xs">
                                        +50% Protected
                                    </span>
                                </motion.div>
                            </motion.div>

                            <div className="absolute bottom-0 w-full h-0.5 bg-gray-300" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default ImpermanentLossEducation;
