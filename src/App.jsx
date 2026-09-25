// src/App.jsx

import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import PrivateLayout from "./components/PrivateLayout";

function Login() {
  return <h1>Login</h1>;
}

function Register() {
  return <h1>Registro</h1>;
}

function ClienteHome() {
  return (
    <div className="p-8">
      <h1 className="text-h1 text-primary">
        Panel Cliente
      </h1>
    </div>
  );
}

function TecnicoHome() {
  return (
    <div className="p-8">
      <h1 className="text-h1 text-primary">
        Panel Técnico
      </h1>
    </div>
  );
}

function AdminHome() {
  return (
    <div className="p-8">
      <h1 className="text-h1 text-primary">
        Panel Administrador
      </h1>
    </div>
  );
}

function App() {
  // Simulación de autenticación
  const user = {
    isAuthenticated: true,
    role: "technician",
  };

  return (
    <BrowserRouter>
      <Routes>

        {/* ================= RUTAS PÚBLICAS ================= */}

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />


        {/* ================= RUTAS PRIVADAS ================= */}

        <Route
          element={
            <ProtectedRoute
              isAllowed={user.isAuthenticated}
            />
          }
        >
          {/* Layout privado con Navbar */}
          <Route element={<PrivateLayout />}>

            {/* Cliente */}
            <Route
              path="/cliente"
              element={
                user.role === "client" ? (
                  <ClienteHome />
                ) : (
                  <Login />
                )
              }
            />

            {/* Técnico */}
            <Route
              path="/tecnico"
              element={
                user.role === "technician" ? (
                  <TecnicoHome />
                ) : (
                  <Login />
                )
              }
            />

            {/* Administrador */}
            <Route
              path="/admin"
              element={
                user.role === "admin" ? (
                  <AdminHome />
                ) : (
                  <Login />
                )
              }
            />

          </Route>
        </Route>


        {/* ================= RUTA POR DEFECTO ================= */}

        <Route path="*" element={<Login />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;