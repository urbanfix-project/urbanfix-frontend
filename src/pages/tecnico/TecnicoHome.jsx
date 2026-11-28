import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import {
  getAvailableServiceRequests,
  acceptServiceRequest,
} from "../../services/serviceRequestService";

const nombresProfesiones = {
  ELECTRICISTA: "Electricidad",
  PLOMERO: "Plomería",
  GASISTA: "Gas",
  TECNICO_AC: "Refrigeración",
  CERRAJERO: "Cerrajería",
  ALBANIL: "Albañilería",
};

const nombreOficio = (codigo) =>
  nombresProfesiones[codigo] || codigo || "Sin oficio informado";

const formatearFecha = (fecha) => {
  if (!fecha || Number.isNaN(new Date(fecha).getTime())) {
    return "Sin fecha";
  }

  return new Date(fecha).toLocaleDateString("es-AR");
};

// La ubicación se toma de los datos reales de la solicitud.
// El backend puede informar localidad, ciudad o zona según el endpoint.
const obtenerZona = (solicitud) =>
  solicitud.locality ||
  solicitud.city ||
  solicitud.zone ||
  "Sin zona informada";

const obtenerMensajeError = (error, respaldo) => {
  const mensaje = error?.response?.data?.message;
  if (Array.isArray(mensaje)) return mensaje.join(", ");
  return typeof mensaje === "string" && mensaje.trim() ? mensaje : respaldo;
};

