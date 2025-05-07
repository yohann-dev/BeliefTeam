import { QuerySnapshot, DocumentData } from 'firebase-admin/firestore';

interface CacheItem<T> {
    data: T;
    timestamp: number;
}

export class CacheService {
    private cache: Map<string, CacheItem<any>> = new Map();
    private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds
    private hits = 0;
    private misses = 0;

    set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
        this.cache.set(key, {
            data,
            timestamp: Date.now() + ttl
        });
    }

    get<T>(key: string): T | null {
        const item = this.cache.get(key);
        if (!item) {
            this.misses++;
            return null;
        }
        
        if (Date.now() > item.timestamp) {
            this.cache.delete(key);
            this.misses++;
            return null;
        }
        
        this.hits++;
        return item.data as T;
    }

    clear(): void {
        this.cache.clear();
    }

    getStats() {
        return {
            hits: this.hits,
            misses: this.misses,
            hitRate: this.hits / (this.hits + this.misses)
        };
    }
}

// Create a singleton instance
export const cacheService = new CacheService(); 