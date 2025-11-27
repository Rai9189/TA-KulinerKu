import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { toast } from "sonner";

interface ReviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantId?: string;
  menuId?: string;
  review?: any;
}

export function ReviewFormModal({
  isOpen,
  onClose,
  restaurantId,
  menuId,
  review,
}: ReviewFormModalProps) {
  const { isGuest, addReview, updateReview } = useAppContext();

  const [formData, setFormData] = useState({
    rating: "5",
    comment: "",
  });

  useEffect(() => {
    if (review) {
      setFormData({
        rating: review.rating.toString(),
        comment: review.comment || "",
      });
    } else {
      setFormData({
        rating: "5",
        comment: "",
      });
    }
  }, [review]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isGuest) {
      toast.error("Anda harus login terlebih dahulu untuk menulis review.");
      return;
    }

    // Validasi
    if (!restaurantId && !menuId) {
      toast.error("Restaurant atau Menu harus dipilih");
      return;
    }

    try {
      if (review) {
        // Edit review yang sudah ada
        const payload = {
          menu_id: menuId || review.menu_id,
          rating: parseInt(formData.rating),
          comment: formData.comment,
        };
        await updateReview(review.id, payload);
        toast.success("Review berhasil diperbarui");
      } else {
        // Review baru - gunakan menuId jika ada, jika tidak gunakan restaurantId
        // Tapi addReview kemungkinan hanya terima menu_id
        if (!menuId) {
          toast.error("Menu harus dipilih untuk review baru");
          return;
        }

        const payload = {
          menu_id: menuId,  // ✅ Dijamin string
          rating: parseInt(formData.rating),
          comment: formData.comment,
        };
        await addReview(payload);
        toast.success("Review berhasil ditambahkan");
      }
      onClose();
    } catch (error) {
      toast.error("Gagal menyimpan review. Silakan coba lagi.");
      console.error("Error submitting review:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {review ? "Edit Review" : "Tulis Review"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Rating */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Rating *
            </label>
            <select
              required
              value={formData.rating}
              onChange={(e) =>
                setFormData({ ...formData, rating: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
            >
              <option value="5">⭐⭐⭐⭐⭐ (5 - Sangat Baik)</option>
              <option value="4">⭐⭐⭐⭐ (4 - Baik)</option>
              <option value="3">⭐⭐⭐ (3 - Cukup)</option>
              <option value="2">⭐⭐ (2 - Kurang)</option>
              <option value="1">⭐ (1 - Buruk)</option>
            </select>
          </div>

          {/* Komentar */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Komentar *
            </label>
            <textarea
              required
              value={formData.comment}
              onChange={(e) =>
                setFormData({ ...formData, comment: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none transition"
              placeholder="Bagikan pengalaman Anda..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium"
            >
              {review ? "Simpan" : "Kirim Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}