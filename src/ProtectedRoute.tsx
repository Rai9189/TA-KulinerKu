// src/App.tsx
import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { BottomNavigation } from "./components/BottomNavigation";
import { Home } from "./pages/Home";
import { MenuList } from "./pages/MenuList";
import { MenuDetail } from "./pages/MenuDetail";
import { RestaurantList } from "./pages/RestaurantList";
import { RestaurantDetail } from "./pages/RestaurantDetail";
import { Profile } from "./pages/Profile";
import { AppProvider } from "./context/AppContext";
import { ProtectedRoute } from "./ProtectedRoute";
import { Login } from "./pages/Login";
import { AdminDashboard } from "./pages/AdminDashboard"; // contoh halaman khusus admin

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

        {/* Profile bisa diakses guest, tapi tampilannya berbeda */}
        <Route path="/profile" element={<Profile />} />

        {/* Admin-only route */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login />} />
      </Routes>

      {location.pathname !== "/login" && <BottomNavigation />}
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
