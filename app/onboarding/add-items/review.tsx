import ReviewItemsView, { DetectedItem } from "@/components/items/ReviewItemsView";
import { useI18n } from "@/i18n";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function ReviewItems() {
  const router = useRouter();
  const { t } = useI18n();
  const { location, storageKey, items, source } = useLocalSearchParams<{
    location: string;
    storageKey: string;
    items: string;
    source?: string;
  }>();
  const storageName = location ?? t("addItems.defaultStorage");

  const parsedItems: DetectedItem[] = (() => {
    try {
      return items ? JSON.parse(items) : [];
    } catch {
      return [];
    }
  })();

  return (
    <ReviewItemsView
      storageName={storageName}
      initialItems={parsedItems}
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
