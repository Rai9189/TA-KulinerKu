import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { MenuItem, Restaurant, Review, User } from "../types";
import { supabase } from "../lib/supabaseClient";

interface AppContextType {
  menuItems: MenuItem[];
  restaurants: Restaurant[];
  reviews: Review[];

  favoriteMenus: string[];
  favoriteRestaurants: string[];

  user: User | null;          // Null = Guest
  role: "guest" | "user" | "admin";

  toggleFavoriteMenu: (menuId: string) => void;
  toggleFavoriteRestaurant: (restaurantId: string) => void;

  refreshUser: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [favoriteMenus, setFavoriteMenus] = useState<string[]>([]);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<string[]>([]);

  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<"guest" | "user" | "admin">("guest");

  // ============================
  //  FETCH MENU, RESTO, REVIEW
  // ============================

  const fetchMenuItems = async () => {
    const { data, error } = await supabase.from("menu_items").select("*");
    if (!error && data) setMenuItems(data);
  };

  const fetchRestaurants = async () => {
    const { data, error } = await supabase.from("restaurants").select("*");
    if (!error && data) setRestaurants(data);
  };

  const fetchReviews = async () => {
    const { data, error } = await supabase.from("reviews").select("*");
    if (!error && data) setReviews(data);
  };

  // ============================
  //        LOAD USER
  // ============================

  const refreshUser = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      setRole("guest");
      return;
    }

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", token)
      .single();

    if (error || !data) {
      setUser(null);
      setRole("guest");
      return;
    }

    setUser(data);
    setRole(data.role === "admin" ? "admin" : "user");

    // fetch favorites user
    fetchUserFavorites(data.id);
  };

  const fetchUserFavorites = async (userId: string) => {
    const { data, error } = await supabase
      .from("favorites")
      .select("*")
      .eq("user_id", userId);

    if (!error && data) {
      setFavoriteMenus(data.map((f: any) => f.menu_id).filter(Boolean));
      setFavoriteRestaurants(data.map((f: any) => f.restaurant_id).filter(Boolean));
    }
  };

  // Load user & data awal
  useEffect(() => {
    refreshUser();
    fetchMenuItems();
    fetchRestaurants();
    fetchReviews();
  }, []);

  // ============================
  //      FAVORITE HANDLERS
  // ============================

  const toggleFavoriteMenu = async (menuId: string) => {
    if (role === "guest") {
      alert("Silakan login untuk menambahkan favorit!");
      return;
    }

    const alreadyFav = favoriteMenus.includes(menuId);

    if (alreadyFav) {
      await supabase
        .from("favorites")
        .delete()
        .eq("menu_id", menuId)
        .eq("user_id", user?.id);

      setFavoriteMenus(prev => prev.filter(id => id !== menuId));
      return;
    }

    await supabase.from("favorites").insert({
      user_id: user?.id,
      menu_id: menuId,
    });

    setFavoriteMenus(prev => [...prev, menuId]);
  };

  const toggleFavoriteRestaurant = async (restaurantId: string) => {
    if (role === "guest") {
      alert("Silakan login untuk menambahkan favorit!");
      return;
    }

    const alreadyFav = favoriteRestaurants.includes(restaurantId);

    if (alreadyFav) {
      await supabase
        .from("favorites")
        .delete()
        .eq("restaurant_id", restaurantId)
        .eq("user_id", user?.id);

      setFavoriteRestaurants(prev => prev.filter(id => id !== restaurantId));
      return;
    }

    await supabase.from("favorites").insert({
      user_id: user?.id,
      restaurant_id: restaurantId,
    });

    setFavoriteRestaurants(prev => [...prev, restaurantId]);
  };

  return (
    <AppContext.Provider
      value={{
        menuItems,
        restaurants,
        reviews,
        favoriteMenus,
        favoriteRestaurants,
        user,
        role,
        toggleFavoriteMenu,
        toggleFavoriteRestaurant,
        refreshUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
}
