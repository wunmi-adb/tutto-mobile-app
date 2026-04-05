import ManualEntryView from "@/components/items/ManualEntryView";
import { getSingleParamValue } from "@/lib/utils/add-items";
import { useLocalSearchParams, useRouter } from "expo-router";
import { type ComponentProps, useCallback } from "react";

export default function Manual() {
  const router = useRouter();
  const { location, storageKey, source } = useLocalSearchParams<{
    location: string;
    storageKey: string;
    source?: string;
  }>();
  const normalizedLocation = getSingleParamValue(location);
  const normalizedStorageKey = getSingleParamValue(storageKey);
  const normalizedSource = getSingleParamValue(source);

  const handleComplete = useCallback(
    (items: Parameters<ComponentProps<typeof ManualEntryView>["onComplete"]>[0]) => {
      router.push({
        pathname: "/onboarding/add-items/review",
        params: {
          ...(normalizedLocation ? { location: normalizedLocation } : {}),
          ...(normalizedStorageKey ? { storageKey: normalizedStorageKey } : {}),
          items: JSON.stringify(items),
          ...(normalizedSource ? { source: normalizedSource } : {}),
        },
      });
    },
    [normalizedLocation, normalizedSource, normalizedStorageKey, router],
  );

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <ManualEntryView
      onComplete={handleComplete}
      onBack={handleBack}
    />
  );
}
