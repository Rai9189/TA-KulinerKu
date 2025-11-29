import { Camera, Edit2, LogOut, Star, Heart, User, Key, Trash2, UtensilsCrossed, Store, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuCard } from '../components/MenuCard';
import { RestaurantCard } from '../components/RestaurantCard';
import { useAppContext } from '../context/AppContext';
import { Input } from '../components/ui/input';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { toast } from 'sonner';
import { supabase } from '../lib/supabaseClient';
import type { ReviewWithTarget } from '../types';

export function Profile() {
  const {
    currentUser,
    setCurrentUser,
    favoriteMenus,
    favoriteRestaurants,
    menuItems,
    restaurants,
    reviews,
    allUsers,
    updateUserRole,
    deleteUser,
    deleteCurrentUserAccount,
  } = useAppContext();

  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(currentUser?.username || '');
  const [editBio, setEditBio] = useState(currentUser?.bio || '');
  const [profileImage, setProfileImage] = useState(currentUser?.profile_image || '');
  const [selectedTab, setSelectedTab] = useState<'favorites' | 'reviews' | 'users'>('favorites');
  const [reviewSubTab, setReviewSubTab] = useState<'menu' | 'restaurant'>('menu');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Delete Account States
  const [showDangerZoneModal, setShowDangerZoneModal] = useState(false);
  const [showFinalConfirmModal, setShowFinalConfirmModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.username);
      setEditBio(currentUser.bio || '');
      setProfileImage(currentUser.profile_image || '');
    }
  }, [currentUser]);

  // LANJUT KE PART 2...
// LANJUTAN DARI PART 1...

  // Guest Check
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-20 px-4">
        <div className="text-center max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <LogOut className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-2">Belum Login</h2>
            <p className="text-gray-500 text-sm sm:text-base mb-6">Silakan login untuk melihat profil Anda</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/login')}
                className="w-full px-4 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all font-medium"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="w-full px-4 py-2.5 border-2 border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition-all font-medium"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Data Processing - PERBAIKAN: Ambil nama dari menuItems/restaurants
  const favMenuList = menuItems.filter(m => favoriteMenus.includes(m.id));
  const favRestaurantList = restaurants.filter(r => favoriteRestaurants.includes(r.id));
  
  const userReviews: ReviewWithTarget[] = reviews
    .filter(r => r.user_id === currentUser.id)
    .map(r => {
      const menu = menuItems.find(m => m.id === r.menu_id);
      const restaurant = restaurants.find(rest => rest.id === r.restaurant_id);
      
      return {
        ...r,
        targetName: menu?.name || restaurant?.name || 'Unknown',
        targetType: r.menu_id ? 'menu' as const : 'restaurant' as const,
      };
    });

  const menuReviews = userReviews.filter(r => r.targetType === 'menu');
  const restaurantReviews = userReviews.filter(r => r.targetType === 'restaurant');

  // Functions
  const handleLogout = () => {
    if (window.confirm('Apakah Anda yakin ingin logout?')) {
      localStorage.removeItem('token');
      setCurrentUser(null);
      navigate('/');
      toast.success('Berhasil logout');
    }
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      toast.error('Nama tidak boleh kosong');
      return;
    }

    const { error } = await supabase
      .from('users')
      .update({ username: editName, bio: editBio, profile_image: profileImage })
      .eq('id', currentUser.id);

    if (error) {
      toast.error('Gagal menyimpan profil');
    } else {
      setCurrentUser({ ...currentUser, username: editName, bio: editBio, profile_image: profileImage });
      setIsEditing(false);
      toast.success('Profil berhasil diupdate');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ukuran file terlalu besar (max 2MB)');
      return;
    }
    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar!');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const newImage = reader.result as string;
      setProfileImage(newImage);
    };
    reader.readAsDataURL(file);
  };

  const handleOpenDangerZone = () => {
    setShowDangerZoneModal(true);
  };

  const handleProceedToFinalConfirm = () => {
    setShowDangerZoneModal(false);
    setShowFinalConfirmModal(true);
  };

  const handleFinalDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      toast.error('Ketik "DELETE" untuk konfirmasi');
      return;
    }

    setIsDeleting(true);

    try {
      const success = await deleteCurrentUserAccount();
      
      if (success) {
        toast.success('Akun berhasil dihapus. Terima kasih telah menggunakan KulinerKu!');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        toast.error('Gagal menghapus akun. Silakan coba lagi.');
        setIsDeleting(false);
      }
    } catch (error) {
      console.error('Delete account error:', error);
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
      setIsDeleting(false);
    }
  };

  // LANJUT KE PART 3...
