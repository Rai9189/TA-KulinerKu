import { Link } from "react-router-dom";
import { Star, Heart } from "lucide-react";
import { MenuItem } from "../data/static-data";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useAppContext } from "../context/AppContext";

interface MenuCardProps {
  menu: MenuItem;
}

export function MenuCard({ menu }: MenuCardProps) {
  const { favoriteMenus, toggleFavoriteMenu } = useAppContext();
  const isFavorite = favoriteMenus.includes(menu.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavoriteMenu(menu.id);
  };

  return (
    <Link to={`/menu/${menu.id}`} className="group">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        <div className="relative h-48">
          <ImageWithFallback
            src={menu.image}
            alt={menu.name}
            className="w-full h-full object-cover"
          />
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
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/90 px-2 py-1 rounded-full">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm">{menu.rating}</span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="mb-1 group-hover:text-orange-600 transition-colors line-clamp-1">
            {menu.name}
          </h3>
          <p className="text-sm text-gray-600 mb-2 line-clamp-1">{menu.restaurant}</p>
          <div className="flex items-center justify-between">
            <span className="text-orange-600">
              Rp {menu.price.toLocaleString("id-ID")}
            </span>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {menu.category}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}