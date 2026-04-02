import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { clearStoredAuthSession, getStoredAuthSession, storeAuthSession } from "@/lib/auth/storage";
import { AuthSession } from "@/lib/auth/types";

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
    let cancelled = false;

    const hydrateSession = async () => {
      try {
        const storedSession = await getStoredAuthSession();

        if (!cancelled) {
          setSessionState(storedSession);
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
    setSessionState(nextSession);

    try {
      await storeAuthSession(nextSession);
    } catch (error) {
      console.warn("Failed to persist auth session.", error);
    }
  };

  const clearSession = async () => {
    setSessionState(null);

    try {
      await clearStoredAuthSession();
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
