import API from './api';

const decodeToken = (token) => {
  try {
    const base64 = token.split('.')[1];
    const decoded = JSON.parse(atob(base64));
    return decoded;
  } catch {
    return null;
  }
};

export const signup = async (userData) => {
  const response = await API.post('/auth/signup', userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await API.post('/auth/login', credentials);
  const token = response.data;
  localStorage.setItem('token', token);
  const decoded = decodeToken(token);
  if (decoded) {
    localStorage.setItem('role', decoded.role);
    localStorage.setItem('email', decoded.sub);
  }
  return token;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('email');
  window.location.href = '/login';
};

export const isLoggedIn = () => {
  return localStorage.getItem('token') !== null;
};

export const getRole = () => {
  return localStorage.getItem('role');
};

export const getEmail = () => {
  return localStorage.getItem('email');
};