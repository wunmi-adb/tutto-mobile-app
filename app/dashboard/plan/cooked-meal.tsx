import type { MealTypeId } from "@/components/dashboard/data";
import CookedMealDetailScreen from "@/components/dashboard/plan/CookedMealDetailScreen";
import type { FillLevel } from "@/lib/inventory/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";

export default function PlanCookedMealScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    dayIdx?: string;
    fillLevel?: FillLevel;
    itemKey?: string;
    location?: string;
    mealId?: string;
    mealName?: string;
    mealType?: MealTypeId;
    storageLocationKey?: string;
  }>();
  const location = params.location;
  const mealName = params.mealName;
  const mealType = params.mealType;

  const hasRequiredParams = !!location && !!mealName && !!mealType;

  useEffect(() => {
    if (!hasRequiredParams) {
      router.replace("/dashboard/plan");
    }
  }, [hasRequiredParams, router]);

  if (!hasRequiredParams) {
    return null;
  }

  const handleUpdateUsage = () => {
    router.push({
      pathname: "/dashboard/plan/update-usage",
      params: {
        dayIdx: params.dayIdx,
        fillLevel: params.fillLevel,
        itemKey: params.itemKey,
        location,
        mealId: params.mealId,
        mealName,
        mealType,
        mode: "cooked_meal",
        storageLocationKey: params.storageLocationKey,
      },
    });
  };

  return (
    <CookedMealDetailScreen
      location={location}
      mealName={mealName}
      mealType={mealType}
      onBack={() => router.back()}
      onUpdateUsage={handleUpdateUsage}
    />
  );
}
