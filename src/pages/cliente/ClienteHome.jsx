
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import SolicitudCard from "../../components/SolicitudCard";
import CrearSolicitud from "../../components/CrearSolicitud";
import {
  getMyProfile,
  updateMyProfile,
} from "../../services/userService";
import { getMyServiceRequests } from "../../services/serviceRequestService";

const opcionesFiltro = [
  { label: "Todas", value: "TODAS" },
  { label: "Pendientes", value: "PENDIENTE" },
  { label: "Aceptadas", value: "ACEPTADA" },
  { label: "Completadas", value: "COMPLETADA" },
];

function getApiMessage(error, fallback) {
  const message = error.response?.data?.message;

  return Array.isArray(message)
    ? message
        .map((item) =>
          typeof item === "string" ? item : item.message
        )
        .filter(Boolean)
        .join(", ") || fallback
    : message || fallback;
}

export default function ClienteHome() {
  // Perfil del cliente
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Solicitudes del cliente
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [requestError, setRequestError] = useState("");
  const [requestMessage, setRequestMessage] = useState("");

  // Filtro por estado
  const [filtroEstado, setFiltroEstado] = useState("TODAS");

  // Obtener solicitudes desde Backend
  const loadRequests = async () => {
    setLoadingRequests(true);
    setRequestError("");

    try {
      const response = await getMyServiceRequests();
      const data = response?.data ?? response;

      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      setRequestError(
        getApiMessage(
          err,
          "No pudimos cargar tus solicitudes. Intentá nuevamente."
        )
      );
    } finally {
      setLoadingRequests(false);
    }
  };

  // Cargar perfil
  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      try {
        const response = await getMyProfile();
        const userData = response?.data ?? response;

        if (active) {
          setProfile(userData);

          setForm({
            name: userData?.name || "",
            phone: userData?.phone || "",
          });
        }
      } catch (err) {
        if (active) {
          setError(
            getApiMessage(
              err,
              "No pudimos cargar tu perfil. Intentá nuevamente."
            )
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  // Cargar solicitudes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadRequests();
  }, []);

  // Actualizar formulario de perfil
  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setMessage("");
  };

  // Guardar perfil
  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await updateMyProfile({
        name: form.name.trim(),
        phone: form.phone.trim(),
      });

      const updatedProfile = response?.data ?? response;

      setProfile((previous) => ({
        ...previous,
        ...(updatedProfile &&
        typeof updatedProfile === "object" &&
        !Array.isArray(updatedProfile)
          ? updatedProfile
          : {}),
        name: form.name.trim(),
        phone: form.phone.trim(),
      }));

      setMessage("¡Tus datos se guardaron correctamente!");
    } catch (err) {
      setError(
        getApiMessage(
          err,
          "No pudimos guardar tus datos. Intentá nuevamente."
        )
      );
    } finally {
      setSaving(false);
    }
  };

  // Filtrar solicitudes sin modificar los datos originales
  const solicitudesFiltradas =
    filtroEstado === "TODAS"
      ? requests
      : requests.filter(
          (solicitud) =>
            String(solicitud.status ?? "")
              .trim()
              .toUpperCase() === filtroEstado
        );

  const displayName = profile?.name || "Cliente";

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">

        {/* BIENVENIDA */}
        <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
            Área de clientes
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#011659]">
            ¡Hola, {displayName}!
          </h1>

          <p className="mt-3 max-w-2xl text-gray-600">
            Administrá tus datos y publicá solicitudes para
            encontrar un profesional para tu hogar.
          </p>
        </section>

        {/* PERFIL Y PUBLICACIÓN */}
        <section className="mt-6 grid gap-5 md:grid-cols-2">

          {/* DATOS PERSONALES */}
          <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#011659]">
              Mis datos personales
            </h2>

            {loading ? (
              <p className="mt-4 text-gray-600">
                Cargando tus datos...
              </p>
            ) : error && !profile ? (
              <div className="mt-4" role="alert">
                <p className="text-sm text-red-700">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="mt-3 font-semibold text-[#011659] underline"
                >
                  Volver a intentar
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mt-5 space-y-4"
              >
                {/* NOMBRE */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Nombre completo
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    required
                    minLength={2}
                    maxLength={100}
                    autoComplete="name"
                    placeholder="Ingresá tu nombre"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                {/* EMAIL */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Correo electrónico
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={profile?.email || ""}
                    readOnly
                    className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-gray-600"
                  />

                  <p className="mt-1 text-xs text-gray-500">
                    El correo de tu cuenta no se modifica desde aquí.
                  </p>
                </div>

                {/* TELÉFONO */}
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Teléfono
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    maxLength={30}
                    autoComplete="tel"
                    placeholder="Ingresá tu teléfono (opcional)"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                {/* ROL */}
                <div>
                  <p className="mb-1 text-sm font-medium text-gray-700">
                    Tipo de cuenta
                  </p>

                  <p className="rounded-lg bg-gray-50 px-4 py-3 text-gray-700">
                    {profile?.role || "Cliente"}
                  </p>
                </div>

                {/* ERRORES */}
                {error && (
                  <p
                    role="alert"
                    className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
                  >
                    {error}
                  </p>
                )}

                {/* MENSAJE DE ÉXITO */}
                {message && (
                  <p
                    role="status"
                    className="rounded-lg bg-green-50 p-3 text-sm text-green-700"
                  >
                    {message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-full bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Guardando..." : "Guardar cambios"}
                </button>
              </form>
            )}
          </article>

          {/* PUBLICAR SOLICITUD */}
          <article
  id="nueva-solicitud"
  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
>
  <h2 className="text-xl font-bold text-[#011659]">
    Publicar solicitud
  </h2>

            <p className="mt-2 text-sm text-gray-600">
              Contanos qué necesitás y elegí el oficio del
              profesional que buscás.
            </p>

            <CrearSolicitud
              onSolicitudCreada={(solicitud) => {
                if (solicitud?.id) {
                  setRequests((prev) => [
                    solicitud,
                    ...prev.filter(
                      (item) => item.id !== solicitud.id
                    ),
                  ]);
                } else {
                  void loadRequests();
                }

                setRequestMessage(
                  "¡Tu solicitud se publicó correctamente!"
                );
              }}
            />

            {requestMessage && (
              <p
                role="status"
                className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-800"
              >
                {requestMessage}
              </p>
            )}
          </article>
        </section>

        {/* MIS SOLICITUDES */}
        <section
          id="mis-solicitudes"
          className="mt-6 scroll-mt-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-[#011659]">
                Mis solicitudes
              </h2>

              <p className="mt-1 text-sm text-gray-600">
                Consultá el estado de los servicios que publicaste.
              </p>
            </div>

<div className="flex flex-wrap items-center gap-2">
  <button
    type="button"
    onClick={() => {
      document
        .getElementById("nueva-solicitud")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }}
    className="rounded-full bg-[#FF5F15] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#e9500c]"
  >
    + Nueva solicitud
  </button>

  <button
    type="button"
    onClick={loadRequests}
    disabled={loadingRequests}
    className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-[#011659] hover:bg-gray-50 disabled:opacity-60"
  >
    {loadingRequests ? "Actualizando..." : "Actualizar lista"}
  </button>
</div>

          </div>

          {/* FILTROS DE ESTADO */}
          <div
            className="mt-5 flex flex-wrap gap-2"
            aria-label="Filtrar solicitudes por estado"
          >
            {opcionesFiltro.map((opcion) => (
              <button
                key={opcion.value}
                type="button"
                onClick={() => setFiltroEstado(opcion.value)}
                aria-pressed={filtroEstado === opcion.value}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  filtroEstado === opcion.value
                    ? "border-[#011659] bg-[#011659] text-white"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {opcion.label}
              </button>
            ))}
          </div>

          {/* LISTADO DE SOLICITUDES */}
          {loadingRequests ? (
            <p className="mt-5 text-gray-600">
              Cargando tus solicitudes...
            </p>
          ) : requestError && requests.length === 0 ? (
            <div className="mt-5">
              <p role="alert" className="text-sm text-red-700">
                {requestError}
              </p>

              <button
                type="button"
                onClick={loadRequests}
                className="mt-3 font-semibold text-[#011659] underline"
              >
                Volver a intentar
              </button>
            </div>
          ) : requests.length === 0 ? (
            <p className="mt-5 rounded-xl bg-gray-50 p-5 text-gray-600">
              Todavía no publicaste solicitudes.
              Completá el formulario para publicar la primera.
            </p>
          ) : solicitudesFiltradas.length === 0 ? (
            <p className="mt-5 rounded-xl bg-gray-50 p-5 text-gray-600">
              No hay solicitudes con este estado.
            </p>
          ) : (
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {solicitudesFiltradas.map((request) => (
                <SolicitudCard
                  key={request.id}
                  solicitud={request}
                />
              ))}
            </div>
          )}
        </section>

        {/* SECCIÓN FINAL */}
        <section className="mt-6 rounded-2xl bg-[#011659] p-6 text-white sm:p-8">
          <h2 className="text-xl font-bold">
            ¿Necesitás un servicio para tu hogar?
          </h2>

          <p className="mt-2 text-sm text-blue-100">
            Publicá tu solicitud y consultá su estado desde este panel.
          </p>

          <Link
            to="/cliente"
            className="mt-5 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#011659]"
          >
            Volver a mi panel
          </Link>
        </section>
      </main>
    </div>
  );
}
