import { useI18n } from "@/i18n";
import { isTranslationKey } from "@/i18n/messages";
import { apiClient } from "@/lib/api/client";
import { ApiResponse, getApiErrorDetails } from "@/lib/api/types";
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner-native";

export type StorageLocation = {
  created_at: string;
  key: string;
  name: string;
  updated_at: string;
};

export type CreateStorageLocationInput = {
  name: string;
};

export const STORAGE_LOCATIONS_QUERY_KEY = ["storage-locations"] as const;

export async function getStorageLocations() {
  const response = await apiClient.get<ApiResponse<StorageLocation[]>>("/api/v1/storage-locations");
  return response.data.data;
}

export async function prefetchStorageLocations(queryClient: QueryClient) {
  return queryClient.fetchQuery({
    queryKey: STORAGE_LOCATIONS_QUERY_KEY,
    queryFn: getStorageLocations,
    staleTime: 60_000,
  });
}

export async function createStorageLocation(payload: CreateStorageLocationInput) {
  const response = await apiClient.post<ApiResponse<StorageLocation>>(
    "/api/v1/storage-locations",
    payload,
  );

  return response.data.data;
}

export function useStorageLocations() {
  return useQuery({
    queryKey: STORAGE_LOCATIONS_QUERY_KEY,
    queryFn: getStorageLocations,
    staleTime: 60_000,
  });
}

export function useCreateStorageLocation(options?: {
  onSuccess?: (storageLocation: StorageLocation) => void | Promise<void>;
}) {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createStorageLocation,
    onSuccess: async (storageLocation) => {
      await queryClient.invalidateQueries({ queryKey: STORAGE_LOCATIONS_QUERY_KEY });
      await options?.onSuccess?.(storageLocation);
    },
    onError: (error) => {
      const errorDetails = getApiErrorDetails(error);
      const errorMessage =
        typeof errorDetails.message === "string" && isTranslationKey(errorDetails.message)
          ? t(errorDetails.message)
          : t("storage.create.error");

      toast.error(errorMessage);
    },
  });
}
