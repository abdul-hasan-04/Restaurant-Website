
import { Navigate, useNavigate } from "react-router";
import useAuth from "../hooks/useAuth";
import TopLoadingBar from "../components/TopLoadingBar";
import { toast } from "react-toastify";
function ProtectedRoute({ children, adminOnly = false }) {
  const { isLoggedIn, profile, isLoading} = useAuth();
  // 1. If the user is not logged in, redirect to login

   if(isLoading) {
    return <TopLoadingBar loading={isLoading}/>
  }
  if (!isLoggedIn) {
    return <Navigate to="/auth/login" replace />;
  }

  // 2. If this route is admin-only, check the user's role
  if (adminOnly && profile?.role !== "admin") {
    return <Navigate to="/dashboard/user" replace />;
  }

  // 3. If all checks pass, render the requested dashboard
  return children;
}

export default ProtectedRoute;
