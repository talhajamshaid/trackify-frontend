import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated, getUserRole } from "../utils/helper";

const PublicRoute = () => {
  if (!isAuthenticated()) return <Outlet />;

  const role = getUserRole();
  if (role === "admin") return <Navigate to="/admin/dashboard" replace />;
  if (role === "user") return <Navigate to="/user/dashboard" replace />;

  return <Navigate to="/" replace />;
};

export default PublicRoute;
