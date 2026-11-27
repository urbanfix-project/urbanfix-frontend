import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";

// Datos demostrativos para la presentación.
// No están conectados al backend.
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
  Completado: "bg-blue-200 text-blue-800 border-blue-400",
  Cancelado: "bg-red-200 text-red-800 border-red-400",
};

const filters = [
  "Todas",
  "Pendiente",
  "Aceptado",
  "Completado",
  "Cancelado",
];

const ITEMS_PER_PAGE = 3;

// Tarjeta de estadísticas
const StatCard = ({ title, value, description }) => {
  return (
    <div className="min-h-[90px] rounded-xl border border-blueLight/40 bg-white px-4 py-3 shadow-sm">
      <p className="text-xs text-blueLight">{title}</p>

      <p className="mt-1 text-2xl font-bold text-primary">
        {value}
      </p>

      <p className="mt-1 text-xs text-blueLight">
        {description}
      </p>
    </div>
  );
};

// Ventana de detalles
const SolicitudModal = ({ solicitud, onClose }) => {
  useEffect(() => {
    if (!solicitud) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [solicitud, onClose]);

  if (!solicitud) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2
            id="modal-title"
            className="text-xl font-bold text-[#011659]"
          >
            Detalles de la solicitud
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ventana"
            className="text-2xl text-gray-500 transition hover:text-red-500"
          >
            ×
          </button>
        </div>

        <div className="space-y-4 text-sm text-gray-700">
          <div className="flex justify-between gap-4 border-b pb-2">
            <span className="font-semibold">ID</span>
            <span>{solicitud.id}</span>
          </div>

          <div className="flex justify-between gap-4 border-b pb-2">
            <span className="font-semibold">Cliente</span>
            <span>{solicitud.client}</span>
          </div>

          <div className="flex justify-between gap-4 border-b pb-2">
            <span className="font-semibold">Oficio</span>
            <span>{solicitud.service}</span>
          </div>

          <div className="flex justify-between gap-4 border-b pb-2">
            <span className="font-semibold">Técnico</span>
            <span>{solicitud.technician}</span>
          </div>

          <div className="flex justify-between gap-4 border-b pb-2">
            <span className="font-semibold">Zona</span>
            <span>{solicitud.zone}</span>
          </div>

          <div className="flex justify-between gap-4 border-b pb-2">
            <span className="font-semibold">Estado</span>

            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                statusStyles[solicitud.status] || ""
              }`}
            >
              {solicitud.status}
            </span>
          </div>

          <div className="flex justify-between gap-4 border-b pb-2">
            <span className="font-semibold">Fecha</span>
            <span>{solicitud.date}</span>
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="text-xs text-blue-800">
            Esta es una vista demostrativa de UrbanFix.
            La moderación de solicitudes todavía no está
            conectada al backend.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-full bg-[#011659] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#FF5F15]"
        >
          Cerrar
        </button>
      </section>
    </div>
  );
};

// Panel principal
const AdminHome = () => {
  const [activeFilter, setActiveFilter] = useState("Todas");
  const [search, setSearch] = useState("");
  const [solicitudSeleccionada, setSolicitudSeleccionada] =
    useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Estadísticas de los datos demostrativos
  const totalSolicitudes = requests.length;

  const pendientes = requests.filter(
    (request) => request.status === "Pendiente"
  ).length;

  const aceptadas = requests.filter(
    (request) => request.status === "Aceptado"
  ).length;

  const completadas = requests.filter(
    (request) => request.status === "Completado"
  ).length;

  // Filtrado y búsqueda
  const filteredRequests = requests.filter((request) => {
    const matchesFilter =
      activeFilter === "Todas" ||
      request.status === activeFilter;

    const searchText = search.trim().toLowerCase();

    const matchesSearch =
      request.client.toLowerCase().includes(searchText) ||
      request.service.toLowerCase().includes(searchText) ||
      request.zone.toLowerCase().includes(searchText) ||
      request.id.toLowerCase().includes(searchText) ||
      request.technician.toLowerCase().includes(searchText);

    return matchesFilter && matchesSearch;
  });

  // Paginación
  const totalPages = Math.max(
    1,
    Math.ceil(filteredRequests.length / ITEMS_PER_PAGE)
  );

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedRequests = filteredRequests.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const cambiarFiltro = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const cambiarBusqueda = (event) => {
    setSearch(event.target.value);
    setCurrentPage(1);
  };

  const cerrarModal = () => {
    setSolicitudSeleccionada(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-[1160px] px-6 py-10">
        {/* Título */}
        <h1 className="mb-8 text-h2 text-primary">
          Panel de Administración
        </h1>

        {/* Estadísticas */}
        <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total solicitudes"
            value={totalSolicitudes}
            description="Solicitudes registradas en la demo"
          />

          <StatCard
            title="Pendientes"
            value={pendientes}
            description="En espera de técnico"
          />

          <StatCard
            title="En curso (Aceptadas)"
            value={aceptadas}
            description="Solicitudes aceptadas"
          />

          <StatCard
            title="Completadas"
            value={completadas}
            description="Servicios finalizados"
          />
        </div>

        {/* Panel de solicitudes */}
        <section className="rounded-[20px] border-2 border-blueLight/40 bg-white p-5 shadow-sm">
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
                  onClick={() => cambiarFiltro(filter)}
                  aria-pressed={activeFilter === filter}
                  className={`
                    min-h-[32px]
                    rounded-full
                    border
                    px-4
                    text-caption
                    transition-colors
                    ${
                      activeFilter === filter
                        ? "border-primary bg-primary text-white"
                        : "border-blueLight bg-white text-primary hover:bg-background"
                    }
                  `}
                >
                  {filter}
                  {filter === "Todas" &&
                    ` (${totalSolicitudes})`}
                </button>
              ))}
            </div>
          </div>

          {/* Buscador */}
          <div className="relative mb-4 mt-4 max-w-[350px]">
            <input
              type="search"
              placeholder="Buscar por cliente, oficio o zona"
              aria-label="Buscar solicitudes"
              value={search}
              onChange={cambiarBusqueda}
              className="h-10 w-full rounded-full border border-blueLight bg-white px-5 pr-10 text-caption text-primary outline-none placeholder:text-blueLight focus:border-primary"
            />

            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-blueLight"
            >
              🔍
            </span>
          </div>

          {/* Tabla */}
          <div className="overflow-x-auto rounded-xl border border-blueLight/30">
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
                  <th className="px-3 py-3 font-medium">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {paginatedRequests.map((request) => (
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
                          ${
                            statusStyles[request.status] ||
                            ""
                          }
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
                        onClick={() =>
                          setSolicitudSeleccionada(request)
                        }
                        className="whitespace-nowrap rounded-full border border-primary px-4 py-1.5 text-[11px] font-medium text-primary transition hover:bg-primary hover:text-white"
                      >
                        Ver / Moderar
                      </button>
                    </td>
                  </tr>
                ))}

                {paginatedRequests.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
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
          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-xs text-gray-500">
              Mostrando {paginatedRequests.length} de{" "}
              {filteredRequests.length} solicitudes
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((page) => page - 1)
                }
                aria-label="Página anterior"
                className="h-8 w-8 rounded border border-blueLight/30 text-primary disabled:cursor-not-allowed disabled:opacity-40"
              >
                ‹
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  aria-label={`Página ${page}`}
                  aria-current={
                    currentPage === page ? "page" : undefined
                  }
                  className={`h-8 w-8 rounded border text-caption ${
                    currentPage === page
                      ? "border-primary bg-primary text-white"
                      : "border-blueLight/30 text-primary"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((page) => page + 1)
                }
                aria-label="Página siguiente"
                className="h-8 w-8 rounded border border-blueLight/30 text-primary disabled:cursor-not-allowed disabled:opacity-40"
              >
                ›
              </button>
            </div>
          </div>
        </section>

        {/* Aviso de demostración */}
        <p className="mt-5 text-center text-xs text-gray-500">
          Panel demostrativo de UrbanFix. Los datos mostrados
          son ilustrativos.
        </p>
      </main>

      {/* Ventana de detalles */}
      <SolicitudModal
        solicitud={solicitudSeleccionada}
        onClose={cerrarModal}
      />
    </div>
  );
};

export default AdminHome;