import {
  User,
  Hash,
  Users,
  Info,
  Heart,
  MessageSquare,
  Edit2,
  Camera,
  Shield,
  Key,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { MenuCard } from "../components/MenuCard";
import { RestaurantCard } from "../components/RestaurantCard";
import { supabase } from "../lib/supabaseClient";

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
  } = useAppContext();

  const [userName, setUserName] = useState(currentUser?.username || "");
  const [userBio, setUserBio] = useState(currentUser?.bio || "");
  const [profileImage, setProfileImage] = useState(currentUser?.profile_image || "");

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const [tempBio, setTempBio] = useState(userBio);
  const [activeTab, setActiveTab] = useState<"favorites" | "reviews" | "users">("favorites");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const favMenuList = menuItems.filter((m) => favoriteMenus.includes(m.id));
  const favRestaurantList = restaurants.filter((r) =>
    favoriteRestaurants.includes(r.id)
  );
  const userReviews = reviews.filter((r) => r.userName === userName);

  // -----------------------------
  // HANDLE IMAGE UPLOAD
  // -----------------------------
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran file terlalu besar (max 2MB)");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar!");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const newImage = reader.result as string;
      setProfileImage(newImage);

      // Update ke Supabase
      if (currentUser) {
        const { error } = await supabase
          .from("users")
          .update({ profile_image: newImage })
          .eq("id", currentUser.id);
        if (error) console.error("Gagal update profile image:", error);
        else setCurrentUser({ ...currentUser, profile_image: newImage });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = async () => {
    if (!currentUser) return;
    if (confirm("Hapus foto profil?")) {
      setProfileImage("");
      const { error } = await supabase
        .from("users")
        .update({ profile_image: "" })
        .eq("id", currentUser.id);
      if (error) console.error("Gagal hapus profile image:", error);
      else setCurrentUser({ ...currentUser, profile_image: "" });
    }
  };

  // -----------------------------
  // HANDLE SAVE PROFILE
  // -----------------------------
  const handleSaveProfile = async () => {
    if (!currentUser) return;

    const { data, error } = await supabase
      .from("users")
      .update({
        username: tempName,
        bio: tempBio,
      })
      .eq("id", currentUser.id);

    if (error) {
      console.error("Gagal update profil:", error);
      alert("Gagal menyimpan profil");
    } else {
      setUserName(tempName);
      setUserBio(tempBio);
      setCurrentUser({ ...currentUser, username: tempName, bio: tempBio });
      setIsEditingProfile(false);
    }
  };

  const handleCancelEdit = () => {
    setTempName(userName);
    setTempBio(userBio);
    setIsEditingProfile(false);
  };

  useEffect(() => {
    if (currentUser) {
      setUserName(currentUser.username);
      setUserBio(currentUser.bio || "");
      setProfileImage(currentUser.profile_image || "");
    }
  }, [currentUser]);

  // -----------------------------
  // RENDER
  // -----------------------------
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

      {/* CONTENT */}
      <div className="px-6 -mt-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* EDIT PROFILE */}
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
                    className="w-full px-4 py-2 border rounded-lg focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Bio</label>
                  <textarea
                    rows={3}
                    value={tempBio}
                    onChange={(e) => setTempBio(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-orange-500"
                  />
                </div>

                {profileImage && (
                  <button
                    onClick={handleRemoveImage}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Hapus foto profil
                  </button>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleSaveProfile}
                    className="flex-1 bg-orange-600 text-white py-2 rounded-lg"
                  >
                    Simpan
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex-1 border py-2 rounded-lg"
                  >
                    Batal
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Nama</p>
                  <p>{userName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Bio</p>
                  <p>{userBio}</p>
                </div>
              </div>
            )}
          </div>

          {/* TABS */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab("favorites")}
                className={`flex-1 py-4 ${
                  activeTab === "favorites"
                    ? "bg-orange-50 text-orange-600 border-b-2 border-orange-600"
                    : "text-gray-600"
                }`}
              >
                Favorit
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`flex-1 py-4 ${
                  activeTab === "reviews"
                    ? "bg-orange-50 text-orange-600 border-b-2 border-orange-600"
                    : "text-gray-600"
                }`}
              >
                Review Saya
              </button>

              {currentUser?.role === "admin" && (
                <button
                  onClick={() => setActiveTab("users")}
                  className={`flex-1 py-4 flex gap-2 items-center justify-center ${
                    activeTab === "users"
                      ? "bg-orange-50 text-orange-600 border-b-2 border-orange-600"
                      : "text-gray-600"
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  Manajemen User
                </button>
              )}
            </div>

            <div className="p-6">
              {/* FAVORITES */}
              {activeTab === "favorites" && (
                <div className="space-y-8">
                  {favMenuList.length > 0 && (
                    <div>
                      <h3 className="mb-4 font-semibold text-lg">Menu Favorit</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {favMenuList.map((menu) => (
                          <MenuCard key={menu.id} menu={menu} />
                        ))}
                      </div>
                    </div>
                  )}

                  {favRestaurantList.length > 0 && (
                    <div>
                      <h3 className="mb-4 font-semibold text-lg">Restoran Favorit</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {favRestaurantList.map((r) => (
                          <RestaurantCard key={r.id} restaurant={r} />
                        ))}
                      </div>
                    </div>
                  )}

                  {favMenuList.length === 0 && favRestaurantList.length === 0 && (
                    <div className="text-center py-10 text-gray-500 flex flex-col items-center">
                      <Heart className="w-12 h-12 mb-3 text-orange-500" />
                      <p className="text-lg font-semibold">Belum ada favorit</p>
                      <p className="text-sm text-gray-400">
                        Simpan menu atau restoran untuk melihatnya di sini.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* REVIEWS */}
              {activeTab === "reviews" && (
                <div>
                  {userReviews.length > 0 ? (
                    <div className="space-y-4">
                      {userReviews.map((review) => (
                        <div
                          key={review.id}
                          className="border p-4 rounded-lg shadow-sm bg-white"
                        >
                          <div className="flex items-center justify-between">
                            <p className="font-semibold">Review Anda</p>
                            <span className="text-yellow-500 font-bold">
                              ★ {review.rating}
                            </span>
                          </div>
                          <p className="text-gray-700 mt-2">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-gray-500 flex flex-col items-center">
                      <MessageSquare className="w-12 h-12 mb-3 text-orange-500" />
                      <p className="text-lg font-semibold">Belum ada review</p>
                      <p className="text-sm text-gray-400">
                        Anda belum memberikan ulasan apa pun.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* USER MANAGEMENT */}
              {activeTab === "users" && currentUser?.role === "admin" && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Key className="w-5 h-5 text-orange-600" />
                    Manajemen User
                  </h3>

                  <div className="space-y-3">
                    {allUsers.map((u) => (
                      <div
                        key={u.id}
                        className="flex items-center justify-between border p-4 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{u.username}</p>
                          <p className="text-sm text-gray-500">{u.email}</p>
                          <p className="text-xs text-gray-600">
                            Role saat ini: {u.role}
                          </p>
                        </div>

                        <button
                          onClick={() =>
                            updateUserRole(
                              u.id,
                              u.role === "admin" ? "user" : "admin"
                            )
                          }
                          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                        >
                          {u.role === "admin" ? "Turunkan ke User" : "Jadikan Admin"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* FOOTER */}
          <div className="text-center py-6">
            <p className="text-gray-500 text-sm">
              © 2025 KulinerKu. Dibuat untuk tugas kuliah.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
