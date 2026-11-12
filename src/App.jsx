
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/useAuth";

import Login from "./pages/Login";
import AdminHome from "./pages/admin/AdminHome";
import AdminUsers from "./pages/admin/AdminUsers";
import TecnicoHome from "./pages/tecnico/TecnicoHome";

function Register() {
  return <h1>Registro</h1>;
}

function ClienteHome() {
  return <h1>Panel Cliente</h1>;
}

function App() {
  const { user } = useAuth();

  const isAuthenticated = !!user;
  const userRole = String(user?.role ?? "")
    .trim()
    .toUpperCase();

  return (
    <BrowserRouter>
      <Routes>
        {/* Página principal */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Cliente */}
        <Route
          element={
            <ProtectedRoute
              isAllowed={
                isAuthenticated &&
                ["CLIENT", "CLIENTE", "CUSTOMER"].includes(userRole)
              }
            />
          }
        >
          <Route path="/cliente" element={<ClienteHome />} />
        </Route>

        {/* Técnico */}
        <Route
          element={
            <ProtectedRoute
              isAllowed={
                isAuthenticated &&
                ["TECHNICIAN", "TECNICO", "TÉCNICO"].includes(userRole)
              }
            />
          }
        >
          <Route path="/tecnico" element={<TecnicoHome />} />
        </Route>

        {/* Administrador */}
        <Route
          element={
            <ProtectedRoute
              isAllowed={
                isAuthenticated &&
                ["ADMIN", "ADMINISTRADOR"].includes(userRole)
              }
            />
          }
        >
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/admin/usuarios" element={<AdminUsers />} />
        </Route>

        {/* Ruta no encontrada */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
