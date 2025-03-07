// components/app/shared/transaction-status.tsx
import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';

type TransactionStatus = 'pending' | 'success' | 'error' | 'warning';

interface TransactionStatusProps {
    status: TransactionStatus;
    title: string;
    message: string;
    txId?: string;
}

const TransactionStatus = ({
    status,
    title,
    message,
    txId,
}: TransactionStatusProps) => {
    const statusConfig = {
        pending: {
            icon: Loader2,
            iconClass: 'text-blue-500 animate-spin',
            bgClass: 'bg-blue-50',
        },
        success: {
            icon: CheckCircle,
            iconClass: 'text-green-500',
            bgClass: 'bg-green-50',
        },
        error: {
            icon: XCircle,
            iconClass: 'text-red-500',
            bgClass: 'bg-red-50',
        },
        warning: {
            icon: AlertTriangle,
            iconClass: 'text-yellow-500',
            bgClass: 'bg-yellow-50',
        },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
        <div className={`rounded-lg p-4 ${config.bgClass}`}>
            <div className="flex">
                <div className="flex-shrink-0">
                    <Icon className={`h-5 w-5 ${config.iconClass}`} />
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-800">
                        {title}
                    </h3>
                    <div className="mt-2 text-sm text-gray-700">
                        <p>{message}</p>
                        {txId && (
                            <p className="mt-2">
                                Transaction ID:{' '}
                                <span className="font-mono text-xs break-all">
                                    {txId}
                                </span>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionStatus;
