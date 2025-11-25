// src/ProtectedRoute.tsx
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "./context/AppContext";

interface ProtectedRouteProps {
  children: ReactNode;
  role?: "user" | "admin"; // Jika tidak diisi, default: semua yang login
}

export const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const { user, role: currentRole } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    // Jika belum login
    if (!user) {
      navigate("/login");
      return;
    }

    // Jika role tertentu, dan user tidak sesuai
    if (role && currentRole !== role) {
      alert("Anda tidak memiliki akses ke halaman ini");
      navigate("/"); // redirect ke home
    }
  }, [user, currentRole, role, navigate]);

  return <>{user ? children : null}</>;
};
