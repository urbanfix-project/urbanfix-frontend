import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const role = String(user?.role ?? "").trim().toUpperCase();
  const isAdmin = ["ADMIN", "ADMINISTRADOR"].includes(role);

  const initials = (user?.name || "Usuario")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

  const links = isAdmin
    ? [
        { label: "Gestión usuarios", to: "/admin/usuarios" },
        { label: "Monitoreo de solicitudes", to: "/admin" },
      ]
    : [
        { label: "Solicitudes Disponibles", to: "/tecnico" },
        { label: "Mis trabajos", to: "/tecnico/trabajos" },
      ];

  return (
    <nav className="w-full h-14 bg-white border-b border-slate-200">
      <div className="mx-auto max-w-[1160px] h-full px-6 flex items-center justify-between">
        {/* Logo */}
        <Link
          to={isAdmin ? "/admin" : "/tecnico"}
          className="text-[22px] font-extrabold tracking-tight"
        >
          <span className="text-[#011659]">Urban</span>
          <span className="text-[#FF5F15]">Fix</span>
        </Link>

        {/* Navegación */}
        <div className="flex items-center h-full gap-5">
          {links.map((link) => {
            const active = location.pathname === link.to;

            return (
              <Link
                key={link.to}
                to={link.to}
                className={`text-[11px] font-medium whitespace-nowrap transition-colors ${
                  active
                    ? "text-[#011659] font-semibold"
                    : "text-[#011659] hover:text-[#FF5F15]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Avatar */}
          <button
            type="button"
            title={`${user?.name || "Usuario"} - Cerrar sesión`}
            onClick={logout}
            className="ml-1 w-8 h-8 shrink-0 rounded-full bg-[#A31970] flex items-center justify-center text-[10px] font-semibold text-white"
          >
            {initials || "U"}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;