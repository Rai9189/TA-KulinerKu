// ===============================
// AppContext.tsx — FIXED IMPORTS
// ===============================

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { toast } from "sonner";
// ⭐ IMPORT Review dari types (jangan define ulang!)
import type { Review } from "../types";

// -----------------------------
// TYPE DEFINITIONS
// -----------------------------
export interface User {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin";
  profile_image?: string | null;
  bio?: string | null;
}

export interface Menu {
  id: string;
  name: string;
  rating: number;
  image?: string | null;
  category: string;
  price: number;
  restaurant_id: string;
  description?: string | null;
  created_at?: string | null;
}

export interface Restaurant {
  id: string;
  name: string;
  rating?: number | null;
  image?: string | null;
  category?: string | null;
  address?: string | null;
  price_range?: string | null;
  open_hours?: string | null;
  description?: string | null;
  created_at?: string | null;
}

// ❌ HAPUS interface Review dari sini!
// Review sudah di-import dari types/index.ts

interface AppContextProps {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  loading: boolean;

  menuItems: Menu[];
  restaurants: Restaurant[];
  reviews: Review[];

  favoriteMenus: string[];
  favoriteRestaurants: string[];

  allUsers: User[];
  fetchAllUsers: () => Promise<void>;
  updateUserRole: (userId: string, newRole: "user" | "admin") => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;

  fetchMenuItems: () => Promise<void>;
  fetchRestaurants: () => Promise<void>;
  fetchFavorites: () => Promise<void>;
  addFavoriteMenu: (menuId: string) => Promise<void>;
  removeFavoriteMenu: (menuId: string) => Promise<void>;
  addFavoriteRestaurant: (restaurantId: string) => Promise<void>;
  removeFavoriteRestaurant: (restaurantId: string) => Promise<void>;
  toggleFavoriteRestaurant: (restaurantId: string) => Promise<void>;

  addMenuItem: (data: Omit<Menu, "id" | "created_at">) => Promise<boolean>;
  updateMenuItem: (id: string, data: Partial<Omit<Menu, "id" | "created_at">>) => Promise<boolean>;
  deleteMenuItem: (menuId: string) => Promise<boolean>;

  addRestaurant: (data: Omit<Restaurant, "id" | "created_at" | "rating">) => Promise<boolean>;
  updateRestaurant: (id: string, data: Partial<Omit<Restaurant, "id" | "created_at">>) => Promise<boolean>;
  deleteRestaurant: (id: string) => Promise<boolean>;

  fetchReviews: () => Promise<void>;
  addReview: (data: { 
    menu_id?: string; 
    restaurant_id?: string; 
    rating: number; 
    comment?: string 
  }) => Promise<boolean>;
  updateReview: (reviewId: string, data: { rating: number; comment?: string }) => Promise<boolean>;
  deleteReview: (reviewId: string) => Promise<boolean>;

  refreshUser: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;

  isAdmin: boolean;
  isUser: boolean;
  isGuest: boolean;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [menuItems, setMenuItems] = useState<Menu[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [favoriteMenus, setFavoriteMenus] = useState<string[]>([]);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<string[]>([]);

  const [allUsers, setAllUsers] = useState<User[]>([]);

  // role helpers
  const isAdmin = currentUser?.role === "admin";
  const isUser = currentUser?.role === "user";
  const isGuest = !currentUser;

  // -----------------------------
  // REGISTER USER
  // -----------------------------
  const register = async (name: string, email: string, password: string) => {
    try {
      const { data: existing, error: errExist } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (errExist) throw errExist;
      if (existing) return false;

      const { error } = await supabase.from("users").insert([
        {
          username: name,
          email,
          password,
          role: "user",
          profile_image: null,
          bio: "",
        },
      ]);
      if (error) throw error;
      return true;
    } catch (e) {
      console.error("register error", e);
      return false;
    }
  };

  // -----------------------------
  // LOGIN
  // -----------------------------
  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .eq("password", password)
        .single();

      if (error || !data) return null;

      localStorage.setItem("token", data.id);
      setCurrentUser(data as User);
      return data as User;
    } catch (e) {
      console.error("login error", e);
      return null;
    }
  };

  // -----------------------------
  // LOGOUT
  // -----------------------------
  const logout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    setFavoriteMenus([]);
    setFavoriteRestaurants([]);
  };

  // -----------------------------
  // REFRESH USER
  // -----------------------------
  const refreshUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setCurrentUser(null);
        setFavoriteMenus([]);
        setFavoriteRestaurants([]);
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", token)
        .single();

      if (!error && data) {
        setCurrentUser(data as User);
      } else {
        setCurrentUser(null);
        setFavoriteMenus([]);
        setFavoriteRestaurants([]);
      }
    } catch (e) {
      console.error("refreshUser error", e);
      setCurrentUser(null);
      setFavoriteMenus([]);
      setFavoriteRestaurants([]);
    }
  };

  // -----------------------------
  // FETCH ALL USERS (admin)
  // -----------------------------
  const fetchAllUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) setAllUsers(data as User[]);
    } catch (e) {
      console.error("fetchAllUsers", e);
    }
  };
