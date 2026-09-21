import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRoles }) {
  const { user, isLoggedIn } = useAuth();

  // Not logged in
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Wrong role
  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;