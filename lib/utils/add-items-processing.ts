import type { InventoryCaptureStatus } from "@/lib/api/item-capture";

export type CaptureScreenType = "image" | "voice";
const CAPTURE_POLL_INTERVAL_MS = 5000;

export function getCaptureScreenType(value: string | undefined): CaptureScreenType {
  return value === "voice" ? "voice" : "image";
}

export function getCaptureInputUri({
  photoUri,
  recordingUri,
  type,
}: {
  photoUri?: string;
  recordingUri?: string;
  type: CaptureScreenType;
}) {
  return type === "voice" ? recordingUri : photoUri;
}

export function getCapturePayloadType(type: CaptureScreenType) {
  return type === "voice" ? "audio" : "image";
}

export function getCaptureRetryPathname(type: CaptureScreenType) {
  return type === "voice" ? "/onboarding/add-items/voice" : "/onboarding/add-items/camera";
}

export function isCapturePending(status: InventoryCaptureStatus) {
  return status.state === "pending" || status.state === "processing";
}

export function getCapturedItems(status: InventoryCaptureStatus) {
  return Array.isArray(status.items) ? status.items : [];
}

export function waitForNextCapturePoll() {
  return new Promise((resolve) => setTimeout(resolve, CAPTURE_POLL_INTERVAL_MS));
}
