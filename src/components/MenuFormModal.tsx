import { useState, useEffect } from "react";
import { X, Star } from "lucide-react";
import { useAppContext } from "../context/AppContext";

interface MenuFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  menu?: any; // menu dari Supabase (UUID)
}

export function MenuFormModal({ isOpen, onClose, menu }: MenuFormModalProps) {
  const { addMenuItem, updateMenuItem, restaurants, reviews } = useAppContext();

  const [formData, setFormData] = useState({
    name: "",
    category: "Indonesian",
    price: "",
    image: "",
    description: "",
    restaurant_id: "",
  });

  // load data (edit mode)
  useEffect(() => {
    if (menu) {
      setFormData({
        name: menu.name,
        category: menu.category,
        price: menu.price.toString(),
        image: menu.image || "",
        description: menu.description || "",
        restaurant_id: menu.restaurant_id,
      });
    } else {
      setFormData({
        name: "",
        category: "Indonesian",
        price: "",
        image: "",
        description: "",
        restaurant_id: restaurants[0]?.id || "",
      });
    }
  }, [menu, restaurants]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSend = {
      name: formData.name,
      category: formData.category,
      price: Number(formData.price),
      rating: 0, // ⭐ Rating otomatis 0, akan diupdate dari review
      image: formData.image,
      description: formData.description,
      restaurant_id: formData.restaurant_id,
    };

    if (menu) {
      // UPDATE Supabase (tanpa rating)
      const { rating, ...updateData } = dataToSend;
      await updateMenuItem(menu.id, updateData);
    } else {
      // INSERT Supabase
      await addMenuItem(dataToSend);
    }

    onClose();
  };

  // Hitung review count untuk menu (edit mode)
  const menuReviews = menu ? reviews.filter((r) => r.menu_id === menu.id) : [];
  const reviewCount = menuReviews.length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2>{menu ? "Edit Menu" : "Tambah Menu Baru"}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block mb-2">Nama Menu *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Kategori *</label>
              <select
                required
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
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
              <label className="block mb-2">Harga *</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* ⭐ RATING INFO (READ-ONLY) - Hanya tampil saat edit */}
          {menu && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-5 h-5 fill-orange-500 text-orange-500" />
                <span className="font-medium">Rating: {menu.rating?.toFixed(1) || "0.0"}</span>
              </div>
              <p className="text-sm text-gray-600">
                {reviewCount > 0 
                  ? `Dihitung otomatis dari ${reviewCount} review pengguna` 
                  : "Belum ada review. Rating akan muncul setelah ada review dari pengguna."}
              </p>
            </div>
          )}

          {/* ⭐ INFO untuk mode tambah */}
          {!menu && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-600">
                💡 Rating akan otomatis dihitung dari review pengguna setelah menu ditambahkan.
              </p>
            </div>
          )}

          <div>
            <label className="block mb-2">Restoran *</label>
            <select
              required
              value={formData.restaurant_id}
              onChange={(e) =>
                setFormData({ ...formData, restaurant_id: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              {restaurants.map((r: any) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2">URL Gambar</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-2">Deskripsi *</label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg"
            >
              Batal
            </button>

            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              {menu ? "Simpan Perubahan" : "Tambah Menu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}