import { useState, useEffect } from "react";
import { X, Star, Clock } from "lucide-react";
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

  // State terpisah untuk time picker
  const [openingTime, setOpeningTime] = useState("08:00");
  const [closingTime, setClosingTime] = useState("22:00");

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

      // Parse open_hours untuk time picker
      if (restaurant.open_hours) {
        const timePattern = /(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/;
        const match = restaurant.open_hours.match(timePattern);
        if (match) {
          setOpeningTime(match[1]);
          setClosingTime(match[2]);
        }
      }
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
      setOpeningTime("08:00");
      setClosingTime("22:00");
    }
  }, [restaurant]);

  // Update open_hours ketika time berubah
  useEffect(() => {
    if (openingTime && closingTime) {
      const formattedHours = `${openingTime} - ${closingTime}`;
      setFormData(prev => ({ ...prev, open_hours: formattedHours }));
    }
  }, [openingTime, closingTime]);

  // ==================== FORMAT PRICE FUNCTION ====================
  const formatRupiah = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (!numbers) return '';
    const formatted = parseInt(numbers).toLocaleString('id-ID');
    return `Rp ${formatted}`;
  };

  // ==================== HANDLE PRICE RANGE INPUT ====================
  const handlePriceRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    
    if (!input) {
      setFormData({ ...formData, price_range: "" });
      return;
    }

    const cleanInput = input.replace(/[^\d-]/g, '');
    const dashCount = (cleanInput.match(/-/g) || []).length;
    if (dashCount > 1) return;

    setFormData({ ...formData, price_range: cleanInput });
  };

  // ==================== FORMAT ON BLUR ====================
  const handlePriceBlur = () => {
    const input = formData.price_range;
    if (!input) return;

    if (input.includes('-')) {
      const parts = input.split('-');
      if (parts.length === 2) {
        const min = parts[0].trim();
        const max = parts[1].trim();
        
        if (min && max) {
          const formattedMin = formatRupiah(min);
          const formattedMax = formatRupiah(max);
          setFormData({ ...formData, price_range: `${formattedMin} - ${formattedMax}` });
        } else if (min) {
          setFormData({ ...formData, price_range: formatRupiah(min) });
        }
      }
    } else {
      const formatted = formatRupiah(input);
      setFormData({ ...formData, price_range: formatted });
    }
  };

  // ==================== HANDLE PASTE ====================
  const handlePricePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const cleanInput = pastedText.replace(/[^\d-]/g, '');
    setFormData({ ...formData, price_range: cleanInput });
    setTimeout(() => handlePriceBlur(), 0);
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
      open_hours: formData.open_hours, // Sudah auto-update dari useEffect
      price_range: formData.price_range,
    };

    if (restaurant) {
      await updateRestaurant(restaurant.id, dataToSend);
    } else {
      await addRestaurant(dataToSend);
    }

    onClose();
  };

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
            {/* ⭐ JAM OPERASIONAL - CLOCK PICKER (di grid kiri) */}
            <div>
              <label className="block mb-2 font-medium">
                Jam Operasional <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                {/* Jam Buka */}
                <div className="relative flex-1">
                  <input
                    type="time"
                    required
                    value={openingTime}
                    onChange={(e) => setOpeningTime(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm"
                  />
                </div>
                
                {/* Separator */}
                <span className="text-gray-400 text-sm font-medium">-</span>
                
                {/* Jam Tutup */}
                <div className="relative flex-1">
                  <input
                    type="time"
                    required
                    value={closingTime}
                    onChange={(e) => setClosingTime(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1.5">
                Preview: <span className="font-medium">{formData.open_hours || "Belum diatur"}</span>
              </p>
            </div>

            {/* Kisaran Harga - AUTO FORMAT (di grid kanan) */}
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