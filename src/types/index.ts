export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;  // Optional karena tidak selalu diambil dari query
  role: "admin" | "user";
  profile_image: string | null;  // ⭐ Ubah dari optional menjadi nullable
  bio: string | null;            // ⭐ Ubah dari optional menjadi nullable
  created_at: string;
}

export interface Restaurant {
  id: string;
  name: string;
  category: string | null;       // ⭐ TAMBAHKAN | null
  rating: number | null;         // ⭐ TAMBAHKAN | null
  address: string | null;        // ⭐ TAMBAHKAN | null
  image: string | null;          // ⭐ TAMBAHKAN | null
  description: string | null;    // ⭐ TAMBAHKAN | null
  open_hours: string | null;     // ⭐ TAMBAHKAN | null
  price_range: string | null;    // ⭐ TAMBAHKAN | null
  created_at?: string;           // ⭐ TAMBAHKAN (optional)
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number | null;         // ⭐ TAMBAHKAN | null
  image: string | null;          // ⭐ TAMBAHKAN | null
  description: string | null;    // ⭐ TAMBAHKAN | null
  restaurant_id: string;
  created_at?: string;           // ⭐ TAMBAHKAN (optional)
}

export interface Review {
  id: string;
  user_id: string;
  restaurant_id: string | null;  // ⭐ UBAH dari optional (?) menjadi nullable (| null)
  menu_id: string | null;        // ⭐ UBAH dari optional (?) menjadi nullable (| null)
  rating: number;
  comment: string | null;        // ⭐ TAMBAHKAN | null
  created_at: string;            // ⭐ GANTI 'date' menjadi 'created_at'
  
  // ⭐ TAMBAHKAN untuk JOIN query (dipakai di Profile.tsx)
  targetName?: string;
  targetType?: 'restaurant' | 'menu';
}

export interface Favorite {
  id: string;
  user_id: string;
  restaurant_id: string | null;
  menu_id: string | null;
  created_at: string;
}