import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/auth";

export default function PublicRoute({ redirectPath = "/dashboard/home" }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) return <Navigate to={redirectPath} replace />;

  return <Outlet />;
}
