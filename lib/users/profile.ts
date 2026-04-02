import { apiClient } from "@/lib/api/client";

type UpdateUserProfileResponse = {
  status: boolean;
  message: string;
  data: {
    id: string;
    email: string;
    name: string;
    locale: string;
    provider: string;
    created_at: string;
  };
};

export async function updateCurrentUserLocale(accessToken: string, locale: string) {
  const response = await apiClient.put<UpdateUserProfileResponse>(
    "/api/v1/users/me",
    { locale },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return response.data;
}
