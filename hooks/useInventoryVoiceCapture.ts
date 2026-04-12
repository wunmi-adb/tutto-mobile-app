import {
  createInventoryCapture,
  getInventoryCaptureStatus,
  readFileAsBase64,
} from "@/lib/api/item-capture";
import { useCallback, useRef, useState } from "react";
import {
  getStorageCapturedItemNames,
  isStorageCapturePending,
  waitForNextStorageCapturePoll,
} from "@/components/onboarding/storage/capture";
import { CAPTURE_POLL_MAX_ATTEMPTS } from "@/components/onboarding/storage/constants";

type Options = {
  onCaptureStart?: () => void;
  onItemsDetected: (detectedNames: string[]) => void;
};

export function useInventoryVoiceCapture({ onCaptureStart, onItemsDetected }: Options) {
  const [isVoiceProcessing, setIsVoiceProcessing] = useState(false);
  const [showVoiceError, setShowVoiceError] = useState(false);
  const isMountedRef = useRef(true);

  const markMounted = useCallback(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const clearVoiceError = useCallback(() => {
    setShowVoiceError(false);
  }, []);

  const handleVoiceDone = useCallback(
    async (recordingUri: string) => {
      onCaptureStart?.();
      setShowVoiceError(false);
      setIsVoiceProcessing(true);

      try {
        const base64Data = await readFileAsBase64(recordingUri);
        const captureKey = await createInventoryCapture({
          data: base64Data,
          type: "audio",
        });

        for (let attempt = 0; attempt < CAPTURE_POLL_MAX_ATTEMPTS; attempt += 1) {
          const status = await getInventoryCaptureStatus(captureKey);

          if (!isStorageCapturePending(status)) {
            const detectedNames = getStorageCapturedItemNames(status);

            if (status.error_key || detectedNames.length === 0) {
              if (isMountedRef.current) {
                setShowVoiceError(true);
              }
              return;
            }

            onItemsDetected(detectedNames);
            return;
          }

          await waitForNextStorageCapturePoll();
        }

        if (isMountedRef.current) {
          setShowVoiceError(true);
        }
      } catch (error) {
        console.error("Failed to process inventory voice capture.", error);

        if (isMountedRef.current) {
          setShowVoiceError(true);
        }
      } finally {
        if (isMountedRef.current) {
          setIsVoiceProcessing(false);
        }
      }
    },
    [onCaptureStart, onItemsDetected],
  );

  return {
    clearVoiceError,
    handleVoiceDone,
    isVoiceProcessing,
    markMounted,
    showVoiceError,
  };
}
