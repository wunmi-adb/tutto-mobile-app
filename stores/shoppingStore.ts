import {
  getLocationLabel,
  getRecipeName,
  getShoppingCategoryLabel,
  type KitchenLocationId,
  type RecipeId,
  type ShoppingCategoryId,
} from "@/components/dashboard/data";
import { useI18n } from "@/i18n";
import type { TranslationKey } from "@/i18n/messages";
import { atom } from "nanostores";
import { useStore } from "@nanostores/react";
import { useMemo } from "react";

type ShoppingReason =
  | { kind: "recipe"; recipeId: RecipeId }
  | { kind: "runningLow"; locationId: Exclude<KitchenLocationId, "all" | "other"> }
  | { kind: "almostEmpty"; locationId: Exclude<KitchenLocationId, "all" | "other"> };

export type ShoppingItem = {
  id: string;
  name?: string;
  nameKey?: TranslationKey;
  category: ShoppingCategoryId;
  suggested: boolean;
  reason?: ShoppingReason;
  bought: boolean;
};

const INITIAL_ITEMS: ShoppingItem[] = [
  {
    id: "1",
    nameKey: "kitchen.items.avocado",
    category: "fresh",
    suggested: true,
    reason: { kind: "recipe", recipeId: "avocadoEggsToast" },
    bought: false,
  },
  {
    id: "2",
    nameKey: "kitchen.items.sourdoughBread",
    category: "bakery",
    suggested: true,
    reason: { kind: "recipe", recipeId: "avocadoEggsToast" },
    bought: false,
  },
  {
    id: "3",
    nameKey: "kitchen.items.beefMince500g",
    category: "meat",
    suggested: true,
    reason: { kind: "recipe", recipeId: "spaghettiBolognese" },
    bought: false,
  },
  {
    id: "4",
    nameKey: "kitchen.items.milkSemiSkimmed",
    category: "dairy",
    suggested: true,
    reason: { kind: "runningLow", locationId: "fridge" },
    bought: false,
  },
  {
    id: "5",
    nameKey: "kitchen.items.paprika",
    category: "spices",
    suggested: true,
    reason: { kind: "almostEmpty", locationId: "spiceRack" },
    bought: false,
  },
];

const CATEGORY_ORDER: ShoppingCategoryId[] = [
  "fresh",
  "meat",
  "dairy",
  "bakery",
  "dryGoods",
  "spices",
  "other",
];

export const $shoppingItems = atom<ShoppingItem[]>(INITIAL_ITEMS);
export const $shoppingShowAdding = atom(false);
export const $shoppingNewItemName = atom("");
export const $shoppingShowBought = atom(false);

function getItemName(t: ReturnType<typeof useI18n>["t"], item: ShoppingItem) {
  if (item.name) {
    return item.name;
  }

  return item.nameKey ? t(item.nameKey) : "";
}

function getReasonLabel(
  t: ReturnType<typeof useI18n>["t"],
  reason: ShoppingReason | undefined,
) {
  if (!reason) {
    return "";
  }

  switch (reason.kind) {
    case "recipe":
      return t("kitchen.shopping.reason.forRecipe", {
        recipe: getRecipeName(t, reason.recipeId),
      });
    case "runningLow":
      return t("kitchen.shopping.reason.runningLow", {
        location: getLocationLabel(t, reason.locationId),
      });
    case "almostEmpty":
      return t("kitchen.shopping.reason.almostEmpty", {
        location: getLocationLabel(t, reason.locationId),
      });
  }
}

export function useShoppingState() {
  const { t } = useI18n();
  const items = useStore($shoppingItems);
  const showAdding = useStore($shoppingShowAdding);
  const newItemName = useStore($shoppingNewItemName);
  const showBought = useStore($shoppingShowBought);

  const unboughtItems = useMemo(() => items.filter((item) => !item.bought), [items]);
  const boughtItems = useMemo(() => items.filter((item) => item.bought), [items]);

  const groupedItems = useMemo(
    () =>
      CATEGORY_ORDER.map((category) => ({
        category,
        items: unboughtItems.filter((item) => item.category === category),
      })).filter((group) => group.items.length > 0),
    [unboughtItems],
  );

  const toggleBought = (id: string) => {
    $shoppingItems.set(
      items.map((item) => (item.id === id ? { ...item, bought: !item.bought } : item)),
    );
  };

  const removeItem = (id: string) => {
    $shoppingItems.set(items.filter((item) => item.id !== id));
  };

  const openAdding = () => {
    $shoppingShowAdding.set(true);
  };

  const closeAdding = () => {
    $shoppingShowAdding.set(false);
    $shoppingNewItemName.set("");
  };

  const addItem = () => {
    const trimmed = newItemName.trim();

    if (!trimmed) {
      return;
    }

    $shoppingItems.set([
      ...items,
      { id: `custom-${Date.now()}`, name: trimmed, category: "other", suggested: false, bought: false },
    ]);
    closeAdding();
  };

  return {
    items,
    showAdding,
    newItemName,
    showBought,
    unboughtItems,
    boughtItems,
    groupedItems,
    getItemName: (item: ShoppingItem) => getItemName(t, item),
    getReasonLabel: (reason: ShoppingReason | undefined) => getReasonLabel(t, reason),
    getCategoryLabel: (category: ShoppingCategoryId) => getShoppingCategoryLabel(t, category),
    subtitle: t("kitchen.shopping.subtitle", { count: unboughtItems.length }),
    toggleBought,
    removeItem,
    openAdding,
    closeAdding,
    addItem,
    setNewItemName: (value: string) => $shoppingNewItemName.set(value),
    toggleBoughtVisibility: () => $shoppingShowBought.set(!showBought),
  };
}
