import { useI18n } from "@/i18n";
import { useInventoryVoiceCapture } from "@/hooks/useInventoryVoiceCapture";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TextInput } from "react-native";
import {
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
  const [reviewItems, setReviewItems] = useState<string[]>([]);
  const manualInputRef = useRef<TextInput>(null);
  const kitchenLabel = t("dashboard.tabs.kitchen");
  const isSaving = false;
  const {
    clearVoiceError,
    handleVoiceDone,
    isVoiceProcessing,
    markMounted,
    showVoiceError,
  } = useInventoryVoiceCapture({
    onCaptureStart: () => setCaptureMode(null),
    onItemsDetected: (detectedNames) => {
      setReviewItems(detectedNames);
    },
  });

  useEffect(() => {
    return markMounted();
  }, [markMounted]);

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

  const removeReviewItem = useCallback((index: number) => {
    setReviewItems((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  }, []);

  const cancelReview = useCallback(() => {
    setReviewItems([]);
  }, []);

  const confirmReview = useCallback(() => {
    setItems((prev) => mergeUniqueNames(prev, reviewItems));
    setReviewItems([]);
  }, [reviewItems]);

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
    clearVoiceError();
    setCaptureMode("voice");
  }, [clearVoiceError]);

  return {
    captureMode,
    reviewItems,
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
    removeReviewItem,
    cancelReview,
    confirmReview,
    resetManualMode,
    retryVoiceCapture,
    setCaptureMode,
    setManualValue,
  };
}
