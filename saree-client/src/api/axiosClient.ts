import axios from "axios";
import type { AxiosRequestConfig, AxiosRequestHeaders, InternalAxiosRequestConfig } from "axios";

// Create Axios instance
const api = axios.create({
  baseURL: "http://localhost:5000/api", // Backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add JWT token to each request if exists
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token");

  // Ensure headers is never undefined
  config.headers = config.headers || {} as AxiosRequestHeaders;

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

// Helper function for multipart/form-data (file uploads)
export const apiMultipart = (config: AxiosRequestConfig) => {
  // Create headers using AxiosHeaders
  const headers = new axios.AxiosHeaders({
    ...(config.headers || {}),
    "Content-Type": "multipart/form-data",
  });

  return api({
    ...config,
    headers,
  });
};

export default api;
