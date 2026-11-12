

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const ROLE_DASHBOARDS = {
  CLIENT: "/cliente",
  CLIENTE: "/cliente",
  CUSTOMER: "/cliente",
  TECHNICIAN: "/tecnico",
  TECNICO: "/tecnico",
  "TÉCNICO": "/tecnico",
  ADMIN: "/admin",
  ADMINISTRADOR: "/admin",
};

const ROLE_GROUPS = {
  CLIENTE: ["CLIENTE", "CLIENT", "CUSTOMER"],
  TECNICO: ["TECNICO", "TÉCNICO", "TECHNICIAN"],
  ADMIN: ["ADMIN", "ADMINISTRADOR"],
};

const ProtectedRoute = ({ requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <p role="status">Cargando...</p>;
  }

  if (!user) {
    return <Navigate replace to="/login" />;
  }

  const userRole = String(user.role ?? "")
    .trim()
    .toUpperCase();

  const expectedRole = String(requiredRole ?? "")
    .trim()
    .toUpperCase();

  if (
    expectedRole &&
    !ROLE_GROUPS[expectedRole]?.includes(userRole)
  ) {
    return (
      <Navigate
        replace
        to={ROLE_DASHBOARDS[userRole] ?? "/login"}
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
