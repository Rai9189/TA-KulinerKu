import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { BottomNavigation } from "./components/BottomNavigation";
import { Home } from "./pages/Home";
import { MenuList } from "./pages/MenuList";
import { MenuDetail } from "./pages/MenuDetail";
import { RestaurantList } from "./pages/RestaurantList";
import { RestaurantDetail } from "./pages/RestaurantDetail";
import { Profile } from "./pages/Profile";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register"; // ⬅ WAJIB DITAMBAHKAN
import { AppProvider } from "./context/AppContext";

function AppContent() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<MenuList />} />
        <Route path="/menu/:id" element={<MenuDetail />} />
        <Route path="/restaurants" element={<RestaurantList />} />
        <Route path="/restaurants/:id" element={<RestaurantDetail />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> {/* ⬅ ROUTE TAMBAHAN */}
      </Routes>

      {location.pathname !== "/login" &&
       location.pathname !== "/register" && (     // ⬅ Bottom nav disembunyikan di login & register
        <BottomNavigation />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}
