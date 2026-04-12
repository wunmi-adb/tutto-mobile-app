import { useI18n } from "@/i18n";
import {
  createInventoryCapture,
  getInventoryCaptureStatus,
  readFileAsBase64,
} from "@/lib/api/item-capture";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TextInput } from "react-native";
import {
  getStorageCapturedItemNames,
  isStorageCapturePending,
  waitForNextStorageCapturePoll,
} from "./capture";
import {
  CAPTURE_POLL_MAX_ATTEMPTS,
  DraftCaptureMode,
  mergeUniqueNames,
} from "./constants";
import { getStorageSuccessHref } from "./routes";

export function useOnboardingStorage() {
  const router = useRouter();
  const { t } = useI18n();
  const [captureMode, setCaptureMode] = useState<DraftCaptureMode>(null);
  const [manualValue, setManualValue] = useState("");
  const [items, setItems] = useState<string[]>([]);
  const [isVoiceProcessing, setIsVoiceProcessing] = useState(false);
  const [showVoiceError, setShowVoiceError] = useState(false);
  const isMountedRef = useRef(true);
  const manualInputRef = useRef<TextInput>(null);
  const kitchenLabel = t("dashboard.tabs.kitchen");
  const isSaving = false;

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (captureMode !== "manual") {
      return;
    }

    const timer = setTimeout(() => {
      manualInputRef.current?.focus();
    }, 100);

    return () => clearTimeout(timer);
  }, [captureMode]);

  const addManualItem = useCallback(() => {
    const trimmed = manualValue.trim();

    if (!trimmed || items.some((item) => item.toLowerCase() === trimmed.toLowerCase())) {
      return;
    }

    setItems((prev) => [...prev, trimmed]);
    setManualValue("");
  }, [items, manualValue]);

  const removeItem = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  }, []);

  const handleVoiceDone = useCallback(async (recordingUri: string) => {
    setCaptureMode(null);
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

          if (isMountedRef.current) {
            setItems((prev) => mergeUniqueNames(prev, detectedNames));
          }
          return;
        }

        await waitForNextStorageCapturePoll();
      }

      if (isMountedRef.current) {
        setShowVoiceError(true);
      }
    } catch (error) {
      console.error("Failed to process onboarding voice capture.", error);

      if (isMountedRef.current) {
        setShowVoiceError(true);
      }
    } finally {
      if (isMountedRef.current) {
        setIsVoiceProcessing(false);
      }
    }
  }, []);

  const saveButtonTitle = useMemo(() => {
    return t(
      items.length === 1
        ? "storage.onboarding.saveOneNow"
        : "storage.onboarding.saveAllNow",
    );
  }, [items.length, t]);

  const handleSave = useCallback(async () => {
    if (items.length === 0 || isSaving) {
      return;
    }

    router.replace(getStorageSuccessHref(kitchenLabel, items.length));
  }, [isSaving, items.length, kitchenLabel, router]);

  const resetManualMode = useCallback(() => {
    setCaptureMode(null);
    setManualValue("");
  }, []);

  const handleBack = useCallback(() => {
    if (captureMode === "manual") {
      resetManualMode();
      return;
    }

    router.back();
  }, [captureMode, resetManualMode, router]);

  const retryVoiceCapture = useCallback(() => {
    setShowVoiceError(false);
    setCaptureMode("voice");
  }, []);

  return {
    captureMode,
    items,
    isSaving,
    isVoiceProcessing,
    kitchenLabel,
    manualInputRef,
    manualValue,
    saveButtonTitle,
    showVoiceError,
    addManualItem,
    handleBack,
    handleSave,
    handleVoiceDone,
    removeItem,
    resetManualMode,
    retryVoiceCapture,
    setCaptureMode,
    setManualValue,
  };
}
