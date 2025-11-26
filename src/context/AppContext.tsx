import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

// -----------------------------
// TYPE DEFINITIONS
// -----------------------------
export interface User {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin";
  profile_image?: string;
  bio?: string;
}

export interface Menu {
  id: string;
  name: string;
  rating: number;
  image: string;
  category: string;
  price: number;
  restaurant_id: string;
}

export interface Restaurant {
  id: string;
  name: string;
  rating: number;
  image: string;
  category: string;
  address?: string;
}

export interface Review {
  id: string;
  userName: string;
  comment: string;
  rating: number;
}

interface AppContextProps {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;

  menuItems: Menu[];
  restaurants: Restaurant[];
  reviews: Review[];

  favoriteMenus: string[];
  favoriteRestaurants: string[];

  fetchMenuItems: () => void;
  fetchRestaurants: () => void;
  fetchFavorites: () => void;
  addFavoriteMenu: (menuId: string) => void;
  removeFavoriteMenu: (menuId: string) => void;
  addFavoriteRestaurant: (restaurantId: string) => void;
  removeFavoriteRestaurant: (restaurantId: string) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [menuItems, setMenuItems] = useState<Menu[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [favoriteMenus, setFavoriteMenus] = useState<string[]>([]);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<string[]>([]);

  // -----------------------------
  // FETCH DATA DARI SUPABASE
  // -----------------------------
  const fetchMenuItems = async () => {
    const { data, error } = await supabase.from<Menu>("menu_items").select("*");
    if (error) console.error("Gagal fetch menu:", error);
    else setMenuItems(data || []);
  };

  const fetchRestaurants = async () => {
    const { data, error } = await supabase.from<Restaurant>("restaurants").select("*");
    if (error) console.error("Gagal fetch restoran:", error);
    else setRestaurants(data || []);
  };

  const fetchFavorites = async () => {
    if (!currentUser) return;
    // Favorite menus
    const { data: favMenus, error: favMenuErr } = await supabase
      .from("favorites")
      .select("menu_id")
      .eq("user_id", currentUser.id)
      .not("menu_id", "is", null);
    if (favMenuErr) console.error("Gagal fetch favorite menus:", favMenuErr);
    else setFavoriteMenus(favMenus?.map((f: any) => f.menu_id) || []);

    // Favorite restaurants
    const { data: favResto, error: favRestoErr } = await supabase
      .from("favorites")
      .select("restaurant_id")
      .eq("user_id", currentUser.id)
      .not("restaurant_id", "is", null);
    if (favRestoErr) console.error("Gagal fetch favorite restaurants:", favRestoErr);
    else setFavoriteRestaurants(favResto?.map((f: any) => f.restaurant_id) || []);
  };

  // -----------------------------
  // FAVORITES ACTION
  // -----------------------------
  const addFavoriteMenu = async (menuId: string) => {
    if (!currentUser) return;
    const { error } = await supabase.from("favorites").insert({
      user_id: currentUser.id,
      menu_id: menuId,
    });
    if (error) console.error("Gagal tambah favorite menu:", error);
    else setFavoriteMenus((prev) => [...prev, menuId]);
  };

  const removeFavoriteMenu = async (menuId: string) => {
    if (!currentUser) return;
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", currentUser.id)
      .eq("menu_id", menuId);
    if (error) console.error("Gagal hapus favorite menu:", error);
    else setFavoriteMenus((prev) => prev.filter((id) => id !== menuId));
  };

  const addFavoriteRestaurant = async (restaurantId: string) => {
    if (!currentUser) return;
    const { error } = await supabase.from("favorites").insert({
      user_id: currentUser.id,
      restaurant_id: restaurantId,
    });
    if (error) console.error("Gagal tambah favorite restoran:", error);
    else setFavoriteRestaurants((prev) => [...prev, restaurantId]);
  };

  const removeFavoriteRestaurant = async (restaurantId: string) => {
    if (!currentUser) return;
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", currentUser.id)
      .eq("restaurant_id", restaurantId);
    if (error) console.error("Gagal hapus favorite restoran:", error);
    else setFavoriteRestaurants((prev) => prev.filter((id) => id !== restaurantId));
  };

  // -----------------------------
  // EFFECTS
  // -----------------------------
  useEffect(() => {
    fetchMenuItems();
    fetchRestaurants();
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [currentUser]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        menuItems,
        restaurants,
        reviews,
        favoriteMenus,
        favoriteRestaurants,
        fetchMenuItems,
        fetchRestaurants,
        fetchFavorites,
        addFavoriteMenu,
        removeFavoriteMenu,
        addFavoriteRestaurant,
        removeFavoriteRestaurant,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used inside AppProvider");
  return context;
}
