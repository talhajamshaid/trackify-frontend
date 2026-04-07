import { Navigate, useRoutes } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoute";
import MainLayout from "../layouts/MainLayout";

// Auth Pages
import Forgot from "../pages/Auth/Forgot";
import Login from "../pages/Auth/Login";
import OtpConfirmation from "../pages/Auth/Otpconfirmation";

// Admin Pages
import AdminDashboard from "../pages/Admin/Dashboard";

// User Pages
import TaskHistory from "../pages/Admin/TaskHistory";
import TaskManage from "../pages/Admin/TaskManage";
import UserRequest from "../pages/Admin/UserRequest";
import NotFound from "../pages/NotFound";
import Settings from "../pages/Settings";
import Dashboard from "../pages/User/Dashboard";
import MyTasks from "../pages/User/MyTasks";
import EmailSent from "../pages/Auth/EmailSent";
import ConfirmPassword from "../pages/Auth/ConfirmPasword";
import Register from "../pages/Auth/Register";

function AppRoutes() {
  const routes = [
    // Public routes
    {
      element: <PublicRoute />,
      children: [
        { path: "/", element: <Navigate to="/login" /> },
        { path: "/login", element: <Login /> },
        { path: "/forgot-password", element: <Forgot /> },
        { path: "/email-sent", element: <EmailSent /> },
        { path: "/reset-password/:token", element: <ConfirmPassword /> },
        { path: "/register", element: <Register /> },
      ],
    },

    // Protected routes (MainLayout wrapper)
    {
      element: <ProtectedRoute />,
      children: [
        {
          element: <MainLayout />,
          children: [
            // Admin-only routes
            {
              path: "/admin",
              element: <ProtectedRoute role="admin" />,
              children: [
                { path: "dashboard", element: <AdminDashboard /> },
                { path: "user", element: <UserRequest /> },
                { path: "task", element: <TaskManage /> },
                { path: "task-history", element: <TaskHistory /> },
              ],
            },

            // User-only routes
            {
              path: "user",
              element: <ProtectedRoute role="user" />,
              children: [
                { path: "dashboard", element: <Dashboard /> },
                { path: "task", element: <MyTasks /> },
              ],
            },
            { path: "/:slug/settings", element: <Settings /> },
          ],
        },
      ],
    },

    // Catch-all
    { path: "*", element: <NotFound /> },
  ];

  return useRoutes(routes);
}

export default AppRoutes;
