import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { MenuItem } from "../data/static-data";
import { useAppContext } from "../context/AppContext";

interface MenuFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  menu?: MenuItem;
}

export function MenuFormModal({ isOpen, onClose, menu }: MenuFormModalProps) {
  const { addMenuItem, updateMenuItem, restaurants } = useAppContext();
  const [formData, setFormData] = useState({
    name: "",
    category: "Indonesian",
    price: "",
    rating: "4.5",
    image: "",
    description: "",
    restaurantId: "",
  });

  useEffect(() => {
    if (menu) {
      setFormData({
        name: menu.name,
        category: menu.category,
        price: menu.price.toString(),
        rating: menu.rating.toString(),
        image: menu.image,
        description: menu.description,
        restaurantId: menu.restaurantId,
      });
    } else {
      setFormData({
        name: "",
        category: "Indonesian",
        price: "",
        rating: "4.5",
        image: "",
        description: "",
        restaurantId: restaurants[0]?.id || "",
      });
    }
  }, [menu, restaurants]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const restaurant = restaurants.find(r => r.id === formData.restaurantId);
    if (!restaurant) return;

    const menuData: MenuItem = {
      id: menu?.id || Date.now().toString(),
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      rating: parseFloat(formData.rating),
      image: formData.image,
      description: formData.description,
      restaurant: restaurant.name,
      restaurantId: formData.restaurantId,
    };

    if (menu) {
      updateMenuItem(menu.id, menuData);
    } else {
      addMenuItem(menuData);
    }

    onClose();
  };

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
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Contoh: Nasi Goreng Spesial"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Kategori *</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
              <label className="block mb-2">Harga (Rp) *</label>
              <input
                type="number"
                required
                min="0"
                step="1000"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="25000"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block mb-2">Restoran *</label>
              <select
                required
                value={formData.restaurantId}
                onChange={(e) => setFormData({ ...formData, restaurantId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {restaurants.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-2">URL Gambar</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-sm text-gray-500 mt-1">Kosongkan jika tidak ada gambar</p>
          </div>

          <div>
            <label className="block mb-2">Deskripsi *</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Deskripsikan menu Anda..."
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
              {menu ? "Simpan Perubahan" : "Tambah Menu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
