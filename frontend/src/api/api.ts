import axios from "axios";
import { getToken } from "../lib/auth";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((cfg) => {
  const token = getToken();
  if (token && cfg.headers) {
    cfg.headers["Authorization"] = `Bearer ${token}`;
  }
  return cfg;
});

export default api;
