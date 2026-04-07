// src/services/http.ts
import axios from "axios";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // <- той самий ключ
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
