import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "sonner";
import RootRedirect from "./routes/root-redirect";
import PublicRoute from "./routes/public-route";
import Login from "./pages/auth/login/login";
import PageNotFound from "./pages/page-not-found/page-not-found";
import ProtectedRoute from "./routes/protected-route";
import DashboardLayout from "./layouts/dashboard-layout";
import DashboardHome from "./pages/dashboard/home/dashboard-home";
import LeadManagement from "./pages/dashboard/lead-management/lead-management";
import Analytics from "./pages/dashboard/analytics/analytics";
import SignUp from "./pages/auth/signup/signup";
import LeadDetail from "./pages/dashboard/lead-management/lead-detail";

function App() {
  return (
    <Router>
      <Toaster position="top-right" duration={7000} richColors />
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route element={<PublicRoute redirectPath="/dashboard/home" />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>

        <Route path="/404" element={<PageNotFound />} />
        <Route element={<ProtectedRoute redirectPath="/login" />}>
          <Route path="/dashboard/*" element={<DashboardLayout />}>
            <Route index element={<Navigate replace to="home" />} />
            <Route path="home" element={<DashboardHome />} />
            <Route path="lead-management" element={<LeadManagement />} />
            <Route path="leads/:id" element={<LeadDetail />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Route>
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
