import * as SecureStore from "expo-secure-store";
import { isAuthSession } from "@/lib/auth/session";
import { AuthSession } from "@/lib/auth/types";

const AUTH_SESSION_STORAGE_KEY = "tutto.auth.session";

export async function getStoredAuthSession() {
  const rawValue = await SecureStore.getItemAsync(AUTH_SESSION_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as unknown;

    return isAuthSession(parsed) ? parsed : null;
  } catch (error) {
    console.warn("Failed to parse stored auth session.", error);
    return null;
  }
}

export async function storeAuthSession(session: AuthSession) {
  await SecureStore.setItemAsync(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session));
}

export async function clearStoredAuthSession() {
  await SecureStore.deleteItemAsync(AUTH_SESSION_STORAGE_KEY);
}
