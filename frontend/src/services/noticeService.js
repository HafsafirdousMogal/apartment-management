import API from './api';

export const getNotices = async () => {
  const response = await API.get('/notices');
  return response.data;
};

export const addNotice = async (notice) => {
  const response = await API.post('/notices', notice);
  return response.data;
};

export const deleteNotice = async (id) => {
  const response = await API.delete(`/notices/${id}`);
  return response.data;
};