
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import SolicitudCard from '../../components/SolicitudCard';
import { getMyProfile, updateMyProfile } from '../../services/userService';
import {
  getMyServiceRequests,
  createServiceRequest,
} from '../../services/serviceRequestService';

const professions = [
  { value: 'ELECTRICISTA', label: 'Electricidad' },
  { value: 'PLOMERO', label: 'Plomería' },
  { value: 'GASISTA', label: 'Gas' },
  { value: 'TECNICO_AC', label: 'Refrigeración / Aire acondicionado' },
  { value: 'CERRAJERO', label: 'Cerrajería' },
  { value: 'ALBANIL', label: 'Albañilería' },
];

function getApiMessage(error, fallback) {
  const message = error.response?.data?.message;

  return Array.isArray(message)
    ? message
        .map((item) =>
          typeof item === 'string' ? item : item.message
        )
        .filter(Boolean)
        .join(', ') || fallback
    : message || fallback;
}

export default function ClienteHome() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [requestError, setRequestError] = useState('');
  const [requestMessage, setRequestMessage] = useState('');
  const [creatingRequest, setCreatingRequest] = useState(false);

  const [requestForm, setRequestForm] = useState({
    title: '',
    description: '',
    requiredProfession: '',
  });

  const loadRequests = async () => {
    setLoadingRequests(true);
    setRequestError('');

    try {
      const response = await getMyServiceRequests();
      const data = response?.data ?? response;

      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      setRequestError(
        getApiMessage(
          err,
          'No pudimos cargar tus solicitudes. Intentá nuevamente.'
        )
      );
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      try {
        const response = await getMyProfile();
        const userData = response?.data ?? response;

        if (active) {
          setProfile(userData);
          setForm({
            name: userData?.name || '',
            phone: userData?.phone || '',
          });
        }
      } catch (err) {
        if (active) {
          setError(
            getApiMessage(
              err,
              'No pudimos cargar tu perfil. Intentá nuevamente.'
            )
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadRequests();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError('');
    setMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    try {
      const response = await updateMyProfile({
        name: form.name.trim(),
        phone: form.phone.trim(),
      });

      const updatedProfile = response?.data ?? response;

      setProfile((previous) => ({
        ...previous,
        ...(updatedProfile &&
        typeof updatedProfile === 'object' &&
        !Array.isArray(updatedProfile)
          ? updatedProfile
          : {}),
        name: form.name.trim(),
        phone: form.phone.trim(),
      }));

      setMessage('¡Tus datos se guardaron correctamente!');
    } catch (err) {
      setError(
        getApiMessage(
          err,
          'No pudimos guardar tus datos. Intentá nuevamente.'
        )
      );
    } finally {
      setSaving(false);
    }
  };

  const handleRequestChange = (event) => {
    const { name, value } = event.target;

    setRequestForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setRequestError('');
    setRequestMessage('');
  };

  const handleCreateRequest = async (event) => {
    event.preventDefault();
    setCreatingRequest(true);
    setRequestError('');
    setRequestMessage('');

    try {
      const response = await createServiceRequest({
        title: requestForm.title.trim(),
        description: requestForm.description.trim(),
        requiredProfession: requestForm.requiredProfession,
      });

      const createdRequest = response?.data ?? response;

      if (createdRequest?.id) {
        setRequests((previous) => [
          createdRequest,
          ...previous.filter((item) => item.id !== createdRequest.id),
        ]);
      } else {
        await loadRequests();
      }

      setRequestForm({
        title: '',
        description: '',
        requiredProfession: '',
      });

      setRequestMessage('¡Tu solicitud se publicó correctamente!');
    } catch (err) {
      setRequestError(
        getApiMessage(
          err,
          'No pudimos publicar la solicitud. Intentá nuevamente.'
        )
      );
    } finally {
      setCreatingRequest(false);
    }
  };

  const displayName = profile?.name || 'Cliente';

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
            Área de clientes
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#011659]">
            ¡Hola, {displayName}!
          </h1>

          <p className="mt-3 max-w-2xl text-gray-600">
            Administrá tus datos y publicá solicitudes para encontrar un
            profesional para tu hogar.
          </p>
        </section>

        <section className="mt-6 grid gap-5 md:grid-cols-2">
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
                <p className="text-sm text-red-700">{error}</p>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="mt-3 font-semibold text-[#011659] underline"
                >
                  Volver a intentar
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
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
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    placeholder="Ingresá tu nombre"
                  />
                </div>

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
                    value={profile?.email || ''}
                    readOnly
                    className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-gray-600"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    El correo de tu cuenta no se modifica desde aquí.
                  </p>
                </div>

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
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    placeholder="Ingresá tu teléfono (opcional)"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Tipo de cuenta
                  </label>
                  <p className="rounded-lg bg-gray-50 px-4 py-3 text-gray-700">
                    {profile?.role || 'Cliente'}
                  </p>
                </div>

                {error && (
                  <p
                    role="alert"
                    className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
                  >
                    {error}
                  </p>
                )}

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
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </form>
            )}
          </article>

          <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#011659]">
              Publicar solicitud
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Contanos qué necesitás y elegí el oficio del profesional que
              buscás.
            </p>

            <form onSubmit={handleCreateRequest} className="mt-5 space-y-4">
              <div>
                <label
                  htmlFor="request-title"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Título del servicio
                </label>
                <input
                  id="request-title"
                  name="title"
                  type="text"
                  value={requestForm.title}
                  onChange={handleRequestChange}
                  minLength={5}
                  maxLength={120}
                  required
                  placeholder="Ej.: Reparar una pérdida de agua"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div>
                <label
                  htmlFor="request-description"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Descripción
                </label>
                <textarea
                  id="request-description"
                  name="description"
                  value={requestForm.description}
                  onChange={handleRequestChange}
                  minLength={10}
                  maxLength={2000}
                  required
                  rows={4}
                  placeholder="Describí el problema y el trabajo que necesitás."
                  className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div>
                <label
                  htmlFor="requiredProfession"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Oficio requerido
                </label>
                <select
                  id="requiredProfession"
                  name="requiredProfession"
                  value={requestForm.requiredProfession}
                  onChange={handleRequestChange}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                >
                  <option value="">Seleccioná un oficio</option>
                  {professions.map((profession) => (
                    <option
                      key={profession.value}
                      value={profession.value}
                    >
                      {profession.label}
                    </option>
                  ))}
                </select>
              </div>

              {requestError && (
                <p
                  role="alert"
                  className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
                >
                  {requestError}
                </p>
              )}

              {requestMessage && (
                <p
                  role="status"
                  className="rounded-lg bg-green-50 p-3 text-sm text-green-700"
                >
                  {requestMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={creatingRequest}
                className="w-full rounded-full bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {creatingRequest ? 'Publicando...' : 'Publicar solicitud'}
              </button>
            </form>
          </article>
        </section>

        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-[#011659]">
                Mis solicitudes
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Consultá el estado de los servicios que publicaste.
              </p>
            </div>

            <button
              type="button"
              onClick={loadRequests}
              disabled={loadingRequests}
              className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-[#011659] hover:bg-gray-50 disabled:opacity-60"
            >
              {loadingRequests ? 'Actualizando...' : 'Actualizar lista'}
            </button>
          </div>

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
              Todavía no publicaste solicitudes. Completá el formulario para
              publicar la primera.
            </p>
          ) : (
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {requests.map((request) => (
                <SolicitudCard
                  key={request.id}
                  solicitud={request}
                />
              ))}
            </div>
          )}
        </section>

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
