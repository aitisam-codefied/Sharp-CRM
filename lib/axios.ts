import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Attach token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("sms_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
