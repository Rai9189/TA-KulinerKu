"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLastSync = exports.updateLastSync = exports.getCacheSize = exports.clearAllCache = exports.removeFromCache = exports.getFromCache = exports.saveToCache = exports.CACHE_KEYS = void 0;
const localforage_1 = __importDefault(require("localforage"));
// Konfigurasi localforage
localforage_1.default.config({
    name: 'KulinerKu',
    storeName: 'app_data',
    description: 'Offline storage for KulinerKu app'
});
// Store keys
exports.CACHE_KEYS = {
    RESTAURANTS: 'restaurants',
    MENUS: 'menus',
    REVIEWS: 'reviews',
    USER_PROFILE: 'user_profile',
    FAVORITES: 'favorites',
    LAST_SYNC: 'last_sync'
};
// Simpan data ke cache
const saveToCache = async (key, data) => {
    try {
        const cacheData = {
            data,
            timestamp: Date.now()
        };
        await localforage_1.default.setItem(key, cacheData);
        console.log(`✅ Data cached: ${key}`);
    }
    catch (error) {
        console.error(`❌ Error caching data for ${key}:`, error);
    }
};
exports.saveToCache = saveToCache;
// Ambil data dari cache
const getFromCache = async (key, maxAge) => {
    try {
        const cached = await localforage_1.default.getItem(key);
        if (!cached) {
            return null;
        }
        // Cek apakah cache sudah kadaluarsa (jika maxAge ditentukan)
        if (maxAge) {
            const age = Date.now() - cached.timestamp;
            if (age > maxAge) {
                console.log(`⚠️ Cache expired for ${key}`);
                await localforage_1.default.removeItem(key);
                return null;
            }
        }
        console.log(`✅ Data loaded from cache: ${key}`);
        return cached.data;
    }
    catch (error) {
        console.error(`❌ Error reading cache for ${key}:`, error);
        return null;
    }
};
exports.getFromCache = getFromCache;
// Hapus data dari cache
const removeFromCache = async (key) => {
    try {
        await localforage_1.default.removeItem(key);
        console.log(`✅ Cache removed: ${key}`);
    }
    catch (error) {
        console.error(`❌ Error removing cache for ${key}:`, error);
    }
};
exports.removeFromCache = removeFromCache;
// Hapus semua cache
const clearAllCache = async () => {
    try {
        await localforage_1.default.clear();
        console.log('✅ All cache cleared');
    }
    catch (error) {
        console.error('❌ Error clearing cache:', error);
    }
};
exports.clearAllCache = clearAllCache;
// Cek ukuran cache
const getCacheSize = async () => {
    try {
        const keys = await localforage_1.default.keys();
        return keys.length;
    }
    catch (error) {
        console.error('❌ Error getting cache size:', error);
        return 0;
    }
};
exports.getCacheSize = getCacheSize;
// Update waktu sinkronisasi terakhir
const updateLastSync = async () => {
    await (0, exports.saveToCache)(exports.CACHE_KEYS.LAST_SYNC, new Date().toISOString());
};
exports.updateLastSync = updateLastSync;
// Ambil waktu sinkronisasi terakhir
const getLastSync = async () => {
    const cached = await (0, exports.getFromCache)(exports.CACHE_KEYS.LAST_SYNC);
    return cached;
};
exports.getLastSync = getLastSync;
