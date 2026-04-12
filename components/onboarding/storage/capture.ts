import type { InventoryCaptureStatus } from "@/lib/api/item-capture";

const CAPTURE_POLL_INTERVAL_MS = 5000;

export function isStorageCapturePending(status: InventoryCaptureStatus) {
  return status.state === "pending" || status.state === "processing";
}

export function getStorageCapturedItemNames(status: InventoryCaptureStatus) {
  if (!Array.isArray(status.items)) {
    return [];
  }

  return status.items.map((item) => item.name);
}

export function waitForNextStorageCapturePoll() {
  return new Promise((resolve) => setTimeout(resolve, CAPTURE_POLL_INTERVAL_MS));
}
