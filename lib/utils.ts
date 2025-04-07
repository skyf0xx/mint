import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function adjustDecimalString(value: string, decimals: number): string {
    // Remove any existing decimal points and leading zeros
    const cleanValue = value.replace(/[.,]/g, '').replace(/^0+/, '');

    // If the number is too short, pad with leading zeros
    const paddedValue = cleanValue.padStart(decimals + 1, '0');

    // Find the position to insert the decimal point
    const insertPosition = paddedValue.length - decimals;

    // Insert the decimal point
    const result =
        paddedValue.slice(0, insertPosition) +
        '.' +
        paddedValue.slice(insertPosition);

    // Remove trailing zeros after decimal and unnecessary decimal point
    return result.replace(/\.?0+$/, '');
}

// Retry configuration type
interface RetryConfig {
    maxAttempts: number;
    initialDelay: number;
    maxDelay: number;
    backoffFactor: number;
}

// Default retry configuration
const DEFAULT_RETRY_CONFIG: RetryConfig = {
    maxAttempts: 5,
    initialDelay: 1000, // 1 second
    maxDelay: 10000, // 10 seconds
    backoffFactor: 2,
};

/**
 * Implements exponential backoff retry logic for async functions
 * @param operation Function to retry
 * @param config Retry configuration
 * @returns Result of the operation
 * @throws Last error encountered after all retries are exhausted
 */
export async function withRetry<T>(
    operation: () => Promise<T>,
    config: Partial<RetryConfig> = {}
): Promise<T> {
    const fullConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
    let lastError: Error | undefined;
    let delay = fullConfig.initialDelay;

    for (let attempt = 1; attempt <= fullConfig.maxAttempts; attempt++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error as Error;

            // If this was the last attempt, throw the error
            if (attempt === fullConfig.maxAttempts) {
                throw new Error(
                    `Failed after ${attempt} attempts. Last error: ${lastError.message}`
                );
            }

            // Calculate next delay with exponential backoff
            delay = Math.min(
                delay * fullConfig.backoffFactor,
                fullConfig.maxDelay
            );

            // Wait before next attempt
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }

    // This should never be reached due to the throw above, but TypeScript needs it
    throw lastError;
}

/**
 * Formats a number with thousands separators and specific decimal places
 * @param value - The number to format
 * @param decimals - Number of decimal places to show (default: 2)
 * @returns Formatted number string
 */
export const formatNumber = (
    value: number | string | undefined,
    decimals = 2
): string => {
    // Handle undefined, null, or NaN
    if (value === undefined || value === null || isNaN(Number(value))) {
        return '0';
    }

    // Convert to number if it's a string
    const num = typeof value === 'string' ? parseFloat(value) : value;

    // Format with commas and specified decimal places
    return num.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
};

export const shortNumberFormat = (amount: string, maxLength: number = 4) => {
    // Parse the amount to a number
    const numAmount = parseFloat(amount);

    // Use Intl.NumberFormat to format the number
    const formatter = new Intl.NumberFormat('en-US', {
        notation: 'compact',
        compactDisplay: 'short',
    });

    const formattedNumber = formatter.format(numAmount);

    // If the number part (excluding suffix) is longer than maxLength
    const match = formattedNumber.match(/^([\d,.]+)([A-Za-z]*)$/);

    if (match) {
        const [, numberPart, suffix] = match;
        const digitsOnly = numberPart.replace(/[,.]/g, '');

        if (digitsOnly.length > maxLength) {
            // Keep the most significant digits and add ellipsis
            const significantDigits = digitsOnly.substring(0, maxLength);

            // Reinsert decimal point if needed (for proper scale representation)
            let truncatedNumber;
            if (numberPart.includes('.')) {
                // Handle decimal points - keep decimal position relative to original
                const decimalPos = numberPart.indexOf('.');
                if (decimalPos < maxLength) {
                    truncatedNumber =
                        significantDigits.substring(0, decimalPos) +
                        '.' +
                        significantDigits.substring(decimalPos);
                } else {
                    truncatedNumber = significantDigits;
                }
            } else {
                truncatedNumber = significantDigits;
            }

            return `${truncatedNumber}..${suffix}`;
        }
    }

    return formattedNumber;
};
