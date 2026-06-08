// Centralized API client.
// One axios instance for the whole app: single base URL, and the JWT (if present)
// is attached automatically to every request. This removes the hardcoded
// "http://localhost:3001" URLs scattered across components.
import axios from "axios";

const client = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3001/api",
  timeout: 15000,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
