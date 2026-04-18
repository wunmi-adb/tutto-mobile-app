import { apiClient } from "@/lib/api/client";
import { ApiResponse } from "@/lib/api/types";
import { ItemType, TrackingMode } from "@/lib/inventory/types";

export type InventoryExtractMediaType = "image" | "audio";

export type CapturedInventoryBatch = {
  best_before?: string;
  fill_level?: string;
  quantity?: number;
};

export type CapturedInventoryItem = {
  batches?: CapturedInventoryBatch[];
  item_type?: ItemType;
  name: string;
  preserve_empty_batches?: boolean;
  tracking_mode?: TrackingMode;
};

export type InventoryCaptureStatus = {
  capture_key: string;
  state: "pending" | "processing" | "completed" | "failed";
  error_key?: string | null;
  items?: string[];
  outcome?: "ok" | "no_item_found" | null;
};

type CreateInventoryExtractionResponse = {
  capture_key?: string;
  state?: "pending" | "processing" | "completed" | "failed";
};

type SubmitInventoryExtractionInput = {
  mediaType: InventoryExtractMediaType;
  uri: string;
};

function getInventoryExtractionMimeType(uri: string, mediaType: InventoryExtractMediaType) {
  const normalizedUri = uri.toLowerCase();

  if (mediaType === "audio") {
    if (normalizedUri.endsWith(".wav")) {
      return "audio/wav";
    }

    if (normalizedUri.endsWith(".mp3")) {
      return "audio/mpeg";
    }

    if (normalizedUri.endsWith(".aac")) {
      return "audio/aac";
    }

    return "audio/m4a";
  }

  if (normalizedUri.endsWith(".png")) {
    return "image/png";
  }

  if (normalizedUri.endsWith(".webp")) {
    return "image/webp";
  }

  if (normalizedUri.endsWith(".heic") || normalizedUri.endsWith(".heif")) {
    return "image/heic";
  }

  return "image/jpeg";
}

function getInventoryExtractionFileName(uri: string, mediaType: InventoryExtractMediaType) {
  const segments = uri.split("/");
  const lastSegment = segments[segments.length - 1];

  if (lastSegment && lastSegment.includes(".")) {
    return lastSegment;
  }

  return mediaType === "audio" ? "inventory-recording.m4a" : "inventory-image.jpg";
}

function getCaptureKey(data: CreateInventoryExtractionResponse) {
  if (typeof data?.capture_key === "string" && data.capture_key.length > 0) {
    return data.capture_key;
  }

  throw new Error("Missing capture key in inventory extraction response.");
}

export async function submitInventoryExtraction({
  mediaType,
  uri,
}: SubmitInventoryExtractionInput) {
  const formData = new FormData();
  const fileName = getInventoryExtractionFileName(uri, mediaType);
  const mimeType = getInventoryExtractionMimeType(uri, mediaType);

  formData.append(
    "file",
    {
      uri,
      name: fileName,
      type: mimeType,
    } as unknown as Blob,
  );

  const response = await apiClient.post<ApiResponse<CreateInventoryExtractionResponse>>(
    "/api/v1/items/extract",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return getCaptureKey(response.data.data);
}

export async function getInventoryExtractionStatus(captureKey: string) {
  const response = await apiClient.get<ApiResponse<InventoryCaptureStatus>>(
    `/api/v1/items/extract/${captureKey}`,
  );

  return response.data.data;
}
