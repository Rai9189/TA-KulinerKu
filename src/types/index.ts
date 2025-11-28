import { Request } from 'express';

// Interface User
export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin' | 'guest';
  created_at?: string;
}

// Interface untuk Request dengan User yang sudah authenticated
export interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
    email: string;
    role: 'user' | 'admin' | 'guest';
  };
}

// Interface Restaurant
export interface Restaurant {
  id: string;
  name: string;
  address: string;
  city: string;
  cuisine_type: string;
  description?: string;
  image_url?: string;
  rating?: number;
  created_at?: string;
}

// Interface Menu
export interface Menu {
  id: string;
  restaurant_id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  image_url?: string;
  is_available: boolean;
  created_at?: string;
}

// Interface Review
export interface Review {
  id: string;
  user_id: string;
  restaurant_id?: string;
  menu_id?: string;
  rating: number;
  comment?: string;
  created_at?: string;
  user?: {
    username: string;
  };
}