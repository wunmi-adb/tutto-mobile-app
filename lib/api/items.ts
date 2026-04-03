import { ItemDraft, ItemType, TrackingMode } from "@/components/items/add-item/types";
import { useI18n } from "@/i18n";
import { isTranslationKey } from "@/i18n/messages";
import { apiClient } from "@/lib/api/client";
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

export function mapItemDraftToCreateInventoryItemInput(
  draft: ItemDraft,
): CreateInventoryItemInput {
  const trackingMode: TrackingMode =
    draft.itemType === "ingredient" && draft.countAsUnits ? "quantity" : "fill_level";

  return {
    name: draft.name.trim(),
    item_type: draft.itemType,
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

export async function createInventoryItems({
  drafts,
  storageLocationKey,
}: CreateInventoryItemsInput) {
  const payload = {
    items: drafts.map((draft) => mapItemDraftToCreateInventoryItemInput(draft)),
  };

  const response = await apiClient.post<ApiResponse<InventoryItem[]>>(
    `/api/v1/storage-locations/${storageLocationKey}/items`,
    payload,
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
