import API from './api';

export const getApartments = async () => {
  const response = await API.get('/apartments');
  return response.data;
};

export const addApartment = async (apartment) => {
  const response = await API.post('/apartments', apartment);
  return response.data;
};

export const deleteApartment = async (id) => {
  const response = await API.delete(`/apartments/${id}`);
  return response.data;
};