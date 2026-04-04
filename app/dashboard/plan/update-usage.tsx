import type { MealTypeId } from "@/components/dashboard/data";
import UpdateUsageScreen, {
  type CookedMealUsageResult,
  type RecipeUsageResult,
} from "@/components/dashboard/plan/UpdateUsageScreen";
import { parseMealRecipe } from "@/components/dashboard/plan/helpers";
import type { PantryItem } from "@/components/dashboard/kitchen/types";
import type { FillLevel, ItemDraft } from "@/components/items/add-item/types";
import { handleCaughtApiError } from "@/lib/api/handle-caught-api-error";
import { useUpdateInventoryItem } from "@/lib/api/items";
import { usePlanState } from "@/stores/planStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";

function createItemDraftFromPantryItem(item: PantryItem): ItemDraft {
  const batches = item.batches.map((batch) => ({
    id: batch.id,
    qty: batch.qty,
    bestBefore: batch.bestBefore,
    fillLevel: batch.fillLevel,
  }));

  return {
    name: item.name,
    itemType: item.type,
    countAsUnits: item.countAsUnits,
    batches,
    expandedBatchId: batches[0]?.id ?? -1,
  };
}

function applyUsageChangeToDraft(
  item: PantryItem,
  change: {
    fillLevel?: FillLevel;
    finished: boolean;
    quantity?: number;
  },
) {
  const draft = createItemDraftFromPantryItem(item);

  if (change.finished) {
    return {
      ...draft,
      batches: [],
    };
  }

  const [firstBatch, ...restBatches] = draft.batches;

  if (!firstBatch) {
    return draft;
  }

  const nextFirstBatch = item.countAsUnits
    ? {
        ...firstBatch,
        qty: typeof change.quantity === "number" ? Math.max(1, Math.round(change.quantity)) : firstBatch.qty,
      }
    : {
        ...firstBatch,
        fillLevel: change.fillLevel ?? firstBatch.fillLevel,
      };

  return {
    ...draft,
    batches: [nextFirstBatch, ...restBatches],
  };
}

export default function PlanUpdateUsageRoute() {
  const router = useRouter();
  const { replaceMeal } = usePlanState();
  const updateInventoryItemMutation = useUpdateInventoryItem();
  const params = useLocalSearchParams<{
    dayIdx?: string;
    fillLevel?: FillLevel;
    itemKey?: string;
    location?: string;
    mealId?: string;
    mealName?: string;
    mealType?: MealTypeId;
    mode?: "cooked_meal";
    recipe?: string;
    storageLocationKey?: string;
  }>();
  const isCookedMealMode = params.mode === "cooked_meal";
  const parsedRecipe = parseMealRecipe(params.recipe);
  const mealId = params.mealId;
  const location = params.location;
  const mealName = params.mealName;
  const mealType = params.mealType;

  const hasCookedMealParams =
    !!location &&
    !!mealId &&
    !!mealName &&
    !!mealType;

  useEffect(() => {
    if (isCookedMealMode && !hasCookedMealParams) {
      router.replace("/dashboard/plan");
      return;
    }

    if (!isCookedMealMode && !parsedRecipe) {
      router.replace("/dashboard/plan");
    }
  }, [hasCookedMealParams, isCookedMealMode, parsedRecipe, router]);

  if (isCookedMealMode) {
    if (!hasCookedMealParams) {
      return null;
    }

    const handleCookedMealDone = async ({
      fillLevel,
      finished,
      changed,
    }: CookedMealUsageResult) => {
      if (changed && params.itemKey && params.storageLocationKey) {
        const cookedMealItem: PantryItem = {
          id: params.itemKey,
          name: mealName,
          type: "cooked_meal",
          location,
          storageLocationKey: params.storageLocationKey,
          countAsUnits: false,
          batches: [
            {
              id: 1,
              qty: 1,
              fillLevel: params.fillLevel ?? "just_opened",
              sealed: false,
              bestBefore: "",
            },
          ],
        };

        try {
          await updateInventoryItemMutation.mutateAsync({
            draft: applyUsageChangeToDraft(cookedMealItem, {
              fillLevel,
              finished,
            }),
            itemKey: params.itemKey,
            storageLocationKey: params.storageLocationKey,
          });
        } catch (error) {
          handleCaughtApiError(error);
          return;
        }
      }

      const dayIdx = Number.parseInt(params.dayIdx ?? "", 10);

      if (Number.isFinite(dayIdx)) {
        replaceMeal(dayIdx, mealId, {
          kind: "cooked_meal",
          fillLevel: finished ? undefined : fillLevel,
          itemKey: params.itemKey ?? mealId,
          location,
          name: mealName,
          storageLocationKey: params.storageLocationKey,
        });
      }

      router.replace("/dashboard/plan");
    };

    return (
      <UpdateUsageScreen
        mode="cooked_meal"
        mealName={mealName}
        location={location}
        initialFillLevel={params.fillLevel}
        onSkip={() => router.replace("/dashboard/plan")}
        onDone={handleCookedMealDone}
        saving={updateInventoryItemMutation.isPending}
      />
    );
  }

  if (!parsedRecipe) {
    return null;
  }

  const handleRecipeDone = async ({ changes }: RecipeUsageResult) => {
    const updates = changes.filter((change) => change.used && change.matchedItem?.storageLocationKey);

    try {
      for (const change of updates) {
        const matchedItem = change.matchedItem as PantryItem;

        await updateInventoryItemMutation.mutateAsync({
          draft: applyUsageChangeToDraft(matchedItem, {
            fillLevel: change.fillLevel,
            finished: change.finished,
            quantity: change.quantity,
          }),
          itemKey: matchedItem.id,
          storageLocationKey: matchedItem.storageLocationKey as string,
        });
      }

      router.replace("/dashboard/plan");
    } catch (error) {
      handleCaughtApiError(error);
    }
  };

  return (
    <UpdateUsageScreen
      mode="recipe"
      recipe={parsedRecipe}
      onSkip={() => router.replace("/dashboard/plan")}
      onDone={handleRecipeDone}
      saving={updateInventoryItemMutation.isPending}
    />
  );
}
