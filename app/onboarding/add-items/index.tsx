import MethodSelection from "@/components/items/MethodSelection";
import { useI18n } from "@/i18n";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function AddItemsIndex() {
  const router = useRouter();
  const { t } = useI18n();
  const { location, storageKey, source } = useLocalSearchParams<{
    location: string;
    storageKey: string;
    source?: string;
  }>();
  const storageName = location ?? t("addItems.defaultStorage");

  return (
    <MethodSelection
      storageName={storageName}
      onBack={() => router.back()}
      onSelectCamera={() =>
        router.push({
          pathname: "/onboarding/add-items/camera",
          params: { location: storageName, storageKey, ...(source ? { source } : {}) },
        })
      }
      onSelectVoice={() =>
        router.push({
          pathname: "/onboarding/add-items/voice",
          params: { location: storageName, storageKey, ...(source ? { source } : {}) },
        })
      }
      onSelectManual={() =>
        router.push({
          pathname: "/onboarding/add-items/manual",
          params: { location: storageName, storageKey, ...(source ? { source } : {}) },
        })
      }
    />
  );
}
