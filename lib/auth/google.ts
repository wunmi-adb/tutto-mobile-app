import * as Linking from "expo-linking";
import { apiClient } from "@/lib/api/client";
import { AuthCallbackResult, AuthSession } from "@/lib/auth/types";

type GoogleRedirectResponse = {
  data: {
    redirect_url: string;
  };
  message: string;
  status: boolean;
};

function parseNumber(value: unknown) {
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

function getUrlParams(url: string) {
  const parsed = Linking.parse(url);
  const params = { ...(parsed.queryParams ?? {}) } as Record<string, unknown>;
  const hashIndex = url.indexOf("#");

  if (hashIndex >= 0) {
    const fragment = url.slice(hashIndex + 1);
    const fragmentParams = new URLSearchParams(fragment);

    for (const [key, value] of fragmentParams.entries()) {
      params[key] = value;
    }
  }

  return params;
}

export async function getGoogleAuthRedirectUrl(redirectUri: string) {
  const response = await apiClient.get<GoogleRedirectResponse>("/api/v1/auth/google", {
    params: {
      redirect_uri: redirectUri,
    },
  });

  return response.data.data.redirect_url;
}

export function parseGoogleAuthCallback(url: string): AuthCallbackResult | null {
  const params = getUrlParams(url);
  const status = params.status;
  const parsedUrl = Linking.parse(url);
  const redirectUri = `${parsedUrl.scheme}://${parsedUrl.path ?? ""}`;

  if (status === "error") {
    return {
      status: "error",
      redirectUri,
      errorKey: typeof params.error_key === "string" ? params.error_key : null,
    };
  }

  const session = {
    access_token: params.access_token,
    refresh_token: params.refresh_token,
    expires_at: parseNumber(params.expires_at),
    refresh_expires_at: parseNumber(params.refresh_expires_at),
  };

  if (
    (status === "success" || typeof status !== "string") &&
    isAuthSession(session)
  ) {
    return {
      status: "success",
      redirectUri,
      session,
    };
  }

  return null;
}
