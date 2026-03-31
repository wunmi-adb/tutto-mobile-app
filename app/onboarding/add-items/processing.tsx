import ProcessingOverlay from "@/components/items/ProcessingOverlay";
import { useI18n } from "@/i18n";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";

// Mock items — replace with real AI detection results when available
const MOCK_ITEMS = [
  { name: "Whole milk" },
  { name: "Cheddar cheese" },
  { name: "Greek yogurt" },
  { name: "Orange juice" },
  { name: "Leftover pasta" },
];

export default function Processing() {
  const router = useRouter();
  const { t } = useI18n();
  const { location } = useLocalSearchParams<{ location: string }>();
  const defaultStorage = t("addItems.defaultStorage");

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace({
        pathname: "/onboarding/add-items/review",
        params: {
          location: location ?? defaultStorage,
          items: JSON.stringify(MOCK_ITEMS),
        },
      });
    }, 2500);
    return () => clearTimeout(timer);
  }, [defaultStorage, location, router]);

  return <ProcessingOverlay />;
}
