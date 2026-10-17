
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const publicRoutes = [
    "/",
    "/login",
    "/register",
    "/oficios",
    "/como-funciona",
    "/nosotros",
    "/faq",
    "/soporte",
  ];

  const isPublic = publicRoutes.includes(location.pathname);
  const role = String(user?.role ?? "").trim().toUpperCase();

  const isAdmin = ["ADMIN", "ADMINISTRADOR"].includes(role);
  const isClient = ["CLIENT", "CLIENTE", "CUSTOMER"].includes(role);
  const isTechnician = ["TECHNICIAN", "TECNICO", "TÉCNICO"].includes(role);

  const initials = (user?.name || "Usuario")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

  const links = isPublic
    ? [
        { label: "Oficios", to: "/oficios" },
        { label: "¿Cómo funciona?", to: "/como-funciona" },
        { label: "Nosotros", to: "/nosotros" },
        { label: "FAQ", to: "/faq" },
        { label: "Soporte", to: "/soporte" },
      ]
    : isAdmin
      ? [
          { label: "Gestión usuarios", to: "/admin/usuarios" },
          { label: "Monitoreo de solicitudes", to: "/admin" },
        ]
      : isClient
        ? [
            { label: "Mis solicitudes", to: "/cliente" },
            { label: "Soporte", to: "/soporte" },
          ]
        : isTechnician
          ? [
              { label: "Solicitudes Disponibles", to: "/tecnico" },
              { label: "Mis trabajos", to: "/tecnico/trabajos" },
            ]
          : [];

  const homePath = isPublic
    ? "/login"
    : isAdmin
      ? "/admin"
      : isClient
        ? "/cliente"
        : "/tecnico";

  return (
    <nav className="relative z-10 h-[60px] w-full border-b border-slate-100 bg-white">
      <div className="mx-auto flex h-full max-w-[1160px] items-center justify-between gap-4 px-5 sm:px-6">
        <Link
          to={homePath}
          className="shrink-0 text-[22px] font-extrabold tracking-tight"
        >
          <span className="text-[#011659]">Urban</span>
          <span className="text-[#FF5F15]">Fix</span>
        </Link>

        <div className="flex h-full items-center gap-3 sm:gap-5">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`hidden whitespace-nowrap text-[11px] font-medium transition-colors sm:block ${
                location.pathname === link.to
                  ? "border-b-2 border-[#011659] font-semibold text-[#011659]"
                  : "text-[#011659] hover:text-[#FF5F15]"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {isClient && !isPublic && (
            <button
              type="button"
              onClick={() => navigate("/cliente/nueva-solicitud")}
              className="rounded-full bg-[#FF6422] px-4 py-2 text-[10px] font-semibold text-white transition hover:bg-[#e9500c]"
            >
              + Nueva solicitud
            </button>
          )}

          {isPublic ? (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-full border border-[#011659] px-4 py-2 text-[10px] font-semibold text-[#011659] transition hover:bg-slate-50 sm:px-5"
              >
                Iniciar Sesión
              </Link>

              <Link
                to="/register"
                className="rounded-full bg-[#FF5F15] px-4 py-2 text-[10px] font-semibold text-white transition hover:bg-[#e9500c] sm:px-6"
              >
                Regístrate
              </Link>
            </div>
          ) : (
            <button
              type="button"
              title={`${user?.name || "Usuario"} - Cerrar sesión`}
              onClick={logout}
              className="ml-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#A31970] text-[10px] font-semibold text-white"
            >
              {initials || "U"}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
