
import api from "./api";

// Obtener solicitudes disponibles para técnicos
export const getAvailableServiceRequests = async () => {
  const response = await api.get("/service-requests/available");
  return response.data;
};

// Aceptar una solicitud disponible
export const acceptServiceRequest = async (id) => {
  const response = await api.patch(
    `/service-requests/${id}/accept`
  );
  return response.data;
};

// Rechazar una solicitud asignada al técnico
export const rejectServiceRequest = async (id) => {
  const response = await api.patch(
    `/service-requests/${id}/reject`
  );
  return response.data;
};
