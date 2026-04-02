import { clearStoredCurrentUser } from "@/lib/api/profile";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { clearStoredAuthSession, getStoredAuthSession, storeAuthSession } from "@/lib/auth/storage";
import { isAccessTokenExpired, isRefreshTokenExpired } from "@/lib/auth/session";
import { subscribeToAuthSession, syncAuthSession } from "@/lib/auth/session-store";
import { AuthSession } from "@/lib/auth/types";
import { refreshAuthSession } from "@/lib/auth/refresh";

type AuthContextValue = {
  ready: boolean;
  isAuthenticated: boolean;
  session: AuthSession | null;
  setSession: (session: AuthSession) => Promise<void>;
  clearSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<AuthSession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    return subscribeToAuthSession(setSessionState);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const hydrateSession = async () => {
      try {
        const storedSession = await getStoredAuthSession();

        if (!storedSession) {
          await clearStoredCurrentUser();

          if (!cancelled) {
            syncAuthSession(null);
          }

          return;
        }

        if (isRefreshTokenExpired(storedSession)) {
          await clearStoredAuthSession();
          await clearStoredCurrentUser();

          if (!cancelled) {
            syncAuthSession(null);
          }

          return;
        }

        if (!cancelled) {
          syncAuthSession(storedSession);
        }

        if (isAccessTokenExpired(storedSession)) {
          try {
            await refreshAuthSession();
          } catch (error) {
            console.warn("Failed to refresh stored auth session.", error);
          }
        }
      } catch (error) {
        console.warn("Failed to hydrate auth session.", error);
      } finally {
        if (!cancelled) {
          setReady(true);
        }
      }
    };

    hydrateSession();

    return () => {
      cancelled = true;
    };
  }, []);

  const setSession = async (nextSession: AuthSession) => {
    syncAuthSession(nextSession);

    try {
      await clearStoredCurrentUser();
      await storeAuthSession(nextSession);
    } catch (error) {
      console.warn("Failed to persist auth session.", error);
    }
  };

  const clearSession = async () => {
    syncAuthSession(null);

    try {
      await clearStoredAuthSession();
      await clearStoredCurrentUser();
    } catch (error) {
      console.warn("Failed to clear auth session.", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ready,
        isAuthenticated: !!session,
        session,
        setSession,
        clearSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
