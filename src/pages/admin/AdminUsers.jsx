
import { useMemo, useState } from "react";
import Navbar from "../../components/Navbar";

const users = [
  {
    id: "U-214",
    name: "Mariana Costa",
    email: "mariana@gmail.com",
    type: "Cliente",
    phone: "+593 99 111 5555",
    zone: "Quito",
    status: "Activo",
  },
  {
    id: "U-213",
    name: "Roberto Giménez",
    email: "roberto@plomero.ar",
    type: "Técnico",
    phone: "+593 99 123 5425",
    zone: "Centro",
    status: "Activo",
  },
  {
    id: "U-212",
    name: "Carlos Méndez",
    email: "carlos@electric.ar",
    type: "Técnico",
    phone: "+593 99 111 3333",
    zone: "Norte",
    status: "Activo",
  },
  {
    id: "U-211",
    name: "Juan Pérez",
    email: "juanperez@mail.com",
    type: "Cliente",
    phone: "+593 99 122 2222",
    zone: "Sur",
    status: "Suspendido",
  },
];

const AdminUsers = () => {
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [search, setSearch] = useState("");

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesFilter =
        activeFilter === "Todos" || user.type === activeFilter;

      const searchText = search.toLowerCase().trim();

      const matchesSearch = [
        user.id,
        user.name,
        user.email,
        user.type,
        user.phone,
        user.zone,
      ].some((value) => value.toLowerCase().includes(searchText));

      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, search]);

  const counts = {
    total: users.length,
    clients: users.filter((user) => user.type === "Cliente").length,
    technicians: users.filter((user) => user.type === "Técnico").length,
    active: users.filter((user) => user.status === "Activo").length,
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="mx-auto max-w-[1160px] space-y-6 px-5 py-8">
        {/* Estadísticas */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon="♙" title="Total usuarios" value={counts.total} />
          <StatCard icon="♙" title="Clientes" value={counts.clients} />
          <StatCard icon="⚙" title="Técnicos" value={counts.technicians} />
          <StatCard icon="✓" title="Cuentas activas" value={counts.active} />
        </section>

        {/* Gestión de usuarios */}
        <section className="rounded-[20px] border border-[#DCE5F2] bg-white p-5 shadow-sm">
          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <h1 className="text-base font-semibold text-[#011659]">
              Gestión de Usuarios
            </h1>

            <div className="flex flex-wrap gap-2">
              {[
                { label: "Todos", count: counts.total },
                { label: "Cliente", count: counts.clients },
                { label: "Técnico", count: counts.technicians },
              ].map((filter) => (
                <button
                  key={filter.label}
                  type="button"
                  onClick={() => setActiveFilter(filter.label)}
                  className={`rounded-full border px-4 py-1.5 text-xs transition ${
                    activeFilter === filter.label
                      ? "border-[#011659] bg-[#011659] text-white"
                      : "border-[#94A3B8] bg-white text-[#526789] hover:bg-slate-50"
                  }`}
                >
                  {filter.label === "Todos" ? "Todas" : `${filter.label}s`}
                  {" "}({filter.count})
                </button>
              ))}
            </div>
          </div>

          {/* Buscador */}
          <div className="relative mb-6 max-w-[465px]">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nombre, email o zona"
              className="h-11 w-full rounded-full border border-[#94A9D2] bg-white px-7 pr-12 text-sm text-[#011659] outline-none placeholder:text-[#94A3B8] focus:border-[#011659] focus:ring-1 focus:ring-[#011659]"
            />
            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-lg text-[#94A9D2]">
              ⌕
            </span>
          </div>

          {/* Tabla */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-xs text-[#17233D]">
              <thead className="bg-[#F5F6FA] text-[#526789]">
                <tr>
                  {[
                    "#ID",
                    "Usuario",
                    "Oficio",
                    "Teléfono",
                    "Zona",
                    "Estado",
                    "Acciones",
                  ].map((heading) => (
                    <th key={heading} className="px-4 py-3 font-medium">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-[#E8EDF5] last:border-0">
                    <td className="px-4 py-4">#{user.id}</td>

                    <td className="px-4 py-4">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-[#64748B]">{user.email}</div>
                    </td>

                    <td className="px-4 py-4">{user.type}</td>
                    <td className="px-4 py-4">{user.phone}</td>
                    <td className="px-4 py-4">{user.zone}</td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 ${
                          user.status === "Activo"
                            ? "border-emerald-600 text-emerald-700"
                            : "border-red-600 text-red-600"
                        }`}
                      >
                        {user.status === "Activo" ? "⊙ " : "⊗ "}
                        {user.status}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() =>
                          window.alert(
                            `Usuario: ${user.name}\nCorreo: ${user.email}\nEstado: ${user.status}`
                          )
                        }
                        className="whitespace-nowrap rounded-full border border-[#011659] px-4 py-1.5 font-semibold text-[#011659] transition hover:bg-[#011659] hover:text-white"
                      >
                        Ver / Moderar
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                      No se encontraron usuarios.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

const StatCard = ({ icon, title, value }) => (
  <div className="flex min-h-[120px] items-start justify-between rounded-2xl border border-[#DCE5F2] bg-white p-4 shadow-sm">
    <div>
      <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-md bg-[#F1F5F9] text-lg text-[#011659]">
        {icon}
      </div>
      <p className="text-xs text-[#526789]">{title}</p>
      <p className="mt-1 text-2xl font-bold text-[#011659]">{value}</p>
    </div>
    <span className="text-xl text-[#011659]">›</span>
  </div>
);

export default AdminUsers;
