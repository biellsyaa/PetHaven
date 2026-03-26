import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  if (role === "shelter") {
    const shelterId = localStorage.getItem("shelter_id");
    if (!shelterId) return <Navigate to="/shelter/login" replace />;
  }

  if (role === "admin") {
    const adminId = localStorage.getItem("admin_id");
    if (!adminId) return <Navigate to="/admin/login" replace />;
  }

  return children;
}