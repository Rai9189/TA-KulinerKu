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
  loading: boolean;

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

  refreshUser: () => Promise<void>;
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

  // -----------------------------
  // REFRESH USER DARI LOCALSTORAGE
  // -----------------------------
  const refreshUser = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      const { data, error } = await supabase
        .from<User>("users")
        .select("*")
        .eq("id", token)
        .single();

      if (!error && data) setCurrentUser(data);
      else setCurrentUser(null);
    } else {
      setCurrentUser(null);
    }
  };

  // -----------------------------
  // FETCH DATA
  // -----------------------------
  const fetchMenuItems = async () => {
    const { data, error } = await supabase.from<Menu>("menu_items").select("*");
    if (!error) setMenuItems(data || []);
  };

  const fetchRestaurants = async () => {
    const { data, error } = await supabase.from<Restaurant>("restaurants").select("*");
    if (!error) setRestaurants(data || []);
  };

  const fetchFavorites = async () => {
    if (!currentUser) return;

    const { data: favMenus } = await supabase
      .from("favorites")
      .select("menu_id")
      .eq("user_id", currentUser.id)
      .not("menu_id", "is", null);
    setFavoriteMenus(favMenus?.map((f: any) => f.menu_id) || []);

    const { data: favResto } = await supabase
      .from("favorites")
      .select("restaurant_id")
      .eq("user_id", currentUser.id)
      .not("restaurant_id", "is", null);
    setFavoriteRestaurants(favResto?.map((f: any) => f.restaurant_id) || []);
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
    if (!error) setFavoriteMenus((prev) => [...prev, menuId]);
  };

  const removeFavoriteMenu = async (menuId: string) => {
    if (!currentUser) return;
    await supabase.from("favorites").delete().eq("user_id", currentUser.id).eq("menu_id", menuId);
    setFavoriteMenus((prev) => prev.filter((id) => id !== menuId));
  };

  const addFavoriteRestaurant = async (restaurantId: string) => {
    if (!currentUser) return;
    const { error } = await supabase.from("favorites").insert({
      user_id: currentUser.id,
      restaurant_id: restaurantId,
    });
    if (!error) setFavoriteRestaurants((prev) => [...prev, restaurantId]);
  };

  const removeFavoriteRestaurant = async (restaurantId: string) => {
    if (!currentUser) return;
    await supabase.from("favorites").delete().eq("user_id", currentUser.id).eq("restaurant_id", restaurantId);
    setFavoriteRestaurants((prev) => prev.filter((id) => id !== restaurantId));
  };

  // -----------------------------
  // EFFECTS
  // -----------------------------
  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
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
        loading,
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
        refreshUser,
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
