import axios from "axios";
import { getToken } from "../lib/auth";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Configured axios instance for API requests
 * Automatically includes authentication headers when token is available
 */

const api = axios.create({
  baseURL,
});

/**
 * Request interceptor to automatically add authentication token
 * Runs before every API request to include Bearer token in headers
 */
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token && config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

/**
 * Response interceptor for global error handling
 * Can be extended to handle common response patterns
 */
api.interceptors.response.use(
  (response) => {
    // Return successful responses as-is
    return response;
  },
  (error) => {
    // Global error handling can be added here
    // For now, just pass the error through
    return Promise.reject(error);
  }
);

export default api;
