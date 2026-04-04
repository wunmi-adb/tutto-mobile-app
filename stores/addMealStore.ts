import { type MealTypeId } from "@/components/dashboard/data";
import type { PantryItem } from "@/components/dashboard/kitchen/types";
import { useI18n } from "@/i18n";
import { useInfiniteInventoryItems } from "@/lib/api/inventory";
import { useStore } from "@nanostores/react";
import { atom } from "nanostores";
import { useEffect, useMemo } from "react";

export type AddMealKind = "recipe" | "cooked_meal";

export const $addMealKind = atom<AddMealKind>("recipe");
export const $addMealSelectedType = atom<MealTypeId | null>(null);
export const $addMealName = atom("");
export const $addMealSearchValue = atom("");
export const $addMealDebouncedSearchValue = atom("");

export function resetAddMealState() {
  $addMealKind.set("recipe");
  $addMealSelectedType.set(null);
  $addMealName.set("");
  $addMealSearchValue.set("");
  $addMealDebouncedSearchValue.set("");
}

export function useAddMealState({
  onAddCookedMeal,
  onAddRecipeMeal,
  submitting = false,
}: {
  onAddCookedMeal: (item: PantryItem, type: MealTypeId) => Promise<void> | void;
  onAddRecipeMeal: (name: string, type: MealTypeId) => Promise<void> | void;
  submitting?: boolean;
}) {
  const { t } = useI18n();
  const mealKind = useStore($addMealKind);
  const selectedType = useStore($addMealSelectedType);
  const name = useStore($addMealName);
  const searchValue = useStore($addMealSearchValue);
  const debouncedSearchValue = useStore($addMealDebouncedSearchValue);
  const inventoryQuery = useInfiniteInventoryItems({
    search: mealKind === "cooked_meal" ? debouncedSearchValue : undefined,
  });
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = inventoryQuery;

  useEffect(() => {
    const timer = setTimeout(() => {
      $addMealDebouncedSearchValue.set(searchValue.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]);

  useEffect(() => {
    if (mealKind !== "cooked_meal") {
      return;
    }

    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, mealKind]);

  const cookedItems = useMemo(
    () =>
      (data?.pages ?? [])
        .flatMap((page) => page.items)
        .filter((item) => item.type === "cooked_meal"),
    [data?.pages],
  );

  const selectedCookedItem = useMemo(() => {
    if (mealKind !== "cooked_meal") {
      return null;
    }

    return cookedItems.find((item) => item.id === name) ?? null;
  }, [cookedItems, mealKind, name]);

  const canSubmit =
    !submitting &&
    selectedType !== null &&
    (mealKind === "recipe" ? name.trim().length > 0 : selectedCookedItem !== null);

  const resetForm = () => {
    $addMealName.set("");
    $addMealSearchValue.set("");
    $addMealDebouncedSearchValue.set("");
  };

  const selectRecipeMode = () => {
    $addMealKind.set("recipe");
    resetForm();
  };

  const selectCookedMealMode = () => {
    $addMealKind.set("cooked_meal");
    resetForm();
  };

  const getEmptyStateText = () => {
    if (debouncedSearchValue) {
      return t("kitchen.plan.addScreen.noCookedMealMatches");
    }

    return t("kitchen.plan.addScreen.noCookedItems");
  };

  const submit = async () => {
    if (!selectedType) {
      return;
    }

    if (mealKind === "cooked_meal") {
      if (!selectedCookedItem) {
        return;
      }

      await onAddCookedMeal(selectedCookedItem, selectedType);
      resetAddMealState();
      return;
    }

    await onAddRecipeMeal(name.trim(), selectedType);
    resetAddMealState();
  };

  return {
    mealKind,
    selectedType,
    name,
    searchValue,
    cookedItems,
    isLoading,
    canSubmit,
    getEmptyStateText,
    selectRecipeMode,
    selectCookedMealMode,
    setSelectedType: (value: MealTypeId) => $addMealSelectedType.set(value),
    setName: (value: string) => $addMealName.set(value),
    setSearchValue: (value: string) => $addMealSearchValue.set(value),
    selectCookedItem: (itemId: string) => $addMealName.set(itemId),
    submit,
  };
}
