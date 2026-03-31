import ManualEntryView from "@/components/items/ManualEntryView";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function Manual() {
  const router = useRouter();
  const { location } = useLocalSearchParams<{ location: string }>();

  return (
    <ManualEntryView
      onComplete={(items) =>
        router.push({
          pathname: "/onboarding/add-items/review",
          params: {
            location,
            items: JSON.stringify(items),
          },
        })
      }
      onBack={() => router.back()}
    />
  );
}
