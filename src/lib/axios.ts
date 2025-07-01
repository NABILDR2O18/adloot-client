import axios from "axios";
import { parseCookies } from "nookies";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASEURL + "/v1/api",
});

api.interceptors.request.use((config) => {
  const cookies = parseCookies();
  const token = cookies.session;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
