
import { useState } from "react";
import { createServiceRequest } from "../services/serviceRequestService";

const profesiones = [
  { value: "ELECTRICISTA", label: "Electricidad" },
  { value: "PLOMERO", label: "Plomería" },
  { value: "GASISTA", label: "Gas" },
  { value: "TECNICO_AC", label: "Refrigeración" },
  { value: "CERRAJERO", label: "Cerrajería" },
  { value: "ALBANIL", label: "Albañilería" },
];

const pasos = ["Oficio", "Problema", "Ubicación", "Horario"];

const formularioInicial = {
  title: "",
  requiredProfession: "",
  description: "",
  address: "",
};

export default function CrearSolicitud({ onSolicitudCreada }) {
  const [paso, setPaso] = useState(1);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormulario((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const validarPaso = (numero) => {
    if (numero === 1 && !formulario.requiredProfession) {
      return "Seleccioná un oficio para continuar.";
    }

    if (numero === 2) {
      const titulo = formulario.title.trim();
      const descripcion = formulario.description.trim();

      if (titulo.length < 5 || titulo.length > 120) {
        return "El título debe tener entre 5 y 120 caracteres.";
      }

      if (descripcion.length < 10 || descripcion.length > 2000) {
        return "La descripción debe tener entre 10 y 2000 caracteres.";
      }
    }

    if (numero === 3) {
      const direccion = formulario.address.trim();

      if (!direccion || direccion.length > 200) {
        return "Ingresá una dirección válida de hasta 200 caracteres.";
      }
    }

    return "";
  };

  const siguientePaso = () => {
    const mensaje = validarPaso(paso);

    if (mensaje) {
      setError(mensaje);
      return;
    }

    setError("");
    setPaso((actual) => Math.min(actual + 1, 4));
  };

  const pasoAnterior = () => {
    setError("");
    setPaso((actual) => Math.max(actual - 1, 1));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (cargando) return;

    if (paso < 4) {
      siguientePaso();
      return;
    }

    for (let numero = 1; numero <= 3; numero++) {
      const mensaje = validarPaso(numero);

      if (mensaje) {
        setPaso(numero);
        setError(mensaje);
        return;
      }
    }

    setCargando(true);
    setError("");

    try {
      const respuesta = await createServiceRequest({
        title: formulario.title.trim(),
        requiredProfession: formulario.requiredProfession,
        description: formulario.description.trim(),
        address: formulario.address.trim(),
      });

      setFormulario(formularioInicial);
      setPaso(1);

      onSolicitudCreada?.(respuesta?.data ?? respuesta);
    } catch (err) {
      const mensaje = err.response?.data?.message;

      setError(
        Array.isArray(mensaje)
          ? mensaje.join(", ")
          : typeof mensaje === "string"
            ? mensaje
            : "No se pudo publicar la solicitud. Intentá nuevamente."
      );
    } finally {
      setCargando(false);
    }
  };

  const profesionSeleccionada =
    profesiones.find(
      (profesion) =>
        profesion.value === formulario.requiredProfession
    )?.label ?? "";

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mt-5 space-y-6"
    >
      {/* Indicador de pasos */}
      <div className="grid grid-cols-4 gap-2">
        {pasos.map((nombre, indice) => {
          const numero = indice + 1;
          const activo = paso === numero;
          const completado = paso > numero;

          return (
            <div
              key={nombre}
              className="text-center"
              aria-current={activo ? "step" : undefined}
            >
              <div
                className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                  activo || completado
                    ? "bg-orange-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {completado ? "✓" : numero}
              </div>

              <p
                className={`mt-2 text-xs sm:text-sm ${
                  activo
                    ? "font-semibold text-[#011659]"
                    : "text-gray-500"
                }`}
              >
                {nombre}
              </p>
            </div>
          );
        })}
      </div>

      <p className="text-sm text-gray-500">
        Paso {paso} de 4
      </p>

      {/* Paso 1: Oficio */}
      {paso === 1 && (
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-[#011659]">
            ¿Qué profesional necesitás?
          </h3>

          <p className="text-sm text-gray-600">
            Seleccioná el oficio relacionado con tu problema.
          </p>

          <div>
            <label
              htmlFor="solicitud-categoria"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Categoría del servicio
            </label>

            <select
              id="solicitud-categoria"
              name="requiredProfession"
              value={formulario.requiredProfession}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
            >
              <option value="">
                Seleccioná una categoría
              </option>

              {profesiones.map((profesion) => (
                <option
                  key={profesion.value}
                  value={profesion.value}
                >
                  {profesion.label}
                </option>
              ))}
            </select>
          </div>
        </section>
      )}

      {/* Paso 2: Problema */}
      {paso === 2 && (
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-[#011659]">
            Contanos qué necesitás resolver
          </h3>

          <div>
            <label
              htmlFor="solicitud-titulo"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Título del servicio
            </label>

            <input
              id="solicitud-titulo"
              name="title"
              value={formulario.title}
              onChange={handleChange}
              required
              minLength={5}
              maxLength={120}
              placeholder="Ej.: Reparar una pérdida de agua"
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
            />
          </div>

          <div>
            <label
              htmlFor="solicitud-descripcion"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Descripción
            </label>

            <textarea
              id="solicitud-descripcion"
              name="description"
              value={formulario.description}
              onChange={handleChange}
              required
              minLength={10}
              maxLength={2000}
              rows={4}
              placeholder="Describí el problema que necesitás resolver"
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
            />
          </div>
        </section>
      )}

      {/* Paso 3: Ubicación */}
      {paso === 3 && (
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-[#011659]">
            ¿Dónde se realizará el trabajo?
          </h3>

          <div>
            <label
              htmlFor="solicitud-direccion"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Dirección
            </label>

            <input
              id="solicitud-direccion"
              name="address"
              value={formulario.address}
              onChange={handleChange}
              required
              maxLength={200}
              autoComplete="street-address"
              placeholder="Ej.: Calle San Martín 123"
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
            />

            <p className="mt-2 text-xs text-gray-500">
              Indicá la dirección donde el técnico
              deberá realizar el trabajo.
            </p>
          </div>
        </section>
      )}

      {/* Paso 4: Horario y confirmación */}
      {paso === 4 && (
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-[#011659]">
            Revisá tu solicitud
          </h3>

          <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
            <p className="text-sm font-semibold text-[#011659]">
              Selección de horarios
            </p>

            <p className="mt-2 text-sm text-gray-700">
              La selección de horarios todavía no
              está disponible en esta versión.
              Podés publicar la solicitud sin indicar
              un horario.
            </p>
          </div>

          <div className="space-y-3 rounded-xl border border-gray-200 p-4">
            <div>
              <p className="text-xs text-gray-500">
                Oficio
              </p>
              <p className="font-semibold text-gray-800">
                {profesionSeleccionada}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Título
              </p>
              <p className="break-words font-semibold text-gray-800">
                {formulario.title}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Descripción
              </p>
              <p className="whitespace-pre-wrap break-words text-gray-800">
                {formulario.description}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Dirección
              </p>
              <p className="break-words text-gray-800">
                {formulario.address}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Mensaje de error */}
      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {/* Navegación */}
      <div className="flex flex-wrap gap-3">
        {paso > 1 && (
          <button
            type="button"
            onClick={pasoAnterior}
            disabled={cargando}
            className="rounded-full border border-gray-300 px-5 py-3 font-semibold text-[#011659] hover:bg-gray-50 disabled:opacity-60"
          >
            Anterior
          </button>
        )}

        <button
          type="submit"
          disabled={cargando}
          className="min-w-0 flex-1 rounded-full bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {cargando
            ? "Publicando..."
            : paso === 4
              ? "Publicar solicitud"
              : "Siguiente"}
        </button>
      </div>
    </form>
  );
}
