import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginRequest } from '../services/authService';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Estado para saber si el usuario intentó enviar el formulario
  const [submitted, setSubmitted] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Validaciones locales para campos vacíos
  const emailError = submitted && !email.trim();
  const passwordError = submitted && !password.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setError('');

    // Si algún campo está vacío, detenemos la ejecución para mostrar los bordes rojos locales
    if (!email.trim() || !password.trim()) {
      return;
    }

    setLoading(true);

    try {
      const data = await loginRequest({ email, password });
      login(data.user, data.token);

      const role = data.user?.role;
      if (role === 'admin' || role === 'administrador') {
        navigate('/admin');
      } else if (role === 'technician' || role === 'tecnico') {
        navigate('/tecnico');
      } else {
        navigate('/cliente');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Credenciales inválidas'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F1F5F9] px-4 py-8">
      {/* Tarjeta blanca flotante */}
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-[#E2E8F0] flex flex-col items-center">
        
        {/* Brand / Logo UrbanFix */}
        <div className="text-3xl font-extrabold mb-6 tracking-tight">
          <span className="text-[#011659]">Urban</span>
          <span className="text-[#FF5F15]">Fix</span>
        </div>

        <h2 className="text-2xl font-bold text-[#0F172A] mb-6 self-start">
          Inicia Sesión
        </h2>

        {/* Le sacamos el attribute "required" HTML para dejar que React controle el estado de error */}
        <form onSubmit={handleSubmit} noValidate className="w-full space-y-4">
          {/* Campo Email */}
          <div>
            <label className="block text-xs font-semibold text-[#64748B] mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="mimail@gmail.com"
              className={`w-full px-4 py-2.5 bg-white border rounded-2xl text-[#0F172A] placeholder-[#94A3B8] text-sm focus:outline-none transition duration-200 ${
                emailError || error
                  ? 'border-[#DB3B2E] text-[#DB3B2E] focus:border-[#DB3B2E]'
                  : 'border-[#E2E8F0] focus:border-[#011659]'
              }`}
            />
            {emailError && (
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-[#DB3B2E]">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>El correo electrónico es obligatorio</span>
              </div>
            )}
          </div>

          {/* Campo Contraseña */}
          <div>
            <label className="block text-xs font-semibold text-[#64748B] mb-1">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className={`w-full px-4 py-2.5 bg-white border rounded-2xl text-[#0F172A] placeholder-[#94A3B8] text-sm focus:outline-none transition duration-200 pr-10 ${
                  passwordError || error
                    ? 'border-[#DB3B2E] text-[#DB3B2E] focus:border-[#DB3B2E]'
                    : 'border-[#E2E8F0] focus:border-[#011659]'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-7 0-10-7-10-7a19.08 19.08 0 014.125-5.175m2.417-1.428A9.973 9.973 0 0112 5c7 0 10 7 10 7a18.98 18.98 0 01-2.28 3.5m-2.2 2.2a3 3 0 11-4.243-4.243" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>

            {passwordError && (
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-[#DB3B2E]">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>La contraseña es obligatoria</span>
              </div>
            )}

            {/* Error global del backend */}
            {error && !passwordError && (
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-[#DB3B2E]">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Recordarme y Olvidaste tu contraseña */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-[#64748B]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-gray-300 text-[#011659] focus:ring-[#011659]"
              />
              <span>Recordarme</span>
            </label>
            <a href="#" className="text-[#3B82F6] hover:underline font-medium">
              ¿Olvidaste tú contraseña?
            </a>
          </div>

          {/* Botón Iniciar Sesión */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#011659] hover:bg-[#011040] text-white font-semibold py-3 px-6 rounded-full transition duration-200 disabled:opacity-60 flex justify-center items-center gap-2 shadow-md cursor-pointer text-sm mt-4"
          >
            {loading ? (
              <>
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                <span>Ingresando...</span>
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}