// ===============================
// AppContext.tsx — PART 2 / 3
// ===============================

  // -----------------------------
  // UPDATE USER ROLE
  // -----------------------------
  const updateUserRole = async (userId: string, newRole: "user" | "admin") => {
    try {
      const { error } = await supabase.from("users").update({ role: newRole }).eq("id", userId);
      if (!error) {
        setAllUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
      }
    } catch (e) {
      console.error("updateUserRole", e);
    }
  };

  // -----------------------------
  // DELETE USER
  // -----------------------------
  const deleteUser = async (userId: string) => {
    try {
      const { error } = await supabase.from("users").delete().eq("id", userId);
      if (!error) {
        setAllUsers((prev) => prev.filter((u) => u.id !== userId));
      }
    } catch (e) {
      console.error("deleteUser", e);
    }
  };

  // -----------------------------
  // FETCH RESTAURANTS
  // -----------------------------
  const fetchRestaurants = async () => {
    try {
      const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) setRestaurants(data as Restaurant[]);
    } catch (e) {
      console.error("fetchRestaurants", e);
    }
  };

  // -----------------------------
  // FETCH MENU ITEMS
  // -----------------------------
  const fetchMenuItems = async () => {
    try {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) setMenuItems(data as Menu[]);
    } catch (e) {
      console.error("fetchMenuItems", e);
    }
  };

  // -----------------------------
  // FETCH REVIEWS
  // -----------------------------
  const fetchReviews = async () => {
    try {
      // Fetch langsung dari Supabase dengan join
      const { data, error } = await supabase
        .from("reviews")
        .select(`
          *,
          user:users(username)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("fetchReviews error:", error);
        return;
      }

      if (!data) return;

      // ⭐ Map data untuk flatten struktur user
      const mappedReviews = data.map((review: any) => ({
        ...review,
        userName: review.user?.username || "Unknown User",
      }));

      setReviews(mappedReviews as Review[]);
    } catch (e) {
      console.error("fetchReviews", e);
    }
  };

  // -----------------------------
  // FAVORITES
  // -----------------------------
  const fetchFavorites = async () => {
    try {
      if (!currentUser) {
        setFavoriteMenus([]);
        setFavoriteRestaurants([]);
        return;
      }

      const { data, error } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", currentUser.id);

      if (error || !data) return;

      const menuFav = (data as any[])
        .filter((f) => f.menu_id)
        .map((f) => f.menu_id);

      const restoFav = (data as any[])
        .filter((f) => f.restaurant_id)
        .map((f) => f.restaurant_id);

      setFavoriteMenus(menuFav);
      setFavoriteRestaurants(restoFav);
    } catch (e) {
      console.error("fetchFavorites", e);
    }
  };

  const addFavoriteMenu = async (menuId: string) => {
    try {
      if (!currentUser) {
        toast.error("Anda harus login untuk menggunakan fitur favorit!");
        return;
      }

      const { error } = await supabase.from("favorites").insert([
        {
          user_id: currentUser.id,
          menu_id: menuId,
        },
      ]);

      if (!error) setFavoriteMenus((prev) => [...prev, menuId]);
    } catch (e) {
      console.error("addFavoriteMenu", e);
    }
  };

  const removeFavoriteMenu = async (menuId: string) => {
    try {
      if (!currentUser) return;

      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", currentUser.id)
        .eq("menu_id", menuId);

      if (!error)
        setFavoriteMenus((prev) => prev.filter((id) => id !== menuId));
    } catch (e) {
      console.error("removeFavoriteMenu", e);
    }
  };

  const addFavoriteRestaurant = async (restaurantId: string) => {
    try {
      if (!currentUser) {
        toast.error("Anda harus login untuk menggunakan fitur favorit!");
        return;
      }

      const { error } = await supabase.from("favorites").insert([
        {
          user_id: currentUser.id,
          restaurant_id: restaurantId,
        },
      ]);

      if (!error)
        setFavoriteRestaurants((prev) => [...prev, restaurantId]);
    } catch (e) {
      console.error("addFavoriteRestaurant", e);
    }
  };

  const removeFavoriteRestaurant = async (restaurantId: string) => {
    try {
      if (!currentUser) return;

      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", currentUser.id)
        .eq("restaurant_id", restaurantId);

      if (!error)
        setFavoriteRestaurants((prev) =>
          prev.filter((id) => id !== restaurantId)
        );
    } catch (e) {
      console.error("removeFavoriteRestaurant", e);
    }
  };

  const toggleFavoriteRestaurant = async (restaurantId: string) => {
    if (!currentUser) {
      toast.error("Anda harus login untuk menggunakan fitur favorit!");
      return;
    }

    if (favoriteRestaurants.includes(restaurantId)) {
      await removeFavoriteRestaurant(restaurantId);
    } else {
      await addFavoriteRestaurant(restaurantId);
    }
  };

  // -----------------------------
  // MENU CRUD (Add / Update / Delete)
  // -----------------------------
  const addMenuItem = async (data: Omit<Menu, "id" | "created_at">) => {
    try {
      if (!isAdmin) {
        toast.error("Hanya admin yang dapat menambah menu");
        return false;
      }

      const { data: inserted, error } = await supabase
        .from("menu_items")
        .insert([
          {
            name: data.name,
            category: data.category,
            price: data.price,
            rating: 0, // ⭐ FIXED: Rating awal selalu 0
            image: data.image ?? null,
            description: data.description ?? null,
            restaurant_id: data.restaurant_id,
          },
        ])
        .select()
        .single();

      if (error) {
        toast.error("Gagal menambah menu");
        console.error("addMenuItem error", error);
        return false;
      }

      setMenuItems((prev) => [inserted as Menu, ...prev]);
      toast.success("Menu berhasil ditambahkan");
      return true;
    } catch (e) {
      console.error("addMenuItem", e);
      return false;
    }
  };
// ===============================
// AppContext.tsx — PART 3 / 3
// ===============================

  const updateMenuItem = async (
    menuId: string,
    updatedData: Partial<Omit<Menu, "id" | "created_at">>
  ) => {
    try {
      if (!isAdmin) {
        toast.error("Hanya admin yang dapat mengedit menu");
        return false;
      }

      const { data: updated, error } = await supabase
        .from("menu_items")
        .update({ ...updatedData })
        .eq("id", menuId)
        .select()
        .single();

      if (error) {
        toast.error("Gagal mengupdate menu");
        console.error("updateMenuItem error", error);
        return false;
      }

      setMenuItems((prev) =>
        prev.map((m) => (m.id === menuId ? (updated as Menu) : m))
      );

      toast.success("Menu berhasil diupdate");
      return true;
    } catch (e) {
      console.error("updateMenuItem", e);
      return false;
    }
  };

  const deleteMenuItem = async (menuId: string) => {
    try {
      if (!isAdmin) {
        toast.error("Hanya admin yang dapat menghapus menu");
        return false;
      }

      const { error } = await supabase
        .from("menu_items")
        .delete()
        .eq("id", menuId);

      if (error) {
        console.error("deleteMenuItem", error);
        toast.error("Gagal menghapus menu");
        return false;
      }

      setMenuItems((prev) => prev.filter((m) => m.id !== menuId));
      toast.success("Menu berhasil dihapus");
      return true;
    } catch (e) {
      console.error("deleteMenuItem", e);
      return false;
    }
  };

// 🔧 PERBAIKAN: addReview function di AppContext.tsx
// Ganti function addReview yang lama (sekitar line 404-427) dengan ini:

  const addReview = async (data: { 
    menu_id?: string; 
    restaurant_id?: string; 
    rating: number; 
    comment?: string 
  }) => {
    try {
      if (!currentUser) {
        toast.error("Anda harus login untuk menambahkan review");
        return false;
      }

      // Validasi: Harus ada salah satu
      if (!data.menu_id && !data.restaurant_id) {
        toast.error("Menu atau Restaurant harus dipilih");
        return false;
      }

      console.log("📝 Adding review:", data); // Debug log

      const { data: inserted, error } = await supabase
        .from("reviews")
        .insert([
          {
            user_id: currentUser.id,
            menu_id: data.menu_id ?? null,
            restaurant_id: data.restaurant_id ?? null,
            rating: data.rating,
            comment: data.comment ?? null,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("❌ addReview error:", error);
        toast.error("Gagal menambahkan review");
        return false;
      }

      console.log("✅ Review inserted:", inserted); // Debug log

      const newReview = { ...inserted, userName: currentUser.username } as Review;
      setReviews((prev) => [newReview, ...prev]);
      
      // ⭐ UPDATE RATING dengan error handling
      try {
        if (data.menu_id) {
          console.log("🔄 Updating menu rating for:", data.menu_id);
          const { error: rpcError } = await supabase.rpc('update_menu_rating', { 
            p_menu_id: data.menu_id  // ✅ GANTI INI
          });
          
          if (rpcError) {
            console.error("❌ RPC error (menu):", rpcError);
          } else {
            console.log("✅ Menu rating updated");
            await fetchMenuItems();
          }
        }
        
        if (data.restaurant_id) {
          console.log("🔄 Updating restaurant rating for:", data.restaurant_id);
          const { error: rpcError } = await supabase.rpc('update_restaurant_rating', { 
            p_restaurant_id: data.restaurant_id  // ✅ GANTI INI
          });
          
          if (rpcError) {
            console.error("❌ RPC error (restaurant):", rpcError);
          } else {
            console.log("✅ Restaurant rating updated");
            await fetchRestaurants();
          }
        }
      } catch (rpcErr) {
        console.error("❌ RPC call failed:", rpcErr);
      }
      
      toast.success("Review berhasil ditambahkan");
      return true;
    } catch (e) {
      console.error("❌ addReview exception:", e);
      return false;
    }
  };

  const updateReview = async (reviewId: string, data: { rating: number; comment?: string }) => {
    try {
      if (!currentUser) {
        toast.error("Anda harus login untuk mengupdate review");
        return false;
      }

      // ⭐ Ambil data review untuk mendapatkan menu_id atau restaurant_id
      const { data: existingReview, error: checkError } = await supabase
        .from("reviews")
        .select("user_id, menu_id, restaurant_id")
        .eq("id", reviewId)
        .single();

      if (checkError || !existingReview) {
        toast.error("Review tidak ditemukan");
        return false;
      }

      const isOwner = existingReview.user_id === currentUser.id;
      if (!isOwner) {
        toast.error("Anda hanya bisa mengupdate review milik Anda sendiri");
        return false;
      }

      const { data: updated, error } = await supabase
        .from("reviews")
        .update({ rating: data.rating, comment: data.comment })
        .eq("id", reviewId)
        .eq("user_id", currentUser.id)
        .select()
        .single();

      if (error) {
        toast.error("Gagal mengupdate review");
        console.error("updateReview error", error);
        return false;
      }

      const updatedReview = { ...updated, userName: currentUser.username } as Review;
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? updatedReview : r))
      );

      // ⭐ UPDATE RATING setelah review diupdate
      if (existingReview.menu_id) {
        await supabase.rpc('update_menu_rating', { 
          p_menu_id: existingReview.menu_id  // ✅ GANTI INI
        });
        await fetchMenuItems();
      }

      if (existingReview.restaurant_id) {
        await supabase.rpc('update_restaurant_rating', { 
          p_restaurant_id: existingReview.restaurant_id  // ✅ GANTI INI
        });
        await fetchRestaurants();
      }

      toast.success("Review berhasil diupdate");
      return true;
    } catch (e) {
      console.error("updateReview", e);
      return false;
    }
  };
  
  const deleteReview = async (reviewId: string) => {
    try {
      if (!currentUser) {
        toast.error("Anda harus login untuk menghapus review");
        return false;
      }

      // ⭐ Ambil data review untuk cek ownership dan mendapatkan menu_id/restaurant_id
      const { data: existingReview, error: checkError } = await supabase
        .from("reviews")
        .select("user_id, menu_id, restaurant_id")
        .eq("id", reviewId)
        .single();

      if (checkError || !existingReview) {
        toast.error("Review tidak ditemukan");
        return false;
      }

      // ⭐ HANYA pemilik yang bisa hapus
      const isOwner = existingReview.user_id === currentUser.id;
      if (!isOwner) {
        toast.error("Anda hanya bisa menghapus review milik Anda sendiri");
        return false;
      }

      // Simpan menu_id dan restaurant_id sebelum dihapus
      const menuId = existingReview.menu_id;
      const restaurantId = existingReview.restaurant_id;

      // Hapus review
      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", reviewId);

      if (error) {
        console.error("deleteReview", error);
        toast.error("Gagal menghapus review");
        return false;
      }

      setReviews((prev) => prev.filter((r) => r.id !== reviewId));

      // ⭐ UPDATE RATING setelah review dihapus
      if (menuId) {
        await supabase.rpc('update_menu_rating', { 
          p_menu_id: menuId  // ✅ GANTI INI
        });
        await fetchMenuItems();
      }

      if (restaurantId) {
        await supabase.rpc('update_restaurant_rating', { 
          p_restaurant_id: restaurantId  // ✅ GANTI INI
        });
        await fetchRestaurants();
      }

      toast.success("Review berhasil dihapus");
      return true;
    } catch (e) {
      console.error("deleteReview", e);
      return false;
    }
  };

  const addRestaurant = async (
    data: Omit<Restaurant, "id" | "created_at" | "rating">
  ) => {
    if (!isAdmin) {
      toast.error("Hanya admin yang dapat menambah restoran");
      return false;
    }

    try {
      const { data: inserted, error } = await supabase
        .from("restaurants")
        .insert([{ ...data, rating: 0 }])
        .select()
        .single();

      if (error) throw error;

      setRestaurants((prev) => [inserted as Restaurant, ...prev]);
      toast.success("Restoran berhasil ditambahkan");
      return true;
    } catch (e) {
      console.error("addRestaurant", e);
      toast.error("Gagal menambah restoran");
      return false;
    }
  };

  const updateRestaurant = async (
    id: string,
    data: Partial<Omit<Restaurant, "id" | "created_at">>
  ) => {
    if (!isAdmin) {
      toast.error("Hanya admin yang dapat mengedit restoran");
      return false;
    }

    try {
      const { data: updated, error } = await supabase
        .from("restaurants")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      setRestaurants((prev) =>
        prev.map((r) => (r.id === id ? (updated as Restaurant) : r))
      );

      toast.success("Restoran berhasil diupdate");
      return true;
    } catch (e) {
      console.error("updateRestaurant", e);
      toast.error("Gagal mengupdate restoran");
      return false;
    }
  };

  const deleteRestaurant = async (id: string) => {
    if (!isAdmin) {
      toast.error("Hanya admin yang dapat menghapus restoran");
      return false;
    }

    try {
      const { error } = await supabase
        .from("restaurants")
        .delete()
        .eq("id", id);

      if (error) throw error;

      // ⭐ HAPUS RESTAURANT DARI STATE
      setRestaurants((prev) => prev.filter((r) => r.id !== id));

      // ⭐ HAPUS SEMUA MENU YANG TERKAIT RESTAURANT INI
      setMenuItems((prev) => prev.filter((m) => m.restaurant_id !== id));

      // ⭐ HAPUS SEMUA REVIEW YANG TERKAIT RESTAURANT INI
      setReviews((prev) => prev.filter((r) => (r as any).restaurant_id !== id));

      // ⭐ HAPUS FAVORIT RESTAURANT INI (jika user punya)
      setFavoriteRestaurants((prev) => prev.filter((favId) => favId !== id));

      toast.success("Restoran berhasil dihapus");
      return true;
    } catch (e) {
      console.error("deleteRestaurant", e);
      toast.error("Gagal menghapus restoran");
      return false;
    }
  };

  // -----------------------------
  // INITIAL LOAD
  // -----------------------------
  useEffect(() => {
    const loadInitial = async () => {
      setLoading(true);
      await refreshUser();
      await fetchRestaurants();
      await fetchMenuItems();
      await fetchReviews();
      // ❌ HAPUS fetchFavorites dari sini
      setLoading(false);
    };
    loadInitial();
  }, []);

  // ✅ TAMBAHKAN - Fetch favorites saat currentUser berubah
  useEffect(() => {
    if (currentUser) {
      fetchFavorites(); // Hanya fetch jika user login
    } else {
      // Reset favorit jika logout atau guest
      setFavoriteMenus([]);
      setFavoriteRestaurants([]);
    }
  }, [currentUser]); // Dependency: currentUser

  // ✅ SUDAH ADA - Fetch users saat admin login
  useEffect(() => {
    if (currentUser?.role === 'admin') {
      fetchAllUsers();
    }
  }, [currentUser]);

  // -----------------------------
  // PROVIDER
  // -----------------------------
  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        loading,
        menuItems,
        restaurants,
        reviews,
        favoriteMenus,
        favoriteRestaurants,
        allUsers,
        fetchAllUsers,
        updateUserRole,
        deleteUser,
        fetchMenuItems,
        fetchRestaurants,
        fetchFavorites,
        addFavoriteMenu,
        removeFavoriteMenu,
        addFavoriteRestaurant,
        removeFavoriteRestaurant,
        toggleFavoriteRestaurant,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        addRestaurant,
        updateRestaurant,
        deleteRestaurant,
        fetchReviews,
        addReview,
        updateReview,
        deleteReview,
        refreshUser,
        register,
        login,
        logout,
        isAdmin,
        isUser,
        isGuest,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used inside AppProvider");
  }
  return context;
}