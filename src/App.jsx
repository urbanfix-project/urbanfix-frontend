
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import AdminHome from "./pages/admin/AdminHome";
import AdminUsers from "./pages/admin/AdminUsers";
import Register from "./pages/Register";
import ClienteHome from "./pages/cliente/ClienteHome";
import TecnicoHome from "./pages/tecnico/TecnicoHome";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Página principal */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas protegidas para clientes */}
        <Route element={<ProtectedRoute requiredRole="CLIENTE" />}>
          <Route path="/cliente" element={<ClienteHome />} />
        </Route>

        {/* Rutas protegidas para técnicos */}
        <Route element={<ProtectedRoute requiredRole="TECNICO" />}>
          <Route path="/tecnico" element={<TecnicoHome />} />
        </Route>

        {/* Rutas protegidas para administradores */}
        <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/admin/usuarios" element={<AdminUsers />} />
        </Route>

        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
