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
    id: "breakfast",
    name: "Breakfast",
    tone: "tomato",
    recipeIds: ["recipe-fluffy-pancakes", "recipe-avocado-toast", "recipe-overnight-oats"],
    image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800&h=600&fit=crop",
  },
  {
    id: "lunch",
    name: "Lunch",
    tone: "sage",
    recipeIds: ["recipe-caesar-salad", "recipe-chicken-wrap"],
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop",
  },
  {
    id: "instagram-saves",
    name: "Instagram Saves",
    tone: "butter",
    recipeIds: ["recipe-viral-pasta-chips", "recipe-cloud-bread", "recipe-baked-feta-pasta"],
  },
  {
    id: "dinner-favourites",
    name: "Dinner Favourites",
    tone: "berry",
    recipeIds: ["recipe-jollof-rice"],
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop",
  },
  {
    id: "desserts",
    name: "Desserts",
    tone: "tomato",
    recipeIds: [],
  },
];

export const INITIAL_SAVED_RECIPES: SavedRecipe[] = [
  {
    id: "recipe-fluffy-pancakes",
    kind: "custom",
    title: "Fluffy Pancakes",
    totalMinutes: 20,
    servings: 4,
    calories: 350,
    protein: "10g",
    carbs: "48g",
    fat: "14g",
    ingredients: [
      "200g plain flour",
      "2 eggs",
      "300ml milk",
      "1 tbsp sugar",
      "Pinch of salt",
      "Butter for frying",
    ],
    steps: [
      "Mix flour, sugar and salt in a bowl.",
      "Whisk eggs and milk together, then combine with dry ingredients.",
      "Heat butter in a non-stick pan over medium heat.",
      "Pour small ladles of batter and cook for 2 min each side.",
      "Serve stacked with maple syrup and fresh berries.",
    ],
    source: "ai",
    tone: "tomato",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop",
  },
  {
    id: "recipe-avocado-toast",
    kind: "custom",
    title: "Avocado Toast",
    totalMinutes: 10,
    servings: 2,
    calories: 380,
    protein: "18g",
    carbs: "32g",
    fat: "22g",
    ingredients: [
      "2 slices sourdough",
      "1 ripe avocado",
      "2 eggs",
      "Chilli flakes",
      "Lemon juice",
      "Salt & pepper",
    ],
    steps: [
      "Toast the sourdough until golden.",
      "Mash avocado with lemon juice, salt and pepper.",
      "Fry or poach eggs to your liking.",
      "Spread avocado on toast, top with eggs and chilli flakes.",
    ],
    source: "link",
    tone: "sage",
    image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=800&h=600&fit=crop",
  },
  {
    id: "recipe-overnight-oats",
    kind: "custom",
    title: "Overnight Oats",
    totalMinutes: 5,
    servings: 1,
    calories: 290,
    protein: "10g",
    carbs: "48g",
    fat: "6g",
    ingredients: ["80g rolled oats", "200ml milk", "1 tbsp chia seeds", "Honey", "Mixed berries"],
    steps: [
      "Combine oats, milk and chia seeds in a jar.",
      "Stir in honey to taste.",
      "Refrigerate overnight.",
      "Top with berries before serving.",
    ],
    source: "ai",
    tone: "berry",
  },
  {
    id: "recipe-caesar-salad",
    kind: "custom",
    title: "Caesar Salad",
    totalMinutes: 15,
    servings: 2,
    calories: 420,
    protein: "22g",
    carbs: "18g",
    fat: "28g",
    ingredients: [
      "1 romaine lettuce",
      "Croutons",
      "Parmesan shavings",
      "Caesar dressing",
      "Grilled chicken breast",
    ],
    steps: [
      "Wash and chop romaine lettuce.",
      "Grill chicken breast and slice.",
      "Toss lettuce with dressing and croutons.",
      "Top with chicken and parmesan shavings.",
    ],
    source: "document",
    tone: "butter",
    image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=800&h=600&fit=crop",
  },
  {
    id: "recipe-chicken-wrap",
    kind: "custom",
    title: "Chicken Wrap",
    totalMinutes: 10,
    servings: 1,
    calories: 420,
    protein: "22g",
    carbs: "40g",
    fat: "18g",
    ingredients: ["1 tortilla wrap", "Grilled chicken", "Lettuce", "Tomato", "Mayo", "Hot sauce"],
    steps: [
      "Warm the tortilla.",
      "Layer chicken, lettuce, tomato and sauces.",
      "Roll tightly and slice in half.",
    ],
    source: "document",
    tone: "sage",
  },
  {
    id: "recipe-viral-pasta-chips",
    kind: "custom",
    title: "Viral Pasta Chips",
    totalMinutes: 25,
    servings: 4,
    calories: 380,
    protein: "12g",
    carbs: "52g",
    fat: "14g",
    ingredients: [
      "300g pasta (any shape)",
      "2 tbsp olive oil",
      "Garlic powder",
      "Paprika",
      "Parmesan",
      "Marinara for dipping",
    ],
    steps: [
      "Cook pasta al dente and drain well.",
      "Toss with olive oil, garlic powder and paprika.",
      "Air fry at 200C for 12 min until crispy.",
      "Sprinkle with parmesan and serve with marinara.",
    ],
    source: "video",
    tone: "butter",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&h=600&fit=crop",
    creator: {
      name: "Nara Smith",
      handle: "@narasmith",
      platform: "tiktok",
      url: "https://tiktok.com/@narasmith",
    },
  },
  {
    id: "recipe-cloud-bread",
    kind: "custom",
    title: "Cloud Bread",
    totalMinutes: 30,
    servings: 6,
    calories: 60,
    protein: "4g",
    carbs: "2g",
    fat: "3g",
    ingredients: ["3 egg whites", "2 tbsp sugar", "1 tbsp cornflour", "Food colouring (optional)"],
    steps: [
      "Whip egg whites until stiff peaks.",
      "Fold in sugar and cornflour gently.",
      "Shape into clouds on a lined tray.",
      "Bake at 150C for 25 min until set.",
    ],
    source: "video",
    tone: "berry",
    image: "https://images.unsplash.com/photo-1586444248879-bc604bc77dac?w=800&h=600&fit=crop",
    creator: {
      name: "Alix Earle",
      handle: "@alixearle",
      platform: "instagram",
      url: "https://instagram.com/alixearle",
    },
  },
  {
    id: "recipe-baked-feta-pasta",
    kind: "custom",
    title: "Baked Feta Pasta",
    totalMinutes: 35,
    servings: 4,
    calories: 480,
    protein: "18g",
    carbs: "56g",
    fat: "22g",
    ingredients: [
      "400g cherry tomatoes",
      "200g block feta",
      "400g pasta",
      "Olive oil",
      "Garlic",
      "Basil",
      "Chilli flakes",
    ],
    steps: [
      "Place tomatoes and feta in a baking dish.",
      "Drizzle with olive oil, garlic and chilli flakes.",
      "Bake at 200C for 25 min.",
      "Cook pasta, then stir everything together with fresh basil.",
    ],
    source: "link",
    tone: "butter",
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&h=600&fit=crop",
    creator: {
      name: "Joshua Weissman",
      handle: "@joshuaweissman",
      platform: "youtube",
      url: "https://youtube.com/@joshuaweissman",
    },
  },
  {
    id: "recipe-jollof-rice",
    kind: "custom",
    title: "Jollof Rice",
    totalMinutes: 45,
    servings: 6,
    calories: 520,
    protein: "32g",
    carbs: "58g",
    fat: "16g",
    ingredients: [
      "2 cups rice",
      "400g tin tomatoes",
      "4 chicken thighs",
      "1 onion",
      "Scotch bonnet",
      "Thyme",
      "Bay leaves",
      "Stock cube",
    ],
    steps: [
      "Season and brown chicken thighs. Set aside.",
      "Blend tomatoes, onion and scotch bonnet.",
      "Fry the blended mix until reduced.",
      "Add rice, stock and spices. Cook covered on low heat for 30 min.",
      "Serve rice with chicken on top.",
    ],
    source: "ai",
    tone: "tomato",
    image: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&h=600&fit=crop",
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
