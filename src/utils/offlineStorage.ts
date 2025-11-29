import localforage from 'localforage';

// Konfigurasi localforage
localforage.config({
  name: 'KulinerKu',
  storeName: 'app_data',
  description: 'Offline storage for KulinerKu app'
});

// Store keys
export const CACHE_KEYS = {
  RESTAURANTS: 'restaurants',
  MENUS: 'menus',
  REVIEWS: 'reviews',
  USER_PROFILE: 'user_profile',
  FAVORITES: 'favorites',
  LAST_SYNC: 'last_sync'
};

// Tipe data
interface CacheData {
  data: any;
  timestamp: number;
}

// Simpan data ke cache
export const saveToCache = async (key: string, data: any): Promise<void> => {
  try {
    const cacheData: CacheData = {
      data,
      timestamp: Date.now()
    };
    await localforage.setItem(key, cacheData);
    console.log(`✅ Data cached: ${key}`);
  } catch (error) {
    console.error(`❌ Error caching data for ${key}:`, error);
  }
};

// Ambil data dari cache
export const getFromCache = async (key: string, maxAge?: number): Promise<any | null> => {
  try {
    const cached = await localforage.getItem<CacheData>(key);
    
    if (!cached) {
      return null;
    }

    // Cek apakah cache sudah kadaluarsa (jika maxAge ditentukan)
    if (maxAge) {
      const age = Date.now() - cached.timestamp;
      if (age > maxAge) {
        console.log(`⚠️ Cache expired for ${key}`);
        await localforage.removeItem(key);
        return null;
      }
    }

    console.log(`✅ Data loaded from cache: ${key}`);
    return cached.data;
  } catch (error) {
    console.error(`❌ Error reading cache for ${key}:`, error);
    return null;
  }
};

// Hapus data dari cache
export const removeFromCache = async (key: string): Promise<void> => {
  try {
    await localforage.removeItem(key);
    console.log(`✅ Cache removed: ${key}`);
  } catch (error) {
    console.error(`❌ Error removing cache for ${key}:`, error);
  }
};

// Hapus semua cache
export const clearAllCache = async (): Promise<void> => {
  try {
    await localforage.clear();
    console.log('✅ All cache cleared');
  } catch (error) {
    console.error('❌ Error clearing cache:', error);
  }
};

// Cek ukuran cache
export const getCacheSize = async (): Promise<number> => {
  try {
    const keys = await localforage.keys();
    return keys.length;
  } catch (error) {
    console.error('❌ Error getting cache size:', error);
    return 0;
  }
};

// Update waktu sinkronisasi terakhir
export const updateLastSync = async (): Promise<void> => {
  await saveToCache(CACHE_KEYS.LAST_SYNC, new Date().toISOString());
};

// Ambil waktu sinkronisasi terakhir
export const getLastSync = async (): Promise<string | null> => {
  const cached = await getFromCache(CACHE_KEYS.LAST_SYNC);
  return cached;
};