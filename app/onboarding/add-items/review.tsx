import ReviewItemsView, { DetectedItem } from "@/components/items/ReviewItemsView";
import { makeItemDraftFromPrefill } from "@/components/items/add-item/types";
import { useI18n } from "@/i18n";
import { handleCaughtApiError } from "@/lib/api/handle-caught-api-error";
import { useCreateInventoryItems } from "@/lib/api/items";
import {
  getCompleteRouteParams,
  getSingleParamValue,
  parseJsonParam,
} from "@/lib/utils/add-items";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo } from "react";

export default function ReviewItems() {
  const router = useRouter();
  const { t } = useI18n();
  const createInventoryItemsMutation = useCreateInventoryItems();
  const { location, storageKey, items, source } = useLocalSearchParams<{
    location: string;
    storageKey: string;
    items: string;
    source?: string;
  }>();
  const normalizedLocation = getSingleParamValue(location);
  const normalizedStorageKey = getSingleParamValue(storageKey) ?? "";
  const normalizedItems = getSingleParamValue(items);
  const normalizedSource = getSingleParamValue(source);
  const storageName = normalizedLocation ?? t("addItems.defaultStorage");
  const isPantryFlow = normalizedSource === "pantry";
  const parsedItems = useMemo(
    () => parseJsonParam<DetectedItem[]>(normalizedItems, []),
    [normalizedItems],
  );

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleSaveAll = useCallback(
    async (confirmedItems: DetectedItem[]) => {
      try {
        await createInventoryItemsMutation.mutateAsync({
          drafts: confirmedItems.map((item) => makeItemDraftFromPrefill(item)),
          storageLocationKey: normalizedStorageKey,
        });

        if (isPantryFlow) {
          router.replace("/dashboard/kitchen");
          return;
        }

        router.replace(getCompleteRouteParams(storageName, normalizedSource));
      } catch (error) {
        handleCaughtApiError(error);
      }
    },
    [
      createInventoryItemsMutation,
      isPantryFlow,
      normalizedSource,
      normalizedStorageKey,
      router,
      storageName,
    ],
  );

  const handleContinue = useCallback(
    (confirmedItems: DetectedItem[]) => {
      router.push({
        pathname: "/onboarding/add-items/detail",
        params: {
          location: storageName,
          storageKey: normalizedStorageKey,
          items: JSON.stringify(confirmedItems),
          currentIndex: "0",
          completedIndices: "[]",
          ...(normalizedSource ? { source: normalizedSource } : {}),
        },
      });
    },
    [normalizedSource, normalizedStorageKey, router, storageName],
  );

  return (
    <ReviewItemsView
      storageName={storageName}
      initialItems={parsedItems}
      savingAll={createInventoryItemsMutation.isPending}
      onSaveAll={handleSaveAll}
      onContinue={handleContinue}
      onBack={handleBack}
    />
  );
}
