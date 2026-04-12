import DetectedItemsReviewScreen from "@/components/inventory/DetectedItemsReviewScreen";
import { usePantryPalKitchenState } from "@/stores/pantryPalKitchenStore";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function KitchenReviewRoute() {
  const router = useRouter();
  const { clearReviewItems, confirmReviewItems, removeReviewItem, reviewItems } = usePantryPalKitchenState();

  useEffect(() => {
    if (reviewItems.length === 0) {
      router.replace("/dashboard/kitchen");
    }
  }, [reviewItems.length, router]);

  if (reviewItems.length === 0) {
    return null;
  }

  return (
    <DetectedItemsReviewScreen
      items={reviewItems}
      onRemoveItem={removeReviewItem}
      onCancel={() => {
        clearReviewItems();
        router.back();
      }}
      onConfirm={() => {
        confirmReviewItems();
        router.back();
      }}
    />
  );
}
