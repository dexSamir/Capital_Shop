import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://capital-shop-1sgi.onrender.com/api";

export const API_ROOT_URL = API_BASE_URL.replace("/api", "");

export const getImageUrl = (imagePath: string | null | undefined) => {
  if (!imagePath) return "/placeholder.svg";
  if (imagePath.startsWith("http") || imagePath.startsWith("data:")) return imagePath;
  const cleanPath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;
  return `${API_ROOT_URL}/${cleanPath}`;
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
