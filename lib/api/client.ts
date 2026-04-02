import axios from "axios";
import { API_BASE_URL, getApiBaseUrl } from "@/lib/api/config";
import { ensureValidAuthSession, refreshAuthSession } from "@/lib/auth/refresh";
import { getAuthSession } from "@/lib/auth/session-store";

declare module "axios" {
  interface AxiosRequestConfig {
    skipAuth?: boolean;
    _retry?: boolean;
  }
}

function isAbsoluteUrl(url?: string) {
  return typeof url === "string" && /^[a-z][a-z\\d+.-]*:/i.test(url);
}

function setAuthorizationHeader(config: { headers?: unknown }, accessToken: string) {
  const authorizationValue = `Bearer ${accessToken}`;
  const headers = config.headers;

  if (headers && typeof headers === "object" && "set" in headers && typeof headers.set === "function") {
    headers.set("Authorization", authorizationValue);
    return;
  }

  config.headers = {
    ...(headers && typeof headers === "object" ? headers : {}),
    Authorization: authorizationValue,
  };
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

apiClient.interceptors.request.use(async (config) => {
  if (!config.baseURL && !isAbsoluteUrl(config.url)) {
    config.baseURL = getApiBaseUrl();
  }

  if (config.skipAuth) {
    return config;
  }

  const session = await ensureValidAuthSession();

  if (session?.access_token) {
    setAuthorizationHeader(config, session.access_token);
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest || originalRequest.skipAuth || originalRequest._retry || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (!getAuthSession()) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const refreshedSession = await refreshAuthSession();

      if (!refreshedSession?.access_token) {
        return Promise.reject(error);
      }

      setAuthorizationHeader(originalRequest, refreshedSession.access_token);
      return apiClient(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  },
);
