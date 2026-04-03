import type { TranslationKey } from "@/i18n/messages";

export const APPLIANCE_OPTIONS = [
  "Oven",
  "Microwave",
  "Air fryer",
  "Blender",
  "Pressure cooker",
  "Rice cooker",
];

export const DIETARY_OPTIONS = [
  "Halal",
  "Vegetarian",
  "Vegan",
  "Pescatarian",
  "Gluten-free",
  "Dairy-free",
];

export const ALLERGY_OPTIONS = [
  "Tree nuts",
  "Peanuts",
  "Milk",
  "Eggs",
  "Soy",
  "Shellfish",
];

export const DISLIKE_SUGGESTIONS = [
  "Liver",
  "Blue cheese",
  "Olives",
  "Mushrooms",
];

export const CUISINE_OPTIONS = [
  "Nigerian",
  "Italian",
  "Indian",
  "Mediterranean",
  "Mexican",
  "Thai",
];

export const MEAL_SLOT_OPTIONS = [
  { valueKey: "meals.options.breakfast.label", sublabelKey: "meals.options.breakfast.time" },
  { valueKey: "meals.options.brunch.label", sublabelKey: "meals.options.brunch.time" },
  { valueKey: "meals.options.lunch.label", sublabelKey: "meals.options.lunch.time" },
  { valueKey: "meals.options.snacks.label", sublabelKey: "meals.options.snacks.time" },
  { valueKey: "meals.options.dinner.label", sublabelKey: "meals.options.dinner.time" },
  { valueKey: "meals.options.supper.label", sublabelKey: "meals.options.supper.time" },
] as const satisfies readonly {
  valueKey: TranslationKey;
  sublabelKey: TranslationKey;
}[];

export const LANGUAGE_OPTIONS = [
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "ja", label: "Japanese" },
  { code: "tr", label: "Turkish" },
];
