import { AuthSession } from "@/lib/auth/types";

const EXPIRY_BUFFER_SECONDS = 30;

export function parseAuthTimestamp(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

export function isAuthSession(value: unknown): value is AuthSession {
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

export function normalizeAuthSession(value: unknown) {
  if (!value || typeof value !== "object") {
    return null;
  }

  const session = value as Record<string, unknown>;
  const normalizedSession = {
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_at: parseAuthTimestamp(session.expires_at),
    refresh_expires_at: parseAuthTimestamp(session.refresh_expires_at),
  };

  return isAuthSession(normalizedSession) ? normalizedSession : null;
}

function getUnixNow() {
  return Math.floor(Date.now() / 1000);
}

export function isAccessTokenExpired(session: AuthSession, bufferSeconds = EXPIRY_BUFFER_SECONDS) {
  return session.expires_at <= getUnixNow() + bufferSeconds;
}

export function isRefreshTokenExpired(session: AuthSession, bufferSeconds = EXPIRY_BUFFER_SECONDS) {
  return session.refresh_expires_at <= getUnixNow() + bufferSeconds;
}
