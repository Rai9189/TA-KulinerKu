import { User, Hash, Users, Info, Heart, MessageSquare, Edit2, Camera } from "lucide-react";
import { useState, useRef } from "react";
import { useAppContext } from "../context/AppContext";
import { MenuCard } from "../components/MenuCard";
import { RestaurantCard } from "../components/RestaurantCard";
import { Link } from "react-router-dom";

export function Profile() {
  const { userName, setUserName, profileImage, setProfileImage, userBio, setUserBio, favoriteMenus, favoriteRestaurants, menuItems, restaurants, reviews } = useAppContext();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const [tempBio, setTempBio] = useState(userBio);
  const [activeTab, setActiveTab] = useState<"favorites" | "reviews">("favorites");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const favMenuList = menuItems.filter(m => favoriteMenus.includes(m.id));
  const favRestaurantList = restaurants.filter(r => favoriteRestaurants.includes(r.id));
  const userReviews = reviews.filter(r => r.userName === userName);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran file terlalu besar! Maksimal 2MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        alert("File harus berupa gambar!");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    setUserName(tempName);
    setUserBio(tempBio);
    setIsEditingProfile(false);
  };

  const handleCancelEdit = () => {
    setTempName(userName);
    setTempBio(userBio);
    setIsEditingProfile(false);
  };

  const handleRemoveImage = () => {
    if (confirm("Hapus foto profil?")) {
      setProfileImage("");
    }
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white px-6 pt-8 pb-12">
        <div className="max-w-screen-xl mx-auto text-center">
          <div className="relative w-24 h-24 mx-auto mb-4">
            {profileImage ? (
              <img 
                src={profileImage} 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <User className="w-12 h-12 text-orange-600" />
              </div>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
            >
              <Camera className="w-4 h-4 text-orange-600" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
          <h1 className="text-white mb-2">{userName || "Pengguna KulinerKu"}</h1>
          <p className="text-orange-50">{userBio || "Food lover"}</p>
        </div>
      </div>
      
      {/* Profile Content */}
      <div className="px-6 -mt-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Edit Profile Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="flex items-center gap-2">
                <User className="w-6 h-6 text-orange-600" />
                Informasi Profil
              </h2>
              {!isEditingProfile && (
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Edit2 className="w-4 h-4 text-orange-600" />
                </button>
              )}
            </div>
            
            {isEditingProfile ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">Nama Pengguna</label>
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    placeholder="Masukkan nama Anda"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm mb-2">Bio</label>
                  <textarea
                    value={tempBio}
                    onChange={(e) => setTempBio(e.target.value)}
                    placeholder="Ceritakan tentang diri Anda..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {profileImage && (
                  <div>
                    <button
                      onClick={handleRemoveImage}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Hapus Foto Profil
                    </button>
                  </div>
                )}
                
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleSaveProfile}
                    className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                  >
                    Simpan
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Batal
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Nama</p>
                  <p>{userName || "Belum diatur"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Bio</p>
                  <p className="text-gray-700">{userBio || "Belum ada bio"}</p>
                </div>
              </div>
            )}
            <p className="text-sm text-gray-500 mt-4">
              Nama dan foto profil Anda akan ditampilkan saat menulis review
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab("favorites")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 transition-colors ${
                  activeTab === "favorites"
                    ? "bg-orange-50 text-orange-600 border-b-2 border-orange-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Heart className={`w-5 h-5 ${activeTab === "favorites" ? "fill-orange-600" : ""}`} />
                <span>Favorit ({favMenuList.length + favRestaurantList.length})</span>
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 transition-colors ${
                  activeTab === "reviews"
                    ? "bg-orange-50 text-orange-600 border-b-2 border-orange-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <MessageSquare className="w-5 h-5" />
                <span>Review Saya ({userReviews.length})</span>
              </button>
            </div>

            <div className="p-6">
              {activeTab === "favorites" && (
                <div className="space-y-8">
                  {/* Favorite Menus */}
                  {favMenuList.length > 0 && (
                    <div>
                      <h3 className="mb-4">Menu Favorit</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favMenuList.map((menu) => (
                          <MenuCard key={menu.id} menu={menu} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Favorite Restaurants */}
                  {favRestaurantList.length > 0 && (
                    <div>
                      <h3 className="mb-4">Restoran Favorit</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favRestaurantList.map((restaurant) => (
                          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                        ))}
                      </div>
                    </div>
                  )}

                  {favMenuList.length === 0 && favRestaurantList.length === 0 && (
                    <div className="text-center py-12">
                      <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-2">Belum ada favorit</p>
                      <p className="text-sm text-gray-400">
                        Tap ikon ❤️ pada menu atau restoran untuk menambahkan favorit
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "reviews" && (
                <div>
                  {userReviews.length > 0 ? (
                    <div className="space-y-4">
                      {userReviews.map((review) => {
                        const restaurant = restaurants.find(r => r.id === review.restaurantId);
                        const menu = menuItems.find(m => m.id === review.menuId);
                        return (
                          <div key={review.id} className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                {review.restaurantId && restaurant && (
                                  <Link 
                                    to={`/restaurants/${review.restaurantId}`}
                                    className="text-orange-600 hover:text-orange-700"
                                  >
                                    {restaurant.name}
                                  </Link>
                                )}
                                {review.menuId && menu && (
                                  <Link 
                                    to={`/menu/${review.menuId}`}
                                    className="text-orange-600 hover:text-orange-700"
                                  >
                                    {menu.name}
                                  </Link>
                                )}
                                <p className="text-sm text-gray-500">
                                  {new Date(review.date).toLocaleDateString("id-ID", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </p>
                              </div>
                              <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded">
                                <span className="text-orange-600">⭐</span>
                                <span className="text-sm">{review.rating}</span>
                              </div>
                            </div>
                            <p className="text-gray-600">{review.comment}</p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-2">Belum ada review</p>
                      <p className="text-sm text-gray-400">
                        {userName 
                          ? "Kunjungi halaman restoran atau menu dan tulis review pertama Anda!"
                          : "Atur nama pengguna Anda terlebih dahulu untuk menulis review"}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Personal Info Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="mb-6 flex items-center gap-2">
              <Info className="w-6 h-6 text-orange-600" />
              Informasi Developer
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <User className="w-5 h-5 text-orange-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Nama Lengkap</p>
                  <p>Rafi Rai Pasha Afandi</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <Hash className="w-5 h-5 text-orange-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">NIM</p>
                  <p>21120123130073</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <Users className="w-5 h-5 text-orange-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Kelompok</p>
                  <p>Kelompok 8</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* About App Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="mb-4">Tentang Aplikasi</h2>
            <div className="space-y-3 text-gray-600">
              <p>
                <span className="text-orange-600">KulinerKu</span> adalah aplikasi
                pencarian makanan dan restoran yang memudahkan Anda menemukan
                kuliner favorit.
              </p>
              <div className="border-t border-gray-200 pt-3 mt-3">
                <h3 className="mb-2">Fitur Utama:</h3>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Jelajahi berbagai menu makanan dari berbagai kategori</li>
                  <li>Temukan restoran terbaik dengan rating tertinggi</li>
                  <li>Tambah dan edit menu serta restoran</li>
                  <li>Upload foto profil dan edit bio</li>
                  <li>Simpan favorit menu dan restoran</li>
                  <li>Tulis dan edit review restoran</li>
                  <li>Bagikan link menu dan restoran</li>
                  <li>Lihat riwayat review Anda</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Tech Stack Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="mb-4">Teknologi yang Digunakan</h2>
            <div className="flex flex-wrap gap-2">
              {["React", "TypeScript", "Tailwind CSS", "React Router", "Vite", "Context API", "LocalStorage"].map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 bg-orange-50 text-orange-600 rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          
          {/* Footer */}
          <div className="text-center py-6">
            <p className="text-gray-500 text-sm">
              © 2025 KulinerKu. Dibuat dengan ❤️ untuk tugas kuliah.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}