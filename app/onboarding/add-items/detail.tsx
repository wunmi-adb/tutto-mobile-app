import AddItemView from "@/components/items/AddItemView";
import type { ItemDraft } from "@/components/items/add-item/types";
import { DetectedItem } from "@/components/items/ReviewItemsView";
import { useI18n } from "@/i18n";
import { handleCaughtApiError } from "@/lib/api/handle-caught-api-error";
import {
  useCreateInventoryItems,
  useDeleteInventoryItem,
  useUpdateInventoryItem,
} from "@/lib/api/items";
import {
  getCompleteRouteParams,
  getSingleParamValue,
  parseJsonParam,
} from "@/lib/utils/add-items";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo } from "react";

export default function Detail() {
  const router = useRouter();
  const { t } = useI18n();
  const createInventoryItemsMutation = useCreateInventoryItems();
  const deleteInventoryItemMutation = useDeleteInventoryItem();
  const updateInventoryItemMutation = useUpdateInventoryItem();
  const { itemKey, location, storageKey, items, currentIndex, completedIndices, source } =
    useLocalSearchParams<{
      itemKey?: string;
      location: string;
      storageKey: string;
      items: string;
      currentIndex: string;
      completedIndices: string;
      source?: string;
    }>();
  const normalizedItemKey = getSingleParamValue(itemKey);
  const normalizedLocation = getSingleParamValue(location);
  const normalizedStorageKey = getSingleParamValue(storageKey);
  const normalizedItems = getSingleParamValue(items);
  const normalizedCurrentIndex = getSingleParamValue(currentIndex);
  const normalizedCompletedIndices = getSingleParamValue(completedIndices);
  const normalizedSource = getSingleParamValue(source);
  const storageName = normalizedLocation ?? t("addItems.defaultStorage");
  const parsedCurrentIndex = Number.parseInt(normalizedCurrentIndex ?? "0", 10);
  const isPantryFlow = normalizedSource === "pantry";

  const parsedItems = useMemo(
    () => parseJsonParam<DetectedItem[]>(normalizedItems, []),
    [normalizedItems],
  );
  const parsedCompleted = useMemo(
    () => parseJsonParam<number[]>(normalizedCompletedIndices, []),
    [normalizedCompletedIndices],
  );
  const saving =
    createInventoryItemsMutation.isPending ||
    updateInventoryItemMutation.isPending ||
    deleteInventoryItemMutation.isPending;

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleDelete = useCallback(async () => {
    if (!normalizedItemKey) {
      return;
    }

    try {
      await deleteInventoryItemMutation.mutateAsync(normalizedItemKey);
      router.back();
    } catch (error) {
      handleCaughtApiError(error);
    }
  }, [deleteInventoryItemMutation, normalizedItemKey, router]);

  const navigateAfterCreate = useCallback(() => {
    if (isPantryFlow) {
      router.replace("/dashboard/kitchen");
      return;
    }

    router.replace(getCompleteRouteParams(storageName, normalizedSource));
  }, [isPantryFlow, normalizedSource, router, storageName]);

  const updateExistingItem = useCallback(async (drafts: ItemDraft[]) => {
    if (!normalizedItemKey || !normalizedStorageKey || !drafts[0]) {
      return;
    }

    await updateInventoryItemMutation.mutateAsync({
      draft: drafts[0],
      itemKey: normalizedItemKey,
      storageLocationKey: normalizedStorageKey,
    });

    router.back();
  }, [normalizedItemKey, normalizedStorageKey, router, updateInventoryItemMutation]);

  const createNewItems = useCallback(async (drafts: ItemDraft[]) => {
    if (!normalizedStorageKey) {
      return;
    }

    await createInventoryItemsMutation.mutateAsync({
      drafts,
      storageLocationKey: normalizedStorageKey,
    });

    navigateAfterCreate();
  }, [createInventoryItemsMutation, navigateAfterCreate, normalizedStorageKey]);

  const handleFinish = useCallback(
    async (drafts: ItemDraft[]) => {
      try {
        if (normalizedItemKey) {
          await updateExistingItem(drafts);
          return;
        }

        await createNewItems(drafts);
      } catch (error) {
        handleCaughtApiError(error);
      }
    },
    [
      createNewItems,
      normalizedItemKey,
      updateExistingItem,
    ],
  );

  return (
    <AddItemView
      storageName={storageName}
      items={parsedItems}
      currentIndex={parsedCurrentIndex}
      completedIndices={parsedCompleted}
      onBack={handleBack}
      saving={saving}
      deleting={deleteInventoryItemMutation.isPending}
      onDelete={normalizedItemKey ? handleDelete : undefined}
      onFinish={handleFinish}
    />
  );
}
