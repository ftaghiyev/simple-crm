import { useAuth } from "@/hooks/auth";
import { Navigate } from "react-router-dom";

function RootRedirect() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard/home" replace />;
  }

  return <Navigate to="/login" replace />;
}

export default RootRedirect;
