import Constants from "expo-constants";

const apiUrlFromExpoConfig = Constants.expoConfig?.extra?.apiUrl;

export const API_TIMEOUT_MS = 120000;

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  (typeof apiUrlFromExpoConfig === "string" ? apiUrlFromExpoConfig : undefined);

export function getApiBaseUrl() {
  if (!API_BASE_URL) {
    throw new Error("Missing API base URL. Set EXPO_PUBLIC_API_URL before making API requests.");
  }

  return API_BASE_URL;
}
