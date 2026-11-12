
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../context/useAuth";
import { getAvailableServiceRequests } from "../../services/serviceRequestService";

const nombresProfesiones = {
  ELECTRICISTA: "Electricidad",
  PLOMERO: "Plomería",
  GASISTA: "Gas",
  TECNICO_AC: "Refrigeración",
  CERRAJERO: "Cerrajería",
  ALBANIL: "Albañilería",
};

export default function TecnicoHome() {
  const { user, logout } = useAuth();

  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [actualizando, setActualizando] = useState(false);
  const [error, setError] = useState("");

  const nombre = user?.name || "Técnico";

  // Obtener solicitudes reales del Backend
  const fetchSolicitudes = useCallback(async () => {
    try {
      const respuesta = await getAvailableServiceRequests();

      setSolicitudes(
        Array.isArray(respuesta?.data) ? respuesta.data : []
      );

      setError("");
    } catch (err) {
      const mensaje = err.response?.data?.message;

      setError(
        typeof mensaje === "string"
          ? mensaje
          : "No se pudieron cargar las solicitudes."
      );
    } finally {
      setCargando(false);
      setActualizando(false);
    }
  }, []);

  // Carga inicial
  useEffect(() => {
    const cargarSolicitudes = async () => {
      await fetchSolicitudes();
    };

    void cargarSolicitudes();
  }, [fetchSolicitudes]);

  // Actualización manual
  const handleActualizar = async () => {
    if (cargando || actualizando) return;

    setActualizando(true);
    await fetchSolicitudes();
  };

  return (
    <div className="min-h-screen bg-[#F5F8FE]">
      {/* HEADER */}
      <header className="flex items-center justify-between gap-4 bg-[#011659] px-4 py-5 text-white sm:px-6">
        <h1 className="text-2xl font-bold">
          Urban<span className="text-[#FF5F15]">Fix</span>
        </h1>

        <button
          type="button"
          onClick={logout}
          className="rounded-lg bg-[#FF5F15] px-4 py-2 text-sm font-semibold transition hover:bg-orange-600"
        >
          Cerrar sesión
        </button>
      </header>

      {/* CONTENIDO */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <h2 className="text-2xl font-bold text-[#011659] sm:text-3xl">
          ¡Bienvenido, {nombre}!
        </h2>

        <p className="mt-2 text-gray-600">
          Gestioná las solicitudes disponibles para tu profesión.
        </p>

        {/* PANEL DE SOLICITUDES */}
        <section className="mt-8 rounded-2xl bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-[#011659]">
                Solicitudes disponibles
              </h3>

              {!cargando && !error && (
                <p className="mt-1 text-sm text-gray-500">
                  {solicitudes.length}{" "}
                  {solicitudes.length === 1
                    ? "solicitud disponible"
                    : "solicitudes disponibles"}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleActualizar}
              disabled={cargando || actualizando}
              className="rounded-lg bg-[#011659] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {cargando || actualizando
                ? "Actualizando..."
                : "Actualizar"}
            </button>
          </div>

          {/* CARGANDO */}
          {cargando && (
            <p role="status" className="mt-6 text-gray-600">
              Cargando solicitudes...
            </p>
          )}

          {/* ERROR */}
          {error && (
            <p
              role="alert"
              className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          {/* SIN SOLICITUDES */}
          {!cargando && !error && solicitudes.length === 0 && (
            <div className="mt-6 rounded-xl border border-dashed border-gray-300 p-8 text-center">
              <p className="font-semibold text-[#011659]">
                No hay solicitudes disponibles
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Volvé a consultar más tarde para encontrar nuevos trabajos.
              </p>
            </div>
          )}

          {/* LISTADO DE SOLICITUDES */}
          {!cargando && !error && solicitudes.length > 0 && (
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {solicitudes.map((solicitud) => (
                <article
                  key={solicitud.id}
                  className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5 transition hover:shadow-md"
                >
                  {/* TÍTULO Y ESTADO */}
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="min-w-0 flex-1 break-words font-bold text-[#011659] [overflow-wrap:anywhere]">
                      {solicitud.title}
                    </h4>

                    <span className="shrink-0 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                      {solicitud.status}
                    </span>
                  </div>

                  {/* DESCRIPCIÓN */}
                  <p className="mt-4 break-words text-sm leading-6 text-gray-700 [overflow-wrap:anywhere]">
                    {solicitud.description}
                  </p>

                  {/* DETALLES */}
                  <div className="mt-5 space-y-2 border-t border-gray-100 pt-4 text-sm text-gray-600">
                    <p>
                      <strong className="text-[#011659]">
                        Oficio:
                      </strong>{" "}
                      {nombresProfesiones[
                        solicitud.requiredProfession
                      ] ||
                        solicitud.requiredProfession ||
                        "No informado"}
                    </p>

                    <p className="break-words [overflow-wrap:anywhere]">
                      <strong className="text-[#011659]">
                        Dirección:
                      </strong>{" "}
                      {solicitud.address || "No informada"}
                    </p>

                    <p className="text-xs text-gray-500">
                      Fecha:{" "}
                      {solicitud.createdAt &&
                      !Number.isNaN(
                        new Date(solicitud.createdAt).getTime()
                      )
                        ? new Date(
                            solicitud.createdAt
                          ).toLocaleDateString("es-AR")
                        : "Sin fecha"}
                    </p>
                  </div>

                  {/* Próximamente: Aceptar / Rechazar */}
                  {/* Pendiente de endpoints del Backend */}
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
