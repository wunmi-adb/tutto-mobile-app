import StorageCaptureErrorState from "@/components/onboarding/storage/StorageCaptureErrorState";
import StorageProcessingOverlay from "@/components/onboarding/storage/StorageProcessingOverlay";
import StorageVoiceView from "@/components/onboarding/storage/StorageVoiceView";
import { useInventoryVoiceCapture } from "@/hooks/useInventoryVoiceCapture";
import { useI18n } from "@/i18n";
import { usePantryPalKitchenState } from "@/stores/pantryPalKitchenStore";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function KitchenVoiceRoute() {
  const router = useRouter();
  const { t } = useI18n();
  const { clearReviewItems, setReviewItems } = usePantryPalKitchenState();
  const {
    clearVoiceError,
    handleVoiceDone,
    isVoiceProcessing,
    markMounted,
    showVoiceEmptyState,
    showVoiceError,
    voiceErrorKey,
  } = useInventoryVoiceCapture({
    onItemsDetected: (detectedNames) => {
      setReviewItems(detectedNames);
      router.replace("/dashboard/kitchen/review");
    },
  });

  useEffect(() => {
    clearReviewItems();
    return markMounted();
  }, [clearReviewItems, markMounted]);

  if (isVoiceProcessing) {
    return <StorageProcessingOverlay />;
  }

  if (showVoiceError) {
    return (
      <StorageCaptureErrorState
        variant="error"
        errorKey={voiceErrorKey}
        onTryAgain={() => {
          clearVoiceError();
        }}
      />
    );
  }

  if (showVoiceEmptyState) {
    return (
      <StorageCaptureErrorState
        variant="empty"
        onTryAgain={() => {
          clearVoiceError();
        }}
      />
    );
  }

  return (
    <StorageVoiceView
      storageName={t("dashboard.tabs.kitchen")}
      onDone={(recordingUri) => {
        void handleVoiceDone(recordingUri);
      }}
      onBack={() => router.back()}
    />
  );
}
