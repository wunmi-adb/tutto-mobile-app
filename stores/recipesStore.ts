import { useStore } from "@nanostores/react";
import { atom } from "nanostores";
import { useMemo } from "react";
import { useI18n } from "@/i18n";
import {
  EMPTY_RECIPE_DRAFT,
  INITIAL_RECIPE_COLLECTIONS,
  INITIAL_SAVED_RECIPES,
  createCollectionId,
  createCustomRecipe,
  getCollectionCountLabel,
  getCollectionPreviewTitles,
  getCollectionSearchableText,
  getNextTone,
  getSavedRecipeCalories,
  getSavedRecipeCarbs,
  getSavedRecipeFat,
  getRecipeSearchableText,
  getSavedRecipeImage,
  getSavedRecipeIngredients,
  getSavedRecipeMealType,
  getSavedRecipeMetaLabel,
  getSavedRecipeMinutes,
  getSavedRecipeProtein,
  getSavedRecipeServings,
  getSavedRecipeSteps,
  getSavedRecipeTitle,
} from "@/components/dashboard/recipes/helpers";
import type { MealRecipe } from "@/components/dashboard/plan/types";
import type {
  RecipeCollection,
  RecipeDraft,
  SavedRecipe,
} from "@/components/dashboard/recipes/types";

type CollectionEditorState =
  | null
  | { mode: "create" }
  | { mode: "rename"; collectionId: string };

type RecipesById = Record<string, SavedRecipe>;

const INITIAL_RECIPES_BY_ID = INITIAL_SAVED_RECIPES.reduce<RecipesById>((acc, recipe) => {
  acc[recipe.id] = recipe;
  return acc;
}, {});

export const $recipeCollections = atom<RecipeCollection[]>(INITIAL_RECIPE_COLLECTIONS);
export const $savedRecipes = atom<RecipesById>(INITIAL_RECIPES_BY_ID);
export const $recipesHomeSearchQuery = atom("");
export const $recipeCollectionSearchQueries = atom<Record<string, string>>({});
export const $recipeCollectionEditor = atom<CollectionEditorState>(null);
export const $recipeCollectionNameDraft = atom("");
export const $activeRecipeAddCollectionId = atom<string | null>(null);
export const $recipeDraft = atom<RecipeDraft>(EMPTY_RECIPE_DRAFT);

function updateCollections(updater: (collections: RecipeCollection[]) => RecipeCollection[]) {
  $recipeCollections.set(updater($recipeCollections.get()));
}

function setCollectionSearchValue(collectionId: string, value: string) {
  $recipeCollectionSearchQueries.set({
    ...$recipeCollectionSearchQueries.get(),
    [collectionId]: value,
  });
}

function getCollectionById(collectionId: string) {
  return $recipeCollections.get().find((collection) => collection.id === collectionId) ?? null;
}

function getRecipesForCollection(collection: RecipeCollection | null, recipesById: RecipesById) {
  if (!collection) {
    return [];
  }

  return collection.recipeIds
    .map((recipeId) => recipesById[recipeId])
    .filter((recipe): recipe is SavedRecipe => Boolean(recipe));
}

export function openCreateRecipeCollection() {
  $recipeCollectionEditor.set({ mode: "create" });
  $recipeCollectionNameDraft.set("");
}

export function openRenameRecipeCollection(collectionId: string) {
  const collection = getCollectionById(collectionId);

  if (!collection) {
    return;
  }

  $recipeCollectionEditor.set({ mode: "rename", collectionId });
  $recipeCollectionNameDraft.set(collection.name);
}

export function closeRecipeCollectionEditor() {
  $recipeCollectionEditor.set(null);
  $recipeCollectionNameDraft.set("");
}

export function submitRecipeCollectionEditor() {
  const editor = $recipeCollectionEditor.get();
  const name = $recipeCollectionNameDraft.get().trim();

  if (!editor || !name) {
    return;
  }

  if (editor.mode === "create") {
    const nextCollection: RecipeCollection = {
      id: createCollectionId(name),
      name,
      tone: getNextTone($recipeCollections.get().length),
      recipeIds: [],
    };

    updateCollections((collections) => [nextCollection, ...collections]);
    closeRecipeCollectionEditor();
    return;
  }

  updateCollections((collections) =>
    collections.map((collection) => {
      if (collection.id !== editor.collectionId) {
        return collection;
      }

      return { ...collection, name };
    }),
  );
  closeRecipeCollectionEditor();
}

