import { apiClient } from "@/lib/api/client";
import { ApiResponse } from "@/lib/api/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { QueryClient } from "@tanstack/react-query";

export const CURRENT_USER_QUERY_KEY = ["current-user"] as const;
const CURRENT_USER_STORAGE_KEY = "tutto.current-user";

export type CurrentUserHousehold = {
  allergies?: string | null;
  created_at?: string | null;
  dietary?: string | null;
  dislike?: string | null;
  has_item?: boolean | null;
  id?: string | null;
  invite_code?: string | null;
  is_owner?: boolean | null;
  kitchen_appliances?: string | null;
  love?: string | null;
  meals?: string | null;
  name?: string | null;
  number_of_household?: number | null;
  role?: string | null;
  updated_at?: string | null;
} | null;

export type CurrentUser = {
  email: string;
  household: CurrentUserHousehold;
  has_item?: boolean;
  itemsAdded?: boolean;
  items_added?: boolean;
  locale: string;
  name: string;
};

export type UpdateUserProfile = {
  id: string;
  email: string;
  name: string;
  locale: string;
  provider: string;
  created_at: string;
};

export type DeleteCurrentUserAccountResponse = {
  deleted_household: boolean;
};

export type AppEntryRoute =
  | "/onboarding/household"
  | "/onboarding/appliances"
  | "/onboarding/dietary"
  | "/onboarding/allergies"
  | "/onboarding/cuisines"
  | "/onboarding/meals"
  | "/onboarding/storage"
  | "/kitchen";

function hasCompletedStep(value: string | null | undefined) {
  return typeof value === "string" && value.trim().length > 0;
}

function isCurrentUser(value: unknown): value is CurrentUser {
  if (!value || typeof value !== "object") {
    return false;
  }

  const user = value as CurrentUser;

  return (
    typeof user.email === "string" &&
    typeof user.locale === "string" &&
    typeof user.name === "string" &&
    ("household" in user)
  );
}

export async function getStoredCurrentUser() {
  const rawValue = await AsyncStorage.getItem(CURRENT_USER_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as unknown;
    return isCurrentUser(parsed) ? parsed : null;
  } catch (error) {
    console.warn("Failed to parse stored current user.", error);
    return null;
  }
}

export async function storeCurrentUser(user: CurrentUser) {
  await AsyncStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
}

export async function clearStoredCurrentUser() {
  await AsyncStorage.removeItem(CURRENT_USER_STORAGE_KEY);
}

export async function setCurrentUserCache(queryClient: QueryClient, user: CurrentUser) {
  queryClient.setQueryData(CURRENT_USER_QUERY_KEY, user);
  await storeCurrentUser(user);
}

export async function updateCurrentUserHouseholdCache(
  queryClient: QueryClient,
  household: CurrentUserHousehold,
) {
  const currentUser =
    queryClient.getQueryData<CurrentUser>(CURRENT_USER_QUERY_KEY) ??
    (await getStoredCurrentUser());

  if (!currentUser) {
    return;
  }

  await setCurrentUserCache(queryClient, {
    ...currentUser,
    household,
  });
}

export async function updateCurrentUserHasItemCache(
  queryClient: QueryClient,
  hasItem = true,
) {
  const currentUser =
    queryClient.getQueryData<CurrentUser>(CURRENT_USER_QUERY_KEY) ??
    (await getStoredCurrentUser());

  if (!currentUser) {
    return;
  }

  await setCurrentUserCache(queryClient, {
    ...currentUser,
    has_item: hasItem,
    household: currentUser.household
      ? {
          ...currentUser.household,
          has_item: hasItem,
        }
      : currentUser.household,
  });
}

export async function getCurrentUser() {
  const response = await apiClient.get<ApiResponse<CurrentUser>>("/api/v1/user");
  await storeCurrentUser(response.data.data);
  return response.data.data;
}

export async function updateCurrentUserLocale(locale: string) {
  const response = await apiClient.put<ApiResponse<UpdateUserProfile>>("/api/v1/users/me", {
    locale,
  });

  return response.data.data;
}

export async function deleteCurrentUserAccount(email: string) {
  const response = await apiClient.delete<ApiResponse<DeleteCurrentUserAccountResponse>>(
    "/api/v1/user",
    {
      data: {
        email,
      },
    },
  );

  return response.data.data;
}

export function getAppEntryRoute(user: CurrentUser): AppEntryRoute {
 
  const household = user.household;

  if (!household) {
    return "/onboarding/household";
  }

  if (!hasCompletedStep(household.kitchen_appliances)) {
    return "/onboarding/appliances";
  }

  if (!hasCompletedStep(household.dietary)) {
    return "/onboarding/dietary";
  }

  if (!hasCompletedStep(household.allergies)) {
    return "/onboarding/allergies";
  }

  if (!hasCompletedStep(household.love)) {
    return "/onboarding/cuisines";
  }

  if (!hasCompletedStep(household.meals)) {
    return "/onboarding/meals";
  }

  if (household.has_item || user.has_item) {
    return "/kitchen";
  }

  return "/onboarding/storage";
}
