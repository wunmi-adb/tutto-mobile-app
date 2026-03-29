import ManualEntryView from "@/components/items/ManualEntryView";
import { useRouter } from "expo-router";

export default function Manual() {
  const router = useRouter();

  return (
    <ManualEntryView
      onComplete={() => router.push("/onboarding/add-items/review")}
      onBack={() => router.back()}
    />
  );
}
