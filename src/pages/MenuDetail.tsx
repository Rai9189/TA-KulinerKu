import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Star, MapPin, DollarSign, Edit, Trash2, Heart, Share2, Users, Plus, Pencil } from "lucide-react";
import { MenuCard } from "../components/MenuCard";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useAppContext } from "../context/AppContext";
import { MenuFormModal } from "../components/MenuFormModal";
import { ReviewFormModal } from "../components/ReviewFormModal";
import { useState } from "react";

export function MenuDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { menuItems, deleteMenuItem, favoriteMenus, toggleFavoriteMenu, reviews, deleteReview } = useAppContext();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [showShareToast, setShowShareToast] = useState(false);
  
  const menu = menuItems.find((m) => m.id === id);
  const isFavorite = menu ? favoriteMenus.includes(menu.id) : false;
  
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
  
  // Get recommendations from the same restaurant or category
  const recommendations = menuItems
    .filter((m) => m.id !== menu.id && (m.restaurantId === menu.restaurantId || m.category === menu.category))
    .slice(0, 3);

  // Get reviews for this menu
  const menuReviews = reviews.filter((r) => r.menuId === menu.id);

  const handleDelete = () => {
    if (confirm("Apakah Anda yakin ingin menghapus menu ini?")) {
      deleteMenuItem(menu.id);
      navigate("/menu");
    }
  };

  const handleDeleteReview = (reviewId: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus review ini?")) {
      deleteReview(reviewId);
    }
  };

  const handleEditReview = (review: any) => {
    setEditingReview(review);
    setIsReviewModalOpen(true);
  };

  const handleCloseReviewModal = () => {
    setIsReviewModalOpen(false);
    setEditingReview(null);
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareText = `Lihat menu ${menu.name} di KulinerKu!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: menu.name,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        // User cancelled or error occurred
        copyToClipboard(shareUrl);
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 3000);
    });
  };

  // Calculate average rating from reviews
  const averageRating = menuReviews.length > 0
    ? (menuReviews.reduce((sum, r) => sum + r.rating, 0) / menuReviews.length).toFixed(1)
    : menu.rating.toFixed(1);
  
  return (
    <div className="pb-20">
      {/* Header Image */}
      <div className="relative h-80">
        <ImageWithFallback
          src={menu.image}
          alt={menu.name}
          className="w-full h-full object-cover"
        />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="absolute top-6 right-6 flex gap-2">
          <button
            onClick={() => toggleFavoriteMenu(menu.id)}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50"
          >
            <Heart 
              className={`w-5 h-5 transition-colors ${
                isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
              }`}
            />
          </button>
          <button
            onClick={handleShare}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50"
          >
            <Share2 className="w-5 h-5 text-gray-600" />
          </button>
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
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
          <div className="max-w-screen-xl mx-auto">
            <h1 className="text-white mb-2">{menu.name}</h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-white/90 px-3 py-1 rounded-full">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{averageRating}</span>
                {menuReviews.length > 0 && (
                  <span className="text-sm text-gray-600">({menuReviews.length})</span>
                )}
              </div>
              <span className="text-white/90 text-sm bg-white/20 px-3 py-1 rounded-full">
                {menu.category}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="px-6 py-8">
        <div className="max-w-screen-xl mx-auto">
          {/* Price and Restaurant Info */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-orange-600" />
                <span className="text-gray-600">Harga</span>
              </div>
              <span className="text-orange-600">
                Rp {menu.price.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <span className="text-gray-600">Tersedia di</span>
                <Link
                  to={`/restaurants/${menu.restaurantId}`}
                  className="block text-orange-600 hover:text-orange-700"
                >
                  {menu.restaurant}
                </Link>
              </div>
            </div>
          </div>
          
          {/* Description */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="mb-4">Deskripsi</h2>
            <p className="text-gray-600 leading-relaxed">{menu.description}</p>
          </div>

          {/* Reviews */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Users className="w-6 h-6 text-orange-600" />
                <h2>Review Menu</h2>
              </div>
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Tulis Review
              </button>
            </div>
            {menuReviews.length > 0 ? (
              <div className="space-y-4">
                {menuReviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p>{review.userName}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(review.date).toLocaleDateString("id-ID", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded">
                          <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
                          <span className="text-sm">{review.rating}</span>
                        </div>
                        <button
                          onClick={() => handleEditReview(review)}
                          className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100"
                        >
                          <Pencil className="w-4 h-4 text-orange-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteReview(review.id)}
                          className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">Belum ada review. Jadilah yang pertama!</p>
            )}
          </div>
          
          {/* Recommendations */}
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
      </div>

      <MenuFormModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        menu={menu}
      />

      <ReviewFormModal
        isOpen={isReviewModalOpen}
        onClose={handleCloseReviewModal}
        menuId={menu.id}
        review={editingReview}
      />

      {/* Share Toast */}
      {showShareToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          Link berhasil disalin!
        </div>
      )}
    </div>
  );
}