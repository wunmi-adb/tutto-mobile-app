import { ItemDraft, ItemType, TrackingMode } from "@/components/items/add-item/types";
import { useI18n } from "@/i18n";
import { isTranslationKey } from "@/i18n/messages";
import { apiClient } from "@/lib/api/client";
import { INVENTORY_QUERY_KEY } from "@/lib/api/inventory";
import { updateCurrentUserHasItemCache } from "@/lib/api/profile";
import { ApiResponse, getApiErrorDetails } from "@/lib/api/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

export type CreateInventoryItemsInput = {
  drafts: ItemDraft[];
  storageLocationKey: string;
};

export type UpdateInventoryItemInput = {
  draft: ItemDraft;
  itemKey: string;
  storageLocationKey: string;
};

export type DeleteInventoryItemResponse = {
  key: string;
};

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

export function mapItemDraftToUpdateInventoryItemInput(
  draft: ItemDraft,
  storageLocationKey: string,
) {
  return {
    ...mapItemDraftToCreateInventoryItemInput(draft),
    storage_location_key: storageLocationKey,
  };
}

export async function createInventoryItems({
  drafts,
  storageLocationKey,
}: CreateInventoryItemsInput) {
  const payload = {
    items: drafts.map((draft) => mapItemDraftToCreateInventoryItemInput(draft)),
  };

  console.log("Create inventory items payload", JSON.stringify(payload));

  const response = await apiClient.post<ApiResponse<InventoryItem[]>>(
    `/api/v1/storage-locations/${storageLocationKey}/items`,
    payload,
  );

  return response.data.data;
}

export async function updateInventoryItem({
  draft,
  itemKey,
  storageLocationKey,
}: UpdateInventoryItemInput) {
  const payload = mapItemDraftToUpdateInventoryItemInput(draft, storageLocationKey);

  const response = await apiClient.put<ApiResponse<InventoryItem>>(
    `/api/v1/items/${itemKey}`,
    payload,
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
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInventoryItems,
    onSuccess: async () => {
      await updateCurrentUserHasItemCache(queryClient, true);
    },
    onError: (error) => {
      console.log("Error creating inventory items:", JSON.stringify(getApiErrorDetails(error)), JSON.stringify(error));
      const errorDetails = getApiErrorDetails(error);
      const errorMessage =
        typeof errorDetails.message === "string" && isTranslationKey(errorDetails.message)
          ? t(errorDetails.message)
          : t("addItems.create.error");

      toast.error(errorMessage);
    },
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
