// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";

function Login() {
  return <h1>Login</h1>;
}

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
  // 💡 SIMULACIÓN DE AUTENTICACIÓN
  // Más adelante podés reemplazar esto por tu AuthContext, Redux o localStorage
  const user = {
    isAuthenticated: true,
    role: "client" // Opciones: "client", "technician", "admin"
  };

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
              isAllowed={user.isAuthenticated && user.role === "client"}
            />
          }
        >
          <Route path="/cliente" element={<ClienteHome />} />
        </Route>

        {/* Ruta privada - Técnico */}
        <Route
          element={
            <ProtectedRoute
              isAllowed={user.isAuthenticated && user.role === "technician"}
            />
          }
        >
          <Route path="/tecnico" element={<TecnicoHome />} />
        </Route>

        {/* Ruta privada - Administrador */}
        <Route
          element={
            <ProtectedRoute
              isAllowed={user.isAuthenticated && user.role === "admin"}
            />
          }
        >
          <Route path="/admin" element={<AdminHome />} />
        </Route>

        {/* Ruta por defecto para URLs inexistentes */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;