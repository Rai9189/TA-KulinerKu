import { Search, TrendingUp, ChefHat } from "lucide-react";
import { MenuCard } from "../components/MenuCard";
import { RestaurantCard } from "../components/RestaurantCard";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

interface Menu {
  id: string;
  name: string;
  rating: number;
  image: string;
  category: string;
  price: string;
  restaurant_id: string;
}

interface Restaurant {
  id: string;
  name: string;
  rating: number;
  image: string;
  category: string;
  address: string;
}

export function Home() {
  const [menuItems, setMenuItems] = useState<Menu[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ambil menu dari Supabase
        const { data: menuData, error: menuError } = await supabase
          .from<Menu>("menu_items")
          .select("*");
        if (menuError) throw menuError;
        setMenuItems(menuData || []);

        // Ambil restoran dari Supabase
        const { data: restaurantData, error: restaurantError } = await supabase
          .from<Restaurant>("restaurants")
          .select("*");
        if (restaurantError) throw restaurantError;
        setRestaurants(restaurantData || []);
      } catch (err) {
        console.error("Gagal fetch data:", err);
      }
    };

    fetchData();
  }, []);

  const topMenus = [...menuItems].sort((a, b) => b.rating - a.rating).slice(0, 6);
  const topRestaurants = [...restaurants].sort((a, b) => b.rating - a.rating).slice(0, 4);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/menu?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white px-6 pt-8 pb-12">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <ChefHat className="w-8 h-8" />
            <h1 className="text-white">KulinerKu</h1>
          </div>
          <p className="text-orange-50 mb-6">
            Temukan makanan favorit dan restoran terbaik di sekitar Anda
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari menu atau restoran..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </form>
        </div>
      </div>

      {/* Popular Menus Section */}
      <div className="px-6 py-8">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-orange-600" />
            <h2>Menu Populer</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topMenus.map((menu) => (
              <MenuCard key={menu.id} menu={menu} />
            ))}
          </div>
        </div>
      </div>

      {/* Popular Restaurants Section */}
      <div className="px-6 py-8 bg-gray-50">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2>Restoran Terpopuler</h2>
            <button
              onClick={() => navigate("/restaurants")}
              className="text-orange-600 hover:text-orange-700"
            >
              Lihat Semua
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
