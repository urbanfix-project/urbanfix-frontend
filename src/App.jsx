// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/useAuth";
import Login from "./pages/Login";
import AdminHome from "./pages/admin/AdminHome";
import AdminUsers from "./pages/admin/AdminUsers";
function Register() {
  return <h1>Registro</h1>;
}

function ClienteHome() {
  return <h1>Panel Cliente</h1>;
}

function TecnicoHome() {
  return <h1>Panel Técnico</h1>;
}

function App() {
  const { user } = useAuth();

  const isAuthenticated = !!user;
  const userRole = String(user?.role ?? "")
    .trim()
    .toUpperCase();
  console.log("Usuario en App:", user);
  console.log("Rol en App:", userRole);
  console.log("¿Autenticado?:", isAuthenticated);

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirigir la página principal al login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ================= RUTAS PROTEGIDAS ================= */}

        {/* Ruta privada - Cliente */}
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

        {/* Ruta privada - Técnico */}
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

        {/* Ruta privada - Administrador */}
        <Route
          element={
            <ProtectedRoute
              isAllowed={
                isAuthenticated && ["ADMIN", "ADMINISTRADOR"].includes(userRole)
              }
            />
          }
        >
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/admin/usuarios" element={<AdminUsers />} />
        </Route>

        {/* Ruta por defecto */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
