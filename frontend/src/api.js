import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

const apiUrl = "/choreo-apis/awbo/backend/rest-api-be2/v1.0";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : apiUrl,
});

api.interceptors.request.use(
  (config) => {
    // Check admin, then regular users
    const sessionToken = sessionStorage.getItem(ACCESS_TOKEN);
    const localToken = localStorage.getItem(ACCESS_TOKEN) || localStorage.getItem("access");
    const token = sessionToken || localToken;

    console.log("🔐 API Request - Using token from:", sessionToken ? "sessionStorage" : "localStorage");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;