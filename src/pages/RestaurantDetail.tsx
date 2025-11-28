import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Star, MapPin, Clock, DollarSign, Users, 
  Edit, Trash2, Plus, Pencil, Heart, Share2, MoreVertical 
} from "lucide-react";
import { MenuCard } from "../components/MenuCard";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useAppContext } from "../context/AppContext";
import { RestaurantFormModal } from "../components/RestaurantFormModal";
import { ReviewFormModal } from "../components/ReviewFormModal";
import { useState } from "react";
import { toast } from "sonner";

export function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { 
    restaurants, 
    menuItems, 
    reviews, 
    currentUser,
    isGuest,
    deleteRestaurant,
    deleteReview,
    toggleFavoriteRestaurant,
    favoriteRestaurants,
  } = useAppContext();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [showAdminMenu, setShowAdminMenu] = useState(false);

  // Ambil data restoran
  const restaurant = restaurants.find((r) => r.id === id);
  const isFavorite = restaurant ? favoriteRestaurants.includes(restaurant.id) : false;

  if (!restaurant) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Restoran tidak ditemukan</p>
          <button
            onClick={() => navigate("/restaurants")}
            className="text-orange-600 hover:text-orange-700"
          >
            Kembali ke Daftar Restoran
          </button>
        </div>
      </div>
    );
  }

  const restaurantMenus = menuItems.filter(
    (m) => m.restaurant_id === restaurant.id
  );

  // Filter review restaurant
  const restaurantReviews = reviews.filter(
    (r) => (r as any).restaurant_id === restaurant.id
  );

  // DELETE RESTAURANT (ADMIN ONLY)
  const handleDelete = () => {
    if (currentUser?.role !== "admin") return;

    if (confirm("Apakah Anda yakin ingin menghapus restoran ini?")) {
      deleteRestaurant(restaurant.id);
      toast.success("Restoran berhasil dihapus");
      navigate("/restaurants");
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

  // TOGGLE FAVORITE
  const handleToggleFavorite = () => {
    if (isGuest) {
      toast.error("Anda harus login untuk menggunakan fitur favorit!");
      return;
    }
    toggleFavoriteRestaurant(restaurant.id);

    toast.success(
      isFavorite
        ? "Restoran dihapus dari favorit"
        : "Restoran ditambahkan ke favorit"
    );
  };

  // SHARE RESTAURANT
  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareText = `Lihat restoran ${restaurant.name} di KulinerKu!`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: restaurant.name,
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

  // OPEN REVIEW MODAL with GUEST CHECK
  const openReviewModal = () => {
    if (isGuest) {
      toast.error("Anda harus login terlebih dahulu untuk menulis review.");
      return;
    }

    setEditingReview(null);
    setIsReviewModalOpen(true);
  };

  return (
    <div className="pb-20">
      {/* Header Image */}
      <div className="relative h-64 sm:h-80 lg:h-96">
        <ImageWithFallback
          src={restaurant.image ?? ""}
          alt={restaurant.name ?? ""}
          className="w-full h-full object-cover"
        />

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 sm:top-6 sm:left-6 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* ACTION BUTTONS - Responsive */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex gap-2">
          {/* FAVORITE */}
          <button
            onClick={handleToggleFavorite}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50"
          >
            <Heart
              className={`w-5 h-5 ${
                isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
              }`}
            />
          </button>

          {/* SHARE */}
          <button
            onClick={handleShare}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50"
          >
            <Share2 className="w-5 h-5 text-gray-600" />
          </button>

          {/* Admin Actions - Dropdown untuk mobile */}
          {currentUser?.role === "admin" && (
            <div className="relative">
              <button
                onClick={() => setShowAdminMenu(!showAdminMenu)}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 sm:hidden"
              >
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>

              {/* Dropdown Menu - Mobile */}
              {showAdminMenu && (
                <div className="absolute right-0 top-12 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-10 min-w-[160px]">
                  <button
                    onClick={() => {
                      setIsEditModalOpen(true);
                      setShowAdminMenu(false);
                    }}
                    className="w-full px-4 py-3 flex items-center gap-2 hover:bg-gray-50 text-left"
                  >
                    <Edit className="w-4 h-4 text-orange-600" />
                    <span className="text-sm">Edit Restoran</span>
                  </button>
                  <button
                    onClick={() => {
                      handleDelete();
                      setShowAdminMenu(false);
                    }}
                    className="w-full px-4 py-3 flex items-center gap-2 hover:bg-gray-50 text-left border-t"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                    <span className="text-sm">Hapus Restoran</span>
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

        {/* Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-4 sm:p-6">
          <h1 className="text-white text-2xl sm:text-3xl lg:text-4xl mb-2">{restaurant.name}</h1>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-white/90 px-3 py-1 rounded-full">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm sm:text-base">{restaurant.rating ?? 0}</span>
            </div>
            <span className="text-white/90 text-xs sm:text-sm bg-white/20 px-3 py-1 rounded-full">
              {restaurant.category ?? ""}
            </span>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-screen-xl mx-auto space-y-4 sm:space-y-6">
          {/* INFORMASI */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Informasi Restoran</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-gray-600 text-xs sm:text-sm mb-1">Alamat</p>
                  <p className="text-sm sm:text-base break-words">{restaurant.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-gray-600 text-xs sm:text-sm mb-1">Jam Buka</p>
                  <p className="text-sm sm:text-base">{restaurant.open_hours}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-gray-600 text-xs sm:text-sm mb-1">Kisaran Harga</p>
                  <p className="text-sm sm:text-base">{restaurant.price_range}</p>
                </div>
              </div>
            </div>
          </div>

          {/* TENTANG */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Tentang Restoran</h2>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              {restaurant.description}
            </p>
          </div>

          {/* MENU */}
          {restaurantMenus.length > 0 && (
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Menu Populer</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {restaurantMenus.map((menu) => (
                  <MenuCard key={menu.id} menu={menu} />
                ))}
              </div>
            </div>
          )}

          {/* REVIEW LIST */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                <h2 className="text-lg sm:text-xl font-semibold">Review Pelanggan</h2>
              </div>
              <button
                onClick={openReviewModal}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm sm:text-base w-full sm:w-auto"
              >
                <Plus className="w-4 h-4" />
                Tulis Review
              </button>
            </div>

            {restaurantReviews.length > 0 ? (
              <div className="space-y-4">
                {restaurantReviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-gray-100 last:border-0 pb-4 last:pb-0"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm sm:text-base truncate">{(review as any).userName ?? "User"}</p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          {review.created_at
                            ? new Date(review.created_at).toLocaleDateString("id-ID")
                            : ""}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded">
                          <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
                          <span className="text-sm">{review.rating ?? 0}</span>
                        </div>

                        {/* TOMBOL EDIT & DELETE - HANYA PEMILIK */}
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
        </div>
      </div>

      {/* MODAL */}
      <RestaurantFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        restaurant={restaurant}
      />

      <ReviewFormModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        restaurantId={restaurant.id}
        review={editingReview}
      />
    </div>
  );
}