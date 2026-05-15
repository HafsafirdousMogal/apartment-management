import API from './api';

export const getTenants = async () => {
  const response = await API.get('/tenants');
  return response.data;
};

export const addTenant = async (apartmentId, tenant) => {
  const response = await API.post(`/tenants/apartment/${apartmentId}`, tenant);
  return response.data;
};

export const deleteTenant = async (id) => {
  const response = await API.delete(`/tenants/${id}`);
  return response.data;
};

export const getMyProfile = async (email) => {
  const response = await API.get(`/tenants/me?email=${email}`);
  return response.data;
};