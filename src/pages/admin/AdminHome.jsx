import { useState } from "react";

const requests = [
  {
    id: "#1042",
    client: "Marta G.",
    service: "Plomería",
    technician: "Roberto G.",
    zone: "Palermo",
    status: "Aceptado",
    date: "24/09",
  },
  {
    id: "#1041",
    client: "Lucas Gómez",
    service: "Gas",
    technician: "—",
    zone: "Almagro",
    status: "Pendiente",
    date: "23/09",
  },
  {
    id: "#1040",
    client: "Carla Rossi",
    service: "Electricidad",
    technician: "Carlos M.",
    zone: "Belgrano",
    status: "Completado",
    date: "20/09",
  },
  {
    id: "#1039",
    client: "Esteban P.",
    service: "Cerrajería",
    technician: "—",
    zone: "Recoleta",
    status: "Cancelado",
    date: "19/09",
  },
];

const statusStyles = {
  Aceptado: "bg-green-200 text-green-800 border-green-400",
  Pendiente: "bg-yellow-100 text-yellow-800 border-yellow-400",
  Completado: "bg-blue-200 text-primary border-blue-400",
  Cancelado: "bg-red-200 text-red-800 border-red-400",
};

const filters = ["Todas", "Pendiente", "Aceptado", "Completado", "Cancelado"];

const AdminHome = () => {
  const [activeFilter, setActiveFilter] = useState("Todas");
  const [search, setSearch] = useState("");

  const filteredRequests = requests.filter((request) => {
    const matchesFilter =
      activeFilter === "Todas" || request.status === activeFilter;

    const searchText = search.toLowerCase();

    const matchesSearch =
      request.client.toLowerCase().includes(searchText) ||
      request.service.toLowerCase().includes(searchText) ||
      request.zone.toLowerCase().includes(searchText);

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Contenido */}
      <div className="mx-auto max-w-[1160px] px-6 py-10">

        {/* Título */}
        <h1 className="text-h2 text-primary mb-8">
          Panel de Administración
        </h1>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-5">

          <StatCard
            title="Total solicitudes"
            value="128"
            description="+5 hoy"
          />

          <StatCard
            title="Pendientes"
            value="12"
            description="En espera de técnico"
          />

          <StatCard
            title="En curso (Aceptadas)"
            value="8"
            description="Con visita pactada"
          />

          <StatCard
            title="Completadas"
            value="22"
            description="Servicio cerrado"
          />

        </div>

        {/* Panel de solicitudes */}
        <section className="rounded-[20px] border-2 border-blueLight/40 bg-white p-5 shadow-sm">

          {/* Encabezado */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <h2 className="text-h3 text-primary">
              Monitoreo de solicitudes
            </h2>

            {/* Filtros */}
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`
                    h-[30px]
                    rounded-full
                    border
                    px-4
                    text-caption
                    transition-colors
                    ${
                      activeFilter === filter
                        ? "border-primary bg-primary text-white"
                        : "border-blueLight text-primary bg-white hover:bg-background"
                    }
                  `}
                >
                  {filter}
                  {filter === "Todas" && " (214)"}
                </button>
              ))}
            </div>
          </div>

          {/* Buscador */}
          <div className="relative mt-4 mb-4 max-w-[295px]">
            <input
              type="text"
              placeholder="Buscar por nombre, email o zona"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                h-[40px]
                w-full
                rounded-full
                border
                border-blueLight
                bg-white
                px-5
                pr-10
                text-caption
                text-primary
                outline-none
                placeholder:text-blueLight
                focus:border-primary
              "
            />

            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-blueLight">
              🔍
            </span>
          </div>

          {/* Tabla */}
          <div className="overflow-x-auto rounded-[12px] border border-blueLight/30">

            <table className="w-full min-w-[850px] text-left">

              <thead className="bg-background">
                <tr className="text-caption text-primary">
                  <th className="px-3 py-3 font-medium">#ID</th>
                  <th className="px-3 py-3 font-medium">Cliente</th>
                  <th className="px-3 py-3 font-medium">Oficio</th>
                  <th className="px-3 py-3 font-medium">Técnico</th>
                  <th className="px-3 py-3 font-medium">Zona</th>
                  <th className="px-3 py-3 font-medium">Estado</th>
                  <th className="px-3 py-3 font-medium">Fecha</th>
                  <th className="px-3 py-3"></th>
                </tr>
              </thead>

              <tbody>
                {filteredRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="border-t border-blueLight/20 text-caption text-primary"
                  >
                    <td className="px-3 py-3">
                      {request.id}
                    </td>

                    <td className="px-3 py-3">
                      {request.client}
                    </td>

                    <td className="px-3 py-3">
                      {request.service}
                    </td>

                    <td className="px-3 py-3">
                      {request.technician}
                    </td>

                    <td className="px-3 py-3">
                      {request.zone}
                    </td>

                    <td className="px-3 py-3">
                      <span
                        className={`
                          inline-flex
                          min-w-[84px]
                          justify-center
                          rounded-full
                          border
                          px-3
                          py-1
                          text-[11px]
                          font-medium
                          ${statusStyles[request.status]}
                        `}
                      >
                        {request.status}
                      </span>
                    </td>

                    <td className="px-3 py-3">
                      {request.date}
                    </td>

                    <td className="px-3 py-3">
                      <button
                        type="button"
                        className="
                          whitespace-nowrap
                          rounded-full
                          border
                          border-primary
                          px-4
                          py-1.5
                          text-[11px]
                          font-medium
                          text-primary
                          transition
                          hover:bg-primary
                          hover:text-white
                        "
                      >
                        Ver / Moderar
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredRequests.length === 0 && (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-4 py-8 text-center text-caption text-blueLight"
                    >
                      No se encontraron solicitudes.
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>

          {/* Paginación */}
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              className="h-7 w-7 rounded border border-blueLight/30 text-caption text-blueLight"
            >
              ‹
            </button>

            <button
              type="button"
              className="h-7 w-7 rounded border border-blueLight/30 text-caption text-primary"
            >
              1
            </button>

            <button
              type="button"
              className="h-7 w-7 rounded border border-blueLight/30 text-caption text-primary"
            >
              2
            </button>

            <button
              type="button"
              className="h-7 w-7 rounded border border-blueLight/30 text-caption text-blueLight"
            >
              ›
            </button>
          </div>

        </section>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, description }) => {
  return (
    <div className="
      h-[66px]
      rounded-[12px]
      border
      border-blueLight/40
      bg-white
      px-3
      py-2
      shadow-sm
    ">
      <p className="text-[9px] text-blueLight">
        {title}
      </p>

      <p className="text-[20px] font-bold leading-6 text-primary">
        {value}
      </p>

      <p className="text-[8px] text-blueLight">
        {description}
      </p>
    </div>
  );
};

export default AdminHome;