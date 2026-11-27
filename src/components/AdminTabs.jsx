
import { NavLink } from "react-router-dom";

const pestanas = [
  { nombre: "Solicitudes", ruta: "/admin", exacta: true },
  { nombre: "Usuarios", ruta: "/admin/usuarios", exacta: false },
];

export default function AdminTabs() {
  return (
    <nav
      aria-label="Secciones de administración"
      className="mb-6 flex flex-wrap gap-3 border-b border-gray-200 pb-4"
    >
      {pestanas.map((pestana) => (
        <NavLink
          key={pestana.ruta}
          to={pestana.ruta}
          end={pestana.exacta}
          className={({ isActive }) =>
            `rounded-lg px-5 py-3 text-sm font-semibold transition ${
              isActive
                ? "bg-[#011659] text-white"
                : "bg-gray-100 text-[#011659] hover:bg-gray-200"
            }`
          }
        >
          {pestana.nombre}
        </NavLink>
      ))}
    </nav>
  );
}
