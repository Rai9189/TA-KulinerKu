import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft, Star, MapPin, DollarSign, Edit, Trash2,
  Heart, Share2, Users, Plus, Pencil, MoreVertical
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
    isGuest,
    isAdmin,
    deleteMenuItem,
    deleteReview,
  } = useAppContext();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [showAdminMenu, setShowAdminMenu] = useState(false);

  const menu = menuItems.find((m) => m.id === id);
  if (!menu) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
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
      : Number(menu.rating ?? 0).toFixed(1);

  // DELETE MENU (ADMIN ONLY)
  const handleDelete = () => {
    if (!isAdmin) return;
    if (confirm("Apakah Anda yakin ingin menghapus menu ini?")) {
      deleteMenuItem(menu.id);
      toast.success("Menu berhasil dihapus");
      navigate("/menu");
    }
  };

  // DELETE REVIEW - HANYA PEMILIK
  const handleDeleteReview = (review: any) => {
    if (!currentUser) return;

    const isOwner = currentUser.id === review.user_id;

    if (!isOwner) {
      toast.error("Anda hanya bisa menghapus review milik Anda sendiri.");
      return;
    }

    if (confirm("Apakah Anda yakin ingin menghapus review ini?")) {
      deleteReview(review.id);
      toast.success("Review berhasil dihapus");
    }
  };

  // EDIT REVIEW - HANYA PEMILIK
  const handleEditReview = (review: any) => {
    if (!currentUser) return;

    const isOwner = currentUser.id === review.user_id;

    if (!isOwner) {
      toast.error("Anda hanya bisa mengedit review milik Anda sendiri.");
      return;
    }

    setEditingReview(review);
    setIsReviewModalOpen(true);
  };

  // FAVORITE
  const handleToggleFavorite = () => {
    if (isGuest) {
      toast.error("Anda harus login untuk menggunakan fitur ini");
      return;
    }
    if (isFavorite) {
      removeFavoriteMenu(menu.id);
      toast.success("Menu dihapus dari favorit");
    } else {
      addFavoriteMenu(menu.id);
      toast.success("Menu ditambahkan ke favorit");
    }
  };

  // OPEN REVIEW MODAL
  const handleOpenReviewModal = () => {
    if (isGuest) {
      toast.error("Anda harus login untuk menulis review");
      return;
    }
    setEditingReview(null);
    setIsReviewModalOpen(true);
  };

  // SHARE
  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareText = `Lihat menu ${menu.name ?? ""} di KulinerKu!`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: menu.name ?? "",
          text: shareText,
          url: shareUrl,
        });
        toast.success("Berhasil dibagikan!");
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link berhasil disalin!");
      }
    } catch {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link berhasil disalin!");
    }
  };

  return (
    <div className="pb-20">
      {/* Gambar Header - Fixed height h-80 */}
      <div className="relative h-80">
        <ImageWithFallback
          src={menu.image ?? ""}
          alt={menu.name ?? ""}
          className="w-full h-full object-cover"
        />

        {/* BACK */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 sm:top-6 sm:left-6 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* ACTIONS - Responsive Grid */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex gap-2">
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

          {/* Admin Actions - Dropdown untuk mobile */}
          {isAdmin && (
            <div className="relative">
              <button
                onClick={() => setShowAdminMenu(!showAdminMenu)}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 sm:hidden"
              >
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>

              {/* Dropdown Menu - Mobile */}
              {showAdminMenu && (
                <div className="absolute right-0 top-12 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-10 min-w-[150px]">
                  <button
                    onClick={() => {
                      setIsEditModalOpen(true);
                      setShowAdminMenu(false);
                    }}
                    className="w-full px-4 py-3 flex items-center gap-2 hover:bg-gray-50 text-left"
                  >
                    <Edit className="w-4 h-4 text-orange-600" />
                    <span className="text-sm">Edit Menu</span>
                  </button>
                  <button
                    onClick={() => {
                      handleDelete();
                      setShowAdminMenu(false);
                    }}
                    className="w-full px-4 py-3 flex items-center gap-2 hover:bg-gray-50 text-left border-t"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                    <span className="text-sm">Hapus Menu</span>
                  </button>
                </div>
              )}

              {/* Desktop Buttons */}
              <div className="hidden sm:flex gap-2">
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
              </div>
            </div>
          )}
        </div>

        {/* NAME + RATING */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-4 sm:p-6">
          <h1 className="text-white text-2xl sm:text-3xl lg:text-4xl mb-2">{menu.name}</h1>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-white/90 px-3 py-1 rounded-full">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm sm:text-base">{averageRating}</span>
            </div>

            <span className="text-white/90 text-xs sm:text-sm bg-white/20 px-3 py-1 rounded-full">
              {menu.category ?? ""}
            </span>
          </div>
        </div>
      </div>

      {/* DETAIL */}
      <div className="px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-screen-xl mx-auto">
          {/* PRICE + RESTAURANT */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-orange-600" />
                <span className="text-gray-600 text-sm sm:text-base">Harga</span>
              </div>
              <span className="text-orange-600 font-semibold text-base sm:text-lg">
                Rp {Number(menu.price ?? 0).toLocaleString("id-ID")}
              </span>
            </div>

            {restaurant && (
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <span className="text-gray-600 text-sm sm:text-base block mb-1">Tersedia di</span>
                  <Link
                    to={`/restaurants/${restaurant.id}`}
                    className="text-orange-600 hover:text-orange-700 font-medium text-sm sm:text-base break-words"
                  >
                    {restaurant.name ?? ""}
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* DESCRIPTION */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Deskripsi</h2>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{menu.description ?? ""}</p>
          </div>

          {/* REVIEWS - Updated layout seperti kode 1 */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                <h2 className="text-lg sm:text-xl font-semibold">Review Menu</h2>
              </div>

              <button
                onClick={handleOpenReviewModal}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm sm:text-base"
              >
                <Plus className="w-4 h-4" /> Tulis Review
              </button>
            </div>

            {menuReviews.length > 0 ? (
              <div className="space-y-4">
                {menuReviews.map((review) => (
                  <div key={review.id} className="border-b pb-4 last:border-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm sm:text-base truncate">{review.userName ?? "User"}</p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          {review.created_at ? new Date(review.created_at).toLocaleDateString("id-ID") : ""}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded">
                          <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
                          <span className="text-sm">{review.rating ?? 0}</span>
                        </div>

                        {/* TOMBOL EDIT & DELETE - HANYA PEMILIK REVIEW */}
                        {currentUser?.id === review.user_id && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleEditReview(review)}
                              className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100"
                              title="Edit review"
                            >
                              <Pencil className="w-4 h-4 text-orange-600" />
                            </button>

                            <button
                              onClick={() => handleDeleteReview(review)}
                              className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100"
                              title="Hapus review"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm sm:text-base break-words">{review.comment ?? ""}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8 text-sm sm:text-base">
                Belum ada review. Jadilah yang pertama!
              </p>
            )}
          </div>

          {/* RECOMMENDATIONS */}
          {recommendations.length > 0 && (
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Rekomendasi Lainnya</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {recommendations.map((recommendedMenu) => (
                  <MenuCard key={recommendedMenu.id} menu={recommendedMenu} />
                ))}
              </div>
            </div>
          )}
        </div>
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
    </div>
  );
}