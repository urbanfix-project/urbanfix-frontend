
import { useId, useRef } from "react";

const STATUS_CONFIG = {
  PENDIENTE: {
    label: "Pendiente",
    className: "bg-orange-50 text-orange-800 border-orange-300",
  },
  ACEPTADA: {
    label: "Aceptado",
    className: "bg-emerald-50 text-emerald-800 border-emerald-300",
  },
  EN_PROGRESO: {
    label: "En progreso",
    className: "bg-violet-50 text-violet-800 border-violet-300",
  },
  EN_PROCESO: {
    label: "En proceso",
    className: "bg-violet-50 text-violet-800 border-violet-300",
  },
  COMPLETADA: {
    label: "Completado",
    className: "bg-blue-50 text-blue-800 border-blue-300",
  },
  RECHAZADA: {
    label: "Rechazado",
    className: "bg-red-50 text-red-800 border-red-300",
  },
  CANCELADA: {
    label: "Cancelado",
    className: "bg-red-50 text-red-800 border-red-300",
  },
};

const PROFESSION_LABELS = {
  ELECTRICISTA: "Electricidad",
  PLOMERO: "Plomería",
  GASISTA: "Gas",
  TECNICO_AC: "Refrigeración / Aire acondicionado",
  CERRAJERO: "Cerrajería",
  ALBANIL: "Albañilería",
};

const formatRelativeDate = (date) => {
  if (!date) return null;

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return null;

  const today = new Date();

  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const startOfPublishedDay = new Date(
    parsedDate.getFullYear(),
    parsedDate.getMonth(),
    parsedDate.getDate()
  );

  const daysAgo = Math.round(
    (startOfToday - startOfPublishedDay) / 86400000
  );

  if (daysAgo <= 0) return "hoy";
  if (daysAgo === 1) return "hace 1 día";
  if (daysAgo < 30) return `hace ${daysAgo} días`;

  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
  }).format(parsedDate);
};

const formatFullDate = (date) => {
  if (!date) return "Fecha no informada";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Fecha no informada";
  }

  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "long",
  }).format(parsedDate);
};

function SolicitudCard({ solicitud }) {
  const dialogRef = useRef(null);
  const dialogTitleId = useId();

  if (!solicitud) return null;

  const status = String(solicitud.status ?? "PENDIENTE")
    .trim()
    .toUpperCase();

  const badge = STATUS_CONFIG[status] ?? {
    label: status.replaceAll("_", " "),
    className: "bg-gray-100 text-gray-800 border-gray-300",
  };

  const profession = String(
    solicitud.requiredProfession ?? ""
  )
    .trim()
    .toUpperCase();

  const category =
    solicitud.category ||
    PROFESSION_LABELS[profession] ||
    profession.replaceAll("_", " ") ||
    "Oficio no informado";

  const published = formatRelativeDate(solicitud.createdAt);

  const address =
    typeof solicitud.address === "string"
      ? solicitud.address.trim()
      : "";

  const openDetails = () => {
    if (dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal();
    }
  };

  const closeDetails = () => {
    dialogRef.current?.close();
  };

  return (
    <>
      {/* TARJETA DE SOLICITUD */}
      <article className="flex h-full min-w-0 flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
        {published && (
          <p className="mb-3 text-xs font-medium text-gray-500">
            Publicado: {published}
          </p>
        )}

        <div className="flex flex-wrap items-start justify-between gap-3">
          <h3 className="min-w-0 flex-[1_1_180px] text-lg font-semibold leading-6 text-gray-900 [overflow-wrap:anywhere]">
            {solicitud.title || "Solicitud sin título"}
          </h3>

          <span
            className={`inline-flex shrink-0 items-center rounded-full border px-3 py-1 text-xs font-medium leading-4 ${badge.className}`}
          >
            {badge.label}
          </span>
        </div>

        <p className="mt-3 text-sm font-semibold text-gray-700">
          {category}
        </p>

        {solicitud.description && (
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-600 [overflow-wrap:anywhere]">
            {solicitud.description}
          </p>
        )}

        <p className="mt-4 flex min-w-0 items-start gap-2 text-sm text-gray-600">
          <span aria-hidden="true">📍</span>
          <span className="min-w-0 [overflow-wrap:anywhere]">
            {address || "Dirección no informada"}
          </span>
        </p>

        {/* BOTÓN VER DETALLES */}
        <div className="mt-auto pt-5">
          <button
            type="button"
            onClick={openDetails}
            className="w-full rounded-full border border-[#011659] px-5 py-2.5 text-sm font-semibold text-[#011659] transition-colors hover:bg-[#011659] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#011659]"
          >
            Ver detalles
          </button>
        </div>
      </article>

      {/* VENTANA DE DETALLES */}
      <dialog
        ref={dialogRef}
        aria-labelledby={dialogTitleId}
        className="fixed inset-0 m-auto max-h-[85vh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-2xl border border-gray-200 bg-white p-0 text-gray-900 shadow-2xl backdrop:bg-slate-900/60"
      >
        <div className="p-5 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-orange-600">
                Detalle de solicitud
              </p>

              <h2
                id={dialogTitleId}
                className="text-xl font-bold leading-7 text-[#011659] [overflow-wrap:anywhere]"
              >
                {solicitud.title || "Solicitud sin título"}
              </h2>
            </div>

            <button
              type="button"
              onClick={closeDetails}
              aria-label="Cerrar detalles"
              className="shrink-0 rounded-full bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
            >
              ✕
            </button>
          </div>

          <div className="mt-5">
            <span
              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${badge.className}`}
            >
              {badge.label}
            </span>
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <h3 className="text-sm font-semibold text-[#011659]">
                Oficio requerido
              </h3>
              <p className="mt-1 text-sm text-gray-700 [overflow-wrap:anywhere]">
                {category}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[#011659]">
                Descripción del problema
              </h3>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-gray-700 [overflow-wrap:anywhere]">
                {solicitud.description ||
                  "Sin descripción disponible"}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[#011659]">
                Dirección
              </h3>
              <p className="mt-1 text-sm text-gray-700 [overflow-wrap:anywhere]">
                📍 {address || "Dirección no informada"}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[#011659]">
                Fecha de publicación
              </h3>
              <p className="mt-1 text-sm text-gray-700">
                {formatFullDate(solicitud.createdAt)}
              </p>
            </div>
          </div>

          <div className="mt-7 border-t border-gray-200 pt-5">
            <button
              type="button"
              onClick={closeDetails}
              className="w-full rounded-full bg-[#FF5F15] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#e9500c]"
            >
              Cerrar
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}

export default SolicitudCard;
