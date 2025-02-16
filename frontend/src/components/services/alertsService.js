// src/services/alertsService.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/alerts';

// Fetch all alerts
export const fetchAlerts = async () => {
  const response = await axios.get(`${API_URL}/`);
  return response.data;
};

// Mark an alert as read
export const markAlertAsRead = async (alertId) => {
  const response = await axios.put(`${API_URL}/${alertId}/read`);
  return response.data;
};

// Mark all alerts as read
export const markAllAlertsAsRead = async () => {
  const response = await axios.put(`${API_URL}/read_all`);
  return response.data;
};

// Delete all alerts
export const deleteAllAlerts = async () => {
  const response = await axios.delete(`${API_URL}/delete_all`);
  return response.data;
};
