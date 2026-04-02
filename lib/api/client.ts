import axios from "axios";
import { API_BASE_URL, getApiBaseUrl } from "@/lib/api/config";

function isAbsoluteUrl(url?: string) {
  return typeof url === "string" && /^[a-z][a-z\\d+.-]*:/i.test(url);
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  if (!config.baseURL && !isAbsoluteUrl(config.url)) {
    config.baseURL = getApiBaseUrl();
  }

  return config;
});
