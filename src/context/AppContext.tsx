import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  menuItems as initialMenuItems, 
  restaurants as initialRestaurants,
  reviews as initialReviews,
  MenuItem,
  Restaurant,
  Review
} from "../data/static-data";

interface AppContextType {
  menuItems: MenuItem[];
  restaurants: Restaurant[];
  reviews: Review[];
  favoriteMenus: string[];
  favoriteRestaurants: string[];
  userName: string;
  profileImage: string;
  userBio: string;
  addMenuItem: (menu: MenuItem) => void;
  updateMenuItem: (id: string, menu: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  addRestaurant: (restaurant: Restaurant) => void;
  updateRestaurant: (id: string, restaurant: Partial<Restaurant>) => void;
  deleteRestaurant: (id: string) => void;
  addReview: (review: Review) => void;
  updateReview: (id: string, review: Partial<Review>) => void;
  deleteReview: (id: string) => void;
  toggleFavoriteMenu: (menuId: string) => void;
  toggleFavoriteRestaurant: (restaurantId: string) => void;
  setUserName: (name: string) => void;
  setProfileImage: (image: string) => void;
  setUserBio: (bio: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem("menuItems");
    return saved ? JSON.parse(saved) : initialMenuItems;
  });

  const [restaurants, setRestaurants] = useState<Restaurant[]>(() => {
    const saved = localStorage.getItem("restaurants");
    return saved ? JSON.parse(saved) : initialRestaurants;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem("reviews");
    return saved ? JSON.parse(saved) : initialReviews;
  });

  const [favoriteMenus, setFavoriteMenus] = useState<string[]>(() => {
    const saved = localStorage.getItem("favoriteMenus");
    return saved ? JSON.parse(saved) : [];
  });

  const [favoriteRestaurants, setFavoriteRestaurants] = useState<string[]>(() => {
    const saved = localStorage.getItem("favoriteRestaurants");
    return saved ? JSON.parse(saved) : [];
  });

  const [userName, setUserName] = useState<string>(() => {
    const saved = localStorage.getItem("userName");
    return saved || "";
  });

  const [profileImage, setProfileImage] = useState<string>(() => {
    const saved = localStorage.getItem("profileImage");
    return saved || "";
  });

  const [userBio, setUserBio] = useState<string>(() => {
    const saved = localStorage.getItem("userBio");
    return saved || "";
  });

  useEffect(() => {
    localStorage.setItem("menuItems", JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem("restaurants", JSON.stringify(restaurants));
  }, [restaurants]);

  useEffect(() => {
    localStorage.setItem("reviews", JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem("favoriteMenus", JSON.stringify(favoriteMenus));
  }, [favoriteMenus]);

  useEffect(() => {
    localStorage.setItem("favoriteRestaurants", JSON.stringify(favoriteRestaurants));
  }, [favoriteRestaurants]);

  useEffect(() => {
    localStorage.setItem("userName", userName);
  }, [userName]);

  useEffect(() => {
    localStorage.setItem("profileImage", profileImage);
  }, [profileImage]);

  useEffect(() => {
    localStorage.setItem("userBio", userBio);
  }, [userBio]);

  const addMenuItem = (menu: MenuItem) => {
    setMenuItems([...menuItems, menu]);
  };

  const updateMenuItem = (id: string, updatedMenu: Partial<MenuItem>) => {
    setMenuItems(menuItems.map(m => m.id === id ? { ...m, ...updatedMenu } : m));
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems(menuItems.filter(m => m.id !== id));
  };

  const addRestaurant = (restaurant: Restaurant) => {
    setRestaurants([...restaurants, restaurant]);
  };

  const updateRestaurant = (id: string, updatedRestaurant: Partial<Restaurant>) => {
    setRestaurants(restaurants.map(r => r.id === id ? { ...r, ...updatedRestaurant } : r));
  };

  const deleteRestaurant = (id: string) => {
    setRestaurants(restaurants.filter(r => r.id !== id));
  };

  const addReview = (review: Review) => {
    setReviews([...reviews, review]);
  };

  const updateReview = (id: string, updatedReview: Partial<Review>) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, ...updatedReview } : r));
  };

  const deleteReview = (id: string) => {
    setReviews(reviews.filter(r => r.id !== id));
  };

  const toggleFavoriteMenu = (menuId: string) => {
    setFavoriteMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const toggleFavoriteRestaurant = (restaurantId: string) => {
    setFavoriteRestaurants(prev => 
      prev.includes(restaurantId) 
        ? prev.filter(id => id !== restaurantId)
        : [...prev, restaurantId]
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
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        addRestaurant,
        updateRestaurant,
        deleteRestaurant,
        addReview,
        updateReview,
        deleteReview,
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
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
}