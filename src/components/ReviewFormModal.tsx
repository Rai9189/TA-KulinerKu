import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Review } from "../data/static-data";
import { useAppContext } from "../context/AppContext";

interface ReviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantId?: string;
  menuId?: string;
  review?: Review;
}

export function ReviewFormModal({ isOpen, onClose, restaurantId, menuId, review }: ReviewFormModalProps) {
  const { addReview, updateReview, userName } = useAppContext();
  const [formData, setFormData] = useState({
    userName: userName || "",
    rating: "5",
    comment: "",
  });

  useEffect(() => {
    if (review) {
      setFormData({
        userName: review.userName,
        rating: review.rating.toString(),
        comment: review.comment,
      });
    } else {
      setFormData({
        userName: userName || "",
        rating: "5",
        comment: "",
      });
    }
  }, [review, userName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const reviewData: Review = {
      id: review?.id || Date.now().toString(),
      restaurantId: restaurantId,
      menuId: menuId,
      userName: formData.userName,
      rating: parseInt(formData.rating),
      comment: formData.comment,
      date: review?.date || new Date().toISOString().split('T')[0],
    };

    if (review) {
      updateReview(review.id, reviewData);
    } else {
      addReview(reviewData);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="border-b border-gray-200 p-6 flex items-center justify-between">
          <h2>{review ? "Edit Review" : "Tulis Review"}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block mb-2">Nama Anda *</label>
            <input
              type="text"
              required
              value={formData.userName}
              onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Masukkan nama Anda"
            />
          </div>

          <div>
            <label className="block mb-2">Rating *</label>
            <select
              required
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="5">⭐⭐⭐⭐⭐ (5 - Sangat Baik)</option>
              <option value="4">⭐⭐⭐⭐ (4 - Baik)</option>
              <option value="3">⭐⭐⭐ (3 - Cukup)</option>
              <option value="2">⭐⭐ (2 - Kurang)</option>
              <option value="1">⭐ (1 - Buruk)</option>
            </select>
          </div>

          <div>
            <label className="block mb-2">Komentar *</label>
            <textarea
              required
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Bagikan pengalaman Anda..."
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
              {review ? "Simpan" : "Kirim Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}