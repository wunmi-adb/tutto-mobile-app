import { useI18n } from "@/i18n";
import { isTranslationKey } from "@/i18n/messages";
import { apiClient } from "@/lib/api/client";
import { updateCurrentUserHouseholdCache } from "@/lib/api/profile";
import { ApiResponse, getApiErrorDetails } from "@/lib/api/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { toast } from "sonner-native";

export type Household = {
  allergies: string | null;
  created_at: string;
  dietary: string | null;
  dislike: string | null;
  id: string;
  invite_code: string;
  is_owner: boolean;
  kitchen_appliances: string | null;
  love: string | null;
  meals: string | null;
  name: string;
  number_of_household: number;
  role: string;
  updated_at: string;
};

export type CreateHouseholdInput = {
  city: string;
  name: string;
  number_of_household: number;
  region_code: string;
};

export type UpdateHouseholdInput = Partial<{
  allergies: string;
  dietary: string;
  dislike: string;
  kitchen_appliances: string;
  love: string;
  meals: string;
  name: string;
  number_of_household: number;
}>;

type HouseholdValidationError = {
  field?: string;
  invalid_values?: string[];
  reason_key?: string;
};

type HouseholdErrorData = {
  errors?: HouseholdValidationError[];
};

type TranslateFn = ReturnType<typeof useI18n>["t"];

function getHouseholdErrorToastMessage(
  t: TranslateFn,
  errorDetails: ReturnType<typeof getApiErrorDetails>,
  fallbackKey: "household.create.error" | "household.preferences.invalid" = "household.create.error",
) {
  const errorData = errorDetails.data as HouseholdErrorData | null;
  const validationError = Array.isArray(errorData?.errors) ? errorData.errors[0] : undefined;

  if (validationError?.reason_key && isTranslationKey(validationError.reason_key)) {
    const invalidValues = Array.isArray(validationError.invalid_values)
      ? validationError.invalid_values.filter(Boolean).join(", ")
      : "";

    return t(validationError.reason_key, invalidValues ? { values: invalidValues } : undefined);
  }

  if (typeof errorDetails.message === "string" && isTranslationKey(errorDetails.message)) {
    return t(errorDetails.message);
  }

  return t(fallbackKey);
}

export async function createHousehold(payload: CreateHouseholdInput) {
  const response = await apiClient.post<ApiResponse<Household>>("/api/v1/households", payload);
  return response.data.data;
}

export async function updateHouseholdProfile(payload: UpdateHouseholdInput) {
  const response = await apiClient.patch<ApiResponse<Household>>("/api/v1/household", payload);
  return response.data.data;
}

export function useCreateHousehold() {
  const router = useRouter();
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createHousehold,
    onSuccess: async (household) => {
      await updateCurrentUserHouseholdCache(queryClient, household);
      router.replace("/onboarding/notifications");
    },
    onError: (error) => {
      const errorDetails = getApiErrorDetails(error);
      console.log("Error creating household:", JSON.stringify(errorDetails), JSON.stringify(error));
      toast.error(getHouseholdErrorToastMessage(t, errorDetails, "household.create.error"));
    },
  });
}

export function useUpdateHouseholdProfile() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateHouseholdProfile,
    onSuccess: async (household) => {
      console.log("Household updated successfully:", household);
      await updateCurrentUserHouseholdCache(queryClient, household);
    },
    onError: (error) => {
      const errorDetails = getApiErrorDetails(error);

    
      toast.error(getHouseholdErrorToastMessage(t, errorDetails, "household.preferences.invalid"));
    },
  });
}
