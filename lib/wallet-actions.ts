import { dryrun, result } from '@permaweb/aoconnect';
import { sendMessage } from './messages';
import { adjustDecimalString, withRetry } from './utils';
import {
    CACHE_EXPIRY,
    generateCacheKey,
    getFromCache,
    setCache,
} from './cache';

export const MINT_PROCESS = 'lNtrei6YLQiWS8cyFFHDrOBvRzICQPTvrjZBP8fz-ZI';
export const MINT_TOKEN = 'SWQx44W-1iMwGFBSHlC3lStCq3Z7O2WZrx9quLeZOu0';

interface StakedBalance {
    address: never;
    name: string;
    amount: string;
    weight?: string;
}

// Constants

// Types
export interface JWK {
    kty: string;
    n?: string;
    e?: string;
    d?: string;
    p?: string;
    q?: string;
    dp?: string;
    dq?: string;
    qi?: string;
}

export interface TotalSupplyResponse {
    Action: string;
    Data: string;
    Ticker: string;
}

export type StakedBalances = StakedBalance[];

export interface MessageResult {
    Messages: Array<{
        Data?: string;
        Tags: Array<{
            name: string;
            value: string;
        }>;
    }>;
}

export async function sendAndGetResult(
    target: string,
    tags: { name: string; value: string }[],
    signer = false,
    cacheExpiry: number | false,
    userKey = ''
): Promise<MessageResult> {
    let response;
    let cached;
    let cacheKey = '';

    if (cacheExpiry) {
        cacheKey =
            generateCacheKey(target, tags) + (userKey ? '-' + userKey : '');
        cached = await getFromCache(cacheKey);
    }

    if (cached) {
        return cached;
    }

    if (signer === false) {
        response = await dryrun({
            process: target,
            tags,
        });
    } else {
        const messageId = await sendMessage(target, tags, signer);
        if (!messageId) {
            throw new Error('Failed to send message');
        }

        response = await result({
            message: messageId,
            process: target,
        });
    }

    if (cacheExpiry) {
        setCache(cacheKey, response, cacheExpiry);
    }

    return response;
}

// Helper Functions
function findTagValue(
    result: MessageResult,
    tagName: string
): string | undefined {
    return result.Messages[0].Tags.find((tag) => tag.name === tagName)?.value;
}

function handleError<T>(error: unknown, context: string, defaultValue?: T): T {
    console.error(`Error ${context}:`, error);
    if (defaultValue !== undefined) {
        return defaultValue;
    }
    throw error;
}

// Balance response interface
export interface TokenBalance {
    balance: string;
    ticker?: string;
    account?: string;
}

// New getBalance function
export async function getBalance(
    address: string,
    token: string,
    tokenDenomination: number | false = false
): Promise<TokenBalance | null> {
    const tags = [
        { name: 'Action', value: 'Balance' },
        { name: 'Target', value: address },
    ];

    try {
        const result = await sendAndGetResult(token, tags, false, false);
        // Get values from tags
        const balance = findTagValue(result, 'Balance');
        const ticker = findTagValue(result, 'Ticker');
        const account = address;

        if (!balance || !ticker || !account) {
            console.error('Missing required balance information in response');
            return null;
        }

        const denomination =
            tokenDenomination || (await getTokenDenomination(token));
        const adjustedBalance = adjustDecimalString(balance, denomination);

        return {
            balance: adjustedBalance,
            ticker: ticker,
            account: account,
        };
    } catch (error) {
        return handleError(error, 'getting token balance', null);
    }
}

export async function getTokenDenomination(token: string): Promise<number> {
    const tags = [{ name: 'Action', value: 'Info' }];

    try {
        return await withRetry(async () => {
            const result = await sendAndGetResult(
                token,
                tags,
                false,
                CACHE_EXPIRY.MONTH
            );
            const denominationTag = result.Messages[0]?.Tags.find(
                (tag) => tag.name === 'Denomination'
            );

            if (!denominationTag) {
                throw new Error('Denomination tag not found in response');
            }

            const denomination = Number(denominationTag.value);
            return isNaN(denomination) ? 8 : denomination;
        });
    } catch (error) {
        return handleError(error, 'getting token denomination', 8);
    }
}
