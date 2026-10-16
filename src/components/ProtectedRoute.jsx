import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ isAllowed }) => {
  console.log("ProtectedRoute - acceso permitido:", isAllowed);

  if (!isAllowed) {
    console.log("Acceso denegado. Redirigiendo al login.");
    return <Navigate to="/login" replace />;
  }

  console.log("Acceso permitido. Mostrando la página.");
  return <Outlet />;
};

export default ProtectedRoute;