import ReviewItemsView, { DetectedItem } from "@/components/items/ReviewItemsView";
import { makeItemDraftFromPrefill } from "@/components/items/add-item/types";
import { useI18n } from "@/i18n";
import { useCreateInventoryItems } from "@/lib/api/items";
import { useLocalSearchParams, useRouter } from "expo-router";

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
  const storageName = location ?? t("addItems.defaultStorage");
  const isPantryFlow = source === "pantry";

  const parsedItems: DetectedItem[] = (() => {
    try {
      const parsed = items ? JSON.parse(items) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  })();

  return (
    <ReviewItemsView
      storageName={storageName}
      initialItems={parsedItems}
      savingAll={createInventoryItemsMutation.isPending}
      onSaveAll={async (confirmedItems) => {
        try {
          await createInventoryItemsMutation.mutateAsync({
            drafts: confirmedItems.map((item) => makeItemDraftFromPrefill(item)),
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
        } catch {
          // The mutation hook already shows the translated error toast.
        }
      }}
      onContinue={(confirmedItems) =>
        router.push({
          pathname: "/onboarding/add-items/detail",
          params: {
            location: storageName,
            storageKey,
            items: JSON.stringify(confirmedItems),
            currentIndex: "0",
            completedIndices: "[]",
            ...(source ? { source } : {}),
          },
        })
      }
      onBack={() => router.back()}
    />
  );
}
