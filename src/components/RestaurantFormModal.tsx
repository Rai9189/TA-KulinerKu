import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useAppContext } from "../context/AppContext";

interface RestaurantFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurant?: any; // Ambil dari Supabase, pakai tipe any atau bisa dibuat interface
}

export function RestaurantFormModal({ isOpen, onClose, restaurant }: RestaurantFormModalProps) {
  const { addRestaurant, updateRestaurant } = useAppContext();

  const [formData, setFormData] = useState({
    name: "",
    category: "Indonesian",
    rating: "4.5",
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
        rating: restaurant.rating?.toString() || "4.5",
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
        rating: "4.5",
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
      rating: parseFloat(formData.rating),
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

          <div className="grid grid-cols-2 gap-4">
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

            <div>
              <label className="block mb-2">Rating *</label>
              <input
                type="number"
                required
                min="0"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

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
