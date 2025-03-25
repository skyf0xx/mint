const ComparisonContent = () => (
    <div className="mt-10 bg-gray-50/50 rounded-xl p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-600 to-primary-700">
            Traditional LP vs. MINT Single-Sided LP
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
                <h4 className="text-lg font-semibold mb-4 text-gray-700">
                    Traditional LP
                </h4>
                <ul className="space-y-3">
                    <li className="flex items-center space-x-2">
                        <div className="h-2 w-2 rounded-full bg-gray-300" />
                        <span className="text-gray-600">
                            Requires equal value of two tokens
                        </span>
                    </li>
                    <li className="flex items-center space-x-2">
                        <div className="h-2 w-2 rounded-full bg-gray-300" />
                        <span className="text-gray-600">
                            Forces selling half your position
                        </span>
                    </li>
                    <li className="flex items-center space-x-2">
                        <div className="h-2 w-2 rounded-full bg-gray-300" />
                        <span className="text-gray-600">
                            Full exposure to impermanent loss
                        </span>
                    </li>
                    <li className="flex items-center space-x-2">
                        <div className="h-2 w-2 rounded-full bg-gray-300" />
                        <span className="text-gray-600">
                            Complex position calculations
                        </span>
                    </li>
                </ul>
            </div>

            <div className="bg-primary/5 rounded-lg p-5 shadow-sm border border-primary/10">
                <h4 className="text-lg font-semibold mb-4 text-primary-600">
                    MINT Single-Sided LP
                </h4>
                <ul className="space-y-3">
                    <li className="flex items-center space-x-2">
                        <div className="h-2 w-2 rounded-full bg-primary-400" />
                        <span className="text-gray-700">
                            Stake just one token
                        </span>
                    </li>
                    <li className="flex items-center space-x-2">
                        <div className="h-2 w-2 rounded-full bg-primary-400" />
                        <span className="text-gray-700">
                            Maintain full asset exposure
                        </span>
                    </li>
                    <li className="flex items-center space-x-2">
                        <div className="h-2 w-2 rounded-full bg-primary-400" />
                        <span className="text-gray-700">
                            Up to 50% IL protection
                        </span>
                    </li>
                    <li className="flex items-center space-x-2">
                        <div className="h-2 w-2 rounded-full bg-primary-400" />
                        <span className="text-gray-700">
                            Simple one-click process
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
);

export default ComparisonContent;
