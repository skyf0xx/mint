import { dryrun, result } from '@permaweb/aoconnect';
import { sendMessage } from './messages';
import { adjustDecimalString } from './utils';
import {
    CACHE_EXPIRY,
    generateCacheKey,
    getFromCache,
    setCache,
} from './cache';

interface StakedBalance {
    address: never;
    name: string;
    amount: string;
    weight?: string;
}

// Constants
const MINT_TOKEN = 'SWQx44W-1iMwGFBSHlC3lStCq3Z7O2WZrx9quLeZOu0';

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

async function sendAndGetResult(
    target: string,
    tags: { name: string; value: string }[],
    signer = false,
    cacheExpiry: number | false
): Promise<MessageResult> {
    let response;
    let cached;
    let cacheKey = '';

    if (cacheExpiry) {
        cacheKey = generateCacheKey(target, tags);
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

/**
 * Fetches the current total supply of NAB tokens in circulation
 * @returns The total supply as a formatted string, or null if the fetch fails
 */
export const getTotalSupply = async (): Promise<string | null> => {
    const tags = [{ name: 'Action', value: 'Total-Supply', 'x-token': 'MINT' }]; //need to add x-token to create a unique cache key

    try {
        const result = await sendAndGetResult(
            MINT_TOKEN,
            tags,
            false,
            CACHE_EXPIRY.DAY
        );
        if (!result.Messages?.[0]?.Data) {
            throw new Error('No total supply data in response');
        }

        const denomination = 8;

        // Format the total supply with proper decimal places
        return Number.parseFloat(
            adjustDecimalString(result.Messages[0].Data, denomination)
        ).toLocaleString(undefined, { maximumFractionDigits: denomination });
    } catch (error) {
        console.error(error, 'getting total supply', null);
        return null;
    }
};
