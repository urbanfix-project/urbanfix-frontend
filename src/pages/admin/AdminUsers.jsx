
import { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/Navbar";
import AdminTabs from "../../components/AdminTabs";
import api from "../../services/api";

const profesiones = {
  ELECTRICISTA: "Electricidad",
  PLOMERO: "Plomería",
  GASISTA: "Gas",
  TECNICO_AC: "Refrigeración",
  CERRAJERO: "Cerrajería",
  ALBANIL: "Albañilería",
};

// Obtener los usuarios de la respuesta del Backend
function extraerUsuarios(respuesta) {
  if (Array.isArray(respuesta)) {
    return respuesta;
  }

  if (!respuesta || typeof respuesta !== "object") {
    throw new Error("Respuesta de usuarios inválida.");
  }

  if (Array.isArray(respuesta.data)) {
    return respuesta.data;
  }

  if (Array.isArray(respuesta.users)) {
    return respuesta.users;
  }

  if (Array.isArray(respuesta.usuarios)) {
    return respuesta.usuarios;
  }

  if (Array.isArray(respuesta.content)) {
    return respuesta.content;
  }

  if (respuesta.data) {
    return extraerUsuarios(respuesta.data);
  }

  throw new Error(
    "El Backend devolvió un formato de usuarios no reconocido."
  );
}

// Traducir los roles
function normalizarRol(valor) {
  const rolOriginal =
    typeof valor === "object" && valor !== null
      ? valor.name || valor.nombre || valor.code || ""
      : valor;

  const rol = String(rolOriginal || "")
    .trim()
    .toUpperCase()
    .replace(/^ROLE_/, "");

  if (["CLIENTE", "CLIENT", "CUSTOMER"].includes(rol)) {
    return "Cliente";
  }

  if (["TECNICO", "TÉCNICO", "TECHNICIAN"].includes(rol)) {
    return "Técnico";
  }

  if (["ADMIN", "ADMINISTRADOR"].includes(rol)) {
    return "Administrador";
  }

  return rolOriginal || "Sin especificar";
}

// Traducir las profesiones
function normalizarProfesion(valor) {
  if (!valor) {
    return "—";
  }

  const profesion = String(valor).trim().toUpperCase();

  return profesiones[profesion] || String(valor);
}

// Adaptar los datos del Backend
function adaptarUsuario(usuario) {
  const nombreCompleto = [
    usuario.nombre || usuario.firstName,
    usuario.apellido || usuario.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  const nombre =
    usuario.name ||
    usuario.fullName ||
    usuario.nombreCompleto ||
    nombreCompleto ||
    "Sin nombre";

  const email =
    usuario.email ||
    usuario.correo ||
    "Sin correo";

  const id =
    usuario.id ||
    usuario.userId ||
    usuario.uuid ||
    email;

  return {
    id: String(id),
    name: nombre,
    email,
    type: normalizarRol(
      usuario.role || usuario.rol || usuario.roleName
    ),
    phone:
      usuario.telefono ||
      usuario.phone ||
      usuario.phoneNumber ||
      usuario.celular ||
      "—",
    zone:
      usuario.zona ||
      usuario.zone ||
      usuario.localidad ||
      usuario.city ||
      "—",
    profession: normalizarProfesion(
      usuario.profession || usuario.profesion
    ),
  };
}

// Tarjetas de estadísticas
function StatCard({ icon, title, value }) {
  return (
    <div className="flex min-h-[120px] items-start justify-between rounded-2xl border border-[#DCE5F2] bg-white p-4 shadow-sm">
      <div>
        <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-md bg-[#F1F5F9] text-lg">
          {icon}
        </div>

        <p className="text-xs text-[#526789]">
          {title}
        </p>

        <p className="mt-1 text-2xl font-bold text-[#011659]">
          {value}
        </p>
      </div>

      <span
        aria-hidden="true"
        className="text-xl text-[#011659]"
      >
        ›
      </span>
    </div>
  );
}

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Cargar los usuarios reales
  useEffect(() => {
    let activo = true;

    async function cargarUsuarios() {
      try {
        setLoading(true);
        setError("");

        const respuesta = await api.get("/admin/users");

        const registros = extraerUsuarios(respuesta.data);

        if (activo) {
          setUsers(registros.map(adaptarUsuario));
        }
      } catch (err) {
        if (!activo) {
          return;
        }

        const codigo =
          err.response && err.response.status;

        if (codigo === 401 || codigo === 403) {
          setError(
            "No tenés permisos para consultar los usuarios. Verificá tu sesión ADMIN."
          );
        } else {
          setError(
            err.message ||
              "No se pudieron cargar los usuarios."
          );
        }
      } finally {
        if (activo) {
          setLoading(false);
        }
      }
    }

    cargarUsuarios();

    return () => {
      activo = false;
    };
  }, []);

  // Estadísticas
  const counts = useMemo(
    () => ({
      total: users.length,
      clients: users.filter(
        (user) => user.type === "Cliente"
      ).length,
      technicians: users.filter(
        (user) => user.type === "Técnico"
      ).length,
      admins: users.filter(
        (user) => user.type === "Administrador"
      ).length,
    }),
    [users]
  );

  const filters = [
    {
      label: "Todos",
      text: "Todos",
      count: counts.total,
    },
    {
      label: "Cliente",
      text: "Clientes",
      count: counts.clients,
    },
    {
      label: "Técnico",
      text: "Técnicos",
      count: counts.technicians,
    },
    {
      label: "Administrador",
      text: "Administradores",
      count: counts.admins,
    },
  ];

  // Filtrar por rol y búsqueda
  const filteredUsers = useMemo(() => {
    const texto = search.toLowerCase().trim();

    return users.filter((user) => {
      const coincideRol =
        activeFilter === "Todos" ||
        user.type === activeFilter;

      const coincideBusqueda = [
        user.id,
        user.name,
        user.email,
        user.type,
        user.phone,
        user.zone,
        user.profession,
      ].some((valor) =>
        String(valor).toLowerCase().includes(texto)
      );

      return coincideRol && coincideBusqueda;
    });
  }, [users, activeFilter, search]);

  // Mostrar detalles sin modificar usuarios
  function verDetalles(user) {
    window.alert(
      `Usuario: ${user.name}
Correo: ${user.email}
Rol: ${user.type}
Profesión: ${user.profession}
Teléfono: ${user.phone}
Zona: ${user.zone}`
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="mx-auto max-w-[1160px] space-y-6 px-5 py-8">
        <h1 className="text-2xl font-bold text-[#011659]">
          Panel de Administración
        </h1>

        <AdminTabs />

        {/* Estadísticas */}
        <section
          aria-label="Estadísticas de usuarios"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <StatCard
            icon="👥"
            title="Usuarios cargados"
            value={counts.total}
          />

          <StatCard
            icon="👤"
            title="Clientes"
            value={counts.clients}
          />

          <StatCard
            icon="🛠️"
            title="Técnicos"
            value={counts.technicians}
          />

          <StatCard
            icon="🛡️"
            title="Administradores"
            value={counts.admins}
          />
        </section>

        {/* Gestión de usuarios */}
        <section className="rounded-[20px] border border-[#DCE5F2] bg-white p-5 shadow-sm">
          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <h2 className="text-lg font-semibold text-[#011659]">
              Gestión de Usuarios
            </h2>

            {/* Filtros */}
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.label}
                  type="button"
                  onClick={() =>
                    setActiveFilter(filter.label)
                  }
                  aria-pressed={
                    activeFilter === filter.label
                  }
                  className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                    activeFilter === filter.label
                      ? "border-[#011659] bg-[#011659] text-white"
                      : "border-[#94A3B8] bg-white text-[#526789] hover:bg-slate-50"
                  }`}
                >
                  {filter.text} ({filter.count})
                </button>
              ))}
            </div>
          </div>

          {/* Buscador */}
          <div className="relative mb-6 max-w-[465px]">
            <label
              htmlFor="buscar-usuarios"
              className="sr-only"
            >
              Buscar usuarios
            </label>

            <input
              id="buscar-usuarios"
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Buscar por nombre, email o profesión"
              className="h-11 w-full rounded-full border border-[#94A9D2] bg-white px-7 pr-12 text-sm text-[#011659] outline-none placeholder:text-[#94A3B8] focus:border-[#011659]"
            />

            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-lg text-[#94A3B8]"
            >
              🔍
            </span>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {/* Tabla */}
          <div className="overflow-x-auto rounded-xl border border-[#E8EDF5]">
            <table className="w-full min-w-[850px] text-left text-xs text-[#17233D]">
              <thead className="bg-[#F5F6FA] text-[#526789]">
                <tr>
                  {[
                    "#ID",
                    "Usuario",
                    "Tipo",
                    "Teléfono",
                    "Zona",
                    "Profesión",
                    "Acciones",
                  ].map((heading) => (
                    <th
                      key={heading}
                      scope="col"
                      className="px-4 py-3 font-medium"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {loading && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-8 text-center text-slate-500"
                    >
                      Cargando usuarios...
                    </td>
                  </tr>
                )}

                {!loading &&
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-[#E8EDF5] last:border-0"
                    >
                      <td
                        className="px-4 py-4"
                        title={user.id}
                      >
                        {user.id.length > 12
                          ? `${user.id.slice(0, 8)}...`
                          : user.id}
                      </td>

                      <td className="px-4 py-4">
                        <div className="font-medium">
                          {user.name}
                        </div>

                        <div className="break-all text-[#64748B]">
                          {user.email}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        {user.type}
                      </td>

                      <td className="px-4 py-4">
                        {user.phone}
                      </td>

                      <td className="px-4 py-4">
                        {user.zone}
                      </td>

                      <td className="px-4 py-4">
                        {user.profession}
                      </td>

                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() =>
                            verDetalles(user)
                          }
                          className="whitespace-nowrap rounded-full border border-[#011659] px-4 py-2 font-semibold text-[#011659] transition hover:bg-[#011659] hover:text-white"
                        >
                          Ver detalles
                        </button>
                      </td>
                    </tr>
                  ))}

                {!loading &&
                  filteredUsers.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-8 text-center text-slate-500"
                      >
                        {error
                          ? "No se pudieron obtener los usuarios."
                          : "No se encontraron usuarios."}
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-xs text-[#64748B]">
            Usuarios mostrados: {filteredUsers.length}
          </p>
        </section>
      </main>
    </div>
  );
}
