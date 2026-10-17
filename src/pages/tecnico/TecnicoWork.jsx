import { useState } from "react";
import Navbar from "../../components/Navbar";

const trabajosIniciales = [
  {
    id: 1,
    oficio: "Plomería",
    titulo: "Pérdida de agua en cocina",
    descripcion:
      "Pérdida importante en el flexible de agua fría bajo la bacha. Tuve que cerrar la llave de paso...",
    nombre: "Mariana Costa",
    horario: "Tarde (15:00 a 18:00)",
    direccion: "Av. Rivadavia 5420, Piso 4 B, Caballito, CABA",
    contacto: "+54 9 11 5555-4321",
    presupuesto:
      "A convenir en la visita (Cobro directo en efectivo o transferencia)",
    estado: "En curso",
  },
  {
    id: 2,
    oficio: "Plomería",
    titulo: "Pérdida de agua en cocina",
    descripcion:
      "Pérdida importante en el flexible de agua fría bajo la bacha. Tuve que cerrar la llave de paso...",
    nombre: "Mariana Costa",
    horario: "Tarde (15:00 a 18:00)",
    direccion: "Av. Rivadavia 5420, Piso 4 B, Caballito, CABA",
    contacto: "+54 9 11 5555-4321",
    presupuesto:
      "A convenir en la visita (Cobro directo en efectivo o transferencia)",
    estado: "En curso",
  },
  {
    id: 3,
    oficio: "Plomería",
    titulo: "Pérdida de agua en cocina",
    descripcion:
      "Pérdida importante en el flexible de agua fría bajo la bacha. Tuve que cerrar la llave de paso...",
    nombre: "Mariana Costa",
    horario: "Tarde (15:00 a 18:00)",
    direccion: "Av. Rivadavia 5420, Piso 4 B, Caballito, CABA",
    contacto: "+54 9 11 5555-4321",
    presupuesto:
      "A convenir en la visita (Cobro directo en efectivo o transferencia)",
    estado: "Completado",
  },
  {
    id: 4,
    oficio: "Plomería",
    titulo: "Pérdida de agua en cocina",
    descripcion:
      "Pérdida importante en el flexible de agua fría bajo la bacha. Tuve que cerrar la llave de paso...",
    nombre: "Mariana Costa",
    horario: "Tarde (15:00 a 18:00)",
    direccion: "Av. Rivadavia 5420, Piso 4 B, Caballito, CABA",
    contacto: "+54 9 11 5555-4321",
    presupuesto:
      "A convenir en la visita (Cobro directo en efectivo o transferencia)",
    estado: "Completado",
  },
  {
    id: 5,
    oficio: "Plomería",
    titulo: "Pérdida de agua en cocina",
    descripcion:
      "Pérdida importante en el flexible de agua fría bajo la bacha. Tuve que cerrar la llave de paso...",
    nombre: "Mariana Costa",
    horario: "Tarde (15:00 a 18:00)",
    direccion: "Av. Rivadavia 5420, Piso 4 B, Caballito, CABA",
    contacto: "+54 9 11 5555-4321",
    presupuesto:
      "A convenir en la visita (Cobro directo en efectivo o transferencia)",
    estado: "Cancelado",
  },
];

