import AddItemView from "@/components/items/AddItemView";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function Detail() {
  const router = useRouter();
  const { location, items, currentIndex, completedIndices } =
    useLocalSearchParams<{
      location: string;
      items: string;
      currentIndex: string;
      completedIndices: string;
    }>();

  const storageName = location ?? "Fridge";

  const parsedItems: { name: string }[] = (() => {
    try { return items ? JSON.parse(items) : []; } catch { return []; }
  })();

  const parsedCompleted: number[] = (() => {
    try { return completedIndices ? JSON.parse(completedIndices) : []; } catch { return []; }
  })();

  return (
    <AddItemView
      storageName={storageName}
      items={parsedItems}
      currentIndex={parseInt(currentIndex ?? "0", 10)}
      completedIndices={parsedCompleted}
      onBack={() => router.back()}
      onFinish={() => {
        router.replace({ pathname: "/onboarding/complete", params: { location: storageName } });
      }}
    />
  );
}
