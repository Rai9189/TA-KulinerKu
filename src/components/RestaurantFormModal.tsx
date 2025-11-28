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

  // ==================== FORMAT PRICE FUNCTION ====================
  const formatRupiah = (value: string): string => {
    // Hapus semua karakter non-digit
    const numbers = value.replace(/\D/g, '');
    
    // Jika kosong, return empty
    if (!numbers) return '';
    
    // Format dengan titik pemisah ribuan
    const formatted = parseInt(numbers).toLocaleString('id-ID');
    
    return `Rp ${formatted}`;
  };

  // ==================== HANDLE PRICE RANGE INPUT ====================
  const handlePriceRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    
    // Jika user hapus semua, reset
    if (!input) {
      setFormData({ ...formData, price_range: "" });
      return;
    }

    // Deteksi jika ada tanda hubung (range)
    if (input.includes('-')) {
      const parts = input.split('-').map(p => p.trim());
      
      // Format kedua bagian
      const formattedParts = parts.map(part => {
        const numbers = part.replace(/\D/g, '');
        if (!numbers) return '';
        return formatRupiah(numbers);
      });

      // Join dengan " - "
      const result = formattedParts.filter(p => p).join(' - ');
      setFormData({ ...formData, price_range: result });
    } else {
      // Single value, auto format
      const formatted = formatRupiah(input);
      setFormData({ ...formData, price_range: formatted });
    }
  };

  // ==================== HANDLE PASTE ====================
  const handlePricePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    
    // Simulasikan input change
    handlePriceRangeChange({
      target: { value: pastedText }
    } as any);
  };

  // ==================== SUBMIT HANDLER ====================
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
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 flex items-center justify-between z-10">
          <h2 className="text-lg sm:text-xl font-semibold">
            {restaurant ? "Edit Restoran" : "Tambah Restoran Baru"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          {/* Nama Restoran */}
          <div>
            <label className="block mb-2 font-medium text-sm sm:text-base">
              Nama Restoran <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm sm:text-base"
              placeholder="Contoh: Restoran Padang Sederhana"
            />
          </div>

          {/* Kategori */}
          <div>
            <label className="block mb-2 font-medium text-sm sm:text-base">
              Kategori <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm sm:text-base"
            >
              <option value="Indonesian">Indonesian</option>
              <option value="Chinese">Chinese</option>
              <option value="Italian">Italian</option>
              <option value="Japanese">Japanese</option>
              <option value="Thai">Thai</option>
              <option value="American">American</option>
            </select>
          </div>

          {/* Rating Info (Read-Only) - Hanya tampil saat edit */}
          {restaurant && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-5 h-5 fill-orange-500 text-orange-500" />
                <span className="font-semibold text-sm sm:text-base">
                  Rating: {restaurant.rating?.toFixed(1) || "0.0"}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-600">
                {reviewCount > 0 
                  ? `Dihitung otomatis dari ${reviewCount} review pengguna` 
                  : "Belum ada review. Rating akan muncul setelah ada review dari pengguna."}
              </p>
            </div>
          )}

          {/* Info untuk mode tambah */}
          {!restaurant && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-xs sm:text-sm text-gray-600">
                💡 Rating akan otomatis dihitung dari review pengguna setelah restoran ditambahkan.
              </p>
            </div>
          )}

          {/* Alamat */}
          <div>
            <label className="block mb-2 font-medium text-sm sm:text-base">
              Alamat <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm sm:text-base"
              placeholder="Contoh: Jl. Sudirman No. 123, Jakarta"
            />
          </div>

          {/* Jam Buka & Kisaran Harga */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Jam Buka */}
            <div>
              <label className="block mb-2 font-medium text-sm sm:text-base">
                Jam Buka <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.open_hours}
                onChange={(e) => setFormData({ ...formData, open_hours: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm sm:text-base"
                placeholder="08:00 - 22:00"
              />
            </div>

            {/* Kisaran Harga - AUTO FORMAT */}
            <div>
              <label className="block mb-2 font-medium text-sm sm:text-base">
                Kisaran Harga <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.price_range}
                onChange={handlePriceRangeChange}
                onPaste={handlePricePaste}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm sm:text-base"
                placeholder="Ketik: 20000 atau 20000-50000"
              />
              <p className="text-xs text-gray-500 mt-1.5">
                💡 Ketik angka saja, format otomatis menjadi "Rp 20.000 - Rp 50.000"
              </p>
            </div>
          </div>

          {/* URL Gambar */}
          <div>
            <label className="block mb-2 font-medium text-sm sm:text-base">
              URL Gambar
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm sm:text-base"
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-gray-500 mt-1.5">
              Opsional: Masukkan URL gambar restoran
            </p>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block mb-2 font-medium text-sm sm:text-base">
              Deskripsi <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none text-sm sm:text-base"
              placeholder="Deskripsikan restoran Anda..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium text-sm sm:text-base"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all font-medium text-sm sm:text-base shadow-lg shadow-orange-500/30"
            >
              {restaurant ? "Simpan Perubahan" : "Tambah Restoran"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}