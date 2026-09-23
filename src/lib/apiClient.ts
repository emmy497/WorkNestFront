import axios from "axios";
import type { AxiosError } from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use((config: any) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("worknest_token") : null;
  if (token) {
    if (!config.headers) config.headers = {};
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export function extractError(err: unknown, fallback: string) {
  if (axios.isAxiosError(err)) {
    const axiosErr = err as AxiosError & { response?: any };
    return axiosErr.response?.data?.message || axiosErr.message || fallback;
  }

  return fallback;
}

export default apiClient;
