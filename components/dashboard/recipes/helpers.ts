import {
  RECIPE_DEFINITIONS,
  getMealTypeLabel,
  getRecipeName,
  getRecipeIngredients,
  getRecipeSteps,
  type MealTypeId,
} from "@/components/dashboard/data";
import { colors } from "@/constants/colors";
import type { TranslationKey } from "@/i18n/messages";
import type { MealRecipe } from "@/components/dashboard/plan/types";
import type {
  RecipeCollection,
  RecipeDraft,
  RecipeSource,
  RecipeTone,
  SavedRecipe,
} from "@/components/dashboard/recipes/types";

type TranslationFn = (key: TranslationKey, params?: Record<string, number | string>) => string;

export const EMPTY_RECIPE_DRAFT: RecipeDraft = {
  title: "",
  source: "manual",
  totalMinutes: "",
  servings: "",
};

export const INITIAL_RECIPE_COLLECTIONS: RecipeCollection[] = [
  {
    id: "quick-favourites",
    name: "Quick favourites",
    tone: "tomato",
    recipeIds: ["preset-avocadoEggsToast", "preset-mediterraneanWrap", "preset-oatPorridgeBerries"],
    image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800&h=600&fit=crop",
  },
  {
    id: "weeknight-rotation",
    name: "Weeknight rotation",
    tone: "sage",
    recipeIds: ["preset-spaghettiBolognese", "preset-grilledSalmonGreens", "preset-jollofRiceChicken"],
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop",
  },
  {
    id: "hosting-board",
    name: "Hosting board",
    tone: "butter",
    recipeIds: ["preset-avocadoEggsToast", "preset-grilledSalmonGreens", "preset-spaghettiBolognese"],
  },
];

export const INITIAL_SAVED_RECIPES: SavedRecipe[] = [
  {
    id: "preset-avocadoEggsToast",
    kind: "preset",
    presetId: "avocadoEggsToast",
    source: "link",
    tone: "tomato",
    image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=800&h=600&fit=crop",
  },
  {
    id: "preset-grilledSalmonGreens",
    kind: "preset",
    presetId: "grilledSalmonGreens",
    source: "video",
    tone: "sage",
  },
  {
    id: "preset-jollofRiceChicken",
    kind: "preset",
    presetId: "jollofRiceChicken",
    source: "ai",
    tone: "berry",
  },
  {
    id: "preset-mediterraneanWrap",
    kind: "preset",
    presetId: "mediterraneanWrap",
    source: "document",
    tone: "butter",
  },
  {
    id: "preset-oatPorridgeBerries",
    kind: "preset",
    presetId: "oatPorridgeBerries",
    source: "ai",
    tone: "berry",
  },
  {
    id: "preset-spaghettiBolognese",
    kind: "preset",
    presetId: "spaghettiBolognese",
    source: "link",
    tone: "tomato",
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&h=600&fit=crop",
  },
];

const RECIPE_SOURCE_LABEL_KEYS: Record<RecipeSource, TranslationKey> = {
  manual: "recipes.source.manual",
  link: "recipes.source.link",
  document: "recipes.source.document",
  video: "recipes.source.video",
  ai: "recipes.source.ai",
};

type TonePalette = {
  background: string;
  border: string;
  accent: string;
};

const TONE_PALETTES: Record<RecipeTone, TonePalette> = {
  tomato: { background: "#FBF2EC", border: "#EED8CB", accent: "#B95D2A" },
  sage: { background: "#F3F7F0", border: "#D8E6D1", accent: "#4E7C57" },
  butter: { background: "#FCF7EA", border: "#EADFBF", accent: "#A57A1C" },
  berry: { background: "#F8F1F6", border: "#E5D1DF", accent: "#91547B" },
};

function getPresetDefinition(recipe: SavedRecipe) {
  if (recipe.kind !== "preset") {
    return null;
  }

  return RECIPE_DEFINITIONS[recipe.presetId];
}

export function getRecipeSourceLabel(t: TranslationFn, source: RecipeSource) {
  return t(RECIPE_SOURCE_LABEL_KEYS[source]);
}

export function getSavedRecipeTitle(t: TranslationFn, recipe: SavedRecipe) {
  if (recipe.kind === "preset") {
    return getRecipeName(t, recipe.presetId);
  }

  return recipe.title;
}

export function getSavedRecipeMinutes(recipe: SavedRecipe) {
  if (recipe.kind === "preset") {
    return RECIPE_DEFINITIONS[recipe.presetId].timeMinutes;
  }

  return recipe.totalMinutes;
}

export function getSavedRecipeServings(recipe: SavedRecipe) {
  if (recipe.kind === "preset") {
    return RECIPE_DEFINITIONS[recipe.presetId].servings;
  }

  return recipe.servings;
}

export function getSavedRecipeImage(recipe: SavedRecipe) {
  return recipe.image;
}

export function getSavedRecipeCalories(recipe: SavedRecipe) {
  if (recipe.kind === "preset") {
    return RECIPE_DEFINITIONS[recipe.presetId].calories;
  }

  return recipe.calories;
}

export function getSavedRecipeProtein(recipe: SavedRecipe) {
  if (recipe.kind === "preset") {
    return RECIPE_DEFINITIONS[recipe.presetId].protein;
  }

  return recipe.protein;
}