// LANJUTAN DARI PART 2...
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white">
        <div className="max-w-screen-xl mx-auto px-4 py-6 sm:py-8">
          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mb-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all active:scale-95"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
            
            <button
              onClick={handleOpenDangerZone}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-500/90 backdrop-blur-sm rounded-lg hover:bg-red-600 transition-all active:scale-95"
              aria-label="Delete Account"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">Delete Account</span>
            </button>
          </div>

          {/* Profile Section */}
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden ring-4 ring-white/30">
                {profileImage ? (
                  <ImageWithFallback
                    src={profileImage}
                    alt={editName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-1.5 sm:p-2 bg-white text-orange-500 rounded-full shadow-lg hover:bg-gray-50 transition-all active:scale-95"
                aria-label="Upload foto profil"
              >
                <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {isEditing ? (
              <div className="w-full max-w-xs px-4">
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="mb-2 text-center bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-white/70"
                  placeholder="Nama pengguna"
                />
                <Input
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="mb-3 text-center bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-white/70"
                  placeholder="Bio"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveProfile}
                    className="flex-1 px-4 py-2 bg-white text-orange-500 rounded-lg hover:bg-gray-50 font-medium transition-all active:scale-95"
                  >
                    Simpan
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditName(currentUser.username);
                      setEditBio(currentUser.bio || '');
                      setProfileImage(currentUser.profile_image || '');
                    }}
                    className="flex-1 px-4 py-2 border-2 border-white/50 text-white rounded-lg hover:bg-white/20 font-medium transition-all active:scale-95"
                  >
                    Batal
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center px-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <h1 className="text-xl sm:text-2xl font-semibold">{currentUser.username}</h1>
                  <button 
                    onClick={() => setIsEditing(true)} 
                    className="p-1.5 hover:bg-white/20 rounded-lg transition-all active:scale-95"
                    aria-label="Edit profil"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-orange-50 text-sm sm:text-base">{currentUser.bio || 'Food lover 🍔'}</p>
                <p className="text-xs sm:text-sm text-orange-100 mt-1 font-medium">
                  {currentUser.role === 'admin' ? '👑 Admin' : '🍴 User'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* LANJUT KE PART 4... */}
{/* LANJUTAN DARI PART 3... */}

      {/* Main Content */}
      <div className="max-w-screen-xl mx-auto px-4 py-4 sm:py-6">
        {/* Main Tabs */}
        <div className="flex gap-1 sm:gap-2 mb-6 border-b overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setSelectedTab('favorites')}
            className={`px-3 sm:px-4 py-3 border-b-2 transition-all whitespace-nowrap text-sm sm:text-base ${
              selectedTab === 'favorites'
                ? 'border-orange-500 text-orange-500 font-semibold'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Heart className="w-4 h-4" />
              <span>Favorit</span>
            </div>
          </button>
          <button
            onClick={() => setSelectedTab('reviews')}
            className={`px-3 sm:px-4 py-3 border-b-2 transition-all whitespace-nowrap text-sm sm:text-base ${
              selectedTab === 'reviews'
                ? 'border-orange-500 text-orange-500 font-semibold'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Star className="w-4 h-4" />
              <span>Review</span>
            </div>
          </button>
          {currentUser.role === 'admin' && (
            <button
              onClick={() => setSelectedTab('users')}
              className={`px-3 sm:px-4 py-3 border-b-2 transition-all whitespace-nowrap text-sm sm:text-base ${
                selectedTab === 'users'
                  ? 'border-orange-500 text-orange-500 font-semibold'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Key className="w-4 h-4" />
                <span className="hidden sm:inline">Manajemen User</span>
                <span className="sm:hidden">Users</span>
              </div>
            </button>
          )}
        </div>

        {/* FAVORITES TAB */}
        {selectedTab === 'favorites' && (
          <div className="space-y-6 sm:space-y-8">
            {favMenuList.length > 0 && (
              <div>
                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                  <UtensilsCrossed className="w-5 h-5 text-orange-500" />
                  Menu Favorit 
                  <span className="text-sm bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                    {favMenuList.length}
                  </span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                  {favMenuList.map((menu) => (
                    <MenuCard key={menu.id} menu={menu} />
                  ))}
                </div>
              </div>
            )}

            {favRestaurantList.length > 0 && (
              <div>
                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                  <Store className="w-5 h-5 text-orange-500" />
                  Restoran Favorit
                  <span className="text-sm bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                    {favRestaurantList.length}
                  </span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {favRestaurantList.map((r) => (
                    <RestaurantCard key={r.id} restaurant={r} />
                  ))}
                </div>
              </div>
            )}

            {favMenuList.length === 0 && favRestaurantList.length === 0 && (
              <div className="text-center py-12 sm:py-16">
                <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2 text-sm sm:text-base font-medium">Belum ada favorit</p>
                <p className="text-xs sm:text-sm text-gray-400">Tandai menu atau restoran favorit Anda</p>
              </div>
            )}
          </div>
        )}

        {/* REVIEWS TAB */}
        {selectedTab === 'reviews' && (
          <div>
            <div className="flex gap-2 mb-4 sm:mb-6 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setReviewSubTab('menu')}
                className={`flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-md transition-all text-sm sm:text-base ${
                  reviewSubTab === 'menu'
                    ? 'bg-white text-orange-500 shadow-sm font-semibold'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                  <UtensilsCrossed className="w-4 h-4" />
                  <span className="hidden xs:inline">Review Menu</span>
                  <span className="xs:hidden">Menu</span>
                  <span className="text-xs bg-orange-100 text-orange-600 px-1.5 sm:px-2 py-0.5 rounded-full font-semibold">
                    {menuReviews.length}
                  </span>
                </div>
              </button>
              <button
                onClick={() => setReviewSubTab('restaurant')}
                className={`flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-md transition-all text-sm sm:text-base ${
                  reviewSubTab === 'restaurant'
                    ? 'bg-white text-orange-500 shadow-sm font-semibold'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                  <Store className="w-4 h-4" />
                  <span className="hidden xs:inline">Review Restoran</span>
                  <span className="xs:hidden">Restoran</span>
                  <span className="text-xs bg-orange-100 text-orange-600 px-1.5 sm:px-2 py-0.5 rounded-full font-semibold">
                    {restaurantReviews.length}
                  </span>
                </div>
              </button>
            </div>

            {reviewSubTab === 'menu' && (
              <div>
                {menuReviews.length > 0 ? (
                  <div className="space-y-3 sm:space-y-4">
                    {menuReviews.map((review) => (
                      <div key={review.id} className="bg-white rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-base sm:text-lg mb-1 truncate">{review.targetName}</h3>
                            <span className="text-xs text-gray-500 bg-orange-50 px-2 py-1 rounded inline-block">Menu</span>
                          </div>
                          <div className="flex items-center gap-1 bg-yellow-50 px-2.5 sm:px-3 py-1.5 rounded-lg flex-shrink-0">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold text-yellow-700 text-sm sm:text-base">{review.rating}</span>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm sm:text-base mb-3 leading-relaxed">{review.comment}</p>
                        <p className="text-xs text-gray-400">
                          {review.created_at ? new Date(review.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric', month: 'long', year: 'numeric'
                          }) : '-'}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 sm:py-16">
                    <UtensilsCrossed className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2 text-sm sm:text-base font-medium">Belum ada review menu</p>
                    <p className="text-xs sm:text-sm text-gray-400">Berikan review pada menu favorit Anda</p>
                  </div>
                )}
              </div>
            )}

            {reviewSubTab === 'restaurant' && (
              <div>
                {restaurantReviews.length > 0 ? (
                  <div className="space-y-3 sm:space-y-4">
                    {restaurantReviews.map((review) => (
                      <div key={review.id} className="bg-white rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-base sm:text-lg mb-1 truncate">{review.targetName}</h3>
                            <span className="text-xs text-gray-500 bg-blue-50 px-2 py-1 rounded inline-block">Restoran</span>
                          </div>
                          <div className="flex items-center gap-1 bg-yellow-50 px-2.5 sm:px-3 py-1.5 rounded-lg flex-shrink-0">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold text-yellow-700 text-sm sm:text-base">{review.rating}</span>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm sm:text-base mb-3 leading-relaxed">{review.comment}</p>
                        <p className="text-xs text-gray-400">
                          {review.created_at ? new Date(review.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric', month: 'long', year: 'numeric'
                          }) : '-'}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 sm:py-16">
                    <Store className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2 text-sm sm:text-base font-medium">Belum ada review restoran</p>
                    <p className="text-xs sm:text-sm text-gray-400">Berikan review pada restoran favorit Anda</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* LANJUT KE PART 5... */}
        {/* LANJUTAN DARI PART 4... */}

        {/* USER MANAGEMENT TAB (ADMIN) */}
        {selectedTab === 'users' && currentUser.role === 'admin' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <Key className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg sm:text-xl font-semibold">Manajemen User</h2>
              <span className="text-sm bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">{allUsers.length}</span>
            </div>
            
            <div className="space-y-3">
              {allUsers.map((u) => (
                <div key={u.id} className="bg-white rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
                  {/* LAYOUT HORIZONTAL (SEPERTI SEMULA) */}
                  <div className="flex items-center justify-between gap-4">
                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-base truncate">{u.username}</p>
                      <p className="text-sm text-gray-500 truncate">{u.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-gray-600">Role:</p>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                          u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {u.role === 'admin' ? '👑 Admin' : '🍴 User'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Dropdown Role */}
                      <select
                        value={u.role}
                        onChange={(e) => {
                          const newRole = e.target.value as 'admin' | 'user';
                          updateUserRole(u.id, newRole);
                        }}
                        style={{
                          backgroundColor: '#ffffff',
                          color: '#1f2937',
                          border: '2px solid #d1d5db'
                        }}
                        className="px-3 py-2 rounded-lg text-sm font-medium focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all min-w-[100px]"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                      
                      {/* Tombol Hapus - FIXED dengan inline style */}
                      <button
                        onClick={async () => {
                          if (window.confirm(`Hapus user ${u.username}?`)) {
                            await deleteUser(u.id);
                            toast.success('User berhasil dihapus');
                          }
                        }}
                        style={{
                          backgroundColor: '#dc2626',
                          color: '#ffffff'
                        }}
                        className="px-3 py-2 rounded-lg hover:opacity-90 transition-all active:scale-95 flex items-center gap-1.5 text-sm font-medium shadow-md"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {allUsers.length === 0 && (
              <div className="text-center py-12 sm:py-16">
                <User className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-sm sm:text-base">Belum ada user terdaftar</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL 1: DANGER ZONE - STRONGER FIX */}
      {showDangerZoneModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <ShieldAlert className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-1">Danger Zone</h2>
                <p className="text-sm text-gray-600">
                  Akun: <strong className="text-gray-900">{currentUser.username}</strong>
                </p>
              </div>
            </div>

            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-5">
              <p className="text-sm text-red-900 leading-relaxed">
                Setelah akun dihapus, semua data Anda termasuk review dan favorit akan dihapus secara permanen. 
                <strong> Tindakan ini tidak dapat dibatalkan.</strong>
              </p>
            </div>

            <p className="text-base text-gray-700 mb-6 font-medium">
              Apakah Anda yakin ingin melanjutkan?
            </p>

            <div className="flex gap-3">
              {/* TOMBOL BATAL - FIXED dengan !important & inline style */}
              <button
                onClick={() => setShowDangerZoneModal(false)}
                style={{ 
                  backgroundColor: '#ffffff',
                  color: '#374151',
                  border: '2px solid #d1d5db'
                }}
                className="flex-1 px-5 py-3 rounded-lg hover:bg-gray-100 transition-all font-semibold shadow-md"
              >
                Batal
              </button>
              <button
                onClick={handleProceedToFinalConfirm}
                style={{ 
                  backgroundColor: '#dc2626',
                  color: '#ffffff'
                }}
                className="flex-1 px-5 py-3 rounded-lg hover:bg-red-700 transition-all font-semibold shadow-lg"
              >
                Ya, Saya Yakin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: FINAL CONFIRMATION - STRONGER FIX */}
      {showFinalConfirmModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-1">Konfirmasi Hapus Akun</h2>
                <p className="text-sm text-gray-600">
                  Akun Anda: <strong className="text-gray-900">{currentUser.username}</strong>
                </p>
              </div>
            </div>

            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-5">
              <p className="text-sm text-red-900 font-semibold mb-2">
                ⚠️ Peringatan: Tindakan ini akan menghapus:
              </p>
              <ul className="text-sm text-red-800 space-y-1.5 ml-5 list-disc">
                <li>Semua review yang pernah Anda tulis</li>
                <li>Semua daftar favorit Anda</li>
                <li>Akun dan data profil Anda</li>
              </ul>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Ketik <span className="font-mono bg-gray-100 px-2 py-1 rounded text-red-600 text-base">DELETE</span> untuk konfirmasi:
              </label>
              <Input
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Ketik DELETE"
                className="w-full border-2 focus:ring-red-500 focus:border-red-500 text-base"
                disabled={isDeleting}
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              {/* TOMBOL BATAL - FIXED dengan inline style */}
              <button
                onClick={() => {
                  setShowFinalConfirmModal(false);
                  setDeleteConfirmText('');
                }}
                disabled={isDeleting}
                style={{ 
                  backgroundColor: '#ffffff',
                  color: '#374151',
                  border: '2px solid #d1d5db'
                }}
                className="flex-1 px-5 py-3 rounded-lg hover:bg-gray-100 transition-all font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Batal
              </button>
              <button
                onClick={handleFinalDeleteAccount}
                disabled={deleteConfirmText !== 'DELETE' || isDeleting}
                style={{ 
                  backgroundColor: isDeleting || deleteConfirmText !== 'DELETE' ? '#9ca3af' : '#dc2626',
                  color: '#ffffff'
                }}
                className="flex-1 px-5 py-3 rounded-lg hover:opacity-90 transition-all font-semibold shadow-lg disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Hapus Akun</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}