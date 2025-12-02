import { Navigate } from "react-router-dom";
import { useAppContext } from "./context/AppContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  adminOnly = false 
}: ProtectedRouteProps) {
  const { currentUser, loading } = useAppContext();

  // Tunggu sampai loading selesai
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Jika tidak ada user, redirect ke login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Jika route khusus admin, cek role
  if (adminOnly && currentUser.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
