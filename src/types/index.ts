export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: "admin" | "user";
  profile_image?: string;
  bio?: string;
  created_at: string;
}

export interface Restaurant {
  id: string;
  name: string;
  category: string;
  rating: number;
  address: string;
  image: string;
  description: string;
  open_hours: string;
  price_range: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  image: string;
  description: string;
  restaurant_id: string;
}

export interface Review {
  id: string;
  restaurant_id?: string;
  menu_id?: string;
  user_id: string;
  rating: number;
  comment: string;
  date: string;
}
