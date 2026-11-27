import { useEffect } from "react";

import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

useEffect(() => {
  if (location.pathname !== "/cliente") return;

  if (location.hash === "#mis-solicitudes") {
    document
      .getElementById("mis-solicitudes")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  } else {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
}, [location.pathname, location.hash, location.key]);


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

  const role = String(user?.role ?? "")
    .trim()
    .toUpperCase();

  const isAdmin = ["ADMIN", "ADMINISTRADOR"].includes(role);
  const isCliente = ["CLIENTE", "CLIENT", "CUSTOMER"].includes(role);

  const initials = (user?.name || "Usuario")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

  // Enlaces según el rol
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
      : isCliente
        ? [
            { label: "Mi panel", to: "/cliente" },
            { label: "Mis solicitudes", to: "/cliente#mis-solicitudes" },
          ]
        : [
            { label: "Solicitudes Disponibles", to: "/tecnico" },
            { label: "Mis trabajos", to: "/tecnico/trabajos" },
          ];

  // Destino del logo según el rol
  const homePath = isPublic
    ? "/login"
    : isAdmin
      ? "/admin"
      : isCliente
        ? "/cliente"
        : "/tecnico";

  return (
    <nav className="relative z-10 w-full border-b border-slate-100 bg-white">
      <div className="mx-auto flex min-h-[60px] max-w-[1160px] items-center justify-between gap-4 px-5 sm:px-6">
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
                location.pathname + location.hash === link.to
                  ? "font-semibold text-[#011659]"
                  : "text-[#011659] hover:text-[#FF5F15]"
              }`}
            >
              {link.label}
            </Link>
          ))}

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

{!isPublic && isCliente && (
  <div className="flex items-center gap-6 border-t border-slate-100 px-5 py-3 text-xs font-semibold text-[#011659] sm:hidden">
    <Link
      to="/cliente"
      className="hover:text-orange-600"
    >
      Mi panel
    </Link>

    <Link
      to="/cliente#mis-solicitudes"
      className="hover:text-orange-600"
    >
      Mis solicitudes
    </Link>
  </div>
)}

    </nav>
  );
};

export default Navbar;
