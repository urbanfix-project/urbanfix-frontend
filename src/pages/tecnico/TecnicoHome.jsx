
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

const solicitudesIniciales = [
  {
    id: 1,
    titulo: "Cambio de combinación cerradura de entrada",
    detalleTitulo: "Pérdida de agua en cocina",
    descripcion:
      "Pérdida importante en el flexible de agua fría bajo la bacha. Tuve que cerrar la llave de paso porque filtra directo hacia el piso. Se requiere cambio del flexible y revisión de las conexiones de desagüe de la pileta.",
    oficio: "Plomería",
    zona: "CABA",
    ubicacion: "Caballito, CABA",
    horario: "Tarde (15:00 a 18:00)",
    pago: "A convenir en la visita",
    imagen:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
    imagenes: [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=500&q=80",
      "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=500&q=80",
    ],
  },
  {
    id: 2,
    titulo: "Cambio de grifería y flexible en bidet",
    descripcion:
      "Pierde agua continuamente por la base de la canilla y la rosca del flexible gotea hacia el piso. Necesito reemplazo de los flexibles y ajuste completo de la grifería.",
    oficio: "Plomería",
    zona: "CABA",
    ubicacion: "Palermo, CABA",
    horario: "Mañana (9:00 a 13:00)",
    pago: "A convenir en la visita",
    imagen:
      "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=800&q=80",
    imagenes: [
      "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=500&q=80",
      "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=500&q=80",
    ],
  },
  {
    id: 3,
    titulo: "Cortocircuito y salto de térmica principal",
    descripcion:
      "La instalación presenta fallas eléctricas y se dispara la térmica principal. Se necesita revisar las conexiones y detectar el origen del problema.",
    oficio: "Electricista",
    zona: "CABA",
    ubicacion: "Caballito, CABA",
    horario: "Por coordinar",
    pago: "A convenir en la visita",
    imagen:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
    imagenes: [
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=500&q=80",
      "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=500&q=80",
    ],
  },
  {
    id: 4,
    titulo: "Calefón no mantiene la llama del piloto",
    descripcion:
      "El calefón enciende al presionar la perilla, pero se apaga al soltarla después de unos segundos. Se necesita revisar el equipo.",
    oficio: "Gasista",
    zona: "CABA",
    ubicacion: "Palermo, CABA",
    horario: "Por coordinar",
    pago: "A convenir en la visita",
    imagen:
      "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80",
    imagenes: [
      "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=500&q=80",
      "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=500&q=80",
    ],
  },
];

