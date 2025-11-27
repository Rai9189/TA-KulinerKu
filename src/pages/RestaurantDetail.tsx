import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Star, MapPin, Clock, DollarSign, Users, 
  Edit, Trash2, Plus, Pencil, Heart, Share2 
} from "lucide-react";
import { MenuCard } from "../components/MenuCard";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useAppContext } from "../context/AppContext";
import { RestaurantFormModal } from "../components/RestaurantFormModal";
import { ReviewFormModal } from "../components/ReviewFormModal";
import { useState } from "react";
import { toast } from "sonner";
import type { Review } from '../types';  // ⭐ TAMBAHKAN

// ⭐ TAMBAHKAN TYPE EXTENSION
interface ReviewWithDetails extends Review {
  userName?: string;
}

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

  // Ambil data restoran
  const restaurant = restaurants.find((r) => r.id === id);
  const isFavorite = restaurant ? favoriteRestaurants.includes(restaurant.id) : false;

  if (!restaurant) {
    return (
      <div className="flex items-center justify-center min-h-screen">
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

  // ⭐ FIX: Type assertion untuk restaurant_id
  const restaurantReviews = reviews.filter(
    (r) => (r as any).restaurant_id === restaurant.id
  ) as ReviewWithDetails[];


  // DELETE RESTAURANT (ADMIN ONLY)
  const handleDelete = () => {
    if (currentUser?.role !== "admin") return;

    if (confirm("Apakah Anda yakin ingin menghapus restoran ini?")) {
      deleteRestaurant(restaurant.id);
      toast.success("Restoran berhasil dihapus");
      navigate("/restaurants");
    }
  };

  // DELETE REVIEW (ADMIN = semua, USER = review miliknya)
  const handleDeleteReview = (review: any) => {
    if (!currentUser) return;

    const isOwner = currentUser.id === review.user_id;
    const isAdmin = currentUser.role === "admin";

    if (!isOwner && !isAdmin) {
      toast.error("Anda tidak punya izin menghapus review ini.");
      return;
    }

    if (confirm("Apakah Anda yakin ingin menghapus review ini?")) {
      deleteReview(review.id);
      toast.success("Review berhasil dihapus");
    }
  };

  // EDIT REVIEW
  const handleEditReview = (review: any) => {
    if (!currentUser) return;

    const isOwner = currentUser.id === review.user_id;
    const isAdmin = currentUser.role === "admin";

    if (!isOwner && !isAdmin) {
      toast.error("Anda tidak punya izin mengedit review ini.");
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
      <div className="relative h-80">
        <ImageWithFallback
          src={restaurant.image ?? ""}
          alt={restaurant.name ?? ""}
          className="w-full h-full object-cover"
        />

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* ACTION BUTTONS */}
        <div className="absolute top-6 right-6 flex gap-2">

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

          {/* EDIT & DELETE */}
          {currentUser?.role === "admin" && (
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

        {/* Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
          <div className="max-w-screen-xl mx-auto">
            <h1 className="text-white mb-2">{restaurant.name}</h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-white/90 px-3 py-1 rounded-full">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{restaurant.rating ?? 0}</span>
              </div>
              <span className="text-white/90 text-sm bg-white/20 px-3 py-1 rounded-full">
                {restaurant.category ?? ""}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-6 py-8">
        <div className="max-w-screen-xl mx-auto space-y-6">

          {/* INFORMASI */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="mb-4">Informasi Restoran</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="text-gray-600 text-sm">Alamat</p>
                  <p>{restaurant.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="text-gray-600 text-sm">Jam Buka</p>
                  <p>{restaurant.open_hours}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="text-gray-600 text-sm">Kisaran Harga</p>
                  <p>{restaurant.price_range}</p>
                </div>
              </div>
            </div>
          </div>

          {/* TENTANG */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="mb-4">Tentang Restoran</h2>
            <p className="text-gray-600 leading-relaxed">
              {restaurant.description}
            </p>
          </div>

          {/* MENU */}
          {restaurantMenus.length > 0 && (
            <div>
              <h2 className="mb-6">Menu Populer</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {restaurantMenus.map((menu) => (
                  <MenuCard key={menu.id} menu={menu} />
                ))}
              </div>
            </div>
          )}

          {/* REVIEW LIST */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Users className="w-6 h-6 text-orange-600" />
                <h2>Review Pelanggan</h2>
              </div>
              <button
                onClick={openReviewModal}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
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
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        {/* ⭐ FIX: userName tidak ada di interface Review */}
                        <p>{review.userName ?? "User"}</p>
                        <p className="text-sm text-gray-500">
                          {review.created_at
                            ? new Date(review.created_at).toLocaleDateString(
                                "id-ID"
                              )
                            : ""}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded">
                          <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
                          <span className="text-sm">{review.rating ?? 0}</span>
                        </div>

                        {/* IZIN EDIT & DELETE */}
                        {(currentUser?.role === "admin" ||
                          currentUser?.id === review.user_id) && (
                          <>
                            <button
                              onClick={() => handleEditReview(review)}
                              className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100"
                            >
                              <Pencil className="w-4 h-4 text-orange-600" />
                            </button>
                            <button
                              onClick={() => handleDeleteReview(review)}
                              className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100"
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