export function getSavedRecipeCarbs(recipe: SavedRecipe) {
  if (recipe.kind === "preset") {
    return RECIPE_DEFINITIONS[recipe.presetId].carbs;
  }

  return recipe.carbs;
}

export function getSavedRecipeFat(recipe: SavedRecipe) {
  if (recipe.kind === "preset") {
    return RECIPE_DEFINITIONS[recipe.presetId].fat;
  }

  return recipe.fat;
}

export function getSavedRecipeIngredients(t: TranslationFn, recipe: SavedRecipe) {
  if (recipe.kind === "preset") {
    return getRecipeIngredients(t, recipe.presetId);
  }

  return recipe.ingredients;
}

export function getSavedRecipeSteps(t: TranslationFn, recipe: SavedRecipe) {
  if (recipe.kind === "preset") {
    return getRecipeSteps(t, recipe.presetId);
  }

  return recipe.steps;
}

export function getSavedRecipeMealType(recipe: SavedRecipe): MealTypeId {
  if (recipe.kind === "preset") {
    return RECIPE_DEFINITIONS[recipe.presetId].mealType;
  }

  return "dinner";
}

export function getSavedRecipeMetaLabel(t: TranslationFn, recipe: SavedRecipe) {
  const presetDefinition = getPresetDefinition(recipe);

  if (presetDefinition) {
    return getMealTypeLabel(t, presetDefinition.mealType);
  }

  return t("recipes.recipe.customMeta", {
    source: getRecipeSourceLabel(t, recipe.source),
  });
}

export function getTonePalette(tone: RecipeTone) {
  return TONE_PALETTES[tone];
}

export function getCollectionPreviewTitles(
  t: TranslationFn,
  collection: RecipeCollection,
  recipesById: Record<string, SavedRecipe>,
) {
  return collection.recipeIds
    .slice(0, 2)
    .map((recipeId) => recipesById[recipeId])
    .filter((recipe): recipe is SavedRecipe => Boolean(recipe))
    .map((recipe) => getSavedRecipeTitle(t, recipe));
}

export function getCollectionSearchableText(
  t: TranslationFn,
  collection: RecipeCollection,
  recipesById: Record<string, SavedRecipe>,
) {
  const recipeTitles = collection.recipeIds
    .map((recipeId) => recipesById[recipeId])
    .filter((recipe): recipe is SavedRecipe => Boolean(recipe))
    .map((recipe) => getSavedRecipeTitle(t, recipe));

  return [collection.name, ...recipeTitles].join(" ").toLowerCase();
}

export function getRecipeSearchableText(t: TranslationFn, recipe: SavedRecipe) {
  return [
    getSavedRecipeTitle(t, recipe),
    getSavedRecipeMetaLabel(t, recipe),
    getRecipeSourceLabel(t, recipe.source),
  ]
    .join(" ")
    .toLowerCase();
}

export function getCollectionCountLabel(t: TranslationFn, count: number) {
  return t("recipes.collection.count", { count });
}

export function createRecipeId() {
  return `recipe-${Date.now()}`;
}

export function createCollectionId(name: string) {
  const normalized = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return normalized ? `collection-${normalized}-${Date.now()}` : `collection-${Date.now()}`;
}

export function createCustomRecipe(draft: RecipeDraft, tone: RecipeTone): SavedRecipe {
  const totalMinutes = Number.parseInt(draft.totalMinutes.trim(), 10);
  const servings = Number.parseInt(draft.servings.trim(), 10);

  return {
    id: createRecipeId(),
    kind: "custom",
    title: draft.title.trim(),
    totalMinutes: Number.isFinite(totalMinutes) ? totalMinutes : 20,
    servings: Number.isFinite(servings) ? servings : 2,
    calories: 360,
    protein: "18g",
    carbs: "32g",
    fat: "14g",
    ingredients: ["Ingredient 1", "Ingredient 2"],
    steps: ["Add your first instruction", "Add your second instruction"],
    source: draft.source,
    tone,
    image: undefined,
  };
}

export function mapSavedRecipeToMealRecipe(recipe: SavedRecipe): MealRecipe {
  if (recipe.kind === "preset") {
    return {
      kind: "preset",
      recipeId: recipe.presetId,
    };
  }

  return {
    kind: "custom",
    name: recipe.title,
    timeMinutes: recipe.totalMinutes,
    servings: recipe.servings,
    calories: recipe.calories,
    protein: recipe.protein,
    carbs: recipe.carbs,
    fat: recipe.fat,
    ingredients: recipe.ingredients,
    steps: recipe.steps,
  };
}

export function getNextTone(index: number): RecipeTone {
  const tones: RecipeTone[] = ["tomato", "sage", "butter", "berry"];
  return tones[index % tones.length] ?? "tomato";
}

export function getCollectionIconColor(tone: RecipeTone) {
  return getTonePalette(tone).accent;
}

export function getCollectionCardBorderColor(tone: RecipeTone) {
  return getTonePalette(tone).border;
}

export function getCollectionCardBackgroundColor(tone: RecipeTone) {
  return getTonePalette(tone).background;
}

export function getRecipesScreenBackgroundColor() {
  return colors.background;
}
