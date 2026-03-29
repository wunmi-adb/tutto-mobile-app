import ReviewItemsView, { DetectedItem } from "@/components/items/ReviewItemsView";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function ReviewItems() {
  const router = useRouter();
  const { location, items } = useLocalSearchParams<{ location: string; items: string }>();
  const storageName = location ?? "Fridge";

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
            items: JSON.stringify(confirmedItems),
            currentIndex: "0",
            completedIndices: "[]",
          },
        })
      }
      onBack={() => router.back()}
    />
  );
}
