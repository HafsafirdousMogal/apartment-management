import API from './api';

export const getComplaints = async () => {
  const response = await API.get('/complaints');
  return response.data;
};

export const raiseComplaint = async (tenantId, apartmentId, complaint) => {
  const response = await API.post(`/complaints/tenant/${tenantId}/apartment/${apartmentId}`, complaint);
  return response.data;
};

export const updateComplaintStatus = async (id, status) => {
  const response = await API.put(`/complaints/${id}/status?status=${status}`);
  return response.data;
};

export const getMaintenanceCharges = async () => {
  const response = await API.get('/maintenance-charges');
  return response.data;
};

export const markChargeAsPaid = async (id) => {
  const response = await API.put(`/maintenance-charges/${id}/pay`);
  return response.data;
};