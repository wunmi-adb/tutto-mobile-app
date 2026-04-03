import AddItemView from "@/components/items/AddItemView";
import { DetectedItem } from "@/components/items/ReviewItemsView";
import { useI18n } from "@/i18n";
import { useCreateInventoryItems } from "@/lib/api/items";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function Detail() {
  const router = useRouter();
  const { t } = useI18n();
  const createInventoryItemsMutation = useCreateInventoryItems();
  const { location, storageKey, items, currentIndex, completedIndices, source } =
    useLocalSearchParams<{
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

  return (
    <AddItemView
      storageName={storageName}
      items={parsedItems}
      currentIndex={parseInt(currentIndex ?? "0", 10)}
      completedIndices={parsedCompleted}
      onBack={() => router.back()}
      saving={createInventoryItemsMutation.isPending}
      onFinish={async (drafts) => {
        if (!storageKey) {
          return;
        }

        try {
          await createInventoryItemsMutation.mutateAsync({
            drafts,
            storageLocationKey: storageKey,
          });

          router.replace({
            pathname: "/onboarding/complete",
            params: { location: storageName, ...(source ? { source } : {}) },
          });
        } catch {
          // The mutation hook already shows the translated error toast.
        }
      }}
    />
  );
}
