import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/auth";
import ContentLoading from "@/components/ui/content-loading";

const ProtectedRoute = ({ redirectPath = "/login" }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <ContentLoading loading={loading} />;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
