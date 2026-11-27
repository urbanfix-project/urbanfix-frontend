import { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/Navbar";
import AdminTabs from "../../components/AdminTabs";
import api from "../../services/api";

const estados = [
  { valor: "TODAS", nombre: "Todas" },
  { valor: "PENDIENTE", nombre: "Pendiente" },
  { valor: "ACEPTADA", nombre: "Aceptada" },
  { valor: "EN_PROGRESO", nombre: "En progreso" },
  { valor: "COMPLETADA", nombre: "Completada" },
  { valor: "RECHAZADA", nombre: "Rechazada" },
  { valor: "CANCELADA", nombre: "Cancelada" },
];

const estilosEstado = {
  PENDIENTE: "bg-yellow-100 text-yellow-800",
  ACEPTADA: "bg-green-100 text-green-800",
  EN_PROGRESO: "bg-blue-100 text-blue-800",
  COMPLETADA: "bg-emerald-100 text-emerald-800",
  RECHAZADA: "bg-orange-100 text-orange-800",
  CANCELADA: "bg-red-100 text-red-800",
};

const nombresOficio = {
  ELECTRICISTA: "Electricidad",
  PLOMERO: "Plomería",
  GASISTA: "Gas",
  TECNICO_AC: "Refrigeración",
  CERRAJERO: "Cerrajería",
  ALBANIL: "Albañilería",
};

function obtenerNombre(valor) {
  if (typeof valor === "string") {
    return valor || "—";
  }

  if (!valor || typeof valor !== "object") {
    return "—";
  }

  const nombreCompleto = [
    valor.nombre || valor.name || valor.firstName,
    valor.apellido || valor.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  return valor.nombreCompleto || nombreCompleto || "—";
}

function normalizarEstado(valor) {
  const estado = String(valor || "")
    .trim()
    .toUpperCase();

  if (estado === "ACEPTADO") return "ACEPTADA";
  if (estado === "CANCELADO") return "CANCELADA";
  if (estado === "COMPLETADO") return "COMPLETADA";

  return estado || "DESCONOCIDO";
}

function mostrarEstado(estado) {
  const encontrado = estados.find(
    (item) => item.valor === estado
  );

  return encontrado ? encontrado.nombre : estado;
}

function mostrarFecha(valor) {
  if (!valor) return "—";

  const fecha = new Date(valor);

  if (Number.isNaN(fecha.getTime())) {
    return String(valor);
  }

  return fecha.toLocaleDateString("es-AR");
}

function adaptarSolicitud(item) {
  const oficio =
    item.requiredProfession ||
    item.oficio ||
    item.servicio ||
    item.service ||
    item.tipoServicio;

  const oficioNombre = obtenerNombre(oficio);

  return {
    id:
      item.id ||
      item.solicitudId ||
      item.serviceRequestId ||
      null,

    cliente: obtenerNombre(
      item.cliente ||
      item.usuarioCliente ||
      item.client ||
      item.clienteNombre ||
      item.clientName
    ),

    oficio:
      nombresOficio[oficioNombre] ||
      oficioNombre ||
      "—",

    tecnico: obtenerNombre(
      item.tecnico ||
      item.technician ||
      item.tecnicoNombre ||
      item.technicianName
    ),

    zona: obtenerNombre(
      item.zona ||
      item.barrio ||
      item.direccion ||
      item.address
    ),

    estado: normalizarEstado(
      item.estado || item.status
    ),

    fecha: mostrarFecha(
      item.fechaCreacion ||
      item.createdAt ||
      item.fecha
    ),
  };
}

function extraerSolicitudes(datos) {
  if (Array.isArray(datos)) return datos;

  if (datos && Array.isArray(datos.data)) {
    return datos.data;
  }

  if (datos && Array.isArray(datos.content)) {
    return datos.content;
  }

  if (datos && Array.isArray(datos.solicitudes)) {
    return datos.solicitudes;
  }

  if (datos && datos.data && Array.isArray(datos.data.content)) {
    return datos.data.content;
  }

  throw new Error(
    "El Backend devolvió un formato de solicitudes no reconocido."
  );
}

function StatCard({ title, value, description }) {
  return (
    <div className="rounded-xl border border-blueLight/40 bg-white p-4 shadow-sm">
      <p className="text-xs text-blueLight">{title}</p>

      <p className="mt-2 text-2xl font-bold text-primary">
        {value}
      </p>

      <p className="mt-1 text-xs text-blueLight">
        {description}
      </p>
    </div>
  );
}

export default function AdminHome() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [filtro, setFiltro] = useState("TODAS");
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [cancelandoId, setCancelandoId] = useState(null);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    let activo = true;

    async function cargarSolicitudes() {
      try {
        setCargando(true);
        setError("");

        const respuesta = await api.get(
          "/admin/service-requests"
        );

        const registros = extraerSolicitudes(
          respuesta.data
        );

        if (activo) {
          setSolicitudes(
            registros.map(adaptarSolicitud)
          );
        }
      } catch (err) {
        if (!activo) return;

        const estadoHttp =
          err.response && err.response.status;

        if (estadoHttp === 401 || estadoHttp === 403) {
          setError(
            "Necesitás una cuenta ADMIN válida para consultar las solicitudes."
          );
        } else {
          setError(
            err.message ||
            "No se pudieron cargar las solicitudes."
          );
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    }

    cargarSolicitudes();

    return () => {
      activo = false;
    };
  }, []);

  const solicitudesFiltradas = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    return solicitudes.filter((solicitud) => {
      const coincideEstado =
        filtro === "TODAS" ||
        solicitud.estado === filtro;

      const coincideBusqueda = [
        solicitud.id,
        solicitud.cliente,
        solicitud.oficio,
        solicitud.tecnico,
        solicitud.zona,
      ]
        .join(" ")
        .toLowerCase()
        .includes(texto);

      return coincideEstado && coincideBusqueda;
    });
  }, [solicitudes, filtro, busqueda]);

  const pendientes = solicitudes.filter(
    (item) => item.estado === "PENDIENTE"
  ).length;

  const enCurso = solicitudes.filter(
    (item) =>
      item.estado === "ACEPTADA" ||
      item.estado === "EN_PROGRESO"
  ).length;

  const completadas = solicitudes.filter(
    (item) => item.estado === "COMPLETADA"
  ).length;

  async function cancelarOrden(solicitud) {
    if (!solicitud.id || cancelandoId !== null) {
      return;
    }

    const confirmar = window.confirm(
      `¿Querés cancelar la solicitud #${solicitud.id}?`
    );

    if (!confirmar) return;

    const estadoAnterior = solicitud.estado;

    setError("");
    setMensaje("");
    setCancelandoId(solicitud.id);

    // Actualización optimista
    setSolicitudes((anteriores) =>
      anteriores.map((item) =>
        item.id === solicitud.id
          ? { ...item, estado: "CANCELADA" }
          : item
      )
    );

    try {
      await api.patch(
        `/admin/service-requests/${solicitud.id}/status`,
        { status: "CANCELADA" }
      );

      setMensaje(
        `La solicitud #${solicitud.id} fue cancelada.`
      );
    } catch (err) {
      // Restaurar el estado anterior si falla
      setSolicitudes((anteriores) =>
        anteriores.map((item) =>
          item.id === solicitud.id
            ? { ...item, estado: estadoAnterior }
            : item
        )
      );

      const mensajeBackend =
        err.response &&
        err.response.data &&
        err.response.data.message;

      setError(
        typeof mensajeBackend === "string"
          ? mensajeBackend
          : "No se pudo cancelar la solicitud. Se restauró su estado anterior."
      );
    } finally {
      setCancelandoId(null);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-[1160px] px-6 py-10">
        <h1 className="mb-8 text-h2 text-primary">
          Panel de Administración
        </h1>

        <AdminTabs />

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Solicitudes cargadas"
            value={solicitudes.length}
            description="Total recibido del Backend"
          />

          <StatCard
            title="Pendientes"
            value={pendientes}
            description="Esperando atención"
          />

          <StatCard
            title="En curso"
            value={enCurso}
            description="Aceptadas o en progreso"
          />

          <StatCard
            title="Completadas"
            value={completadas}
            description="Servicios finalizados"
          />
        </div>

        <section className="rounded-[20px] border-2 border-blueLight/40 bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="text-h3 text-primary">
              Monitoreo de solicitudes
            </h2>

            <div className="flex flex-wrap gap-3">
              <label
                htmlFor="filtro-estado"
                className="sr-only"
              >
                Filtrar solicitudes por estado
              </label>

              <select
                id="filtro-estado"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="rounded-lg border border-blueLight bg-white px-4 py-2 text-sm text-primary"
              >
                {estados.map((estado) => (
                  <option
                    key={estado.valor}
                    value={estado.valor}
                  >
                    {estado.nombre}
                  </option>
                ))}
              </select>

              <input
                type="search"
                value={busqueda}
                onChange={(e) =>
                  setBusqueda(e.target.value)
                }
                placeholder="Buscar solicitudes..."
                aria-label="Buscar solicitudes"
                className="rounded-lg border border-blueLight bg-white px-4 py-2 text-sm text-primary"
              />
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {mensaje && (
            <div
              role="status"
              className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-800"
            >
              {mensaje}
            </div>
          )}

          <div className="overflow-x-auto rounded-xl border border-blueLight/30">
            <table className="w-full min-w-[850px] text-left">
              <thead className="bg-background">
                <tr className="text-sm text-primary">
                  <th className="px-3 py-3">#ID</th>
                  <th className="px-3 py-3">Cliente</th>
                  <th className="px-3 py-3">Oficio</th>
                  <th className="px-3 py-3">Técnico</th>
                  <th className="px-3 py-3">Zona</th>
                  <th className="px-3 py-3">Estado</th>
                  <th className="px-3 py-3">Fecha</th>
                  <th className="px-3 py-3">Acción</th>
                </tr>
              </thead>

              <tbody>
                {cargando && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-8 text-center text-sm text-blueLight"
                    >
                      Cargando solicitudes...
                    </td>
                  </tr>
                )}

                {!cargando &&
                  solicitudesFiltradas.map((solicitud) => {
                    const estadoFinal = [
                      "CANCELADA",
                      "COMPLETADA",
                      "RECHAZADA",
                    ].includes(solicitud.estado);

                    return (
                      <tr
                        key={solicitud.id}
                        className="border-t border-blueLight/20 text-sm text-primary"
                      >
                        <td className="px-3 py-3">
                          {solicitud.id || "—"}
                        </td>

                        <td className="px-3 py-3">
                          {solicitud.cliente}
                        </td>

                        <td className="px-3 py-3">
                          {solicitud.oficio}
                        </td>

                        <td className="px-3 py-3">
                          {solicitud.tecnico}
                        </td>

                        <td className="px-3 py-3">
                          {solicitud.zona}
                        </td>

                        <td className="px-3 py-3">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                              estilosEstado[solicitud.estado] ||
                              "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {mostrarEstado(
                              solicitud.estado
                            )}
                          </span>
                        </td>

                        <td className="px-3 py-3">
                          {solicitud.fecha}
                        </td>

                        <td className="px-3 py-3">
                          <button
                            type="button"
                            disabled={
                              estadoFinal ||
                              !solicitud.id ||
                              cancelandoId !== null
                            }
                            onClick={() =>
                              cancelarOrden(solicitud)
                            }
                            className="whitespace-nowrap rounded-full border border-red-500 px-4 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {cancelandoId === solicitud.id
                              ? "Cancelando..."
                              : estadoFinal
                                ? "Sin acción"
                                : "Cancelar orden"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                {!cargando &&
                  solicitudesFiltradas.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-8 text-center text-sm text-blueLight"
                      >
                        No se encontraron solicitudes.
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-xs text-blueLight">
            Mostrando {solicitudesFiltradas.length} de{" "}
            {solicitudes.length} solicitudes cargadas.
          </p>
        </section>
      </main>
    </div>
  );
}
