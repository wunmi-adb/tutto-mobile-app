import MethodSelection from "@/components/items/MethodSelection";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function AddItemsIndex() {
  const router = useRouter();
  const { location } = useLocalSearchParams<{ location: string }>();
  const storageName = location ?? "Fridge";

  return (
    <MethodSelection
      storageName={storageName}
      onBack={() => router.back()}
      onSelectCamera={() =>
        router.push({ pathname: "/onboarding/add-items/camera", params: { location: storageName } })
      }
      onSelectVoice={() =>
        router.push({ pathname: "/onboarding/add-items/voice", params: { location: storageName } })
      }
      onSelectManual={() =>
        router.push({ pathname: "/onboarding/add-items/manual" })
      }
    />
  );
}
