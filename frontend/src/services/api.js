import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const client = axios.create({
  baseURL: API_BASE,
  timeout: 12000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Helper for handling API responses cleanly
export async function getCurrentWeather(city = 'New Delhi', lat = null, lon = null) {
  const params = {};
  if (lat && lon) {
    params.lat = lat;
    params.lon = lon;
    if (city) params.city = city;
  } else {
    params.city = city;
  }
  const res = await client.get('/weather/current', { params });
  return res.data.data;
}

export async function getForecast(city = 'New Delhi', lat = null, lon = null, days = 7) {
  const params = { days };
  if (lat && lon) {
    params.lat = lat;
    params.lon = lon;
  } else {
    params.city = city;
  }
  const res = await client.get('/weather/forecast', { params });
  return res.data;
}

export async function getAlerts(city = 'New Delhi', lat = null, lon = null) {
  const params = {};
  if (lat && lon) {
    params.lat = lat;
    params.lon = lon;
  } else {
    params.city = city;
  }
  const res = await client.get('/weather/alerts', { params });
  return res.data.alerts;
}

export async function getHistoricalClimate(city = 'New Delhi', lat = null, lon = null) {
  const params = {};
  if (lat && lon) {
    params.lat = lat;
    params.lon = lon;
  } else {
    params.city = city;
  }
  const res = await client.get('/weather/history', { params });
  return res.data.data;
}

export async function getAgroAdvisory(city = 'New Delhi', lat = null, lon = null) {
  const params = {};
  if (lat && lon) {
    params.lat = lat;
    params.lon = lon;
  } else {
    params.city = city;
  }
  const res = await client.get('/weather/agriculture', { params });
  return res.data.data;
}

export async function searchLocations(query = '') {
  const res = await client.get('/weather/locations', { params: { search: query } });
  return res.data.locations || [];
}

export async function sendChatMessage(message, language = 'en', location = 'New Delhi', sessionId = 'default_user') {
  const res = await client.post('/chat', { message, language, location, sessionId });
  return res.data.data;
}

export async function getChatHistory(sessionId = 'default_user') {
  const res = await client.get('/chat/history', { params: { sessionId } });
  return res.data.history || [];
}

export async function clearChatHistory(sessionId = 'default_user') {
  const res = await client.post('/chat/clear', { sessionId });
  return res.data;
}

export async function getSavedLocations(sessionId = 'default_user') {
  const res = await client.get('/saved-locations', { params: { sessionId } });
  return res.data.locations || [];
}

export async function addSavedLocation(cityName, sessionId = 'default_user', notes = '') {
  const res = await client.post('/saved-locations', { cityName, sessionId, notes });
  return res.data;
}

export async function deleteSavedLocation(id) {
  const res = await client.delete(`/saved-locations/${id}`);
  return res.data;
}

export async function checkHealth() {
  const res = await client.get('/health');
  return res.data;
}

export default client;
