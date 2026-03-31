import VoiceView from "@/components/items/VoiceView";
import { useI18n } from "@/i18n";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function Voice() {
  const router = useRouter();
  const { t } = useI18n();
  const { location } = useLocalSearchParams<{ location: string }>();
  const storageName = location ?? t("addItems.defaultStorage");

  return (
    <VoiceView
      storageName={storageName}
      onDone={() =>
        router.replace({
          pathname: "/onboarding/add-items/processing",
          params: { location: storageName },
        })
      }
      onBack={() => router.back()}
    />
  );
}
