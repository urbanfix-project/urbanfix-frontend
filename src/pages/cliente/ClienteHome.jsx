
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

const solicitudesIniciales = [
  {
    id: 1,
    publicado: "hoy",
    estado: "Pendiente",
    titulo: "Pérdida de agua bajo mesada",
    descripcion:
      "Pérdida importante en el flexible de agua fría bajo la bacha. Tuve que cerrar la llave de paso porque filtra directo hacia el piso. Se requiere cambio del flexible y revisión de las conexiones de desagüe de la pileta.",
    zona: "Caballito, CABA",
    horario: "Tarde 15:00 a 18:00",
    presupuesto: "A convenir en la visita",
  },
  {
    id: 2,
    publicado: "ayer",
    estado: "Aceptado",
    titulo: "Instalación de tomacorriente y térmica",
    descripcion:
      "Necesito instalar dos tomas dobles en el living y revisar la llave térmica principal que salta cuando enchufo el caloventor. Tengo los materiales comprados.",
    zona: "Almagro, CABA",
    horario: "Mañ. 09:00 a 12:00",
    presupuesto: "A convenir en la visita",
  },
  {
    id: 3,
    publicado: "hace 3 días",
    estado: "Completado",
    titulo: "Pérdida en estufa tiro balanceado",
    descripcion:
      "Se sentía un leve olor a gas al encender la estufa del dormitorio. Vino el gasista, realizó la limpieza de la termocupla, cambió la llave de paso y quedó funcionando sin fugas.",
    zona: "Barracas, CABA",
    horario: "Tarde 15:00 a 18:00",
    presupuesto: "A convenir en la visita",
  },
  {
    id: 4,
    publicado: "hace 5 días",
    estado: "Cancelado",
    titulo: "Cambio de combinación cerradura de entrada",
    descripcion:
      "Se trababa la llave de la puerta principal del departamento y costaba abrir desde afuera. Solicitud cancelada por el cliente por falta de disponibilidad horaria coordinada.",
    zona: "Almagro, CABA",
    horario: "Fin de semana",
    presupuesto: "A convenir en la visita",
  },
];

const estilosEstado = {
  Pendiente: "border-orange-400 text-orange-500 bg-orange-50",
  Aceptado: "border-emerald-500 text-emerald-600 bg-emerald-50",
  Completado: "border-sky-400 text-sky-600 bg-sky-50",
  Cancelado: "border-red-400 text-red-500 bg-red-50",
};

