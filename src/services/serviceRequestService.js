
import api from "./api";

// Obtener solicitudes disponibles para técnicos
export const getAvailableServiceRequests = async () => {
  const response = await api.get("/service-requests/available");
  return response.data;
};
