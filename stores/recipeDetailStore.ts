import type { ResolvedMealRecipe } from "@/components/dashboard/plan/types";
import type { MealRecipe } from "@/components/dashboard/plan/types";
import { atom } from "nanostores";
import { useStore } from "@nanostores/react";
import { useEffect, useMemo } from "react";

export type EditableStep = {
  minutes: number | null;
  text: string;
};

const $recipeDetailEditing = atom(false);
const $recipeDetailName = atom("");
const $recipeDetailIngredients = atom<string[]>([]);
const $recipeDetailSteps = atom<EditableStep[]>([]);
const $recipeDetailNewIngredient = atom("");

function parseStepMinutes(step: string) {
  const match = step.match(/\((\d+)\s*min\)$/i);
  return match ? Number(match[1]) : null;
}

function stripStepMinutes(step: string) {
  return step.replace(/\s*\(\d+\s*min\)$/i, "").trim();
}

export function serializeEditableStep(step: EditableStep) {
  const text = step.text.trim();

  if (!text) {
    return "";
  }

  if (!step.minutes || step.minutes <= 0) {
    return text;
  }

  return `${text} (${step.minutes} min)`;
}

function getEditableSteps(steps: string[]) {
  return steps.map((step) => ({
    minutes: parseStepMinutes(step),
    text: stripStepMinutes(step),
  }));
}

function hydrateRecipeDetailState(recipeDetails: ResolvedMealRecipe) {
  $recipeDetailEditing.set(false);
  $recipeDetailName.set(recipeDetails.name);
  $recipeDetailIngredients.set(recipeDetails.ingredients);
  $recipeDetailSteps.set(getEditableSteps(recipeDetails.steps));
  $recipeDetailNewIngredient.set("");
}

export function resetRecipeDetailState() {
  $recipeDetailEditing.set(false);
  $recipeDetailName.set("");
  $recipeDetailIngredients.set([]);
  $recipeDetailSteps.set([]);
  $recipeDetailNewIngredient.set("");
}

export function useRecipeDetailState(recipeDetails: ResolvedMealRecipe) {
  const editing = useStore($recipeDetailEditing);
  const name = useStore($recipeDetailName);
  const ingredients = useStore($recipeDetailIngredients);
  const steps = useStore($recipeDetailSteps);
  const newIngredient = useStore($recipeDetailNewIngredient);

  useEffect(() => {
    hydrateRecipeDetailState(recipeDetails);

    return () => {
      resetRecipeDetailState();
    };
  }, [recipeDetails]);

  const serializedRecipe = useMemo<MealRecipe>(() => {
    const nextIngredients = ingredients.map((ingredient) => ingredient.trim()).filter(Boolean);
    const nextSteps = steps.map(serializeEditableStep).filter(Boolean);

    return {
      kind: "custom",
      name: name.trim() || recipeDetails.name,
      timeMinutes: recipeDetails.timeMinutes,
      servings: recipeDetails.servings,
      calories: recipeDetails.calories,
      protein: recipeDetails.protein,
      carbs: recipeDetails.carbs,
      fat: recipeDetails.fat,
      ingredients: nextIngredients,
      steps: nextSteps,
    };
  }, [ingredients, name, recipeDetails, steps]);

  const updateIngredient = (index: number, value: string) => {
    $recipeDetailIngredients.set(
      $recipeDetailIngredients.get().map((ingredient, itemIndex) => {
        if (itemIndex !== index) {
          return ingredient;
        }

        return value;
      }),
    );
  };

  const removeIngredient = (index: number) => {
    $recipeDetailIngredients.set(
      $recipeDetailIngredients.get().filter((_, itemIndex) => itemIndex !== index),
    );
  };

  const addIngredient = () => {
    const trimmed = $recipeDetailNewIngredient.get().trim();

    if (!trimmed) {
      return;
    }

    $recipeDetailIngredients.set([...$recipeDetailIngredients.get(), trimmed]);
    $recipeDetailNewIngredient.set("");
  };

  const updateStepText = (index: number, value: string) => {
    $recipeDetailSteps.set(
      $recipeDetailSteps.get().map((step, itemIndex) => {
        if (itemIndex !== index) {
          return step;
        }

        return { ...step, text: value };
      }),
    );
  };

  const updateStepMinutes = (index: number, value: string) => {
    const minutesValue = value.trim() ? Number.parseInt(value, 10) : null;
    const safeMinutes =
      Number.isFinite(minutesValue) && (minutesValue ?? 0) > 0 ? minutesValue : null;

    $recipeDetailSteps.set(
      $recipeDetailSteps.get().map((step, itemIndex) => {
        if (itemIndex !== index) {
          return step;
        }

        return { ...step, minutes: safeMinutes };
      }),
    );
  };

  const removeStep = (index: number) => {
    $recipeDetailSteps.set($recipeDetailSteps.get().filter((_, itemIndex) => itemIndex !== index));
  };

  const addStep = () => {
    $recipeDetailSteps.set([...$recipeDetailSteps.get(), { minutes: null, text: "" }]);
  };

  const startEditing = () => {
    $recipeDetailEditing.set(true);
  };

  const finishEditing = () => {
    $recipeDetailEditing.set(false);
  };

  return {
    addIngredient,
    addStep,
    editing,
    finishEditing,
    ingredients,
    name,
    newIngredient,
    removeIngredient,
    removeStep,
    serializedRecipe,
    setName: (value: string) => $recipeDetailName.set(value),
    setNewIngredient: (value: string) => $recipeDetailNewIngredient.set(value),
    startEditing,
    steps,
    updateIngredient,
    updateStepMinutes,
    updateStepText,
  };
}