export function deleteRecipeCollection(collectionId: string) {
  const collection = getCollectionById(collectionId);

  if (!collection || collection.recipeIds.length > 0) {
    return;
  }

  updateCollections((collections) => collections.filter((collection) => collection.id !== collectionId));
}

export function openRecipeAddSheet(collectionId: string) {
  $activeRecipeAddCollectionId.set(collectionId);
  $recipeDraft.set(EMPTY_RECIPE_DRAFT);
}

export function closeRecipeAddSheet() {
  $activeRecipeAddCollectionId.set(null);
  $recipeDraft.set(EMPTY_RECIPE_DRAFT);
}

export function setRecipeDraftField<Key extends keyof RecipeDraft>(key: Key, value: RecipeDraft[Key]) {
  $recipeDraft.set({
    ...$recipeDraft.get(),
    [key]: value,
  });
}

export function saveRecipeToActiveCollection() {
  const collectionId = $activeRecipeAddCollectionId.get();
  const collection = collectionId ? getCollectionById(collectionId) : null;

  if (!collection) {
    return;
  }

  const nextRecipe = createCustomRecipe($recipeDraft.get(), collection.tone);

  $savedRecipes.set({
    ...$savedRecipes.get(),
    [nextRecipe.id]: nextRecipe,
  });

  updateCollections((collections) =>
    collections.map((item) => {
      if (item.id !== collection.id) {
        return item;
      }

      return {
        ...item,
        recipeIds: [nextRecipe.id, ...item.recipeIds],
      };
    }),
  );

  closeRecipeAddSheet();
}

export function updateSavedRecipe(recipeId: string, nextRecipe: MealRecipe) {
  const currentRecipe = $savedRecipes.get()[recipeId];

  if (!currentRecipe) {
    return;
  }

  if (nextRecipe.kind === "preset") {
    $savedRecipes.set({
      ...$savedRecipes.get(),
      [recipeId]: {
        id: recipeId,
        kind: "preset",
        presetId: nextRecipe.recipeId,
        source: currentRecipe.source,
        tone: currentRecipe.tone,
        image: currentRecipe.image,
      },
    });
    return;
  }

  $savedRecipes.set({
    ...$savedRecipes.get(),
    [recipeId]: {
      id: recipeId,
      kind: "custom",
      title: nextRecipe.name,
      totalMinutes: nextRecipe.timeMinutes,
      servings: nextRecipe.servings,
      calories: nextRecipe.calories,
      protein: nextRecipe.protein,
      carbs: nextRecipe.carbs,
      fat: nextRecipe.fat,
      ingredients: nextRecipe.ingredients,
      steps: nextRecipe.steps,
      source: currentRecipe.source,
      tone: currentRecipe.tone,
      image: currentRecipe.image,
    },
  });
}

export function useRecipesHomeState() {
  const { t } = useI18n();
  const collections = useStore($recipeCollections);
  const recipesById = useStore($savedRecipes);
  const collectionEditor = useStore($recipeCollectionEditor);
  const collectionNameDraft = useStore($recipeCollectionNameDraft);
  const homeSearchQuery = useStore($recipesHomeSearchQuery);

  const filteredCollections = useMemo(() => {
    const trimmedQuery = homeSearchQuery.trim().toLowerCase();

    if (!trimmedQuery) {
      return collections;
    }

    return collections.filter((collection) =>
      getCollectionSearchableText(t, collection, recipesById).includes(trimmedQuery),
    );
  }, [collections, homeSearchQuery, recipesById, t]);

  return {
    collectionEditor,
    collectionNameDraft,
    filteredCollections,
    homeSearchQuery,
    getCollectionCountLabel: (collection: RecipeCollection) =>
      getCollectionCountLabel(t, collection.recipeIds.length),
    getCollectionPreviewTitles: (collection: RecipeCollection) =>
      getCollectionPreviewTitles(t, collection, recipesById),
    openCreateCollection: openCreateRecipeCollection,
    openRenameCollection: openRenameRecipeCollection,
    closeCollectionEditor: closeRecipeCollectionEditor,
    submitCollectionEditor: submitRecipeCollectionEditor,
    deleteCollection: deleteRecipeCollection,
    setCollectionNameDraft: (value: string) => $recipeCollectionNameDraft.set(value),
    setHomeSearchQuery: (value: string) => $recipesHomeSearchQuery.set(value),
  };
}

