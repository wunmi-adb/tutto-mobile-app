import { useI18n } from "@/i18n";
import { isTranslationKey } from "@/i18n/messages";
import { apiClient } from "@/lib/api/client";
import { INVENTORY_QUERY_KEY } from "@/lib/api/inventory";
import { ItemDraft, ItemType, TrackingMode } from "@/lib/inventory/types";
import { updateCurrentUserHasItemCache } from "@/lib/api/profile";
import { ApiResponse, getApiErrorDetails } from "@/lib/api/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { toast } from "sonner-native";

export type CreateInventoryItemBatchInput = {
  best_before?: string;
  fill_level?: string;
  quantity?: number;
};

export type CreateInventoryItemInput = {
  batches: CreateInventoryItemBatchInput[];
  item_type: ItemType;
  name: string;
  tracking_mode: TrackingMode;
};

export type InventoryItem = {
  name: string;
};

export type KitchenItemCategory = {
  key: string;
  name: string;
};

export type KitchenItem = {
  available: boolean;
  category?: KitchenItemCategory | null;
  created_at: string;
  key: string;
  name: string;
  updated_at: string;
};

export type KitchenItemsStatus = "available" | "unavailable";

export type KitchenItemsPagination = {
  page?: number;
  page_count?: number;
  per_page?: number;
  skipped?: number;
  total?: number;
  total_volume?: number;
};

type KitchenItemsPayload =
  | KitchenItem[]
  | {
      items?: KitchenItem[] | null;
      pagination?: KitchenItemsPagination | null;
    };

export type CreateInventoryItemsInput = {
  available?: boolean;
  items: string[];
};

export type UpdateInventoryItemInput = {
  draft: ItemDraft;
  itemKey: string;
};

export type RenameInventoryItemInput = {
  itemKey: string;
  name: string;
};

export type UpdateInventoryAvailabilityInput = {
  available: boolean;
  itemKey: string;
};

export type DeleteInventoryItemResponse = {
  key: string;
};

async function fetchKitchenItemsPage(
  page: number,
  perPage: number,
  status?: KitchenItemsStatus,
) {
  const response = await apiClient.get<ApiResponse<KitchenItemsPayload>>("/api/v1/items", {
    params: {
      page,
      per_page: perPage,
      ...(status ? { status } : {}),
    },
  });

  return response.data.data;
}

function getKitchenItemsFromPayload(payload: KitchenItemsPayload | null | undefined): KitchenItem[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  return [];
}

export async function getKitchenItems(status?: KitchenItemsStatus): Promise<KitchenItem[]> {
  const perPage = 100;
  const firstPagePayload = await fetchKitchenItemsPage(0, perPage, status);
  const initialItems: KitchenItem[] = getKitchenItemsFromPayload(firstPagePayload);

  if (Array.isArray(firstPagePayload)) {
    return initialItems;
  }

  const pagination = firstPagePayload.pagination;
  const currentPage = typeof pagination?.page === "number" ? pagination.page : 0;
  const totalPages = typeof pagination?.page_count === "number" ? pagination.page_count : 1;
  const isZeroBased = currentPage === 0;
  const lastPage = isZeroBased ? totalPages - 1 : totalPages;

  if (lastPage <= currentPage) {
    return initialItems;
  }

  const remainingPages = [];

  for (let page = currentPage + 1; page <= lastPage; page += 1) {
    remainingPages.push(fetchKitchenItemsPage(page, perPage, status));
  }

  const remainingPayloads = await Promise.all(remainingPages);

  return remainingPayloads.reduce<KitchenItem[]>(
    (items, payload) => items.concat(getKitchenItemsFromPayload(payload)),
    initialItems,
  );
}

export function mapItemDraftToCreateInventoryItemInput(
  draft: ItemDraft,
): CreateInventoryItemInput {
  const trackingMode: TrackingMode =
    draft.itemType === "ingredient" && draft.countAsUnits ? "quantity" : "fill_level";
  const normalizedItemType: ItemType =
    String(draft.itemType) === "cooked" ? "cooked_meal" : draft.itemType;

  return {
    name: draft.name.trim(),
    item_type: normalizedItemType,
    tracking_mode: trackingMode,
    batches: draft.batches.map((batch) => {
      const bestBefore = batch.bestBefore || undefined;

      if (trackingMode === "quantity") {
        return {
          quantity: batch.qty,
          ...(bestBefore ? { best_before: bestBefore } : {}),
        };
      }

      return {
        fill_level: batch.fillLevel,
        ...(bestBefore ? { best_before: bestBefore } : {}),
      };
    }),
  };
}

export function mapItemDraftToUpdateInventoryItemInput(draft: ItemDraft) {
  return mapItemDraftToCreateInventoryItemInput(draft);
}

