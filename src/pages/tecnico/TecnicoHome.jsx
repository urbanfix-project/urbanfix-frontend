import { useAuth } from "../../context/useAuth";

const solicitudesDemo = [
  {
    id: 1,
    servicio: "Reparación de instalación eléctrica",
    cliente: "Cliente de ejemplo",
    zona: "Pilar",
    estado: "Pendiente",
  },
  {
    id: 2,
    servicio: "Mantenimiento de aire acondicionado",
    cliente: "Cliente de ejemplo",
    zona: "Tortuguitas",
    estado: "En proceso",
  },
  {
    id: 3,
    servicio: "Revisión de tablero eléctrico",
    cliente: "Cliente de ejemplo",
    zona: "Malvinas Argentinas",
    estado: "Completado",
  },
];

export default function TecnicoHome() {
  const { user, logout } = useAuth();

  const nombre = user?.name || "Técnico";

  return (
    <div className="min-h-screen bg-[#F5F8FE]">
      <header className="flex items-center justify-between bg-[#011659] px-6 py-5 text-white">
        <h1 className="text-2xl font-bold">
          Urban<span className="text-[#FF5F15]">Fix</span>
        </h1>

        <button
          onClick={logout}
          className="rounded-lg bg-[#FF5F15] px-4 py-2 text-sm font-semibold"
        >
          Cerrar sesión
        </button>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <h2 className="text-3xl font-bold text-[#011659]">
          ¡Bienvenido, {nombre}!
        </h2>

        <p className="mt-2 text-gray-600">
          Panel de gestión de servicios técnicos.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            ["Solicitudes pendientes", 1],
            ["Trabajos en curso", 1],
            ["Trabajos completados", 1],
          ].map(([titulo, cantidad]) => (
            <div
              key={titulo}
              className="rounded-2xl bg-white p-6 shadow-sm"
            >
              <p className="text-sm text-gray-500">{titulo}</p>
              <p className="mt-3 text-4xl font-bold text-[#011659]">
                {cantidad}
              </p>
            </div>
          ))}
        </div>

        <section className="mt-10 rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="mb-5 text-xl font-bold text-[#011659]">
            Solicitudes de servicio
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="p-4">Servicio</th>
                  <th className="p-4">Cliente</th>
                  <th className="p-4">Zona</th>
                  <th className="p-4">Estado</th>
                </tr>
              </thead>

              <tbody>
                {solicitudesDemo.map((solicitud) => (
                  <tr key={solicitud.id} className="border-b">
                    <td className="p-4">{solicitud.servicio}</td>
                    <td className="p-4">{solicitud.cliente}</td>
                    <td className="p-4">{solicitud.zona}</td>
                    <td className="p-4 font-semibold text-[#011659]">
                      {solicitud.estado}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <p className="mt-6 text-center text-sm text-gray-500">
          Vista demostrativa. Los datos son ilustrativos y no
          representan solicitudes reales.
        </p>
      </main>
    </div>
  );
}