export default function ClienteHome() {
  const navigate = useNavigate();
  const [solicitudes, setSolicitudes] = useState(solicitudesIniciales);
  const [filtro, setFiltro] = useState("Todas");
  const [modal, setModal] = useState(null);
  const [seleccionada, setSeleccionada] = useState(null);

  const solicitudesFiltradas = solicitudes.filter((solicitud) => {
    if (filtro === "Activas") {
      return ["Pendiente", "Aceptado"].includes(solicitud.estado);
    }

    if (filtro === "Historial") {
      return ["Completado", "Cancelado"].includes(solicitud.estado);
    }

    return true;
  });

  const activas = solicitudes.filter((s) =>
    ["Pendiente", "Aceptado"].includes(s.estado)
  ).length;

  const historial = solicitudes.filter((s) =>
    ["Completado", "Cancelado"].includes(s.estado)
  ).length;

  const cancelarSolicitud = () => {
    if (!seleccionada) return;

    setSolicitudes((actuales) =>
      actuales.map((solicitud) =>
        solicitud.id === seleccionada.id
          ? { ...solicitud, estado: "Cancelado" }
          : solicitud
      )
    );

    setModal({ tipo: "resultado", mensaje: "Solicitud cancelada correctamente." });
    setSeleccionada(null);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FD]">
      <Navbar />

      <main className="mx-auto max-w-[1160px] px-5 py-10 sm:px-6">
        <h1 className="mb-10 text-xl font-bold text-[#011659]">
          Mis solicitudes
        </h1>

        <div className="mb-4 flex flex-wrap gap-1.5">
          {[
            { label: "Todas", count: solicitudes.length },
            { label: "Activas", count: activas },
            { label: "Historial", count: historial },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => setFiltro(item.label)}
              className={`rounded-full border border-[#011659] px-3 py-1.5 text-[11px] transition ${
                filtro === item.label
                  ? "bg-[#071B68] text-white"
                  : "bg-white text-[#011659] hover:bg-blue-50"
              }`}
            >
              {item.label}
              {item.label !== "Todas" && ` (${item.count})`}
            </button>
          ))}
        </div>

        {solicitudesFiltradas.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center">
            <p className="text-sm text-slate-500">
              No tienes solicitudes en esta categoría.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {solicitudesFiltradas.map((solicitud) => (
              <article
                key={solicitud.id}
                className="flex min-h-[210px] flex-col rounded-2xl bg-white p-5 shadow-sm"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="text-[9px] text-slate-600">
                    Publicado: {solicitud.publicado}
                  </span>

                  <span
                    className={`rounded-full border px-2 py-0.5 text-[9px] ${estilosEstado[solicitud.estado]}`}
                  >
                    ◉ {solicitud.estado}
                  </span>
                </div>

                <h2 className="text-[15px] font-semibold leading-5 text-[#011659]">
                  {solicitud.titulo}
                </h2>

                <p className="mt-2 line-clamp-4 text-[10px] leading-[14px] text-gray-600">
                  {solicitud.descripcion}
                </p>

                <div className="mt-auto">
                  <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-[9px] text-[#7185A6]">
                    <span>♧ {solicitud.zona}</span>
                    <span>▦ {solicitud.horario}</span>
                    <span>♙ {solicitud.presupuesto}</span>
                  </div>

                  <div className="mt-4 flex justify-end gap-2">
                    {["Pendiente", "Aceptado"].includes(solicitud.estado) && (
                      <button
                        type="button"
                        onClick={() => {
                          setSeleccionada(solicitud);
                          setModal({ tipo: "cancelar" });
                        }}
                        className="rounded-full border border-[#011659] px-4 py-1.5 text-[10px] font-semibold text-[#011659] hover:bg-blue-50"
                      >
                        Cancelar
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/cliente/solicitud/${solicitud.id}`, {
                          state: { solicitud },
                        })
                      }
                      className="rounded-full bg-[#FF6422] px-4 py-1.5 text-[10px] font-semibold text-white hover:bg-[#e9500c]"
                    >
                      Ver detalles
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]">
          <section
            role="dialog"
            aria-modal="true"
            className="w-full max-w-[350px] rounded-2xl bg-white px-6 py-7 text-center shadow-2xl"
          >
            {modal.tipo === "cancelar" ? (
              <>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-4 border-orange-400 text-3xl text-[#FF6422]">
                  !
                </div>
                <h2 className="mt-4 text-base font-bold text-slate-800">
                  ¿Cancelar solicitud?
                </h2>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  ¿Seguro que deseas cancelar «{seleccionada?.titulo}»?
                </p>
                <button
                  type="button"
                  onClick={cancelarSolicitud}
                  className="mt-5 w-full rounded-full bg-[#071B68] px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-900"
                >
                  Sí, cancelar solicitud
                </button>
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  className="mt-2 w-full rounded-full border border-slate-300 px-4 py-2.5 text-xs text-slate-600 hover:bg-slate-50"
                >
                  Volver
                </button>
              </>
            ) : modal.tipo === "nueva" ? (
              <>
                <h2 className="text-base font-bold text-[#011659]">
                  Nueva solicitud
                </h2>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Desde aquí podrás iniciar una nueva solicitud de servicio.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setModal(null);
                    navigate("/oficios");
                  }}
                  className="mt-5 w-full rounded-full bg-[#FF6422] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#e9500c]"
                >
                  Elegir un oficio
                </button>
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  className="mt-2 w-full rounded-full border border-slate-300 px-4 py-2.5 text-xs text-slate-600"
                >
                  Cerrar
                </button>
              </>
            ) : (
              <>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-4 border-emerald-500 text-3xl text-emerald-500">
                  ✓
                </div>
                <h2 className="mt-4 text-base font-bold text-slate-800">
                  Solicitud actualizada
                </h2>
                <p className="mt-2 text-xs text-slate-500">
                  {modal.mensaje}
                </p>
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  className="mt-5 w-full rounded-full bg-[#071B68] px-4 py-2.5 text-xs font-semibold text-white"
                >
                  Entendido
                </button>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
