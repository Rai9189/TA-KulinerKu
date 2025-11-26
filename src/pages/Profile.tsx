import { Camera, Edit2, LogOut, Star, Heart, User, Key, Trash2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuCard } from '../components/MenuCard';
import { RestaurantCard } from '../components/RestaurantCard';
import { useAppContext } from '../context/AppContext';
import { Input } from '../components/ui/input';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';
import { supabase } from '../lib/supabaseClient';

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
  } = useAppContext();

  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(currentUser?.username || '');
  const [editBio, setEditBio] = useState(currentUser?.bio || '');
  const [profileImage, setProfileImage] = useState(currentUser?.profile_image || '');
  const [selectedTab, setSelectedTab] = useState<'favorites' | 'reviews' | 'users'>('favorites');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.username);
      setEditBio(currentUser.bio || '');
      setProfileImage(currentUser.profile_image || '');
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-20">
        <div className="text-center px-4 max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <LogOut className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl mb-2">Belum Login</h2>
            <p className="text-gray-500 mb-6">Silakan login untuk melihat profil Anda</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/login')}
                className="w-full px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="w-full px-4 py-2 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Data filtered
  const favMenuList = menuItems.filter(m => favoriteMenus.includes(m.id));
  const favRestaurantList = restaurants.filter(r => favoriteRestaurants.includes(r.id));
  const userReviews = reviews.filter(r => r.userName === currentUser.username);

  // =======================
  // FUNCTIONS
  // =======================
  const handleLogout = () => {
    if (window.confirm('Apakah Anda yakin ingin logout?')) {
      localStorage.removeItem('token');
      setCurrentUser(null);
      navigate('/login');
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

  const handleRemoveImage = async () => {
    if (!currentUser) return;
    if (window.confirm('Hapus foto profil?')) {
      setProfileImage('');
    }
  };

  // =======================
  // RENDER UI
  // =======================
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white">
        <div className="max-w-screen-xl mx-auto px-4 py-8">
          <div className="flex justify-end mb-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>

          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                {profileImage ? (
                  <ImageWithFallback
                    src={profileImage}
                    alt={editName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-orange-500" />
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 bg-white text-orange-500 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
              >
                <Camera className="w-4 h-4" />
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
              <div className="w-full max-w-xs">
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="mb-2 text-center bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-white/70"
                  placeholder="Nama pengguna"
                />
                <Input
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="mb-2 text-center bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-white/70"
                  placeholder="Bio"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveProfile}
                    className="flex-1 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
                  >
                    Simpan
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditName(currentUser.username);
                      setEditBio(currentUser.bio || '');
                    }}
                    className="flex-1 px-4 py-2 border border-white/30 text-white rounded hover:bg-white/20"
                  >
                    Batal
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl">{currentUser.username}</h1>
                  <button onClick={() => setIsEditing(true)} className="p-1 hover:bg-white/20 rounded">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-orange-50 mb-1">{currentUser.bio || 'Food lover'}</p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b">
          <button
            onClick={() => setSelectedTab('favorites')}
            className={`px-4 py-3 border-b-2 transition-colors ${
              selectedTab === 'favorites'
                ? 'border-orange-500 text-orange-500'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span>Favorit</span>
            </div>
          </button>
          <button
            onClick={() => setSelectedTab('reviews')}
            className={`px-4 py-3 border-b-2 transition-colors ${
              selectedTab === 'reviews'
                ? 'border-orange-500 text-orange-500'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              <span>Review Saya</span>
            </div>
          </button>
          {currentUser.role === 'admin' && (
            <button
              onClick={() => setSelectedTab('users')}
              className={`px-4 py-3 border-b-2 transition-colors flex items-center gap-2 ${
                selectedTab === 'users'
                  ? 'border-orange-500 text-orange-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Key className="w-4 h-4" />
              <span>Manajemen User</span>
            </button>
          )}
        </div>

        {/* Favorites */}
        {selectedTab === 'favorites' && (
          <div className="space-y-8">
            {favMenuList.length > 0 && (
              <div>
                <h2 className="mb-4">Menu Favorit ({favMenuList.length})</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {favMenuList.map((menu) => (
                    <MenuCard key={menu.id} menu={menu} />
                  ))}
                </div>
              </div>
            )}
            {favRestaurantList.length > 0 && (
              <div>
                <h2 className="mb-4">Restoran Favorit ({favRestaurantList.length})</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favRestaurantList.map((r) => (
                    <RestaurantCard key={r.id} restaurant={r} />
                  ))}
                </div>
              </div>
            )}
            {favMenuList.length === 0 && favRestaurantList.length === 0 && (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">Belum ada favorit</p>
                <p className="text-sm text-gray-400">Tandai menu atau restoran favorit Anda</p>
              </div>
            )}
          </div>
        )}

        {/* Reviews */}
        {selectedTab === 'reviews' && (
          <div>
            {userReviews.length > 0 ? (
              <div className="space-y-4">
                {userReviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="mb-1">{review.targetName || 'Menu/Restoran'}</h3>
                        <span className="text-xs text-gray-500">{review.targetType || ''}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-2">{review.comment}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(review.date).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">Belum ada review</p>
                <p className="text-sm text-gray-400">Berikan review pada menu atau restoran</p>
              </div>
            )}
          </div>
        )}

        {/* User management (admin only) */}
        {selectedTab === 'users' && currentUser.role === 'admin' && (
          <div className="space-y-3">
            {allUsers.map((u) => (
              <div key={u.id} className="flex items-center justify-between border p-4 rounded-lg">
                <div>
                  <p className="font-medium">{u.username}</p>
                  <p className="text-sm text-gray-500">{u.email}</p>
                  <p className="text-xs text-gray-600">Role saat ini: {u.role}</p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={u.role}
                    onChange={(e) => updateUserRole(u.id, e.target.value)}
                    className="border px-2 py-1 rounded"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button
                    onClick={async () => {
                      if (window.confirm(`Hapus user ${u.username}?`)) {
                        await deleteUser(u.id);
                        toast.success('User berhasil dihapus');
                      }
                    }}
                    className="px-2 py-1 bg-black text-white rounded hover:bg-gray-800 flex items-center gap-1 text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
