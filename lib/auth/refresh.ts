import axios from "axios";
import { getApiBaseUrl } from "@/lib/api/config";
import { clearStoredCurrentUser } from "@/lib/api/profile";
import {
  isAccessTokenExpired,
  isRefreshTokenExpired,
  normalizeAuthSession,
} from "@/lib/auth/session";
import { getAuthSession, syncAuthSession } from "@/lib/auth/session-store";
import { clearStoredAuthSession, storeAuthSession } from "@/lib/auth/storage";
import { AuthSession } from "@/lib/auth/types";

const AUTH_REFRESH_PATH = "/api/v1/auth/refresh";

type RefreshResponse = {
  data?: unknown;
  message?: string;
  status?: boolean;
};

const refreshClient = axios.create({
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

let refreshPromise: Promise<AuthSession | null> | null = null;

function extractAuthSession(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const value = payload as RefreshResponse & Record<string, unknown>;

  return normalizeAuthSession(value.data) ?? normalizeAuthSession(value);
}

async function clearAuthSessionState() {
  syncAuthSession(null);

  try {
    await clearStoredAuthSession();
    await clearStoredCurrentUser();
  } catch (error) {
    console.warn("Failed to clear auth session after refresh failure.", error);
  }
}

async function persistAuthSession(session: AuthSession) {
  syncAuthSession(session);

  try {
    await storeAuthSession(session);
  } catch (error) {
    console.warn("Failed to persist refreshed auth session.", error);
  }
}

export async function refreshAuthSession() {
  const currentSession = getAuthSession();

  if (!currentSession) {
    return null;
  }

  if (isRefreshTokenExpired(currentSession)) {
    await clearAuthSessionState();
    return null;
  }

  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const response = await refreshClient.post<RefreshResponse>(
        `${getApiBaseUrl()}${AUTH_REFRESH_PATH}`,
        {
          refresh_token: currentSession.refresh_token,
        },
      );

      const nextSession = extractAuthSession(response.data);

      if (!nextSession) {
        throw new Error("Refresh response did not contain a valid auth session.");
      }

      await persistAuthSession(nextSession);
      return nextSession;
    } catch (error) {
      await clearAuthSessionState();
      throw error;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export async function ensureValidAuthSession() {
  const currentSession = getAuthSession();

  if (!currentSession) {
    return null;
  }

  if (isRefreshTokenExpired(currentSession)) {
    await clearAuthSessionState();
    return null;
  }

  if (isAccessTokenExpired(currentSession)) {
    return refreshAuthSession();
  }

  return currentSession;
}
