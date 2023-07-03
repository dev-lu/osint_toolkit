import axios from 'axios';

const baseURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
const api = axios.create({
  baseURL: `${baseURL}`,
});

export default api;