import { useState } from "react";
import { RestaurantCard } from "../components/RestaurantCard";
import { Search, SlidersHorizontal, Plus } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { RestaurantFormModal } from "../components/RestaurantFormModal";

export function RestaurantList() {
  const { restaurants } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"rating" | "name">("rating");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  let filteredRestaurants = restaurants.filter((restaurant) => {
    return (
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
  
  // Sort restaurants
  filteredRestaurants = [...filteredRestaurants].sort((a, b) => {
    if (sortBy === "rating") {
      return b.rating - a.rating;
    } else {
      return a.name.localeCompare(b.name);
    }
  });
  
  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white px-6 pt-8 pb-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-white">Daftar Restoran</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-10 h-10 bg-white text-orange-600 rounded-full flex items-center justify-center hover:bg-orange-50 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari restoran..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
        </div>
      </div>
      
      {/* Sort Options */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-gray-600" />
              <span>Urutkan:</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy("rating")}
                className={`px-4 py-2 rounded-full transition-colors ${
                  sortBy === "rating"
                    ? "bg-orange-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Rating Tertinggi
              </button>
              <button
                onClick={() => setSortBy("name")}
                className={`px-4 py-2 rounded-full transition-colors ${
                  sortBy === "name"
                    ? "bg-orange-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Nama A-Z
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Restaurant Grid */}
      <div className="px-6 py-8">
        <div className="max-w-screen-xl mx-auto">
          <p className="text-gray-600 mb-6">
            Menampilkan {filteredRestaurants.length} restoran
          </p>
          {filteredRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500">Tidak ada restoran yang ditemukan</p>
            </div>
          )}
        </div>
      </div>

      <RestaurantFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}