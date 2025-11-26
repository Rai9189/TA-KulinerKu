import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

// -----------------------------
// TYPE DEFINITIONS
// -----------------------------
export interface User {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin";
}

export interface Menu {
  id: string;
  name: string;
  rating: number;
  image: string;
  category: string;
  price: string;
  restaurant_id: string;
}

export interface Restaurant {
  id: string;
  name: string;
  rating: number;
  image: string;
  category: string;
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

  userName: string;
  setUserName: (name: string) => void;

  userBio: string;
  setUserBio: (bio: string) => void;

  profileImage: string;
  setProfileImage: (img: string) => void;

  favoriteMenus: string[];
  setFavoriteMenus: (fav: string[]) => void;

  favoriteRestaurants: string[];
  setFavoriteRestaurants: (fav: string[]) => void;

  menuItems: Menu[];
  restaurants: Restaurant[];
  reviews: Review[];

  allUsers: User[];
  updateUserRole: (id: string, newRole: "admin" | "user") => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

// -----------------------------
// PROVIDER
// -----------------------------
export function AppProvider({ children }: { children: ReactNode }) {
  // AUTH USER (local)
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // PROFILE USER
  const [userName, setUserName] = useState("Pengguna Baru");
  const [userBio, setUserBio] = useState("Food lover");
  const [profileImage, setProfileImage] = useState("");

  // FAVORITES
  const [favoriteMenus, setFavoriteMenus] = useState<string[]>([]);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<string[]>([]);

  // STATIC DUMMY DATA (bisa diganti Supabase)
  const [menuItems, setMenuItems] = useState<Menu[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([
    {
      id: "1",
      username: "admin",
      email: "admin@example.com",
      role: "admin",
    },
    {
      id: "2",
      username: "user1",
      email: "user1@example.com",
      role: "user",
    },
  ]);

  // ROLE MANAGEMENT ADMIN
  const updateUserRole = (id: string, newRole: "admin" | "user") => {
    setAllUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        userName,
        setUserName,
        userBio,
        setUserBio,
        profileImage,
        setProfileImage,
        favoriteMenus,
        setFavoriteMenus,
        favoriteRestaurants,
        setFavoriteRestaurants,
        menuItems,
        restaurants,
        reviews,
        allUsers,
        updateUserRole,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// -----------------------------
// HOOK
// -----------------------------
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used inside AppProvider");
  return context;
}
