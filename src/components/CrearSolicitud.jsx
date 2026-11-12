
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

const formularioInicial = {
  title: "",
  requiredProfession: "",
  description: "",
  address: "",
};

export default function CrearSolicitud({ onSolicitudCreada }) {
  const [formulario, setFormulario] = useState(formularioInicial);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formulario.title.trim() ||
      !formulario.requiredProfession ||
      !formulario.description.trim() ||
      !formulario.address.trim()
    ) {
      setError("Completá todos los campos obligatorios.");
      return;
    }

    if (cargando) return;

    setCargando(true);
    setError("");

    try {
      // El contrato actual de Backend todavía no incluye address.
    const respuesta = await createServiceRequest({
  title: formulario.title.trim(),
  requiredProfession: formulario.requiredProfession,
  description: formulario.description.trim(),
  address: formulario.address.trim(),
});
      setFormulario(formularioInicial);
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

  return (
    <form onSubmit={handleSubmit} className="mt-5 space-y-4">
      <div>
        <label htmlFor="solicitud-titulo" className="mb-1 block text-sm font-medium text-gray-700">
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
        <label htmlFor="solicitud-categoria" className="mb-1 block text-sm font-medium text-gray-700">
          Categoría
        </label>
        <select
          id="solicitud-categoria"
          name="requiredProfession"
          value={formulario.requiredProfession}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
        >
          <option value="">Seleccioná una categoría</option>
          {profesiones.map((profesion) => (
            <option key={profesion.value} value={profesion.value}>
              {profesion.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="solicitud-descripcion" className="mb-1 block text-sm font-medium text-gray-700">
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

      <div>
        <label htmlFor="solicitud-direccion" className="mb-1 block text-sm font-medium text-gray-700">
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
       <p className="mt-1 text-xs text-gray-500">
  Indicá la dirección donde el técnico deberá realizar el trabajo.
</p>
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={cargando}
        className="w-full rounded-full bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {cargando ? "Publicando..." : "Publicar solicitud"}
      </button>
    </form>
  );
}
