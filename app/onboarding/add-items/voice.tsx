import VoiceView from "@/components/items/VoiceView";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function Voice() {
  const router = useRouter();
  const { location } = useLocalSearchParams<{ location: string }>();
  const storageName = location ?? "Fridge";

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
