// src/services/api.js
import axios from 'axios';

// Create an instance with your base backend URL
const API = axios.create({
  baseURL: 'http://localhost:8081',
});

// Add a request interceptor to attach the JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;