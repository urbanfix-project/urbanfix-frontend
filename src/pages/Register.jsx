
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { registerRequest } from '../services/authService';

const professions = [
  { value: 'ELECTRICISTA', label: 'Electricista' },
  { value: 'PLOMERO', label: 'Plomero/a' },
  { value: 'GASISTA', label: 'Gasista' },
  { value: 'TECNICO_AC', label: 'Técnico/a de aire acondicionado' },
  { value: 'CERRAJERO', label: 'Cerrajero/a' },
  { value: 'ALBANIL', label: 'Albañil' },
];

const initialForm = {
  name: '',
  email: '',
  password: '',
  phone: '',
  role: 'CLIENTE',
  profession: '',
};

export default function Register() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
      ...(name === 'role' && value === 'CLIENTE'
        ? { profession: '' }
        : {}),
    }));

    setError('');
    setSuccess('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const passwordPattern =
      /^(?=.*[a-zñ])(?=.*[A-ZÑ])(?=.*\d)[A-Za-zñÑ\d]{8,}$/;

    if (!passwordPattern.test(form.password)) {
      setError(
        'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número. No admite caracteres especiales.'
      );
      return;
    }

    if (form.role === 'TECNICO' && !form.profession) {
      setError('Seleccioná tu profesión para continuar.');
      return;
    }

    const userData = {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      role: form.role,
      ...(form.phone.trim() ? { phone: form.phone.trim() } : {}),
      ...(form.role === 'TECNICO'
        ? { profession: form.profession }
        : {}),
    };

    setLoading(true);

    try {
      await registerRequest(userData);

      setSuccess(
        '¡Tu cuenta se creó correctamente! Ya podés iniciar sesión.'
      );
      setForm(initialForm);
    } catch (err) {
      const responseMessage = err.response?.data?.message;

      setError(
        Array.isArray(responseMessage)
          ? responseMessage.join(' ')
          : responseMessage ||
              'No se pudo crear la cuenta. Verificá los datos e intentá nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-10">
      <section className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg sm:p-8">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-[#011659]">
            Crear cuenta
          </h1>
          <p className="mt-2 text-gray-600">
            Unite a UrbanFix y encontrá la ayuda que necesitás.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            role="status"
            className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800"
          >
            <p>{success}</p>
            <Link
              to="/login"
              className="mt-3 inline-block font-semibold underline"
            >
              Ir a iniciar sesión
            </Link>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
              autoComplete="name"
              minLength={2}
              maxLength={100}
              value={form.name}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
              placeholder="Tu nombre y apellido"
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
              name="email"
              type="email"
              autoComplete="email"
              maxLength={120}
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
              placeholder="nombre@correo.com"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Teléfono (opcional)
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              minLength={8}
              maxLength={20}
              value={form.phone}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
              placeholder="Ej.: 11 1234 5678"
            />
          </div>

          <div>
            <label
              htmlFor="role"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              ¿Cómo vas a usar UrbanFix?
            </label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            >
              <option value="CLIENTE">Busco un servicio (cliente)</option>
              <option value="TECNICO">Ofrezco servicios (técnico)</option>
            </select>
          </div>

          {form.role === 'TECNICO' && (
            <div>
              <label
                htmlFor="profession"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Tu profesión
              </label>
              <select
                id="profession"
                name="profession"
                value={form.profession}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Seleccioná una profesión</option>
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
          )}

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              maxLength={72}
              value={form.password}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
              placeholder="Mínimo 8 caracteres"
            />
            <p className="mt-1 text-xs text-gray-500">
              Debe incluir mayúscula, minúscula y número, sin caracteres especiales.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#011659] px-4 py-3 font-semibold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          ¿Ya tenés una cuenta?{' '}
          <Link
            to="/login"
            className="font-semibold text-[#011659] underline"
          >
            Iniciá sesión
          </Link>
        </p>
      </section>
    </main>
  );
}