const IconoExito = () => (
  <svg
    viewBox="0 0 48 48"
    className="h-14 w-14 text-emerald-500"
    fill="none"
    aria-hidden="true"
  >
    <circle cx="23" cy="25" r="18" stroke="currentColor" strokeWidth="4" />
    <path
      d="m13 24 7 7 17-18"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconoInfo = () => (
  <svg
    viewBox="0 0 48 48"
    className="h-14 w-14 text-[#FF6422]"
    fill="none"
    aria-hidden="true"
  >
    <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="4" />
    <path
      d="M24 14v12m0 7h.01"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
    />
  </svg>
);

const IconoCheck = () => (
  <svg
    viewBox="0 0 48 48"
    className="h-14 w-14 text-emerald-500"
    fill="none"
    aria-hidden="true"
  >
    <circle cx="23" cy="25" r="18" stroke="currentColor" strokeWidth="4" />
    <path
      d="m13 24 7 7 17-18"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TecnicoWork = () => {
  const [trabajos, setTrabajos] = useState(trabajosIniciales);
  const [pestana, setPestana] = useState("En curso");
  const [modal, setModal] = useState(null);
  const [trabajoSeleccionado, setTrabajoSeleccionado] = useState(null);

  const trabajosFiltrados = trabajos.filter(
    (trabajo) => trabajo.estado === pestana,
  );

  const abrirModal = (tipo, trabajo) => {
    setTrabajoSeleccionado(trabajo);
    setModal(tipo);
  };

  const cerrarModal = () => {
    setModal(null);
    setTrabajoSeleccionado(null);
  };

  const confirmarAccion = () => {
    if (!trabajoSeleccionado || !modal) return;

    const nuevoEstado = modal === "cancelar" ? "Cancelado" : "Completado";

    setTrabajos((actuales) =>
      actuales.map((trabajo) =>
        trabajo.id === trabajoSeleccionado.id
          ? { ...trabajo, estado: nuevoEstado }
          : trabajo,
      ),
    );

    setPestana(nuevoEstado);
    setModal(modal === "cancelar" ? "cancelado" : "completado");
    setTrabajoSeleccionado(null);
  };

  const contador = (estado) =>
    trabajos.filter((trabajo) => trabajo.estado === estado).length;

  return (
    <div className="min-h-screen bg-[#F4F7FD]">
      <Navbar />

      <main className="mx-auto max-w-[1160px] px-5 py-10 sm:px-6">
        <h1 className="mb-6 text-xl font-semibold text-[#011659]">
          Mis Trabajos
        </h1>

        <div className="mb-6 flex flex-wrap gap-2">
          {[
            { label: "En curso", count: contador("En curso") },
            { label: "Completados", count: contador("Completado") },
            { label: "Cancelados", count: contador("Cancelado") },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() =>
                setPestana(
                  item.label === "Completados"
                    ? "Completado"
                    : item.label === "Cancelados"
                      ? "Cancelado"
                      : "En curso",
                )
              }
              className={`rounded-full border border-[#011659] px-3 py-1.5 text-[11px] transition ${
                (pestana === "En curso" && item.label === "En curso") ||
                (pestana === "Completado" && item.label === "Completados") ||
                (pestana === "Cancelado" && item.label === "Cancelados")
                  ? "bg-[#071B68] text-white"
                  : "bg-white text-[#011659] hover:bg-blue-50"
              }`}
            >
              {item.label} ({item.count})
            </button>
          ))}
        </div>

        {trabajosFiltrados.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center text-sm text-slate-500">
            No tienes trabajos en esta categoría.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {trabajosFiltrados.map((trabajo) => (
              <article
                key={trabajo.id}
                className="rounded-2xl bg-white p-5 shadow-sm"
              >
                <div className="mb-4 flex items-center justify-between gap-2">
                  <span className="rounded-full border border-[#011659]/40 bg-blue-50 px-3 py-1 text-[10px] text-[#011659]">
                    ⚒ {trabajo.oficio}
                  </span>

                  <span
                    className={`rounded-full border px-3 py-1 text-[10px] ${
                      trabajo.estado === "En curso"
                        ? "border-emerald-400 bg-emerald-100 text-emerald-700"
                        : trabajo.estado === "Completado"
                          ? "border-blue-300 bg-blue-50 text-blue-700"
                          : "border-red-300 bg-red-50 text-red-700"
                    }`}
                  >
                    {trabajo.estado === "En curso"
                      ? "Aceptado"
                      : trabajo.estado}
                  </span>
                </div>

                <h2 className="text-base font-semibold text-[#011659]">
                  {trabajo.titulo}
                </h2>

                <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-[#011659]">
                  {trabajo.descripcion}
                </p>

                <div className="mt-3 space-y-1.5 rounded-lg border border-[#8EA2C5] bg-slate-50 p-3 text-[10px] leading-4 text-[#011659]">
                  <p>
                    <strong>◉ Nombre y Apellido:</strong> {trabajo.nombre}
                    <span className="ml-2">
                      <strong>▦ Horario:</strong> {trabajo.horario}
                    </span>
                  </p>
                  <p>
                    <strong>♧ Dirección:</strong> {trabajo.direccion}
                  </p>
                  <p>
                    <strong>☏ Contacto:</strong> {trabajo.contacto}
                  </p>
                  <p className="flex items-start gap-1">
                    <strong className="shrink-0">＄ Presupuesto:</strong>
                    <span>{trabajo.presupuesto}</span>
                  </p>
                </div>

                {trabajo.estado === "En curso" && (
                  <div className="mt-3 flex flex-wrap justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => abrirModal("cancelar", trabajo)}
                      className="rounded-full border border-[#011659] px-4 py-2 text-[11px] font-semibold text-[#011659] transition hover:bg-blue-50"
                    >
                      Cancelar trabajo
                    </button>

                    <button
                      type="button"
                      onClick={() => abrirModal("completar", trabajo)}
                      className="rounded-full bg-[#FF6422] px-4 py-2 text-[11px] font-semibold text-white transition hover:bg-[#e9500c]"
                    >
                      Marcar como completado
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </main>

      {modal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-[2px]">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-titulo"
            className="w-full max-w-[365px] rounded-2xl bg-white px-6 py-6 text-center shadow-2xl"
          >
            {modal === "cancelar" && <IconoInfo />}
            {modal === "completar" && <IconoCheck />}
            {modal === "cancelado" && <IconoInfo />}
            {modal === "completado" && <IconoExito />}

            <h2
              id="modal-titulo"
              className="mt-3 text-sm font-bold text-slate-800"
            >
              {modal === "cancelar" && "¿Cancelar este trabajo?"}
              {modal === "completar" && "¿Marcar como completado?"}
              {modal === "cancelado" && "Trabajo cancelado"}
              {modal === "completado" && "¡Trabajo completado con éxito!"}
            </h2>

            <p className="mx-auto mt-3 max-w-[270px] text-[11px] leading-4 text-slate-500">
              {modal === "cancelar" &&
                "¿Estás seguro de que deseas cancelar este trabajo? Esta acción cambiará su estado a cancelado."}
              {modal === "completar" &&
                "Confirma que has terminado el servicio para mover este trabajo a la lista de completados."}
              {modal === "cancelado" &&
                "El trabajo ahora aparece en la pestaña Cancelados."}
              {modal === "completado" &&
                "El trabajo ahora aparece en la pestaña Completados."}
            </p>

            {modal === "cancelar" || modal === "completar" ? (
              <div className="mt-5 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={confirmarAccion}
                  className={`w-full rounded-full px-4 py-2.5 text-[11px] font-semibold text-white transition ${
                    modal === "cancelar"
                      ? "bg-[#FF6422] hover:bg-[#e9500c]"
                      : "bg-[#071B68] hover:bg-[#102b88]"
                  }`}
                >
                  {modal === "cancelar"
                    ? "Sí, cancelar trabajo"
                    : "Sí, completar trabajo"}
                </button>

                <button
                  type="button"
                  onClick={cerrarModal}
                  className="w-full rounded-full border border-slate-300 px-4 py-2.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Volver
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={cerrarModal}
                className="mt-5 w-full rounded-full bg-[#071B68] px-4 py-2.5 text-[11px] font-semibold text-white transition hover:bg-[#102b88]"
              >
                Entendido
              </button>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default TecnicoWork;