export function useRecipeCollectionState(collectionId: string) {
  const { t } = useI18n();
  const collections = useStore($recipeCollections);
  const recipesById = useStore($savedRecipes);
  const recipeDraft = useStore($recipeDraft);
  const activeAddCollectionId = useStore($activeRecipeAddCollectionId);
  const collectionSearchQueries = useStore($recipeCollectionSearchQueries);

  const collection = useMemo(
    () => collections.find((item) => item.id === collectionId) ?? null,
    [collectionId, collections],
  );

  const collectionRecipes = useMemo(
    () => getRecipesForCollection(collection, recipesById),
    [collection, recipesById],
  );

  const collectionSearchQuery = collectionSearchQueries[collectionId] ?? "";

  const filteredRecipes = useMemo(() => {
    const trimmedQuery = collectionSearchQuery.trim().toLowerCase();

    if (!trimmedQuery) {
      return collectionRecipes;
    }

    return collectionRecipes.filter((recipe) =>
      getRecipeSearchableText(t, recipe).includes(trimmedQuery),
    );
  }, [collectionRecipes, collectionSearchQuery, t]);

  return {
    addRecipeVisible: activeAddCollectionId === collectionId,
    collection,
    collectionCountLabel: getCollectionCountLabel(t, collection?.recipeIds.length ?? 0),
    collectionSearchQuery,
    currentRecipeDraft: recipeDraft,
    filteredRecipes,
    getRecipeImage: (recipe: SavedRecipe) => getSavedRecipeImage(recipe),
    getRecipeMetaLabel: (recipe: SavedRecipe) => getSavedRecipeMetaLabel(t, recipe),
    getRecipeMinutesLabel: (recipe: SavedRecipe) =>
      t("kitchen.common.minutes", { count: getSavedRecipeMinutes(recipe) }),
    getRecipeServingsLabel: (recipe: SavedRecipe) =>
      t("kitchen.common.servings", { count: getSavedRecipeServings(recipe) }),
    getRecipeTitle: (recipe: SavedRecipe) => getSavedRecipeTitle(t, recipe),
    openAddRecipe: () => openRecipeAddSheet(collectionId),
    closeAddRecipe: closeRecipeAddSheet,
    saveRecipe: saveRecipeToActiveCollection,
    setCollectionSearchQuery: (value: string) => setCollectionSearchValue(collectionId, value),
    setRecipeDraftField: <Key extends keyof RecipeDraft>(key: Key, value: RecipeDraft[Key]) =>
      setRecipeDraftField(key, value),
  };
}

export function useRecipeDetailState(recipeId: string) {
  const { t } = useI18n();
  const recipesById = useStore($savedRecipes);
  const recipe = recipesById[recipeId] ?? null;

  return {
    recipe,
    getRecipeCalories: (item: SavedRecipe) => getSavedRecipeCalories(item),
    getRecipeCarbs: (item: SavedRecipe) => getSavedRecipeCarbs(item),
    getRecipeFat: (item: SavedRecipe) => getSavedRecipeFat(item),
    getRecipeImage: (item: SavedRecipe) => getSavedRecipeImage(item),
    getRecipeIngredients: (item: SavedRecipe) => getSavedRecipeIngredients(t, item),
    getRecipeMealType: (item: SavedRecipe) => getSavedRecipeMealType(item),
    getRecipeMinutes: (item: SavedRecipe) => getSavedRecipeMinutes(item),
    getRecipeProtein: (item: SavedRecipe) => getSavedRecipeProtein(item),
    getRecipeServings: (item: SavedRecipe) => getSavedRecipeServings(item),
    getRecipeSteps: (item: SavedRecipe) => getSavedRecipeSteps(t, item),
    getRecipeTitle: (item: SavedRecipe) => getSavedRecipeTitle(t, item),
    updateRecipe: (nextRecipe: MealRecipe) => updateSavedRecipe(recipeId, nextRecipe),
  };
}
