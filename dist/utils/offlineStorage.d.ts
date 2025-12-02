export declare const CACHE_KEYS: {
    RESTAURANTS: string;
    MENUS: string;
    REVIEWS: string;
    USER_PROFILE: string;
    FAVORITES: string;
    LAST_SYNC: string;
};
export declare const saveToCache: (key: string, data: any) => Promise<void>;
export declare const getFromCache: (key: string, maxAge?: number) => Promise<any | null>;
export declare const removeFromCache: (key: string) => Promise<void>;
export declare const clearAllCache: () => Promise<void>;
export declare const getCacheSize: () => Promise<number>;
export declare const updateLastSync: () => Promise<void>;
export declare const getLastSync: () => Promise<string | null>;
