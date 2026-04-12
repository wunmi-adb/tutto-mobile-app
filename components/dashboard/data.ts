import type { AppLanguage } from "@/i18n/config";
import type { TranslationKey } from "@/i18n/messages";

type TranslationFn = (key: TranslationKey, params?: Record<string, number | string>) => string;

export type FoodCategory =
  | "bakery"
  | "condiments"
  | "cooked"
  | "dairy"
  | "drinks"
  | "frozen"
  | "grains"
  | "meat"
  | "produce"
  | "seafood"
  | "snacks";

export type KitchenLocationId = "all" | "fridge" | "freezer" | "pantry" | "spiceRack" | "other";
export type ShoppingCategoryId = "fresh" | "meat" | "dairy" | "bakery" | "dryGoods" | "spices" | "other";
export type MealTypeId = "breakfast" | "brunch" | "lunch" | "snack" | "dinner" | "supper";
export type RecipeId =
  | "avocadoEggsToast"
  | "grilledSalmonGreens"
  | "jollofRiceChicken"
  | "mediterraneanWrap"
  | "oatPorridgeBerries"
  | "spaghettiBolognese";

export const KITCHEN_LOCATION_KEYS: Record<KitchenLocationId, TranslationKey> = {
  all: "kitchen.locations.all",
  fridge: "kitchen.locations.fridge",
  freezer: "kitchen.locations.freezer",
  pantry: "kitchen.locations.pantry",
  spiceRack: "kitchen.locations.spiceRack",
  other: "kitchen.locations.other",
};

export const SHOPPING_CATEGORY_KEYS: Record<ShoppingCategoryId, TranslationKey> = {
  fresh: "kitchen.shopping.categories.fresh",
  meat: "kitchen.shopping.categories.meat",
  dairy: "kitchen.shopping.categories.dairy",
  bakery: "kitchen.shopping.categories.bakery",
  dryGoods: "kitchen.shopping.categories.dryGoods",
  spices: "kitchen.shopping.categories.spices",
  other: "kitchen.shopping.categories.other",
};

export const MEAL_TYPE_KEYS: Record<MealTypeId, TranslationKey> = {
  breakfast: "meals.options.breakfast.label",
  brunch: "meals.options.brunch.label",
  lunch: "meals.options.lunch.label",
  snack: "kitchen.mealTypes.snack",
  dinner: "meals.options.dinner.label",
  supper: "meals.options.supper.label",
};

export const KITCHEN_FILL_KEYS = {
  full: "kitchen.fill.full",
  almostFull: "kitchen.fill.almostFull",
  halfLeft: "kitchen.fill.halfLeft",
  runningLow: "kitchen.fill.runningLow",
  almostEmpty: "kitchen.fill.almostEmpty",
} as const satisfies Record<string, TranslationKey>;

type RecipeDefinition = {
  mealType: MealTypeId;
  timeMinutes: number;
  servings: number;
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
  nameKey: TranslationKey;
  ingredientKeys: readonly TranslationKey[];
  stepKeys: readonly TranslationKey[];
};

