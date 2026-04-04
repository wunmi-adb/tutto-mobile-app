import AddItemView from "@/components/items/AddItemView";
import { DetectedItem } from "@/components/items/ReviewItemsView";
import { useI18n } from "@/i18n";
import {
  useCreateInventoryItems,
  useDeleteInventoryItem,
  useUpdateInventoryItem,
} from "@/lib/api/items";
import { handleCaughtApiError } from "@/lib/api/handle-caught-api-error";
import { useLocalSearchParams, useRouter } from "expo-router";

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

  const storageName = location ?? t("addItems.defaultStorage");

  const parsedItems: DetectedItem[] = (() => {
    try { return items ? JSON.parse(items) : []; } catch { return []; }
  })();

  const parsedCompleted: number[] = (() => {
    try { return completedIndices ? JSON.parse(completedIndices) : []; } catch { return []; }
  })();
  const isPantryFlow = source === "pantry";

  return (
    <AddItemView
      storageName={storageName}
      items={parsedItems}
      currentIndex={parseInt(currentIndex ?? "0", 10)}
      completedIndices={parsedCompleted}
      onBack={() => router.back()}
      saving={
        createInventoryItemsMutation.isPending ||
        updateInventoryItemMutation.isPending ||
        deleteInventoryItemMutation.isPending
      }
      deleting={deleteInventoryItemMutation.isPending}
      onDelete={
        itemKey
          ? async () => {
              try {
                await deleteInventoryItemMutation.mutateAsync(itemKey);
                router.back();
              } catch (error) {
                handleCaughtApiError(error);
              }
            }
          : undefined
      }
      onFinish={async (drafts) => {
        if (!storageKey) {
          return;
        }

        try {
          if (itemKey) {
            if (!drafts[0]) {
              return;
            }

            await updateInventoryItemMutation.mutateAsync({
              draft: drafts[0],
              itemKey,
              storageLocationKey: storageKey,
            });

            router.back();
            return;
          }

          await createInventoryItemsMutation.mutateAsync({
            drafts,
            storageLocationKey: storageKey,
          });

          if (isPantryFlow) {
            router.replace("/dashboard/kitchen");
            return;
          }

          router.replace({
            pathname: "/onboarding/complete",
            params: { location: storageName, ...(source ? { source } : {}) },
          });
        } catch (error) {
          handleCaughtApiError(error);
        }
      }}
    />
  );
}