function IconoCheck() {
  return (
    <svg
      viewBox="0 0 48 48"
      className="h-14 w-14 text-emerald-500"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="23"
        cy="25"
        r="18"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        d="m13 24 7 7 17-18"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function TecnicoHome() {
  const navigate = useNavigate();

  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [actualizando, setActualizando] = useState(false);
  const [aceptandoId, setAceptandoId] = useState(null);
  const [error, setError] = useState("");
  const [errorAccion, setErrorAccion] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [zona, setZona] = useState("TODAS");
  const [oficio, setOficio] = useState("TODOS");
  const [seleccionada, setSeleccionada] = useState(null);
  const [trabajoAceptado, setTrabajoAceptado] = useState(false);
  const [ocultas, setOcultas] = useState([]);

  const fetchSolicitudes = useCallback(async () => {
    try {
      const respuesta = await getAvailableServiceRequests();
      setSolicitudes(Array.isArray(respuesta?.data) ? respuesta.data : []);
      setError("");
    } catch (err) {
      setSolicitudes([]);
      setError(obtenerMensajeError(err, "No se pudieron cargar las solicitudes."));
    } finally {
      setCargando(false);
      setActualizando(false);
    }
  }, []);

  useEffect(() => {
    let activo = true;

    getAvailableServiceRequests()
      .then((respuesta) => {
        if (!activo) return;
        setSolicitudes(Array.isArray(respuesta?.data) ? respuesta.data : []);
        setError("");
      })
      .catch((err) => {
        if (!activo) return;
        setSolicitudes([]);
        setError(
          obtenerMensajeError(err, "No se pudieron cargar las solicitudes.")
        );
      })
      .finally(() => {
        if (activo) {
          setCargando(false);
          setActualizando(false);
        }
      });

    return () => {
      activo = false;
    };
  }, []);

  const profesionesDisponibles = [
    ...new Set(solicitudes.map((s) => s.requiredProfession).filter(Boolean)),
  ];
  const zonasDisponibles = [
    ...new Set(
      solicitudes.map(obtenerZona).filter((valor) => valor !== "Sin zona informada")
    ),
  ];

  const solicitudesFiltradas = solicitudes.filter((solicitud) => {
    if (ocultas.includes(solicitud.id)) return false;
    if (oficio !== "TODOS" && solicitud.requiredProfession !== oficio) {
      return false;
    }
    if (zona !== "TODAS" && obtenerZona(solicitud) !== zona) {
      return false;
    }
    return true;
  });

  const handleActualizar = async () => {
    if (cargando || actualizando || aceptandoId !== null) return;
    setActualizando(true);
    setErrorAccion("");
    setMensaje("");
    await fetchSolicitudes();
  };

  const handleAceptar = async (solicitud) => {
    if (solicitud?.id == null || aceptandoId !== null) return;

    const confirmado = window.confirm(
      `¿Querés aceptar la solicitud "${solicitud.title || "Sin título"}"?`
    );
    if (!confirmado) return;

    setAceptandoId(solicitud.id);
    setErrorAccion("");
    setMensaje("");

    try {
      await acceptServiceRequest(solicitud.id);
      setSeleccionada(null);
      setTrabajoAceptado(true);
    } catch (err) {
      setErrorAccion(
        obtenerMensajeError(
          err,
          "No se pudo aceptar la solicitud. Es posible que otro técnico la haya aceptado primero."
        )
      );
    } finally {
      await fetchSolicitudes();
      setAceptandoId(null);
    }
  };

  // Esta acción es solo visual: no envía reportes al backend.
  const ocultarSolicitud = (solicitud) => {
    setOcultas((actuales) => [...new Set([...actuales, solicitud.id])]);
    setSeleccionada(null);
    setMensaje("Solicitud ocultada de esta lista (solo durante esta sesión).");
  };

  const botonAceptar = (solicitud, clases) =>
    solicitud.status === "PENDIENTE" ? (
      <button
        type="button"
        onClick={() => void handleAceptar(solicitud)}
        disabled={aceptandoId !== null}
        className={`${clases} disabled:cursor-not-allowed disabled:opacity-60`}
      >
        {aceptandoId === solicitud.id ? "Aceptando..." : "Aceptar trabajo"}
      </button>
    ) : null;

  return (
    <div className="min-h-screen bg-[#F4F7FD]">
      <Navbar />

      {seleccionada ? (
        <main className="mx-auto max-w-[1160px] px-5 py-10 sm:px-6">
          <button
            type="button"
            onClick={() => setSeleccionada(null)}
            className="mb-7 inline-flex items-center gap-2 font-semibold text-[#011659] hover:text-[#FF5F15]"
          >
            <span aria-hidden="true">←</span> Volver a Solicitudes Disponibles
          </button>

          {errorAccion && (
            <p role="alert" className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
              {errorAccion}
            </p>
          )}

          <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1.65fr)_minmax(280px,0.9fr)]">
            <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-slate-500">
                  Publicado: {formatearFecha(seleccionada.createdAt)}
                </span>
                <span className="rounded-full border border-[#011659]/40 bg-blue-50 px-3 py-1 text-xs font-medium text-[#011659]">
                  ⚒ {nombreOficio(seleccionada.requiredProfession)}
                </span>
              </div>

              <h1 className="text-xl font-semibold text-[#011659] [overflow-wrap:anywhere]">
                {seleccionada.title || "Solicitud sin título"}
              </h1>
              <h2 className="mt-5 text-sm font-semibold text-slate-800">Descripción</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600 [overflow-wrap:anywhere]">
                {seleccionada.description || "Sin descripción"}
              </p>
              <p className="mt-5 text-sm text-slate-600 [overflow-wrap:anywhere]">
                <strong>Estado:</strong> {seleccionada.status || "Sin estado"}
              </p>
              <p className="mt-3 text-sm text-slate-600 [overflow-wrap:anywhere]">
                <strong>Dirección:</strong> {seleccionada.address || "No informada"}
              </p>
              <button
                type="button"
                onClick={() => ocultarSolicitud(seleccionada)}
                className="mt-6 text-xs text-slate-500 hover:text-red-600"
              >
                Ocultar de mi lista (solo esta sesión)
              </button>
            </section>

            <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-sm font-bold text-[#011659]">Resumen del servicio</h2>
              <div className="space-y-3 text-sm text-[#011659]">
                <p className="[overflow-wrap:anywhere]">
                  <strong>Zona:</strong> {obtenerZona(seleccionada)}
                </p>
                <p className="[overflow-wrap:anywhere]">
                  <strong>Oficio:</strong> {nombreOficio(seleccionada.requiredProfession)}
                </p>
                <p>
                  <strong>Fecha:</strong> {formatearFecha(seleccionada.createdAt)}
                </p>
              </div>
              {botonAceptar(
                seleccionada,
                "mt-6 w-full rounded-full bg-[#FF5F15] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#e9500c]"
              )}
            </aside>
          </div>
        </main>
      ) : (
        <main className="mx-auto max-w-[1160px] px-5 py-10 sm:px-6">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-[#011659]">
                Solicitudes Disponibles
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Encontrá trabajos y revisá las solicitudes disponibles.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void handleActualizar()}
              disabled={cargando || actualizando || aceptandoId !== null}
              className="rounded-full bg-[#011659] px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {cargando || actualizando ? "Actualizando..." : "Actualizar"}
            </button>
          </div>

          <div className="mb-5 flex flex-wrap gap-3">
            <label>
              <span className="sr-only">Filtrar por zona</span>
              <select
                value={zona}
                onChange={(evento) => setZona(evento.target.value)}
                className="rounded-full border border-[#011659] bg-white px-4 py-2 text-sm text-[#011659]"
              >
                <option value="TODAS">Zona: Todas</option>
                {zonasDisponibles.map((opcion) => (
                  <option key={opcion} value={opcion}>{opcion}</option>
                ))}
              </select>
            </label>
            <label>
              <span className="sr-only">Filtrar por oficio</span>
              <select
                value={oficio}
                onChange={(evento) => setOficio(evento.target.value)}
                className="rounded-full border border-[#011659] bg-white px-4 py-2 text-sm text-[#011659]"
              >
                <option value="TODOS">Oficio: Todos</option>
                {profesionesDisponibles.map((profesion) => (
                  <option key={profesion} value={profesion}>
                    {nombreOficio(profesion)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {mensaje && (
            <p role="status" className="mb-5 rounded-xl bg-blue-50 p-4 text-sm text-[#011659]">
              {mensaje}
            </p>
          )}
          {errorAccion && (
            <p role="alert" className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
              {errorAccion}
            </p>
          )}
          {cargando && (
            <p role="status" className="rounded-xl bg-white p-6 text-slate-500">
              Cargando solicitudes...
            </p>
          )}
          {!cargando && error && (
            <p role="alert" className="rounded-xl bg-red-50 p-6 text-red-700">
              {error}
            </p>
          )}
          {!cargando && !error && solicitudesFiltradas.length === 0 && (
            <div className="rounded-2xl bg-white p-10 text-center text-sm text-slate-500">
              {solicitudes.length === 0
                ? "No hay solicitudes disponibles por el momento."
                : "No hay solicitudes para los filtros seleccionados."}
            </div>
          )}
          {!cargando && !error && solicitudesFiltradas.length > 0 && (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {solicitudesFiltradas.map((solicitud) => (
                <article
                  key={solicitud.id}
                  className="min-w-0 rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6"
                >
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs text-slate-500">
                      Publicado: {formatearFecha(solicitud.createdAt)}
                    </span>
                    <span className="rounded-full border border-[#011659]/40 bg-blue-50 px-3 py-1 text-xs font-medium text-[#011659]">
                      ⚒ {nombreOficio(solicitud.requiredProfession)}
                    </span>
                  </div>
                  <h2 className="font-semibold text-[#011659] [overflow-wrap:anywhere]">
                    {solicitud.title || "Solicitud sin título"}
                  </h2>
                  <p className="mt-3 line-clamp-4 whitespace-pre-wrap text-sm leading-6 text-slate-600 [overflow-wrap:anywhere]">
                    {solicitud.description || "Sin descripción"}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
                    <span>⌖ {obtenerZona(solicitud)}</span>
                    <span>Estado: {solicitud.status || "Sin estado"}</span>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSeleccionada(solicitud);
                        setErrorAccion("");
                      }}
                      className="rounded-full border border-[#011659] px-4 py-2 text-sm font-semibold text-[#011659] hover:bg-blue-50"
                    >
                      Ver detalles
                    </button>
                    {botonAceptar(
                      solicitud,
                      "rounded-full bg-[#FF5F15] px-4 py-2 text-sm font-semibold text-white hover:bg-[#e9500c]"
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      )}

      {trabajoAceptado && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-[2px]">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="aceptacion-titulo"
            className="w-full max-w-[365px] rounded-2xl bg-white px-6 py-6 text-center shadow-2xl"
          >
            <div className="mb-3 flex justify-center"><IconoCheck /></div>
            <h2 id="aceptacion-titulo" className="text-base font-bold text-slate-800">
              ¡Trabajo asignado con éxito!
            </h2>
            <p className="mt-3 text-sm leading-5 text-slate-500">
              El backend confirmó la aceptación de esta solicitud.
            </p>
            <button
              type="button"
              onClick={() => {
                setTrabajoAceptado(false);
                navigate("/tecnico/trabajos");
              }}
              className="mt-5 w-full rounded-full bg-[#071B68] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#102b88]"
            >
              Ir a Mis Trabajos
            </button>
            <button
              type="button"
              onClick={() => setTrabajoAceptado(false)}
              className="mt-3 text-sm text-slate-500 hover:text-slate-700"
            >
              Seguir viendo solicitudes
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
