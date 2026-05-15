import API from './api';

export const getRentPayments = async () => {
  const response = await API.get('/rent');
  return response.data;
};

export const createRentPayment = async (tenantId, apartmentId, payment) => {
  const response = await API.post(`/rent/tenant/${tenantId}/apartment/${apartmentId}`, payment);
  return response.data;
};

export const markRentAsPaid = async (id) => {
  const response = await API.put(`/rent/${id}/pay`);
  return response.data;
};