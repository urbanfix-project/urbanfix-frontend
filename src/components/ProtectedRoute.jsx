
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const dashboards = {
  ADMIN: "/admin",
  ADMINISTRADOR: "/admin",
  TECNICO: "/tecnico",
  TÉCNICO: "/tecnico",
  TECHNICIAN: "/tecnico",
  CLIENTE: "/cliente",
  CLIENT: "/cliente",
  CUSTOMER: "/cliente",
};

const ProtectedRoute = ({ isAllowed }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAllowed) {
    const role = String(user.role ?? "")
      .trim()
      .toUpperCase();

    return (
      <Navigate
        to={dashboards[role] || "/login"}
        replace
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
