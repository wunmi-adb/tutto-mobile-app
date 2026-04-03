import ManualEntryView from "@/components/items/ManualEntryView";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function Manual() {
  const router = useRouter();
  const { location, storageKey, source } = useLocalSearchParams<{
    location: string;
    storageKey: string;
    source?: string;
  }>();

  return (
    <ManualEntryView
      onComplete={(items) =>
        router.push({
          pathname: "/onboarding/add-items/review",
          params: {
            location,
            storageKey,
            items: JSON.stringify(items),
            ...(source ? { source } : {}),
          },
        })
      }
      onBack={() => router.back()}
    />
  );
}
