
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { loginRequest } from "../services/authService";
import Navbar from "../components/Navbar";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const emailError = submitted && !email.trim();
  const passwordError = submitted && !password.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setError("");

    if (!email.trim() || !password.trim()) {
      return;
    }

    setLoading(true);

    try {
      const response = await loginRequest({
        email: email.trim(),
        password,
      });

      const { user, token } = response.data;

      if (!user || !token) {
        setError("La respuesta del servidor no contiene el usuario o token.");
        return;
      }

      const role = String(user.role ?? "").trim().toUpperCase();

      login(user, token);

      if (["ADMIN", "ADMINISTRADOR"].includes(role)) {
        navigate("/admin");
      } else if (
        ["TECNICO", "TÉCNICO", "TECHNICIAN"].includes(role)
      ) {
        navigate("/tecnico");
      } else if (
        ["CLIENTE", "CLIENT", "CUSTOMER"].includes(role)
      ) {
        navigate("/cliente");
      } else {
        setError(
          `El backend devolvió un rol no reconocido: "${role || "vacío"}".`
        );
      }
    } catch (err) {
      console.error(
        "Error al iniciar sesión:",
        err.response?.data || err
      );

      setError(
        err.response?.data?.message || "Credenciales inválidas"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8FE]">
      {/* Navbar existente */}
      <Navbar />

      {/* Contenido principal */}
      <main className="mx-auto grid min-h-[calc(100vh-56px)] w-full max-w-[1200px] grid-cols-1 items-center gap-8 px-5 py-8 lg:grid-cols-2 lg:gap-16 lg:px-8">

        {/* Espacio reservado para la ilustración */}
      <img
        src="src/img/ilustracion-urbanfix.png"
        alt="Profesional de UrbanFix"
        className="h-[420px] w-full max-w-[460px] object-contain"
      />

        {/* Tarjeta de inicio de sesión */}
        <section className="mx-auto w-full max-w-[440px] rounded-[22px] bg-white px-8 py-10 sm:px-9 sm:py-12">

          {/* Logo */}
          <div className="mb-9 text-[25px] font-extrabold tracking-tight">
            <span className="text-[#011659]">Urban</span>
            <span className="text-[#FF5F15]">Fix</span>
          </div>

          <h1 className="mb-5 text-base font-semibold text-[#011659]">
            Inicia Sesión
          </h1>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="w-full space-y-4"
          >
            {/* Correo electrónico */}
            <div>
              <label className="mb-1 block px-4 text-[10px] font-medium text-[#011659]">
                Correo electrónico
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mimail@gmail.com"
                className={`h-9 w-full rounded-full border bg-white px-6 text-xs text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] ${
                  emailError || error
                    ? "border-[#DB3B2E] focus:border-[#DB3B2E]"
                    : "border-[#94A9D2] focus:border-[#011659]"
                }`}
              />

              {emailError && (
                <p className="mt-1.5 px-4 text-xs text-[#DB3B2E]">
                  El correo electrónico es obligatorio
                </p>
              )}
            </div>

            {/* Contraseña */}
            <div>
              <label className="mb-1 block px-4 text-[10px] font-medium text-[#011659]">
                Contraseña
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  className={`h-9 w-full rounded-full border bg-white px-6 pr-12 text-xs text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] ${
                    passwordError || error
                      ? "border-[#DB3B2E] focus:border-[#DB3B2E]"
                      : "border-[#94A9D2] focus:border-[#011659]"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#011659]"
                >
                  {showPassword ? (
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-7 0-10-7-10-7a19.08 19.08 0 014.125-5.175m2.417-1.428A9.973 9.973 0 0112 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-0.65 0-1.3-.063-1.95-.19"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 3l18 18"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {passwordError && (
                <p className="mt-1.5 px-4 text-xs text-[#DB3B2E]">
                  La contraseña es obligatoria
                </p>
              )}

              {error && !passwordError && (
                <p className="mt-1.5 px-4 text-xs text-[#DB3B2E]">
                  {error}
                </p>
              )}
            </div>

            {/* Recordarme y recuperar contraseña */}
            <div className="flex items-center justify-between gap-2 pt-1 text-[10px]">
              <label className="flex cursor-pointer items-center gap-2 text-[#011659]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 cursor-pointer accent-[#3B82F6]"
                />
                <span>Recordarme</span>
              </label>

              <button
                type="button"
                onClick={() => navigate("/recuperar-contrasena")}
                className="whitespace-nowrap text-[#011659] hover:text-[#FF5F15]"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Botón de inicio de sesión */}
            <button
              type="submit"
              disabled={loading}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-[#06195F] px-6 py-3 text-xs font-semibold text-white shadow-sm transition hover:bg-[#011040] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Ingresando...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </button>
          </form>

          {/* Separador */}
          <div className="my-6 border-t border-[#EEF0F4]" />

          {/* Acceso visual con Google */}
          <button
            type="button"
            disabled
            title="Inicio de sesión con Google aún no configurado"
            className="flex w-full items-center justify-center gap-2 rounded-md bg-[#F0F0F0] py-2.5 text-[10px] text-[#475569]"
          >
            <span className="text-base font-bold text-[#4285F4]">
              G
            </span>
            Or sign in with Google
          </button>

          {/* Registro */}
          <p className="mt-5 text-center text-[10px] text-[#011659]">
            No estás registrado?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="ml-1 font-medium text-[#FF5F15] hover:underline"
            >
              Regístrate
            </button>
          </p>
        </section>
      </main>
    </div>
  );
}