export const RECIPE_DEFINITIONS: Record<RecipeId, RecipeDefinition> = {
  avocadoEggsToast: {
    mealType: "breakfast",
    timeMinutes: 15,
    servings: 2,
    calories: 380,
    protein: "18g",
    carbs: "32g",
    fat: "22g",
    nameKey: "kitchen.recipes.avocadoEggsToast.name",
    ingredientKeys: [
      "kitchen.recipes.avocadoEggsToast.ingredients.1",
      "kitchen.recipes.avocadoEggsToast.ingredients.2",
      "kitchen.recipes.avocadoEggsToast.ingredients.3",
      "kitchen.recipes.avocadoEggsToast.ingredients.4",
      "kitchen.recipes.avocadoEggsToast.ingredients.5",
      "kitchen.recipes.avocadoEggsToast.ingredients.6",
    ],
    stepKeys: [
      "kitchen.recipes.avocadoEggsToast.steps.1",
      "kitchen.recipes.avocadoEggsToast.steps.2",
      "kitchen.recipes.avocadoEggsToast.steps.3",
      "kitchen.recipes.avocadoEggsToast.steps.4",
    ],
  },
  grilledSalmonGreens: {
    mealType: "dinner",
    timeMinutes: 20,
    servings: 2,
    calories: 450,
    protein: "38g",
    carbs: "12g",
    fat: "28g",
    nameKey: "kitchen.recipes.grilledSalmonGreens.name",
    ingredientKeys: [
      "kitchen.recipes.grilledSalmonGreens.ingredients.1",
      "kitchen.recipes.grilledSalmonGreens.ingredients.2",
      "kitchen.recipes.grilledSalmonGreens.ingredients.3",
      "kitchen.recipes.grilledSalmonGreens.ingredients.4",
      "kitchen.recipes.grilledSalmonGreens.ingredients.5",
      "kitchen.recipes.grilledSalmonGreens.ingredients.6",
      "kitchen.recipes.grilledSalmonGreens.ingredients.7",
    ],
    stepKeys: [
      "kitchen.recipes.grilledSalmonGreens.steps.1",
      "kitchen.recipes.grilledSalmonGreens.steps.2",
      "kitchen.recipes.grilledSalmonGreens.steps.3",
      "kitchen.recipes.grilledSalmonGreens.steps.4",
    ],
  },
  jollofRiceChicken: {
    mealType: "lunch",
    timeMinutes: 45,
    servings: 4,
    calories: 520,
    protein: "32g",
    carbs: "58g",
    fat: "16g",
    nameKey: "kitchen.recipes.jollofRiceChicken.name",
    ingredientKeys: [
      "kitchen.recipes.jollofRiceChicken.ingredients.1",
      "kitchen.recipes.jollofRiceChicken.ingredients.2",
      "kitchen.recipes.jollofRiceChicken.ingredients.3",
      "kitchen.recipes.jollofRiceChicken.ingredients.4",
      "kitchen.recipes.jollofRiceChicken.ingredients.5",
      "kitchen.recipes.jollofRiceChicken.ingredients.6",
      "kitchen.recipes.jollofRiceChicken.ingredients.7",
      "kitchen.recipes.jollofRiceChicken.ingredients.8",
    ],
    stepKeys: [
      "kitchen.recipes.jollofRiceChicken.steps.1",
      "kitchen.recipes.jollofRiceChicken.steps.2",
      "kitchen.recipes.jollofRiceChicken.steps.3",
      "kitchen.recipes.jollofRiceChicken.steps.4",
      "kitchen.recipes.jollofRiceChicken.steps.5",
    ],
  },
  mediterraneanWrap: {
    mealType: "lunch",
    timeMinutes: 10,
    servings: 1,
    calories: 420,
    protein: "22g",
    carbs: "40g",
    fat: "18g",
    nameKey: "kitchen.recipes.mediterraneanWrap.name",
    ingredientKeys: [
      "kitchen.recipes.mediterraneanWrap.ingredients.1",
      "kitchen.recipes.mediterraneanWrap.ingredients.2",
      "kitchen.recipes.mediterraneanWrap.ingredients.3",
      "kitchen.recipes.mediterraneanWrap.ingredients.4",
      "kitchen.recipes.mediterraneanWrap.ingredients.5",
      "kitchen.recipes.mediterraneanWrap.ingredients.6",
      "kitchen.recipes.mediterraneanWrap.ingredients.7",
    ],
    stepKeys: [
      "kitchen.recipes.mediterraneanWrap.steps.1",
      "kitchen.recipes.mediterraneanWrap.steps.2",
      "kitchen.recipes.mediterraneanWrap.steps.3",
    ],
  },
  oatPorridgeBerries: {
    mealType: "breakfast",
    timeMinutes: 10,
    servings: 2,
    calories: 290,
    protein: "10g",
    carbs: "48g",
    fat: "6g",
    nameKey: "kitchen.recipes.oatPorridgeBerries.name",
    ingredientKeys: [
      "kitchen.recipes.oatPorridgeBerries.ingredients.1",
      "kitchen.recipes.oatPorridgeBerries.ingredients.2",
      "kitchen.recipes.oatPorridgeBerries.ingredients.3",
      "kitchen.recipes.oatPorridgeBerries.ingredients.4",
      "kitchen.recipes.oatPorridgeBerries.ingredients.5",
    ],
    stepKeys: [
      "kitchen.recipes.oatPorridgeBerries.steps.1",
      "kitchen.recipes.oatPorridgeBerries.steps.2",
      "kitchen.recipes.oatPorridgeBerries.steps.3",
    ],
  },
  spaghettiBolognese: {
    mealType: "dinner",
    timeMinutes: 35,
    servings: 4,
    calories: 580,
    protein: "28g",
    carbs: "62g",
    fat: "22g",
    nameKey: "kitchen.recipes.spaghettiBolognese.name",
    ingredientKeys: [
      "kitchen.recipes.spaghettiBolognese.ingredients.1",
      "kitchen.recipes.spaghettiBolognese.ingredients.2",
      "kitchen.recipes.spaghettiBolognese.ingredients.3",
      "kitchen.recipes.spaghettiBolognese.ingredients.4",
      "kitchen.recipes.spaghettiBolognese.ingredients.5",
      "kitchen.recipes.spaghettiBolognese.ingredients.6",
      "kitchen.recipes.spaghettiBolognese.ingredients.7",
      "kitchen.recipes.spaghettiBolognese.ingredients.8",
      "kitchen.recipes.spaghettiBolognese.ingredients.9",
    ],
    stepKeys: [
      "kitchen.recipes.spaghettiBolognese.steps.1",
      "kitchen.recipes.spaghettiBolognese.steps.2",
      "kitchen.recipes.spaghettiBolognese.steps.3",
      "kitchen.recipes.spaghettiBolognese.steps.4",
      "kitchen.recipes.spaghettiBolognese.steps.5",
    ],
  },
};

