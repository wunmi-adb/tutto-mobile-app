import { ItemType, TrackingMode } from "@/components/items/add-item/types";
import { apiClient } from "@/lib/api/client";
import { ApiResponse } from "@/lib/api/types";

export type InventoryCaptureType = "image" | "audio";

export type InventoryCaptureInput = {
  data: string;
  type: InventoryCaptureType;
};

export type CapturedInventoryBatch = {
  best_before?: string;
  fill_level?: string;
  quantity?: number;
};

export type CapturedInventoryItem = {
  batches?: CapturedInventoryBatch[];
  item_type?: ItemType;
  name: string;
  tracking_mode?: TrackingMode;
};

export type InventoryCaptureStatus = {
  capture_key: string;
  error_key?: string | null;
  items?: CapturedInventoryItem[];
  outcome?: string | null;
  state: string;
};

type CreateInventoryCaptureResponse =
  | string
  | {
      capture_key?: string;
      key?: string;
    };

function getCaptureKey(data: CreateInventoryCaptureResponse) {
  if (typeof data === "string") {
    return data;
  }

  if (typeof data?.capture_key === "string" && data.capture_key.length > 0) {
    return data.capture_key;
  }

  if (typeof data?.key === "string" && data.key.length > 0) {
    return data.key;
  }

  throw new Error("Missing capture key in inventory capture response.");
}

export async function createInventoryCapture(payload: InventoryCaptureInput) {
  const response = await apiClient.post<ApiResponse<CreateInventoryCaptureResponse>>(
    "/api/v1/items/capture",
    payload,
  );

  return getCaptureKey(response.data.data);
}

export async function getInventoryCaptureStatus(captureKey: string) {
  const response = await apiClient.get<ApiResponse<InventoryCaptureStatus>>(
    `/api/v1/items/capture/${captureKey}`,
  );

  return response.data.data;
}

export async function readFileAsBase64(uri: string) {
  const response = await fetch(uri);
  const blob = await response.blob();

  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error("Failed to read local file."));
    };

    reader.onloadend = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Failed to convert local file to base64."));
        return;
      }

      const commaIndex = reader.result.indexOf(",");
      resolve(commaIndex >= 0 ? reader.result.slice(commaIndex + 1) : reader.result);
    };

    reader.readAsDataURL(blob);
  });
}
