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

  // ==================== HANDLE PRICE RANGE INPUT (FIXED) ====================
  const handlePriceRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    
    // Jika user hapus semua, reset
    if (!input) {
      setFormData({ ...formData, price_range: "" });
      return;
    }

    // Izinkan hanya angka dan satu strip
    const cleanInput = input.replace(/[^\d-]/g, '');
    
    // Cegah multiple strip
    const dashCount = (cleanInput.match(/-/g) || []).length;
    if (dashCount > 1) {
      return; // Jangan update jika ada lebih dari 1 strip
    }

    // Update langsung tanpa format (biar user bisa ketik strip)
    setFormData({ ...formData, price_range: cleanInput });
  };

  // ==================== FORMAT ON BLUR ====================
  const handlePriceBlur = () => {
    const input = formData.price_range;
    
    if (!input) return;

    // Deteksi jika ada tanda hubung (range)
    if (input.includes('-')) {
      const parts = input.split('-');
      
      // Pastikan ada 2 bagian
      if (parts.length === 2) {
        const min = parts[0].trim();
        const max = parts[1].trim();
        
        // Format kedua bagian jika keduanya ada angka
        if (min && max) {
          const formattedMin = formatRupiah(min);
          const formattedMax = formatRupiah(max);
          setFormData({ ...formData, price_range: `${formattedMin} - ${formattedMax}` });
        } else if (min) {
          // Jika hanya min yang ada, format min saja
          setFormData({ ...formData, price_range: formatRupiah(min) });
        }
      }
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
    
    // Bersihkan dan set
    const cleanInput = pastedText.replace(/[^\d-]/g, '');
    setFormData({ ...formData, price_range: cleanInput });
    
    // Format setelah paste
    setTimeout(() => {
      handlePriceBlur();
    }, 0);
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
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
          <h2 className="text-xl font-semibold">
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nama Restoran */}
          <div>
            <label className="block mb-2 font-medium">
              Nama Restoran <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              placeholder="Contoh: Restoran Padang Sederhana"
            />
          </div>

          {/* Kategori & Rating */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Kategori */}
            <div>
              <label className="block mb-2 font-medium">
                Kategori <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              >
                <option value="Indonesian">Indonesian</option>
                <option value="Chinese">Chinese</option>
                <option value="Italian">Italian</option>
                <option value="Japanese">Japanese</option>
                <option value="Thai">Thai</option>
                <option value="American">American</option>
              </select>
            </div>

            {/* Rating Info (Read-Only) */}
            {restaurant && (
              <div>
                <label className="block mb-2 font-medium">Rating</label>
                <div className="px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 flex items-center gap-2">
                  <Star className="w-5 h-5 fill-orange-500 text-orange-500" />
                  <span className="font-semibold">
                    {restaurant.rating?.toFixed(1) || "0.0"}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({reviewCount} review)
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Info Rating */}
          {restaurant && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p className="text-sm text-gray-600">
                💡 {reviewCount > 0 
                  ? `Rating dihitung otomatis dari ${reviewCount} review pengguna` 
                  : "Belum ada review. Rating akan muncul setelah ada review dari pengguna."}
              </p>
            </div>
          )}

          {!restaurant && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-600">
                💡 Rating akan otomatis dihitung dari review pengguna setelah restoran ditambahkan.
              </p>
            </div>
          )}

          {/* Alamat */}
          <div>
            <label className="block mb-2 font-medium">
              Alamat <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              placeholder="Contoh: Jl. Sudirman No. 123, Jakarta"
            />
          </div>

          {/* Jam Buka & Kisaran Harga */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Jam Buka */}
            <div>
              <label className="block mb-2 font-medium">
                Jam Buka <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.open_hours}
                onChange={(e) => setFormData({ ...formData, open_hours: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder="08:00 - 22:00"
              />
            </div>

            {/* Kisaran Harga - AUTO FORMAT (FIXED) */}
            <div>
              <label className="block mb-2 font-medium">
                Kisaran Harga <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.price_range}
                onChange={handlePriceRangeChange}
                onBlur={handlePriceBlur}
                onPaste={handlePricePaste}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder="Ketik: 20000-50000"
              />
              <p className="text-xs text-gray-500 mt-1.5">
                💡 Ketik angka saja, format otomatis menjadi "Rp 20.000 - Rp 50.000"
              </p>
            </div>
          </div>

          {/* URL Gambar */}
          <div>
            <label className="block mb-2 font-medium">
              URL Gambar
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-gray-500 mt-1.5">
              Opsional: Masukkan URL gambar restoran
            </p>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block mb-2 font-medium">
              Deskripsi <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none"
              placeholder="Deskripsikan restoran Anda..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all font-medium"
            >
              {restaurant ? "Simpan Perubahan" : "Tambah Restoran"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}