export type ExpiringItem = {
  id: string;
  nameKey: TranslationKey;
  locationId: Exclude<KitchenLocationId, "all" | "other">;
  daysLeft: number;
  fillKey: (typeof KITCHEN_FILL_KEYS)[keyof typeof KITCHEN_FILL_KEYS] | "kitchen.common.units";
  fillCount?: number;
  category: FoodCategory;
};

export const EXPIRING_ITEMS: ExpiringItem[] = [
  {
    id: "jollof",
    nameKey: "kitchen.items.jollofRice",
    locationId: "fridge",
    daysLeft: 1,
    fillKey: KITCHEN_FILL_KEYS.almostFull,
    category: "cooked",
  },
  {
    id: "milk",
    nameKey: "kitchen.items.milk",
    locationId: "fridge",
    daysLeft: 3,
    fillKey: KITCHEN_FILL_KEYS.halfLeft,
    category: "dairy",
  },
  {
    id: "eggs",
    nameKey: "kitchen.items.eggs",
    locationId: "fridge",
    daysLeft: 7,
    fillKey: "kitchen.common.units",
    fillCount: 8,
    category: "dairy",
  },
];

export const HOME_MEAL_IDS: RecipeId[] = [
  "spaghettiBolognese",
  "grilledSalmonGreens",
  "jollofRiceChicken",
];

type RelativeTime =
  | { kind: "hoursAgo"; value: number }
  | { kind: "daysAgo"; value: number }
  | { kind: "yesterday" };

export type ActivityItem =
  | {
      id: string;
      kind: "opened";
      category: FoodCategory;
      itemKey: TranslationKey;
      time: RelativeTime;
    }
  | {
      id: string;
      kind: "cookedAdded";
      category: FoodCategory;
      itemKey: TranslationKey;
      locationId: Exclude<KitchenLocationId, "all" | "other">;
      time: RelativeTime;
    }
  | {
      id: string;
      kind: "boughtList";
      category: FoodCategory;
      itemKeys: readonly TranslationKey[];
      time: RelativeTime;
    }
  | {
      id: string;
      kind: "addedToLocation";
      category: FoodCategory;
      itemKey: TranslationKey;
      count: number;
      locationId: Exclude<KitchenLocationId, "all" | "other">;
      time: RelativeTime;
    };

export const RECENT_ACTIVITY: ActivityItem[] = [
  {
    id: "1",
    kind: "opened",
    category: "dairy",
    itemKey: "kitchen.items.semiSkimmedMilk",
    time: { kind: "hoursAgo", value: 2 },
  },
  {
    id: "2",
    kind: "cookedAdded",
    category: "cooked",
    itemKey: "kitchen.items.jollofRice",
    locationId: "fridge",
    time: { kind: "yesterday" },
  },
  {
    id: "3",
    kind: "boughtList",
    category: "produce",
    itemKeys: [
      "kitchen.items.avocado",
      "kitchen.items.sourdoughBread",
      "kitchen.items.beefMince",
    ],
    time: { kind: "yesterday" },
  },
  {
    id: "4",
    kind: "addedToLocation",
    category: "cooked",
    itemKey: "kitchen.items.stew",
    count: 2,
    locationId: "freezer",
    time: { kind: "daysAgo", value: 2 },
  },
];

