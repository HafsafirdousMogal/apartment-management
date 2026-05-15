import axios from 'axios';

// Base URL of your Spring Boot backend
const API = axios.create({
  baseURL: 'http://localhost:8080'
});

// Automatically attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;