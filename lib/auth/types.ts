export type AuthSession = {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  refresh_expires_at: number;
};

export type AuthCallbackSuccess = {
  status: "success";
  redirectUri: string;
  session: AuthSession;
};

export type AuthCallbackError = {
  status: "error";
  redirectUri: string;
  errorKey: string | null;
};

export type AuthCallbackResult = AuthCallbackSuccess | AuthCallbackError;
