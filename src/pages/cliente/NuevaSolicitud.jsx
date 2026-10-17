
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../services/api";

const oficios = [
  "Plomería",
  "Electricidad",
  "Gasista",
  "Cerrajería",
  "Carpintería",
  "Pintura",
  "Aire acondicionado",
  "No sé / puede ser más de un oficio",
];

const profesiones = {
  Plomería: "PLOMERO",
  Electricidad: "ELECTRICISTA",
  Gasista: "GASISTA",
  Cerrajería: "CERRAJERO",
  Carpintería: "CARPINTERO",
  Pintura: "PINTOR",
  "Aire acondicionado": "TECNICO_AIRE_ACONDICIONADO",
};

const horarios = [
  { label: "Mañana (9 a 13hs)", value: "Mañana (09:00 a 13:00 hs)" },
  { label: "Tarde (13-18hs)", value: "Tarde (15:00 a 18:00 hs)" },
  { label: "Noche (18-21hs)", value: "Noche (18:00 a 21:00 hs)" },
  { label: "Fin de semana", value: "Fin de semana" },
];

const pasos = ["Oficio", "Problema", "Ubicación", "Horario"];

export default function NuevaSolicitud() {
  const navigate = useNavigate();

  const [paso, setPaso] = useState(1);
  const [oficio, setOficio] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fotos, setFotos] = useState([]);
  const [zona, setZona] = useState("");
  const [direccion, setDireccion] = useState("");
  const [horario, setHorario] = useState(horarios[0].value);
  const [publicada, setPublicada] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const seleccionarFotos = (event) => {
    const seleccionadas = Array.from(event.target.files || []);
    const disponibles = Math.max(0, 3 - fotos.length);

    setFotos((actuales) =>
      [...actuales, ...seleccionadas.slice(0, disponibles)].slice(0, 3)
    );

    event.target.value = "";
  };

  const quitarFoto = (index) => {
    setFotos((actuales) => actuales.filter((_, i) => i !== index));
  };

  const siguiente = (event) => {
    event.preventDefault();
    setError("");
    setPaso((actual) => Math.min(actual + 1, 4));
  };

  const anterior = () => {
    setError("");
    setPaso((actual) => Math.max(actual - 1, 1));
  };

  const publicar = async (event) => {
    event.preventDefault();

    if (guardando) return;

    setGuardando(true);
    setError("");

    try {
      const solicitud = {
        title: `Solicitud de ${oficio}`,
        description: descripcion.trim(),
      };

      // Si el cliente no conoce el oficio, no enviamos requiredProfession.
      if (profesiones[oficio]) {
        solicitud.requiredProfession = profesiones[oficio];
      }

      await api.post("/service-requests", solicitud);

      setPublicada(true);
    } catch (err) {
      console.error("Error al crear la solicitud:", err);

      setError(
        err.response?.data?.message ||
          "No se pudo publicar la solicitud. Inténtalo nuevamente."
      );
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FE]">
      <Navbar />

      <main className="mx-auto max-w-[760px] px-5 pb-16 pt-10 sm:pt-14">
        <h1 className="text-center text-base font-bold text-[#011659]">
          Nueva solicitud
        </h1>

        {/* Indicador de pasos */}
        <div className="mx-auto mt-6 flex max-w-[430px] items-center justify-between gap-2">
          {pasos.map((nombre, index) => {
            const numero = index + 1;
            const activo = paso >= numero;

            return (
              <div key={nombre} className="flex items-center gap-2">
                <span
                  className={`flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-full border text-[10px] ${
                    activo
                      ? "border-[#071B68] bg-[#071B68] text-white"
                      : "border-slate-400 text-slate-500"
                  }`}
                >
                  {numero}
                </span>

                <span
                  className={`whitespace-nowrap text-[10px] ${
                    paso === numero
                      ? "font-semibold text-slate-800"
                      : "text-slate-500"
                  }`}
                >
                  {nombre}
                </span>

                {index < 3 && (
                  <span className="ml-1 text-sm text-slate-600">›</span>
                )}
              </div>
            );
          })}
        </div>

        <form
          onSubmit={paso === 4 ? publicar : siguiente}
          className="mx-auto mt-8 w-full max-w-[430px] rounded-2xl bg-white p-6 shadow-[0_8px_30px_rgba(15,35,80,0.03)] sm:p-7"
        >
          {/* PASO 1: OFICIO */}
          {paso === 1 && (
            <>
              <h2 className="text-sm font-bold text-slate-800">
                ¿Qué tipo de trabajo necesitás?
              </h2>

              <label className="mt-4 block text-[10px] text-slate-800">
                Oficio
              </label>

              <select
                value={oficio}
                onChange={(e) => setOficio(e.target.value)}
                required
                className="mt-1 w-full rounded-full border border-[#536B9A] bg-white px-3 py-2 text-[10px] outline-none focus:border-[#FF6422]"
              >
                <option value="">Seleccioná un oficio</option>

                {oficios.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <p className="mt-5 text-[9px] text-[#7185A6]">
                ⓘ Si no estás seguro, elegí la última opción de la lista.
              </p>
            </>
          )}

          {/* PASO 2: PROBLEMA */}
          {paso === 2 && (
            <>
              <h2 className="text-sm font-bold text-slate-800">
                Contanos qué pasó
              </h2>

              <label className="mt-4 block text-[10px] text-slate-800">
                Descripción del problema
              </label>

              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
                rows={4}
                placeholder="Describí el problema..."
                className="mt-1 w-full resize-none rounded-lg border border-[#9AA9C2] px-3 py-2 text-xs outline-none focus:border-[#071B68]"
              />

              <label className="mt-4 block text-[10px] text-slate-800">
                Fotos (opcional)
              </label>

              <div className="mt-2 flex flex-wrap gap-2">
                {fotos.map((foto, index) => (
                  <div
                    key={`${foto.name}-${index}`}
                    className="relative"
                  >
                    <img
                      src={URL.createObjectURL(foto)}
                      alt={`Foto ${index + 1}`}
                      className="h-[64px] w-[64px] rounded-lg border object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => quitarFoto(index)}
                      aria-label="Quitar foto"
                      className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white"
                    >
                      ×
                    </button>
                  </div>
                ))}

                {fotos.length < 3 && (
                  <label className="flex h-[64px] w-[46px] cursor-pointer items-center justify-center rounded-lg border border-dashed border-[#9AA9C2] text-lg text-[#7185A6] hover:bg-slate-50">
                    +
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={seleccionarFotos}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <p className="mt-2 text-[9px] text-[#7185A6]">
                Podés seleccionar hasta 3 fotos. Por ahora solo se muestran
                en pantalla; el endpoint documentado no incluye su carga.
              </p>
            </>
          )}

          {/* PASO 3: UBICACIÓN */}
          {paso === 3 && (
            <>
              <h2 className="text-sm font-bold text-slate-800">
                ¿Dónde es el trabajo?
              </h2>

              <label className="mt-4 block text-[10px] text-slate-800">
                Localidad / Zona
              </label>

              <input
                value={zona}
                onChange={(e) => setZona(e.target.value)}
                required
                placeholder="Ej.: Centro, Quito"
                className="mt-1 w-full rounded-full border border-[#9AA9C2] px-3 py-2 text-[10px] outline-none focus:border-[#071B68]"
              />

              <label className="mt-4 block text-[10px] text-slate-800">
                Dirección exacta
              </label>

              <input
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                required
                placeholder="Calle y número"
                className="mt-1 w-full rounded-full border border-[#9AA9C2] px-3 py-2 text-[10px] outline-none focus:border-[#071B68]"
              />

              <p className="mt-5 text-[9px] text-[#7185A6]">
                ⓘ Esta dirección solo se comparte con el técnico si acepta el
                trabajo.
              </p>
            </>
          )}

          {/* PASO 4: HORARIO Y RESUMEN */}
          {paso === 4 && (
            <>
              <h2 className="text-sm font-bold text-slate-800">
                ¿Cuándo te viene bien?
              </h2>

              <p className="mt-4 text-[10px] text-slate-800">
                Seleccioná la franja horaria para la visita
              </p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {horarios.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setHorario(item.value)}
                    className={`rounded-full border px-3 py-1.5 text-[9px] transition ${
                      horario === item.value
                        ? "border-[#071B68] bg-[#071B68] text-white"
                        : "border-[#9AA9C2] text-[#536B9A] hover:bg-slate-50"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="mt-5 rounded-xl border border-[#9AA9C2] bg-[#F7F8FC] p-3 text-[10px] text-[#7185A6]">
                <p className="font-semibold text-[#011659]">
                  Resumen de tu solicitud
                </p>

                <ul className="mt-2 list-disc pl-4">
                  <li>Servicio: {oficio}</li>
                  <li>Descripción: {descripcion}</li>
                  <li>Zona: {zona}</li>
                  <li>Dirección: {direccion}</li>
                  <li>Visita: {horario}</li>
                  <li>Fotos adjuntas: {fotos.length}</li>
                  <li>Presupuesto: A convenir en la visita</li>
                </ul>
              </div>
            </>
          )}

          {error && (
            <p
              role="alert"
              className="mt-4 rounded-lg bg-red-50 p-3 text-xs text-red-700"
            >
              {error}
            </p>
          )}

          {/* BOTONES */}
          <div className="mt-6 flex justify-end gap-2">
            {paso > 1 && (
              <button
                type="button"
                onClick={anterior}
                disabled={guardando}
                className="rounded-full border border-[#071B68] px-5 py-2 text-[10px] font-semibold text-[#071B68] hover:bg-slate-50 disabled:opacity-60"
              >
                Atrás
              </button>
            )}

            {paso < 4 ? (
              <button
                type="submit"
                className="rounded-full bg-[#FF6422] px-5 py-2 text-[10px] font-semibold text-white hover:bg-[#e9500c]"
              >
                Siguiente
              </button>
            ) : (
              <button
                type="submit"
                disabled={guardando}
                className="rounded-full bg-[#FF6422] px-4 py-2 text-[10px] font-semibold text-white hover:bg-[#e9500c] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {guardando ? "Publicando..." : "Confirmar y publicar"}
              </button>
            )}
          </div>
        </form>
      </main>

      {/* MODAL DE ÉXITO */}
      {publicada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-exito"
            className="w-full max-w-[340px] rounded-2xl bg-white px-5 py-7 text-center shadow-xl"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border-[4px] border-[#10B969] text-3xl font-bold text-[#10B969]">
              ✓
            </div>

            <h2
              id="titulo-exito"
              className="mt-5 text-sm font-bold text-slate-800"
            >
              ¡Solicitud publicada con éxito!
            </h2>

            <p className="mx-auto mt-3 max-w-[260px] text-[10px] leading-4 text-[#7185A6]">
              Tu pedido ya está visible para los técnicos disponibles en tu
              zona. Te avisaremos apenas un profesional acepte el trabajo.
            </p>

            <button
              type="button"
              onClick={() => navigate("/cliente")}
              className="mt-5 w-full rounded-full bg-[#071B68] px-4 py-2.5 text-[10px] font-semibold text-white hover:bg-[#0b267e]"
            >
              Ir a Mis Solicitudes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