const IconoCheck = () => (
  <svg
    viewBox="0 0 48 48"
    className="h-14 w-14 text-[#10B981]"
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

const TecnicoHome = () => {
  const navigate = useNavigate();

  const [solicitudes, setSolicitudes] = useState(solicitudesIniciales);
  const [zona, setZona] = useState("Todas");
  const [oficio, setOficio] = useState("Todos");
  const [seleccionada, setSeleccionada] = useState(null);
  const [vistaDetalle, setVistaDetalle] = useState(false);
  const [trabajoAceptado, setTrabajoAceptado] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const solicitudesFiltradas = solicitudes.filter((solicitud) => {
    const coincideZona =
      zona === "Todas" || solicitud.zona === zona;

    const coincideOficio =
      oficio === "Todos" || solicitud.oficio === oficio;

    return coincideZona && coincideOficio;
  });

  const abrirDetalle = (solicitud) => {
    setSeleccionada(solicitud);
    setVistaDetalle(true);
    setMensaje("");
  };

  const volverListado = () => {
    setVistaDetalle(false);
    setSeleccionada(null);
  };

  const aceptarTrabajo = (solicitud) => {
    setSeleccionada(solicitud);
    setTrabajoAceptado(true);
  };

  const cerrarConfirmacion = () => {
    setTrabajoAceptado(false);
  };

  const marcarInadecuada = (id) => {
    setSolicitudes((actuales) =>
      actuales.filter((solicitud) => solicitud.id !== id)
    );

    if (seleccionada?.id === id) {
      volverListado();
    }

    setMensaje("Solicitud ocultada en esta demostración.");
  };

  return (
    <div className="min-h-screen bg-[#F4F7FD]">
      <Navbar />

      {vistaDetalle && seleccionada ? (
        <main className="mx-auto max-w-[1160px] px-5 py-10 sm:px-6">
          <button
            type="button"
            onClick={volverListado}
            className="mb-7 inline-flex items-center gap-2 text-base font-semibold text-[#011659] hover:text-[#FF5F15]"
          >
            <span aria-hidden="true">←</span>
            Volver a Solicitudes Disponibles
          </button>

          <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1.65fr)_minmax(280px,0.9fr)]">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-[10px] text-slate-500">
                  Publicado: hace 5 días
                </span>

                <span className="rounded-full border border-[#011659]/40 bg-blue-50 px-3 py-1 text-[10px] font-medium text-[#011659]">
                  ⚒ {seleccionada.oficio}
                </span>
              </div>

              <h1 className="text-lg font-semibold text-[#011659]">
                {seleccionada.detalleTitulo || seleccionada.titulo}
              </h1>

              <h2 className="mt-2 text-xs font-semibold text-slate-800">
                Descripción
              </h2>

              <p className="mt-1 text-xs leading-[1.45] text-slate-600">
                {seleccionada.descripcion}
              </p>

              <h2 className="mt-3 text-xs font-semibold text-slate-800">
                Fotos adjuntas
              </h2>

              <div className="mt-2 flex flex-wrap gap-2">
                {(seleccionada.imagenes?.length
                  ? seleccionada.imagenes
                  : [seleccionada.imagen]
                ).map((imagen, index) => (
                  <img
                    key={`${seleccionada.id}-${index}`}
                    src={imagen}
                    alt={`Foto adjunta ${index + 1} de la solicitud`}
                    className="h-32 w-32 rounded-lg object-cover sm:h-[122px] sm:w-[110px]"
                  />
                ))}
              </div>

              <div className="mt-3 rounded-md border border-[#8EA2C5] px-3 py-2 text-[10px] text-slate-500">
                Los datos de contacto se comparten recién al aceptar el trabajo.
              </div>

              <button
                type="button"
                onClick={() => marcarInadecuada(seleccionada.id)}
                className="mt-3 text-[10px] text-slate-500 hover:text-red-600"
              >
                ⓘ Reportar como inadecuado
              </button>
            </section>

            <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-xs font-bold text-[#011659]">
                Resumen del servicio
              </h2>

              <div className="space-y-3 text-[10px] text-[#011659]">
                <div className="flex items-start gap-2">
                  <span className="text-base">♧</span>
                  <p>
                    <strong>Zona:</strong> {seleccionada.ubicacion} (aprox. a 2 km)
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <span className="text-base">⌂</span>
                  <p>Calle y piso al aceptar</p>
                </div>

                <div className="flex items-start gap-2">
                  <span className="text-base">▦</span>
                  <p>
                    <strong>Franja horaria sugerida:</strong>{" "}
                    {seleccionada.horario}
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <span className="text-base">＄</span>
                  <p>
                    <strong>Presupuesto:</strong> {seleccionada.pago}
                  </p>
                </div>
              </div>

              <p className="mt-3 pl-6 text-[10px] leading-4 text-slate-500">
                El cobro se realiza de forma directa en el domicilio (Efectivo
                o Transferencia bancaria).
              </p>

              <button
                type="button"
                onClick={() => aceptarTrabajo(seleccionada)}
                className="mt-4 w-full rounded-full bg-[#FF6422] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#e9500c]"
              >
                Aceptar trabajo
              </button>
            </aside>
          </div>
        </main>
      ) : (
        <main className="mx-auto max-w-[1160px] px-5 py-10 sm:px-6">
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-[#011659]">
              Solicitudes Disponibles
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Encuentra trabajos y revisa las solicitudes disponibles.
            </p>
          </div>

          <div className="mb-5 flex flex-wrap gap-2">
            <label>
              <span className="sr-only">Filtrar por zona</span>
              <select
                value={zona}
                onChange={(e) => setZona(e.target.value)}
                className="rounded-full border border-[#011659] bg-white px-4 py-2 text-xs text-[#011659] outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="Todas">Zona: Todas</option>
                <option value="CABA">Zona: CABA</option>
              </select>
            </label>

            <label>
              <span className="sr-only">Filtrar por oficio</span>
              <select
                value={oficio}
                onChange={(e) => setOficio(e.target.value)}
                className="rounded-full border border-[#011659] bg-white px-4 py-2 text-xs text-[#011659] outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="Todos">Oficio: Todos</option>
                <option value="Plomería">Plomería</option>
                <option value="Electricista">Electricista</option>
                <option value="Gasista">Gasista</option>
              </select>
            </label>
          </div>

          {mensaje && (
            <div
              role="status"
              className="mb-5 flex items-start justify-between gap-4 rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-[#011659]"
            >
              <p>{mensaje}</p>
              <button
                type="button"
                onClick={() => setMensaje("")}
                className="font-semibold"
                aria-label="Cerrar mensaje"
              >
                ✕
              </button>
            </div>
          )}

          {solicitudesFiltradas.length === 0 ? (
            <div className="rounded-2xl bg-white p-10 text-center text-sm text-slate-500">
              No hay solicitudes para los filtros seleccionados.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {solicitudesFiltradas.map((solicitud) => (
                <article
                  key={solicitud.id}
                  className="rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6"
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className="text-[11px] text-slate-500">
                      Publicado: hace 5 días
                    </span>

                    <span className="rounded-full border border-[#011659]/40 bg-blue-50 px-3 py-1 text-[10px] font-medium text-[#011659]">
                      ⚒ {solicitud.oficio}
                    </span>
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row">
                    <img
                      src={solicitud.imagen}
                      alt={`Referencia de ${solicitud.oficio}`}
                      className="h-36 w-full rounded-lg object-cover sm:h-[118px] sm:w-[102px] sm:shrink-0"
                      loading="lazy"
                    />

                    <div className="min-w-0 flex-1">
                      <h2 className="text-base font-semibold leading-5 text-[#011659]">
                        {solicitud.titulo}
                      </h2>

                      <p className="mt-2 line-clamp-4 text-xs leading-[1.4] text-slate-600">
                        {solicitud.descripcion}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[10px] text-slate-500">
                    <span>♧ {solicitud.ubicacion}</span>
                    <span>▦ {solicitud.horario}</span>
                    <span>＄ {solicitud.pago}</span>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => marcarInadecuada(solicitud.id)}
                      className="text-[10px] text-slate-500 hover:text-red-600"
                    >
                      ⓘ Marcar como inadecuado
                    </button>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => abrirDetalle(solicitud)}
                        className="rounded-full border border-[#011659] px-4 py-2 text-[11px] font-semibold text-[#011659] transition hover:bg-blue-50"
                      >
                        Ver detalles
                      </button>

                      <button
                        type="button"
                        onClick={() => aceptarTrabajo(solicitud)}
                        className="rounded-full bg-[#FF5F15] px-4 py-2 text-[11px] font-semibold text-white transition hover:bg-[#e9500c]"
                      >
                        Aceptar trabajo
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      )}

      {trabajoAceptado && seleccionada && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-[2px]">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="aceptacion-titulo"
            className="w-full max-w-[365px] rounded-2xl bg-white px-6 py-6 text-center shadow-2xl"
          >
            <div className="mb-3 flex justify-center">
              <IconoCheck />
            </div>

            <h2
              id="aceptacion-titulo"
              className="text-sm font-bold text-slate-800"
            >
              ¡Trabajo asignado con éxito!
            </h2>

            <p className="mx-auto mt-3 max-w-[270px] text-[10px] leading-4 text-slate-500">
              Te comprometiste a realizar este servicio. Ponte en contacto con
              el cliente para coordinar el horario de visita y el presupuesto.
            </p>

            <button
              type="button"
              onClick={() => {
                setTrabajoAceptado(false);
                navigate("/tecnico/trabajos");
              }}
              className="mt-4 w-full rounded-full bg-[#071B68] px-4 py-2.5 text-[11px] font-semibold text-white transition hover:bg-[#102b88]"
            >
              Ir a Mis Trabajos
            </button>

            <button
              type="button"
              onClick={cerrarConfirmacion}
              className="mt-3 text-xs text-slate-500 hover:text-slate-700"
            >
              Seguir viendo solicitudes
            </button>
          </section>
        </div>
      )}
    </div>
  );
};

export default TecnicoHome;
