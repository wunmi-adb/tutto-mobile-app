import { useMutation } from "@tanstack/react-query";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useEffect, useState } from "react";
import { useI18n } from "@/i18n";
import { TranslationKey } from "@/i18n/messages";
import { getGoogleAuthRedirectUrl, parseGoogleAuthCallback } from "@/lib/auth/google";
import { useAuth } from "@/providers/AuthProvider";

const AUTH_CALLBACK_PATH = "auth/callback";

type UseGoogleAuthOptions = {
  onSuccess: () => void;
};

const GOOGLE_AUTH_ERROR_KEY_MAP: Record<string, TranslationKey> = {
  access_denied: "auth.google.errors.accessDenied",
  access_denied_by_user: "auth.google.errors.accessDenied",
  account_conflict: "auth.google.errors.accountConflict",
  account_exists: "auth.google.errors.accountConflict",
  invalid_state: "auth.google.errors.invalidState",
  invalid_session: "auth.google.errors.invalidState",
  session_expired: "auth.google.errors.invalidState",
  user_not_found: "auth.google.errors.userNotFound",
};

WebBrowser.maybeCompleteAuthSession();

function getGoogleAuthErrorMessage(errorKey: string | null, t: (key: TranslationKey) => string) {
  if (!errorKey) {
    return t("auth.google.errors.generic");
  }

  return t(GOOGLE_AUTH_ERROR_KEY_MAP[errorKey] ?? "auth.google.errors.generic");
}

export function useGoogleAuth({ onSuccess }: UseGoogleAuthOptions) {
  const { t } = useI18n();
  const { setSession } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isBrowserOpen, setIsBrowserOpen] = useState(false);
  const redirectUri = AuthSession.makeRedirectUri({
    path: AUTH_CALLBACK_PATH,
  });

  const redirectMutation = useMutation({
    mutationFn: () => getGoogleAuthRedirectUrl(redirectUri),
    onError: () => {
      setError(t("auth.google.errors.generic"));
    },
  });

  useEffect(() => {
    return () => {
      WebBrowser.coolDownAsync().catch(() => {});
    };
  }, []);

  const close = useCallback(async () => {
    setIsBrowserOpen(false);
    await WebBrowser.dismissBrowser();
  }, []);

  const runAuthSession = useCallback(
    async (redirectUrl: string) => {
      try {
        setIsBrowserOpen(true);
        const result = await WebBrowser.openAuthSessionAsync(redirectUrl, redirectUri);
        setIsBrowserOpen(false);

        if (result.type === "cancel" || result.type === "dismiss") {
          return;
        }

        if (result.type !== "success" || !result.url) {
          setError(t("auth.google.errors.generic"));
          return;
        }

        const callbackResult = parseGoogleAuthCallback(result.url);

        if (!callbackResult) {
          setError(t("auth.google.errors.generic"));
          return;
        }

        if (callbackResult.status === "error") {
          setError(getGoogleAuthErrorMessage(callbackResult.errorKey, t));
          return;
        }

        await setSession(callbackResult.session);
        await WebBrowser.dismissBrowser();
        onSuccess();
      } catch (error) {
        setIsBrowserOpen(false);
        console.warn("Failed to complete Google auth session.", error);
        setError(t("auth.google.errors.generic"));
      }
    },
    [onSuccess, redirectUri, setSession, t],
  );

  const open = useCallback(() => {
    if (redirectMutation.isPending || isBrowserOpen) {
      return;
    }

    setError(null);
    redirectMutation.reset();
    redirectMutation.mutate(undefined, {
      onSuccess: (redirectUrl) => {
        runAuthSession(redirectUrl);
      },
    });
  }, [isBrowserOpen, redirectMutation, runAuthSession]);

  const retry = useCallback(() => {
    open();
  }, [open]);

  return {
    isLoading: redirectMutation.isPending || isBrowserOpen,
    error,
    open,
    close,
    retry,
  };
}
