import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import LoadingSpinner from "./LoadingSpinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, isLoading } = useUser();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <LoadingSpinner />;
  }
  console.log(user);
  if (!user) {
    // Redirect them to the home page, but save the current location they were
    // trying to go to for a successful login
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Add role-based protection if requiredRole is specified
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
