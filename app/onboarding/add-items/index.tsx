import MethodSelection from "@/components/items/MethodSelection";
import { useI18n } from "@/i18n";
import { getSingleParamValue } from "@/lib/utils/add-items";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback } from "react";

export default function AddItemsIndex() {
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

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const getSelectionParams = useCallback(
    () => ({
      location: storageName,
      ...(normalizedStorageKey ? { storageKey: normalizedStorageKey } : {}),
      ...(normalizedSource ? { source: normalizedSource } : {}),
    }),
    [normalizedSource, normalizedStorageKey, storageName],
  );

  const handleSelectCamera = useCallback(() => {
    router.push({
      pathname: "/onboarding/add-items/camera",
      params: getSelectionParams(),
    });
  }, [getSelectionParams, router]);

  const handleSelectVoice = useCallback(() => {
    router.push({
      pathname: "/onboarding/add-items/voice",
      params: getSelectionParams(),
    });
  }, [getSelectionParams, router]);

  const handleSelectManual = useCallback(() => {
    router.push({
      pathname: "/onboarding/add-items/manual",
      params: getSelectionParams(),
    });
  }, [getSelectionParams, router]);

  return (
    <MethodSelection
      storageName={storageName}
      onBack={handleBack}
      onSelectCamera={handleSelectCamera}
      onSelectVoice={handleSelectVoice}
      onSelectManual={handleSelectManual}
    />
  );
}
