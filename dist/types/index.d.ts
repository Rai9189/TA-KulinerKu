import { Request } from 'express';
export interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    role: 'user' | 'admin' | 'guest';
    profile_image?: string;
    bio?: string;
    created_at?: string;
}
export interface AuthRequest extends Request {
    user?: {
        id: string;
        username: string;
        email: string;
        role: 'user' | 'admin' | 'guest';
    };
}
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
export interface Review {
    id: string;
    user_id: string;
    restaurant_id?: string | null;
    menu_id?: string | null;
    rating: number;
    comment?: string;
    created_at?: string;
    user?: {
        username: string;
    };
    restaurant?: {
        name: string;
    } | null;
    menu?: {
        name: string;
    } | null;
}
export interface ReviewWithTarget extends Review {
    targetName: string;
    targetType: 'restaurant' | 'menu';
}
