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
import { getSingleParamValue } from "@/lib/utils/add-items";
import {
  getCapturedItems,
  getCaptureInputUri,
  getCapturePayloadType,
  getCaptureRetryPathname,
  getCaptureScreenType,
  isCapturePending,
  waitForNextCapturePoll,
} from "@/lib/utils/add-items-processing";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner-native";

const CAPTURE_POLL_MAX_ATTEMPTS = 40;

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
  const normalizedLocation = getSingleParamValue(location);
  const normalizedStorageKey = getSingleParamValue(storageKey);
  const normalizedSource = getSingleParamValue(source);
  const normalizedPhotoUri = getSingleParamValue(photoUri);
  const normalizedRecordingUri = getSingleParamValue(recordingUri);
  const captureType = getCaptureScreenType(getSingleParamValue(type));
  const defaultStorage = t("addItems.defaultStorage");
  const captureInputUri = useMemo(
    () =>
      getCaptureInputUri({
        photoUri: normalizedPhotoUri,
        recordingUri: normalizedRecordingUri,
        type: captureType,
      }),
    [captureType, normalizedPhotoUri, normalizedRecordingUri],
  );

  const retryCapture = useCallback(() => {
    router.replace({
      pathname: getCaptureRetryPathname(captureType),
      params: {
        location: normalizedLocation ?? defaultStorage,
        ...(normalizedStorageKey ? { storageKey: normalizedStorageKey } : {}),
        ...(normalizedSource ? { source: normalizedSource } : {}),
      },
    });
  }, [captureType, defaultStorage, normalizedLocation, normalizedSource, normalizedStorageKey, router]);

  const getCaptureErrorMessage = useCallback(
    (messageKey: string | null | undefined) => {
      if (typeof messageKey === "string" && isTranslationKey(messageKey)) {
        return t(messageKey);
      }

      return t("inventory.item_capture.failed");
    },
    [t],
  );

  const navigateToReview = useCallback(
    (capturedItems: ReturnType<typeof getCapturedItems>) => {
      router.replace({
        pathname: "/onboarding/add-items/review",
        params: {
          location: normalizedLocation ?? defaultStorage,
          ...(normalizedStorageKey ? { storageKey: normalizedStorageKey } : {}),
          ...(normalizedSource ? { source: normalizedSource } : {}),
          items: JSON.stringify(capturedItems),
        },
      });
    },
    [defaultStorage, normalizedLocation, normalizedSource, normalizedStorageKey, router],
  );

  const logCapturePollStatus = useCallback(
    (attempt: number, captureKey: string, status: InventoryCaptureStatus) => {
      const capturedItems = getCapturedItems(status);

      console.log("Inventory capture poll status", {
        attempt,
        captureKey,
        state: status.state,
        outcome: status.outcome,
        errorKey: status.error_key ?? null,
        itemsCount: capturedItems.length,
        status,
      });
    },
    [],
  );

  const handleResolvedCaptureStatus = useCallback(
    (captureKey: string, status: InventoryCaptureStatus) => {
      const capturedItems = getCapturedItems(status);

      if (status.error_key) {
        console.error("Inventory capture completed with backend error.", {
          captureKey,
          status,
        });
        setCaptureErrorMessage(getCaptureErrorMessage(status.error_key));
        return true;
      }

      navigateToReview(capturedItems);
      return true;
    },
    [getCaptureErrorMessage, navigateToReview],
  );

  const handleCapturePollTimeout = useCallback(() => {
    console.error("Inventory capture polling timed out.", {
      type: captureType,
      inputUri: captureInputUri,
    });
    setCaptureErrorMessage(t("inventory.item_capture.temporarily_unavailable"));
  }, [captureInputUri, captureType, t]);

  const handleMissingInputUri = useCallback(() => {
    console.error("Inventory capture failed: missing input URI.", {
      type: captureType,
      photoUri: normalizedPhotoUri,
      recordingUri: normalizedRecordingUri,
    });
    toast.error(t("addItems.create.error"));
    retryCapture();
  }, [captureType, normalizedPhotoUri, normalizedRecordingUri, retryCapture, t]);

  const requestInventoryCapture = useCallback(
    async (inputUri: string, cancelledRef: { current: boolean }) => {
      const base64Data = await readFileAsBase64(inputUri);

      if (cancelledRef.current) {
        return null;
      }

      return createInventoryCapture({
        data: base64Data,
        type: getCapturePayloadType(captureType),
      });
    },
    [captureType],
  );

  const handleCaptureFailure = useCallback(
    (error: unknown, inputUri: string | undefined) => {
      console.error("Inventory capture request or polling failed.", {
        type: captureType,
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
    },
    [captureType, t],
  );

  const pollCaptureUntilResolved = useCallback(
    async (captureKey: string, cancelledRef: { current: boolean }) => {
      for (let attempt = 0; attempt < CAPTURE_POLL_MAX_ATTEMPTS; attempt += 1) {
        if (cancelledRef.current) {
          return;
        }

        const status = await getInventoryCaptureStatus(captureKey);
        logCapturePollStatus(attempt + 1, captureKey, status);

        if (cancelledRef.current) {
          return;
        }

        if (!isCapturePending(status)) {
          handleResolvedCaptureStatus(captureKey, status);
          return;
        }

        await waitForNextCapturePoll();
      }

      handleCapturePollTimeout();
    },
    [
      handleCapturePollTimeout,
      handleResolvedCaptureStatus,
      logCapturePollStatus,
    ],
  );

  const processCapture = useCallback(
    async (cancelledRef: { current: boolean }) => {
      if (!captureInputUri) {
        handleMissingInputUri();
        return;
      }

      try {
        const captureKey = await requestInventoryCapture(captureInputUri, cancelledRef);

        if (!captureKey || cancelledRef.current) {
          return;
        }

        await pollCaptureUntilResolved(captureKey, cancelledRef);
      } catch (error) {
        handleCaptureFailure(error, captureInputUri);
      }
    },
    [
      captureInputUri,
      handleCaptureFailure,
      handleMissingInputUri,
      pollCaptureUntilResolved,
      requestInventoryCapture,
    ],
  );

  useEffect(() => {
    const cancelledRef = { current: false };

    void processCapture(cancelledRef);

    return () => {
      cancelledRef.current = true;
    };
  }, [processCapture]);

  if (captureErrorMessage) {
    return (
      <CaptureErrorState
        message={captureErrorMessage}
        type={captureType}
        onTryAgain={retryCapture}
      />
    );
  }

  return <ProcessingOverlay subtitle={t("addItems.processing.subtitle")} />;
}
