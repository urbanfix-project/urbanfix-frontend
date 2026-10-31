

const STATUS_CONFIG = {
  PENDIENTE: {
    label: 'Pendiente',
    className: 'bg-amber-100 text-amber-900 border-amber-300',
  },
  ACEPTADA: {
    label: 'Aceptado',
    className: 'bg-blue-100 text-blue-900 border-blue-300',
  },
  EN_PROGRESO: {
    label: 'En progreso',
    className: 'bg-violet-100 text-violet-900 border-violet-300',
  },
  EN_PROCESO: {
    label: 'En proceso',
    className: 'bg-violet-100 text-violet-900 border-violet-300',
  },
  COMPLETADA: {
    label: 'Completado',
    className: 'bg-green-100 text-green-900 border-green-300',
  },
  RECHAZADA: {
    label: 'Rechazado',
    className: 'bg-red-100 text-red-900 border-red-300',
  },
  CANCELADA: {
    label: 'Cancelado',
    className: 'bg-gray-100 text-gray-800 border-gray-300',
  },
};

const PROFESSION_LABELS = {
  ELECTRICISTA: 'Electricidad',
  PLOMERO: 'Plomería',
  GASISTA: 'Gas',
  TECNICO_AC: 'Refrigeración / Aire acondicionado',
  CERRAJERO: 'Cerrajería',
  ALBANIL: 'Albañilería',
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

  const daysAgo = Math.floor(
    (startOfToday - startOfPublishedDay) / 86400000
  );

  if (daysAgo <= 0) return 'hoy';
  if (daysAgo === 1) return 'hace 1 día';
  if (daysAgo < 30) return `hace ${daysAgo} días`;

  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'medium',
  }).format(parsedDate);
};

function SolicitudCard({ solicitud }) {
  if (!solicitud) return null;

  const status = String(solicitud.status ?? 'PENDIENTE')
    .trim()
    .toUpperCase();

  const badge = STATUS_CONFIG[status] ?? {
    label: status.replaceAll('_', ' '),
    className: 'bg-gray-100 text-gray-800 border-gray-300',
  };

  const profession = String(solicitud.requiredProfession ?? '');
  const category =
    solicitud.category ||
    PROFESSION_LABELS[profession] ||
    profession.replaceAll('_', ' ');

  const published = formatRelativeDate(solicitud.createdAt);

  return (
    <article className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      {published && (
        <p className="mb-3 text-xs font-medium text-gray-500">
          Publicado: {published}
        </p>
      )}

      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="min-w-0 flex-1 text-lg font-semibold leading-6 text-gray-900">
          {solicitud.title || 'Solicitud sin título'}
        </h3>

        <span
          className={`inline-flex shrink-0 items-center rounded-full border px-3 py-1 text-xs font-semibold ${badge.className}`}
        >
          {badge.label}
        </span>
      </div>

      {category && (
        <p className="mt-3 text-sm font-semibold text-gray-700">
          {category}
        </p>
      )}

      {solicitud.description && (
        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-600">
          {solicitud.description}
        </p>
      )}

      {solicitud.address && (
        <p className="mt-4 flex items-start gap-2 text-sm text-gray-600">
          <span aria-hidden="true">📍</span>
          <span>{solicitud.address}</span>
        </p>
      )}

      <div className="mt-auto border-t border-gray-100 pt-4">
        {profession && (
          <p className="text-xs text-gray-500">
            Oficio requerido: {profession.replaceAll('_', ' ')}
          </p>
        )}
      </div>
    </article>
  );
}

export default SolicitudCard;
