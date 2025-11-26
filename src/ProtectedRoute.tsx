// src/ProtectedRoute.tsx
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppContext } from "./context/AppContext";

interface ProtectedRouteProps {
  children: ReactNode;
  role?: "user" | "admin";
}

export const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const { currentUser } = useAppContext();

  // Jika belum login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Jika butuh role khusus
  if (role && currentUser.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};
