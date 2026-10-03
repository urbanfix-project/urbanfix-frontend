// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";

function Register() {
  return <h1>Registro</h1>;
}

function ClienteHome() {
  return <h1>Panel Cliente</h1>;
}

function TecnicoHome() {
  return <h1>Panel Técnico</h1>;
}

function AdminHome() {
  return <h1>Panel Administrador</h1>;
}

function App() {
  const { user } = useAuth();

  const isAuthenticated = !!user;
  const userRole = user?.role;

  return (
    <BrowserRouter>
      <Routes>
        {/* ================= RUTAS PÚBLICAS ================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ================= RUTAS PROTEGIDAS ================= */}
        
        {/* Ruta privada - Cliente */}
        <Route
          element={
            <ProtectedRoute
              isAllowed={isAuthenticated && (userRole === "client" || userRole === "cliente")}
            />
          }
        >
          <Route path="/cliente" element={<ClienteHome />} />
        </Route>

        {/* Ruta privada - Técnico */}
        <Route
          element={
            <ProtectedRoute
              isAllowed={isAuthenticated && (userRole === "technician" || userRole === "tecnico")}
            />
          }
        >
          <Route path="/tecnico" element={<TecnicoHome />} />
        </Route>

        {/* Ruta privada - Administrador */}
        <Route
          element={
            <ProtectedRoute
              isAllowed={isAuthenticated && (userRole === "admin" || userRole === "administrador")}
            />
          }
        >
          <Route path="/admin" element={<AdminHome />} />
        </Route>

        {/* Ruta por defecto */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;