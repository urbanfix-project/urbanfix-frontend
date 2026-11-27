
import api from './api';

export const getMyServiceRequests = async () => {
  const response = await api.get('/service-requests/mine');
  return response.data;
};

export const createServiceRequest = async (requestData) => {
  const response = await api.post('/service-requests', requestData);
  return response.data;
};
