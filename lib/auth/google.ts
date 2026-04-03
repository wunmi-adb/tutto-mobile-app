import * as Linking from "expo-linking";
import { apiClient } from "@/lib/api/client";
import { ApiResponse } from "@/lib/api/types";
import { normalizeAuthSession } from "@/lib/auth/session";
import { AuthCallbackResult } from "@/lib/auth/types";

type GoogleRedirectData = {
  redirect_url: string;
};

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

export async function getGoogleAuthRedirectUrl(redirectUri: string, locale: string) {
  const response = await apiClient.get<ApiResponse<GoogleRedirectData>>("/api/v1/auth/google", {
    params: {
      redirect_uri: redirectUri,
      locale,
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

  const session = normalizeAuthSession({
    access_token: params.access_token,
    refresh_token: params.refresh_token,
    expires_at: params.expires_at,
    refresh_expires_at: params.refresh_expires_at,
  });

  if ((status === "success" || typeof status !== "string") && session) {
    return {
      status: "success",
      redirectUri,
      session,
    };
  }

  return null;
}