export async function createInventoryItems({
  available = true,
  items,
}: CreateInventoryItemsInput) {
  const payload = {
    available,
    items: items.map((item) => item.trim()).filter(Boolean),
  };

  const response = await apiClient.post<ApiResponse<InventoryItem[]>>(
    "/api/v1/items",
    payload,
  );

  return response.data.data;
}

export async function updateInventoryItem({
  draft,
  itemKey,
}: UpdateInventoryItemInput) {
  const payload = mapItemDraftToUpdateInventoryItemInput(draft);

  const response = await apiClient.put<ApiResponse<InventoryItem>>(
    `/api/v1/items/${itemKey}`,
    payload,
  );

  return response.data.data;
}

export async function renameInventoryItem({
  itemKey,
  name,
}: RenameInventoryItemInput) {
  const response = await apiClient.patch<ApiResponse<InventoryItem>>(
    `/api/v1/items/${itemKey}`,
    { name: name.trim() },
  );

  return response.data.data;
}

export async function updateInventoryAvailability({
  available,
  itemKey,
}: UpdateInventoryAvailabilityInput) {
  const response = await apiClient.patch<ApiResponse<InventoryItem>>(
    `/api/v1/items/${itemKey}/availability`,
    { available },
  );

  return response.data.data;
}

export async function deleteInventoryItem(itemKey: string) {
  const response = await apiClient.delete<ApiResponse<DeleteInventoryItemResponse>>(
    `/api/v1/items/${itemKey}`,
  );

  return response.data.data;
}

export function useCreateInventoryItems() {
  const router = useRouter();
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInventoryItems,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: INVENTORY_QUERY_KEY });
      await updateCurrentUserHasItemCache(queryClient, true);
      toast.success(t("addItems.create.success"));
    },
    onError: (error) => {
      const errorDetails = getApiErrorDetails(error);
      const errorMessage =
        typeof errorDetails.message === "string" && isTranslationKey(errorDetails.message)
          ? t(errorDetails.message)
          : t("addItems.create.error");

      toast.error(errorMessage);

      if (errorDetails.message === "household.required") {
        router.push("/onboarding/household");
      }
    },
  });
}

export function useKitchenItems(status?: KitchenItemsStatus) {
  return useQuery({
    queryKey: [...INVENTORY_QUERY_KEY, "kitchen-list", status ?? "all"],
    queryFn: () => getKitchenItems(status),
    staleTime: 30_000,
  });
}

export function useUpdateInventoryItem() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateInventoryItem,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: INVENTORY_QUERY_KEY });
    },
    onError: (error) => {
      console.log(
        "Error updating inventory item:",
        JSON.stringify(getApiErrorDetails(error)),
        JSON.stringify(error),
      );
      const errorDetails = getApiErrorDetails(error);
      const errorMessage =
        typeof errorDetails.message === "string" && isTranslationKey(errorDetails.message)
          ? t(errorDetails.message)
          : t("addItems.create.error");

      toast.error(errorMessage);
    },
  });
}

export function useDeleteInventoryItem() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteInventoryItem,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: INVENTORY_QUERY_KEY });
      toast.success(t("addItems.delete.success"));
    },
    onError: (error) => {
      console.log(
        "Error deleting inventory item:",
        JSON.stringify(getApiErrorDetails(error)),
        JSON.stringify(error),
      );
      const errorDetails = getApiErrorDetails(error);
      const errorMessage =
        typeof errorDetails.message === "string" && isTranslationKey(errorDetails.message)
          ? t(errorDetails.message)
          : t("addItems.delete.error");

      toast.error(errorMessage);
    },
  });
}

export function useRenameInventoryItem() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: renameInventoryItem,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: INVENTORY_QUERY_KEY });
      toast.success(t("addItems.rename.success"));
    },
    onError: (error) => {
      console.log(
        "Error renaming inventory item:",
        JSON.stringify(getApiErrorDetails(error)),
        JSON.stringify(error),
      );
      const errorDetails = getApiErrorDetails(error);
      const errorMessage =
        typeof errorDetails.message === "string" && isTranslationKey(errorDetails.message)
          ? t(errorDetails.message)
          : t("addItems.create.error");

      toast.error(errorMessage);
    },
  });
}

export function useUpdateInventoryAvailability() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateInventoryAvailability,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: INVENTORY_QUERY_KEY });
      toast.success(t("addItems.availability.updated"));
    },
    onError: (error) => {
      console.log(
        "Error updating inventory availability:",
        JSON.stringify(getApiErrorDetails(error)),
        JSON.stringify(error),
      );
      const errorDetails = getApiErrorDetails(error);
      const errorMessage =
        typeof errorDetails.message === "string" && isTranslationKey(errorDetails.message)
          ? t(errorDetails.message)
          : t("addItems.create.error");

      toast.error(errorMessage);
    },
  });
}
