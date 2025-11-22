import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { MenuItem, Restaurant, Review } from "../types"; // Buat type TS sesuai tabel Supabase
import { supabase } from "../lib/supabaseClient"; // Supabase client

interface AppContextType {
  menuItems: MenuItem[];
  restaurants: Restaurant[];
  reviews: Review[];
  favoriteMenus: string[];
  favoriteRestaurants: string[];
  userName: string;
  profileImage: string;
  userBio: string;
  toggleFavoriteMenu: (menuId: string) => void;
  toggleFavoriteRestaurant: (restaurantId: string) => void;
  setUserName: (name: string) => void;
  setProfileImage: (image: string) => void;
  setUserBio: (bio: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [favoriteMenus, setFavoriteMenus] = useState<string[]>([]);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<string[]>([]);
  const [userName, setUserName] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string>("");
  const [userBio, setUserBio] = useState<string>("");

  // Fetch menu items dari Supabase
  const fetchMenuItems = async () => {
    const { data, error } = await supabase.from("menu").select("*");
    if (!error && data) setMenuItems(data);
  };

  // Fetch restaurants dari Supabase
  const fetchRestaurants = async () => {
    const { data, error } = await supabase.from("restaurants").select("*");
    if (!error && data) setRestaurants(data);
  };

  // Fetch reviews dari Supabase
  const fetchReviews = async () => {
    const { data, error } = await supabase.from("reviews").select("*");
    if (!error && data) setReviews(data);
  };

  useEffect(() => {
    fetchMenuItems();
    fetchRestaurants();
    fetchReviews();
  }, []);

  const toggleFavoriteMenu = (menuId: string) => {
    setFavoriteMenus(prev => 
      prev.includes(menuId) ? prev.filter(id => id !== menuId) : [...prev, menuId]
    );
  };

  const toggleFavoriteRestaurant = (restaurantId: string) => {
    setFavoriteRestaurants(prev => 
      prev.includes(restaurantId) ? prev.filter(id => id !== restaurantId) : [...prev, restaurantId]
    );
  };

  return (
    <AppContext.Provider
      value={{
        menuItems,
        restaurants,
        reviews,
        favoriteMenus,
        favoriteRestaurants,
        userName,
        profileImage,
        userBio,
        toggleFavoriteMenu,
        toggleFavoriteRestaurant,
        setUserName,
        setProfileImage,
        setUserBio,
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
