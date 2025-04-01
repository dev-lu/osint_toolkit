import axios from 'axios';

const isDevelopment = process.env.NODE_ENV === 'development';
const baseURL = isDevelopment 
  ? 'http://localhost:8000'
  : '';

const api = axios.create({
  baseURL: baseURL,
});

export default api;