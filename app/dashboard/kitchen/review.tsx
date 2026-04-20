import DetectedItemsReviewScreen from "@/components/inventory/DetectedItemsReviewScreen";
import { handleCaughtApiError } from "@/lib/api/handle-caught-api-error";
import { useCreateInventoryItems } from "@/lib/api/items";
import { usePantryPalKitchenState } from "@/stores/pantryPalKitchenStore";
import { useRouter } from "expo-router";
import { useCallback, useEffect } from "react";

export default function KitchenReviewRoute() {
  const router = useRouter();
  const createInventoryItemsMutation = useCreateInventoryItems();
  const { clearReviewItems, removeReviewItem, reviewItems } = usePantryPalKitchenState();

  useEffect(() => {
    if (reviewItems.length === 0) {
      router.replace("/dashboard/kitchen");
    }
  }, [reviewItems.length, router]);

  const handleConfirm = useCallback(async () => {
    if (reviewItems.length === 0 || createInventoryItemsMutation.isPending) {
      return;
    }

    try {
      await createInventoryItemsMutation.mutateAsync({
        available: true,
        items: reviewItems,
      });
      clearReviewItems();
      router.replace("/dashboard/kitchen");
    } catch (error) {
      handleCaughtApiError(error);
    }
  }, [clearReviewItems, createInventoryItemsMutation, reviewItems, router]);

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
        void handleConfirm();
      }}
      isConfirming={createInventoryItemsMutation.isPending}
    />
  );
}
