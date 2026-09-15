import { BrowserRouter, Routes, Route } from "react-router-dom";

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
  return (
    <BrowserRouter>
      <Routes>

        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas privadas - Cliente */}
        <Route path="/cliente" element={<ClienteHome />} />

        {/* Rutas privadas - Técnico */}
        <Route path="/tecnico" element={<TecnicoHome />} />

        {/* Rutas privadas - Administrador */}
        <Route path="/admin" element={<AdminHome />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;