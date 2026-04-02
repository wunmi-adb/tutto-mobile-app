import * as SecureStore from "expo-secure-store";
import { AuthSession } from "@/lib/auth/types";

const AUTH_SESSION_STORAGE_KEY = "tutto.auth.session";

function isAuthSession(value: unknown): value is AuthSession {
  if (!value || typeof value !== "object") {
    return false;
  }

  const session = value as AuthSession;

  return (
    typeof session.access_token === "string" &&
    typeof session.refresh_token === "string" &&
    typeof session.expires_at === "number" &&
    typeof session.refresh_expires_at === "number"
  );
}

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
