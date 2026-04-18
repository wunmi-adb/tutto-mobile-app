import type { InventoryCaptureStatus } from "@/lib/api/item-capture";

export const INVENTORY_EXTRACTION_POLL_INTERVAL_MS = 2000;

export function isInventoryExtractionPending(status: InventoryCaptureStatus) {
  return status.state === "pending" || status.state === "processing";
}

export function getStorageExtractedItemNames(status: InventoryCaptureStatus) {
  if (!Array.isArray(status.items)) {
    return [];
  }

  return status.items.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}
