import CaptureErrorState from "@/components/items/CaptureErrorState";
import ProcessingOverlay from "@/components/items/ProcessingOverlay";
import { useI18n } from "@/i18n";
import { isTranslationKey } from "@/i18n/messages";
import {
  createInventoryCapture,
  getInventoryCaptureStatus,
  InventoryCaptureStatus,
  readFileAsBase64,
} from "@/lib/api/item-capture";
import { getApiErrorDetails } from "@/lib/api/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner-native";

const CAPTURE_POLL_INTERVAL_MS = 5000;
const CAPTURE_POLL_MAX_ATTEMPTS = 40;

function isCapturePending(status: InventoryCaptureStatus) {
  return status.state === "pending" || status.state === "processing";
}

function getCapturedItems(status: InventoryCaptureStatus) {
  return Array.isArray(status.items) ? status.items : [];
}

export default function Processing() {
  const router = useRouter();
  const { t } = useI18n();
  const [captureErrorMessage, setCaptureErrorMessage] = useState<string | null>(null);
  const { location, storageKey, source, photoUri, recordingUri, type } = useLocalSearchParams<{
    location?: string;
    storageKey?: string;
    source?: string;
    photoUri?: string;
    recordingUri?: string;
    type?: "image" | "voice";
  }>();
  const defaultStorage = t("addItems.defaultStorage");
  const captureType = type === "voice" ? "voice" : "image";

  const retryCapture = useCallback(() => {
    router.replace({
      pathname:
        captureType === "voice" ? "/onboarding/add-items/voice" : "/onboarding/add-items/camera",
      params: {
        location: location ?? defaultStorage,
        ...(storageKey ? { storageKey } : {}),
        ...(source ? { source } : {}),
      },
    });
  }, [captureType, defaultStorage, location, router, source, storageKey]);

  useEffect(() => {
    let cancelled = false;

    const processCapture = async () => {
      const inputUri = type === "voice" ? recordingUri : photoUri;

      if (!inputUri) {
        console.error("Inventory capture failed: missing input URI.", {
          type,
          photoUri,
          recordingUri,
        });
        toast.error(t("addItems.create.error"));
        retryCapture();
        return;
      }

      try {
        const base64Data = await readFileAsBase64(inputUri);

        if (cancelled) {
          return;
        }

        const captureKey = await createInventoryCapture({
          data: base64Data,
          type: type === "voice" ? "audio" : "image",
        });

        for (let attempt = 0; attempt < CAPTURE_POLL_MAX_ATTEMPTS; attempt += 1) {
          if (cancelled) {
            return;
          }

          const status = await getInventoryCaptureStatus(captureKey);
          const capturedItems = getCapturedItems(status);

          console.log("Inventory capture poll status", {
            attempt: attempt + 1,
            captureKey,
            state: status.state,
            outcome: status.outcome,
            errorKey: status.error_key ?? null,
            itemsCount: capturedItems.length,
            status,
          });

          if (cancelled) {
            return;
          }

          if (!isCapturePending(status)) {
            if (status.error_key) {
              console.error("Inventory capture completed with backend error.", {
                captureKey,
                status,
              });
              setCaptureErrorMessage(
                isTranslationKey(status.error_key) ? t(status.error_key) : null,
              );
              return;
            }

            router.replace({
              pathname: "/onboarding/add-items/review",
              params: {
                location: location ?? defaultStorage,
                ...(storageKey ? { storageKey } : {}),
                ...(source ? { source } : {}),
                items: JSON.stringify(capturedItems),
              },
            });
            return;
          }

          await new Promise((resolve) => setTimeout(resolve, CAPTURE_POLL_INTERVAL_MS));
        }

        console.error("Inventory capture polling timed out.", {
          type,
          inputUri,
        });
        setCaptureErrorMessage(t("inventory.item_capture.temporarily_unavailable"));
      } catch (error) {
        console.error("Inventory capture request or polling failed.", {
          type,
          inputUri,
          error,
          errorDetails: getApiErrorDetails(error),
        });
        const errorDetails = getApiErrorDetails(error);
        const message =
          typeof errorDetails.message === "string" && isTranslationKey(errorDetails.message)
            ? t(errorDetails.message)
            : t("addItems.create.error");

        setCaptureErrorMessage(message);
      }
    };

    void processCapture();

    return () => {
      cancelled = true;
    };
  }, [
    defaultStorage,
    location,
    photoUri,
    recordingUri,
    retryCapture,
    router,
    source,
    storageKey,
    t,
    type,
  ]);

  if (captureErrorMessage) {
    return (
      <CaptureErrorState
        message={captureErrorMessage}
        type={captureType}
        onTryAgain={retryCapture}
      />
    );
  }

  return <ProcessingOverlay />;
}
