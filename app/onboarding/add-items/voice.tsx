import VoiceView from "@/components/items/VoiceView";
import { useI18n } from "@/i18n";
import { getSingleParamValue } from "@/lib/utils/add-items";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback } from "react";

export default function Voice() {
  const router = useRouter();
  const { t } = useI18n();
  const { location, storageKey, source } = useLocalSearchParams<{
    location: string;
    storageKey: string;
    source?: string;
  }>();
  const normalizedLocation = getSingleParamValue(location);
  const normalizedStorageKey = getSingleParamValue(storageKey);
  const normalizedSource = getSingleParamValue(source);
  const storageName = normalizedLocation ?? t("addItems.defaultStorage");

  const handleDone = useCallback(
    (recordingUri: string) => {
      router.replace({
        pathname: "/onboarding/add-items/processing",
        params: {
          location: storageName,
          ...(normalizedStorageKey ? { storageKey: normalizedStorageKey } : {}),
          recordingUri,
          type: "voice",
          ...(normalizedSource ? { source: normalizedSource } : {}),
        },
      });
    },
    [normalizedSource, normalizedStorageKey, router, storageName],
  );

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <VoiceView
      storageName={storageName}
      onDone={handleDone}
      onBack={handleBack}
    />
  );
}
