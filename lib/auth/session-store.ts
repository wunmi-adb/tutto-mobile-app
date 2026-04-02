import { AuthSession } from "@/lib/auth/types";

type AuthSessionListener = (session: AuthSession | null) => void;

let currentSession: AuthSession | null = null;
const listeners = new Set<AuthSessionListener>();

export function getAuthSession() {
  return currentSession;
}

export function syncAuthSession(session: AuthSession | null) {
  currentSession = session;
  listeners.forEach((listener) => listener(session));
}

export function subscribeToAuthSession(listener: AuthSessionListener) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}
