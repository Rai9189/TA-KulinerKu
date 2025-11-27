import { Search as SearchIcon, TrendingUp, MapPin } from "lucide-react";
import { MenuCard } from "../components/MenuCard";
import { RestaurantCard } from "../components/RestaurantCard";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

export function Search() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const navigate = useNavigate();
  const { menuItems, restaurants } = useAppContext();

  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  const searchLower = searchQuery.toLowerCase();

  // Filter menu
  const filteredMenus = menuItems.filter(m => 
    m.name?.toLowerCase().includes(searchLower) ||
    m.category?.toLowerCase().includes(searchLower)
  );

  // Filter restaurant
  const filteredRestaurants = restaurants.filter(r => 
    r.name?.toLowerCase().includes(searchLower) ||
    r.category?.toLowerCase().includes(searchLower) ||
    r.address?.toLowerCase().includes(searchLower)
  );

  const totalResults = filteredMenus.length + filteredRestaurants.length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="pb-20">
      {/* Hero Section - Sama seperti Home */}
      <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white px-6 pt-8 pb-12">
        <div className="max-w-screen-xl mx-auto">
          <h1 className="text-white mb-2">Hasil Pencarian</h1>
          <p className="text-orange-50 mb-6">
            {totalResults > 0 
              ? `Ditemukan ${totalResults} hasil untuk "${initialQuery}"`
              : `Tidak ada hasil untuk "${initialQuery}"`
            }
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
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

      {/* Menu Section - Sama seperti Home */}
      {filteredMenus.length > 0 && (
        <div className="px-6 py-8">
          <div className="max-w-screen-xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-6 h-6 text-orange-600" />
              <h2>Menu ({filteredMenus.length})</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMenus.map((menu) => (
                <MenuCard key={menu.id} menu={menu} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Restaurant Section - Sama seperti Home */}
      {filteredRestaurants.length > 0 && (
        <div className="px-6 py-8 bg-gray-50">
          <div className="max-w-screen-xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="w-6 h-6 text-orange-600" />
              <h2>Restoran ({filteredRestaurants.length})</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {totalResults === 0 && (
        <div className="px-6 py-16">
          <div className="max-w-screen-xl mx-auto text-center">
            <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">Tidak ada hasil ditemukan</p>
            <p className="text-gray-400 text-sm mb-6">
              Coba kata kunci lain atau jelajahi menu populer
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      )}
    </div>
  );
}