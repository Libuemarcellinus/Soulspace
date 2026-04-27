import { createBrowserRouter, Navigate } from "react-router";
import MainApp from "./MainApp";
import AdminLayout from "./components/admin/AdminLayout";
import AdminLogin from "./components/admin/AdminLogin";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminSouls from "./components/admin/AdminSouls";
import AdminCircles from "./components/admin/AdminCircles";
import AdminMoods from "./components/admin/AdminMoods";
import AdminUsers from "./components/admin/AdminUsers";

// Simple auth check - in production this would check real auth
const isAdminAuthenticated = () => {
  return localStorage.getItem('adminAuth') === 'true';
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return isAdminAuthenticated() ? <>{children}</> : <Navigate to="/admin/login" replace />;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainApp />,
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "souls", element: <AdminSouls /> },
      { path: "circles", element: <AdminCircles /> },
      { path: "moods", element: <AdminMoods /> },
      { path: "users", element: <AdminUsers /> },
    ],
  },
]);