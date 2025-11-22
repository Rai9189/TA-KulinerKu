import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { BottomNavigation } from "./components/BottomNavigation";
import { Home } from "./pages/Home";
import { MenuList } from "./pages/MenuList";
import { MenuDetail } from "./pages/MenuDetail";
import { RestaurantList } from "./pages/RestaurantList";
import { RestaurantDetail } from "./pages/RestaurantDetail";
import { Profile } from "./pages/Profile";
import { AppProvider } from "./context/AppContext";

export default function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<MenuList />} />
            <Route path="/menu/:id" element={<MenuDetail />} />
            <Route path="/restaurants" element={<RestaurantList />} />
            <Route path="/restaurants/:id" element={<RestaurantDetail />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
          <BottomNavigation />
        </div>
      </Router>
    </AppProvider>
  );
}