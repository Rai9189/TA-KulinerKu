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

  // ⭐ FIX: Reset form saat modal dibuka/ditutup
  useEffect(() => {
    if (isOpen) {
      if (review) {
        // Mode Edit - Load data review yang ada
        setFormData({
          rating: review.rating.toString(),
          comment: review.comment || "",
        });
      } else {
        // Mode Tambah Baru - Reset form
        setFormData({
          rating: "5",
          comment: "",
        });
      }
    } else {
      // ✅ Reset form saat modal ditutup
      setFormData({
        rating: "5",
        comment: "",
      });
    }
  }, [isOpen, review]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isGuest) {
      toast.error("Anda harus login terlebih dahulu untuk menulis review.");
      return;
    }

    // ⭐ Validasi - harus ada salah satu
    if (!restaurantId && !menuId && !review) {
      toast.error("Restaurant atau Menu harus dipilih");
      return;
    }

    try {
      if (review) {
        // ========== EDIT REVIEW ==========
        const payload = {
          rating: parseInt(formData.rating),
          comment: formData.comment,
        };
        const success = await updateReview(review.id, payload);
        
        if (success) {
          toast.success("Review berhasil diperbarui");
          // ✅ Reset form setelah submit
          setFormData({ rating: "5", comment: "" });
          onClose();
        }
      } else {
        // ========== REVIEW BARU ==========
        const payload: any = {
          rating: parseInt(formData.rating),
          comment: formData.comment,
        };

        // ⭐ Tentukan apakah review untuk menu atau restaurant
        if (menuId) {
          payload.menu_id = menuId;
        } else if (restaurantId) {
          payload.restaurant_id = restaurantId;
        }

        const success = await addReview(payload);
        
        if (success) {
          toast.success("Review berhasil ditambahkan");
          // ✅ Reset form setelah submit
          setFormData({ rating: "5", comment: "" });
          onClose();
        }
      }
    } catch (error) {
      toast.error("Gagal menyimpan review. Silakan coba lagi.");
      console.error("Error submitting review:", error);
    }
  };

  if (!isOpen) return null;

  // ⭐ Tentukan judul modal
  const modalTitle = review 
    ? "Edit Review" 
    : menuId 
      ? "Tulis Review Menu" 
      : "Tulis Review Restoran";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">{modalTitle}</h2>
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