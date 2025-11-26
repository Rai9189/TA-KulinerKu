import { Link } from "react-router-dom";
import { Star, MapPin, Heart } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useAppContext, Restaurant } from "../context/AppContext";

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const {
    currentUser,
    favoriteRestaurants,
    addFavoriteRestaurant,
    removeFavoriteRestaurant
  } = useAppContext();

  const isFavorite = favoriteRestaurants.includes(restaurant.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser) {
      alert("Anda harus login untuk menggunakan fitur favorit");
      return;
    }

    if (isFavorite) {
      removeFavoriteRestaurant(restaurant.id);
    } else {
      addFavoriteRestaurant(restaurant.id);
    }
  };

  return (
    <Link to={`/restaurants/${restaurant.id}`} className="group">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        <div className="relative h-48">
          <ImageWithFallback
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />

          {/* Tombol favorit */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors z-10"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
              }`}
            />
          </button>

          {/* Rating */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/90 px-2 py-1 rounded-full">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm">{restaurant.rating}</span>
          </div>
        </div>

        {/* Info restoran */}
        <div className="p-4">
          <h3 className="mb-2 group-hover:text-orange-600 transition-colors line-clamp-1">
            {restaurant.name}
          </h3>
          <div className="flex items-start gap-2 text-sm text-gray-600 mb-2">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-1">{restaurant.address}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {restaurant.category}
            </span>
            <span className="text-xs text-gray-600">{restaurant.price_range || ""}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
