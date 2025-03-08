import { Redis } from '@upstash/redis';
import { MessageResult } from './wallet-actions';

const CACHE_PREFIX = 'mint:';

// Initialize Redis client

const redis = new Redis({
    url: 'https://musical-shark-48934.upstash.io',
    token: 'Ab8mAAIjcDFkM2MzYTVlYzNkNmM0M2ZkOWUyNjE5YThlM2ZlOTUxMnAxMA',
});

// Cache expiry times in seconds
export const CACHE_EXPIRY = {
    MINUTE: 60,
    TEN_MINUTES: 600,
    HOUR: 3_600,
    DAY: 86_400,
    WEEK: 604_800,
    MONTH: 2_629_746,
};

// Generate cache key from target and tags
export function generateCacheKey(
    target: string,
    tags: { name: string; value: string }[]
): string {
    const tagString = tags.map((t) => `${t.name}:${t.value}`).join('|');
    return `${CACHE_PREFIX}${target}:${tagString}`;
}

export async function getFromCache(key: string): Promise<MessageResult | null> {
    const cached = await redis.get(key);
    return cached ? (cached as MessageResult) : null;
}

export async function setCache(
    key: string,
    data: MessageResult,
    expiry: number
): Promise<void> {
    await redis.set(key, data, { ex: expiry });
}

export async function deleteFromCache(key: string): Promise<boolean> {
    try {
        const result = await redis.del(key);
        // Redis returns 1 if key was deleted, 0 if key didn't exist
        return result === 1;
    } catch (error) {
        console.error('Error deleting key from cache:', error);
        throw error;
    }
}
