import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = ({ isAllowed, redirectTo = "/login", children }) => {
  // Si no cumple el permiso (no está logueado o rol incorrecto), redirige al Login
  if (!isAllowed) {
    return <Navigate to={redirectTo} replace />;
  }

  // Si tiene permiso, renderiza las rutas hijas
  return children ? children : <Outlet />;
};