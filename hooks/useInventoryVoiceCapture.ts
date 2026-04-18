import {
  getInventoryExtractionStatus,
  submitInventoryExtraction,
} from "@/lib/api/item-capture";
import { isTranslationKey } from "@/i18n/messages";
import { useCallback, useRef, useState } from "react";
import {
  INVENTORY_EXTRACTION_POLL_INTERVAL_MS,
  getStorageExtractedItemNames,
  isInventoryExtractionPending,
} from "@/components/onboarding/storage/capture";
import { INVENTORY_EXTRACTION_POLL_MAX_ATTEMPTS } from "@/components/onboarding/storage/constants";

type Options = {
  onCaptureStart?: () => void;
  onItemsDetected: (detectedNames: string[]) => void;
};

export function useInventoryVoiceCapture({ onCaptureStart, onItemsDetected }: Options) {
  const [isVoiceProcessing, setIsVoiceProcessing] = useState(false);
  const [showVoiceEmptyState, setShowVoiceEmptyState] = useState(false);
  const [showVoiceError, setShowVoiceError] = useState(false);
  const [voiceErrorKey, setVoiceErrorKey] = useState<string | null>(null);
  const isMountedRef = useRef(true);
  const activeExtractionIdRef = useRef(0);
  const pollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const markMounted = useCallback(() => {
    isMountedRef.current = true;

    return () => {
      activeExtractionIdRef.current += 1;
      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current);
        pollTimeoutRef.current = null;
      }
      isMountedRef.current = false;
    };
  }, []);

  const clearVoiceError = useCallback(() => {
    setShowVoiceEmptyState(false);
    setShowVoiceError(false);
    setVoiceErrorKey(null);
  }, []);

  const waitForNextExtractionPoll = useCallback((extractionId: number) => {
    return new Promise<boolean>((resolve) => {
      pollTimeoutRef.current = setTimeout(() => {
        pollTimeoutRef.current = null;
        resolve(
          isMountedRef.current && activeExtractionIdRef.current === extractionId,
        );
      }, INVENTORY_EXTRACTION_POLL_INTERVAL_MS);
    });
  }, []);

  const handleVoiceDone = useCallback(
    async (recordingUri: string) => {
      const extractionId = activeExtractionIdRef.current + 1;
      activeExtractionIdRef.current = extractionId;

      onCaptureStart?.();
      clearVoiceError();
      setIsVoiceProcessing(true);

      try {
        const captureKey = await submitInventoryExtraction({
          mediaType: "audio",
          uri: recordingUri,
        });

        for (let attempt = 0; attempt < INVENTORY_EXTRACTION_POLL_MAX_ATTEMPTS; attempt += 1) {
          if (!isMountedRef.current || activeExtractionIdRef.current !== extractionId) {
            return;
          }

          const status = await getInventoryExtractionStatus(captureKey);

          if (status.state === "failed") {
            if (isMountedRef.current && activeExtractionIdRef.current === extractionId) {
              setVoiceErrorKey(
                status.error_key && isTranslationKey(status.error_key)
                  ? status.error_key
                  : "inventory.item_capture.failed",
              );
              setShowVoiceError(true);
            }
            return;
          }

          if (status.state === "completed") {
            const detectedNames = getStorageExtractedItemNames(status);

            if (status.outcome === "ok" && detectedNames.length > 0) {
              onItemsDetected(detectedNames);
              return;
            }

            if (isMountedRef.current && activeExtractionIdRef.current === extractionId) {
              if (status.outcome === "no_item_found") {
                setShowVoiceEmptyState(true);
              } else {
                setVoiceErrorKey(
                  status.error_key && isTranslationKey(status.error_key)
                    ? status.error_key
                    : "inventory.item_capture.failed",
                );
                setShowVoiceError(true);
              }
            }
            return;
          }

          if (!isInventoryExtractionPending(status)) {
            if (isMountedRef.current && activeExtractionIdRef.current === extractionId) {
              setVoiceErrorKey("inventory.item_capture.failed");
              setShowVoiceError(true);
            }
            return;
          }

          const shouldContinue = await waitForNextExtractionPoll(extractionId);

          if (!shouldContinue) {
            return;
          }
        }

        if (isMountedRef.current && activeExtractionIdRef.current === extractionId) {
          setVoiceErrorKey("inventory.item_capture.failed");
          setShowVoiceError(true);
        }
      } catch (error) {
        console.error("Failed to process inventory voice capture.", error);

        if (isMountedRef.current && activeExtractionIdRef.current === extractionId) {
          setVoiceErrorKey("inventory.item_capture.failed");
          setShowVoiceError(true);
        }
      } finally {
        if (isMountedRef.current && activeExtractionIdRef.current === extractionId) {
          setIsVoiceProcessing(false);
        }
      }
    },
    [clearVoiceError, onCaptureStart, onItemsDetected, waitForNextExtractionPoll],
  );

  return {
    clearVoiceError,
    handleVoiceDone,
    isVoiceProcessing,
    markMounted,
    showVoiceEmptyState,
    showVoiceError,
    voiceErrorKey,
  };
}
