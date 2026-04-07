import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated, getUserRole } from "../utils/helper"; // getUserRole should return "admin" or "user"

const ProtectedRoute = ({ redirectTo = "/login", role }) => {
  if (!isAuthenticated()) return <Navigate to={redirectTo} replace />;

  // If a role is specified, check it
  if (role && getUserRole() !== role)
    return <Navigate to="/not-authorized" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
