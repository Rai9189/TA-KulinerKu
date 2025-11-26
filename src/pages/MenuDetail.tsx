import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft, Star, MapPin, DollarSign, Edit, Trash2,
  Heart, Share2, Users, Plus, Pencil
} from "lucide-react";
import { MenuCard } from "../components/MenuCard";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useAppContext } from "../context/AppContext";
import { MenuFormModal } from "../components/MenuFormModal";
import { ReviewFormModal } from "../components/ReviewFormModal";
import { useState } from "react";
import { toast } from "sonner";

export function MenuDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    menuItems,
    restaurants,
    reviews,
    favoriteMenus,
    addFavoriteMenu,
    removeFavoriteMenu,
    currentUser,
    isAdmin,
    isGuest,
    deleteMenuItem,
    deleteReview
  } = useAppContext();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [showShareToast, setShowShareToast] = useState(false);

  // cari menu
  const menu = menuItems.find((m) => m.id === id);
  if (!menu) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Menu tidak ditemukan</p>
          <button
            onClick={() => navigate("/menu")}
            className="text-orange-600 hover:text-orange-700"
          >
            Kembali ke Daftar Menu
          </button>
        </div>
      </div>
    );
  }

  // cari restoran menu
  const restaurant = restaurants.find((r) => r.id === menu.restaurant_id);

  const isFavorite = favoriteMenus.includes(menu.id);

  const recommendations = menuItems
    .filter((m) =>
      m.id !== menu.id &&
      (m.restaurant_id === menu.restaurant_id || m.category === menu.category)
    )
    .slice(0, 3);

  const menuReviews = reviews.filter((r) => r.menu_id === menu.id);

  const averageRating =
    menuReviews.length > 0
      ? (menuReviews.reduce((sum, r) => sum + r.rating, 0) / menuReviews.length).toFixed(1)
      : Number(menu.rating ?? 0).toFixed(1); // null safety

  // DELETE MENU
  const handleDelete = () => {
    if (!isAdmin) return;
    if (confirm("Apakah Anda yakin ingin menghapus menu ini?")) {
      deleteMenuItem(menu.id);
      navigate("/menu");
    }
  };

  // DELETE REVIEW
  const handleDeleteReview = (reviewId: string) => {
    if (!isAdmin) return;
    if (confirm("Apakah Anda yakin ingin menghapus review ini?")) {
      deleteReview(reviewId);
    }
  };

  // EDIT REVIEW
  const handleEditReview = (review: any) => {
    setEditingReview(review);
    setIsReviewModalOpen(true);
  };

  // FAVORITE
  const handleToggleFavorite = () => {
    if (isGuest) {
      toast.error("Anda harus login untuk menggunakan fitur ini");
      return;
    }
    if (isFavorite) removeFavoriteMenu(menu.id);
    else addFavoriteMenu(menu.id);
  };

  // OPEN REVIEW MODAL
  const handleOpenReviewModal = () => {
    if (isGuest) {
      toast.error("Anda harus login untuk menulis review");
      return;
    }
    setIsReviewModalOpen(true);
  };

  // SHARE
  const handleShare = async () => {
    const shareUrl = window.location.href;
    try {
      await navigator.share({
        title: menu.name ?? "",
        text: `Lihat menu ${menu.name ?? ""} di KulinerKu!`,
        url: shareUrl,
      });
    } catch {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setShowShareToast(true);
        setTimeout(() => setShowShareToast(false), 3000);
      });
    }
  };

  return (
    <div className="pb-20">
      {/* Gambar Header */}
      <div className="relative h-80">
        <ImageWithFallback
          src={menu.image ?? ""} // null safety
          alt={menu.name ?? ""}
          className="w-full h-full object-cover"
        />

        {/* BACK */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* ACTIONS */}
        <div className="absolute top-6 right-6 flex gap-2">
          <button
            onClick={handleToggleFavorite}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50"
          >
            <Heart
              className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`}
            />
          </button>

          <button
            onClick={handleShare}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50"
          >
            <Share2 className="w-5 h-5 text-gray-600" />
          </button>

          {isAdmin && (
            <>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50"
              >
                <Edit className="w-5 h-5 text-orange-600" />
              </button>

              <button
                onClick={handleDelete}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50"
              >
                <Trash2 className="w-5 h-5 text-red-600" />
              </button>
            </>
          )}
        </div>

        {/* NAME + RATING */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 p-6">
          <h1 className="text-white mb-2">{menu.name}</h1>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white/90 px-3 py-1 rounded-full">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{averageRating}</span>
            </div>

            <span className="text-white/90 text-sm bg-white/20 px-3 py-1 rounded-full">
              {menu.category ?? ""}
            </span>
          </div>
        </div>
      </div>

      {/* DETAIL */}
      <div className="px-6 py-8">
        {/* PRICE + RESTAURANT */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-orange-600" />
              <span className="text-gray-600">Harga</span>
            </div>
            <span className="text-orange-600">
              Rp {Number(menu.price ?? 0).toLocaleString("id-ID")}
            </span>
          </div>

          {restaurant && (
            <div className="flex items-start gap-2">
              <MapPin className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <span className="text-gray-600">Tersedia di</span>
                <Link
                  to={`/restaurants/${restaurant.id}`}
                  className="block text-orange-600 hover:text-orange-700"
                >
                  {restaurant.name ?? ""}
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* DESCRIPTION */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="mb-4">Deskripsi</h2>
          <p className="text-gray-600 leading-relaxed">{menu.description ?? ""}</p>
        </div>

        {/* REVIEWS */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-orange-600" />
              <h2>Review Menu</h2>
            </div>

            <button
              onClick={handleOpenReviewModal}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              <Plus className="w-4 h-4" /> Tulis Review
            </button>
          </div>

          {menuReviews.length > 0 ? (
            <div className="space-y-4">
              {menuReviews.map((review) => (
                <div key={review.id} className="border-b pb-4 last:border-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p>{review.user_id ?? "User"}</p>
                      <p className="text-sm text-gray-500">
                        {review.created_at ? new Date(review.created_at).toLocaleDateString("id-ID") : ""}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded">
                        <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
                        <span className="text-sm">{review.rating ?? 0}</span>
                      </div>

                      {isAdmin && (
                        <>
                          <button
                            onClick={() => handleEditReview(review)}
                            className="w-8 h-8 rounded hover:bg-gray-100"
                          >
                            <Pencil className="w-4 h-4 text-orange-600" />
                          </button>

                          <button
                            onClick={() => handleDeleteReview(review.id)}
                            className="w-8 h-8 rounded hover:bg-gray-100"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-600">{review.comment ?? ""}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">
              Belum ada review. Jadilah yang pertama!
            </p>
          )}
        </div>

        {/* RECOMMENDATIONS */}
        {recommendations.length > 0 && (
          <div>
            <h2 className="mb-6">Rekomendasi Lainnya</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((recommendedMenu) => (
                <MenuCard key={recommendedMenu.id} menu={recommendedMenu} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* EDIT MENU */}
      {isAdmin && (
        <MenuFormModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          menu={menu}
        />
      )}

      {/* ADD / EDIT REVIEW */}
      <ReviewFormModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        menuId={menu.id}
        review={editingReview}
      />

      {/* SHARE TOAST */}
      {showShareToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          Link berhasil disalin!
        </div>
      )}
    </div>
  );
}
