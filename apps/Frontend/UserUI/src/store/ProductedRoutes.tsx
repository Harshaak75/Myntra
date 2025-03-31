import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoutes = () => {
  const { isAuthenticated, loading } = useSelector((state: any) => state.auth);

  // ✅ Prevent infinite loops by waiting for authentication check to complete
  if (loading) {
    return null; // ❌ Don't show anything while loading, App.tsx will handle it
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};
