import { useState, useEffect } from "react";
import { X, Star } from "lucide-react";
import { useAppContext } from "../context/AppContext";

interface RestaurantFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurant?: any;
}

export function RestaurantFormModal({ isOpen, onClose, restaurant }: RestaurantFormModalProps) {
  const { addRestaurant, updateRestaurant, reviews } = useAppContext();

  const [formData, setFormData] = useState({
    name: "",
    category: "Indonesian",
    address: "",
    image: "",
    description: "",
    open_hours: "",
    price_range: "",
  });

  // Load data jika edit mode
  useEffect(() => {
    if (restaurant) {
      setFormData({
        name: restaurant.name || "",
        category: restaurant.category || "Indonesian",
        address: restaurant.address || "",
        image: restaurant.image || "",
        description: restaurant.description || "",
        open_hours: restaurant.open_hours || "",
        price_range: restaurant.price_range || "",
      });
    } else {
      setFormData({
        name: "",
        category: "Indonesian",
        address: "",
        image: "",
        description: "",
        open_hours: "",
        price_range: "",
      });
    }
  }, [restaurant]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSend = {
      name: formData.name,
      category: formData.category,
      address: formData.address,
      image: formData.image,
      description: formData.description,
      open_hours: formData.open_hours,
      price_range: formData.price_range,
    };

    if (restaurant) {
      await updateRestaurant(restaurant.id, dataToSend);
    } else {
      await addRestaurant(dataToSend);
    }

    onClose();
  };

  // Hitung review count untuk restaurant (edit mode)
  const restaurantReviews = restaurant ? reviews.filter((r) => r.restaurant_id === restaurant.id) : [];
  const reviewCount = restaurantReviews.length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2>{restaurant ? "Edit Restoran" : "Tambah Restoran Baru"}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block mb-2">Nama Restoran *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-2">Kategori *</label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="Indonesian">Indonesian</option>
              <option value="Chinese">Chinese</option>
              <option value="Italian">Italian</option>
              <option value="Japanese">Japanese</option>
              <option value="Thai">Thai</option>
              <option value="American">American</option>
            </select>
          </div>

          {/* ⭐ RATING INFO (READ-ONLY) - Hanya tampil saat edit */}
          {restaurant && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-5 h-5 fill-orange-500 text-orange-500" />
                <span className="font-medium">Rating: {restaurant.rating?.toFixed(1) || "0.0"}</span>
              </div>
              <p className="text-sm text-gray-600">
                {reviewCount > 0 
                  ? `Dihitung otomatis dari ${reviewCount} review pengguna` 
                  : "Belum ada review. Rating akan muncul setelah ada review dari pengguna."}
              </p>
            </div>
          )}

          {/* ⭐ INFO untuk mode tambah */}
          {!restaurant && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-600">
                💡 Rating akan otomatis dihitung dari review pengguna setelah restoran ditambahkan.
              </p>
            </div>
          )}

          <div>
            <label className="block mb-2">Alamat *</label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Jam Buka *</label>
              <input
                type="text"
                required
                value={formData.open_hours}
                onChange={(e) => setFormData({ ...formData, open_hours: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="08:00 - 22:00"
              />
            </div>

            <div>
              <label className="block mb-2">Kisaran Harga *</label>
              <input
                type="text"
                required
                value={formData.price_range}
                onChange={(e) => setFormData({ ...formData, price_range: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Rp 20.000 - Rp 50.000"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2">URL Gambar</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-2">Deskripsi *</label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              {restaurant ? "Simpan Perubahan" : "Tambah Restoran"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}