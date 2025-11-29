import { supabase } from './supabaseClient';
import { saveToCache, getFromCache, CACHE_KEYS } from '../utils/offlineStorage';

// Cache duration: 5 menit
const CACHE_DURATION = 5 * 60 * 1000;

export const offlineSupabase = {
  // Get Restaurants dengan offline support
  async getRestaurants(filters?: any) {
    const cacheKey = `${CACHE_KEYS.RESTAURANTS}_${JSON.stringify(filters || {})}`;
    
    try {
      // Coba ambil dari server
      let query = supabase.from('restaurants').select('*').order('created_at', { ascending: false });
      
      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      if (filters?.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Simpan ke cache jika berhasil
      await saveToCache(cacheKey, data);
      return { data, fromCache: false };
    } catch (error) {
      console.warn('⚠️ Failed to fetch from server, loading from cache...', error);
      
      // Jika gagal, ambil dari cache
      const cachedData = await getFromCache(cacheKey, CACHE_DURATION);
      
      if (cachedData) {
        return { data: cachedData, fromCache: true };
      }
      
      throw new Error('No cached data available');
    }
  },

  // Get Restaurant by ID
  async getRestaurantById(id: string) {
    const cacheKey = `${CACHE_KEYS.RESTAURANTS}_${id}`;
    
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      await saveToCache(cacheKey, data);
      return { data, fromCache: false };
    } catch (error) {
      console.warn('⚠️ Failed to fetch restaurant, loading from cache...', error);
      
      const cachedData = await getFromCache(cacheKey, CACHE_DURATION);
      
      if (cachedData) {
        return { data: cachedData, fromCache: true };
      }
      
      throw new Error('No cached data available');
    }
  },

  // Get Menus dengan offline support
  async getMenus(restaurantId?: string) {
    const cacheKey = restaurantId 
      ? `${CACHE_KEYS.MENUS}_restaurant_${restaurantId}`
      : CACHE_KEYS.MENUS;
    
    try {
      let query = supabase
        .from('menu_items')
        .select('*, restaurants(name)')
        .order('created_at', { ascending: false });
      
      if (restaurantId) {
        query = query.eq('restaurant_id', restaurantId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      await saveToCache(cacheKey, data);
      return { data, fromCache: false };
    } catch (error) {
      console.warn('⚠️ Failed to fetch menus, loading from cache...', error);
      
      const cachedData = await getFromCache(cacheKey, CACHE_DURATION);
      
      if (cachedData) {
        return { data: cachedData, fromCache: true };
      }
      
      throw new Error('No cached data available');
    }
  },

  // Get Menu by ID
  async getMenuById(id: string) {
    const cacheKey = `${CACHE_KEYS.MENUS}_${id}`;
    
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*, restaurants(name, address)')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      await saveToCache(cacheKey, data);
      return { data, fromCache: false };
    } catch (error) {
      console.warn('⚠️ Failed to fetch menu, loading from cache...', error);
      
      const cachedData = await getFromCache(cacheKey, CACHE_DURATION);
      
      if (cachedData) {
        return { data: cachedData, fromCache: true };
      }
      
      throw new Error('No cached data available');
    }
  },

  // Get Reviews
  async getReviews(restaurantId?: string, menuId?: string) {
    const cacheKey = `${CACHE_KEYS.REVIEWS}_${restaurantId || ''}_${menuId || ''}`;
    
    try {
      let query = supabase
        .from('reviews')
        .select('*, users(username, profile_image)')
        .order('created_at', { ascending: false });
      
      if (restaurantId) query = query.eq('restaurant_id', restaurantId);
      if (menuId) query = query.eq('menu_id', menuId);
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      await saveToCache(cacheKey, data);
      return { data, fromCache: false };
    } catch (error) {
      console.warn('⚠️ Failed to fetch reviews, loading from cache...', error);
      
      const cachedData = await getFromCache(cacheKey, CACHE_DURATION);
      
      if (cachedData) {
        return { data: cachedData, fromCache: true };
      }
      
      return { data: [], fromCache: true };
    }
  },

  // Check if online
  isOnline() {
    return navigator.onLine;
  }
};