export const LIBRARY_RECIPE_KEYS: TranslationKey[] = [
  "kitchen.library.cards.weeknightPasta",
  "kitchen.library.cards.chickenStirFry",
  "kitchen.library.cards.lentilCurry",
  "kitchen.library.cards.salmonRiceBowl",
];

export function getGreetingKey(date = new Date()): TranslationKey {
  const hour = date.getHours();

  if (hour < 12) {
    return "kitchen.home.greeting.morning";
  }

  if (hour < 17) {
    return "kitchen.home.greeting.afternoon";
  }

  return "kitchen.home.greeting.evening";
}

export function getLocationLabel(t: TranslationFn, locationId: KitchenLocationId) {
  return t(KITCHEN_LOCATION_KEYS[locationId]);
}

export function getShoppingCategoryLabel(t: TranslationFn, categoryId: ShoppingCategoryId) {
  return t(SHOPPING_CATEGORY_KEYS[categoryId]);
}

export function getMealTypeLabel(t: TranslationFn, mealType: MealTypeId) {
  return t(MEAL_TYPE_KEYS[mealType]);
}

export function getRecipeName(t: TranslationFn, recipeId: RecipeId) {
  return t(RECIPE_DEFINITIONS[recipeId].nameKey);
}

export function getRecipeIngredients(t: TranslationFn, recipeId: RecipeId) {
  return RECIPE_DEFINITIONS[recipeId].ingredientKeys.map((key) => t(key));
}

export function getRecipeSteps(t: TranslationFn, recipeId: RecipeId) {
  return RECIPE_DEFINITIONS[recipeId].stepKeys.map((key) => t(key));
}

export function getRelativeTimeLabel(t: TranslationFn, relativeTime: RelativeTime) {
  switch (relativeTime.kind) {
    case "hoursAgo":
      return t("kitchen.common.hoursAgo", { count: relativeTime.value });
    case "daysAgo":
      return t("kitchen.common.daysAgo", { count: relativeTime.value });
    case "yesterday":
      return t("kitchen.common.yesterday");
  }
}

export function getActivityText(t: TranslationFn, activity: ActivityItem) {
  switch (activity.kind) {
    case "opened":
      return t("kitchen.home.activity.opened", { item: t(activity.itemKey) });
    case "cookedAdded":
      return t("kitchen.home.activity.cookedAdded", {
        item: t(activity.itemKey),
        location: getLocationLabel(t, activity.locationId),
      });
    case "boughtList":
      return t("kitchen.home.activity.boughtList", {
        items: activity.itemKeys.map((key) => t(key)).join(", "),
      });
    case "addedToLocation":
      return t("kitchen.home.activity.addedToLocation", {
        item: t(activity.itemKey),
        count: activity.count,
        location: getLocationLabel(t, activity.locationId),
      });
  }
}

export function expiryColor(days: number, palette: { danger: string; warning: string; muted: string }) {
  if (days <= 1) return palette.danger;
  if (days <= 3) return palette.warning;
  return palette.muted;
}

export function getExpiryLabel(t: TranslationFn, days: number) {
  if (days <= 0) return t("kitchen.expiry.expired");
  if (days === 1) return t("kitchen.expiry.tomorrow");
  return t("kitchen.expiry.daysLeftShort", { count: days });
}

export function formatDayLabel(language: AppLanguage, date: Date) {
  return new Intl.DateTimeFormat(language, { weekday: "short" }).format(date);
}

export function formatMonthLabel(language: AppLanguage, date: Date) {
  return new Intl.DateTimeFormat(language, { month: "short" }).format(date);
}

export function formatDateLabel(
  language: AppLanguage,
  date: Date,
  options: Intl.DateTimeFormatOptions,
) {
  return new Intl.DateTimeFormat(language, options).format(date);
}
