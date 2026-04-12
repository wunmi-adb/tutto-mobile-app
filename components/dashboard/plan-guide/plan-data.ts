import type { MealTime, Suggestion, SuggestionType } from "./types";

export const RESULT_COUNT = 10;

export const SEGMENTS: { label: string; value: "all" | SuggestionType }[] = [
  { label: "All", value: "all" },
  { label: "Meals", value: "meal" },
  { label: "Snacks", value: "snack" },
];

export const MEAL_TIME_FILTERS: { label: string; value: MealTime | null }[] = [
  { label: "All meals", value: null },
  { label: "Breakfast", value: "breakfast" },
  { label: "Lunch", value: "lunch" },
  { label: "Dinner", value: "dinner" },
];

export const SUGGESTION_POOL: Suggestion[] = [
  {
    id: "1",
    name: "Avocado & Eggs on Toast",
    time: "15 min",
    servings: 2,
    calories: 380,
    protein: "18g",
    carbs: "32g",
    fat: "22g",
    type: "meal",
    mealTime: "breakfast",
    available: 5,
    total: 6,
    ingredients: [
      "2 eggs",
      "1 avocado",
      "2 slices sourdough",
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
  },
  {
    id: "2",
    name: "Oat Porridge with Berries",
    time: "10 min",
    servings: 2,
    calories: 290,
    protein: "10g",
    carbs: "48g",
    fat: "6g",
    type: "meal",
    mealTime: "breakfast",
    available: 4,
    total: 5,
    ingredients: ["80g rolled oats", "300ml milk", "Honey", "Mixed berries", "Cinnamon"],
    steps: [
      "Combine oats and milk in a saucepan.",
      "Cook on medium heat, stirring for 5 minutes.",
      "Serve topped with berries, honey and cinnamon.",
    ],
  },
  {
    id: "3",
    name: "Jollof Rice with Chicken",
    time: "45 min",
    servings: 4,
    calories: 520,
    protein: "32g",
    carbs: "58g",
    fat: "16g",
    type: "meal",
    mealTime: "lunch",
    available: 6,
    total: 8,
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
      "Season and brown chicken thighs.",
      "Blend tomatoes, onion and scotch bonnet.",
      "Fry the blended mix until reduced.",
      "Add rice, stock and spices. Cook covered on low heat for 30 min.",
      "Serve rice with chicken on top.",
    ],
  },
  {
    id: "4",
    name: "Mediterranean Wrap",
    time: "10 min",
    servings: 1,
    calories: 420,
    protein: "22g",
    carbs: "40g",
    fat: "18g",
    type: "meal",
    mealTime: "lunch",
    available: 5,
    total: 7,
    ingredients: [
      "1 tortilla wrap",
      "Hummus",
      "Feta cheese",
      "Cucumber",
      "Tomato",
      "Mixed leaves",
      "Olives",
    ],
    steps: [
      "Spread hummus over the wrap.",
      "Layer cucumber, tomato, olives, feta and leaves.",
      "Roll tightly and slice in half.",
    ],
  },
  {
    id: "5",
    name: "Spaghetti Bolognese",
    time: "35 min",
    servings: 4,
    calories: 580,
    protein: "28g",
    carbs: "62g",
    fat: "22g",
    type: "meal",
    mealTime: "dinner",
    available: 7,
    total: 9,
    ingredients: [
      "400g spaghetti",
      "500g beef mince",
      "400g tin tomatoes",
      "1 onion",
      "2 garlic cloves",
      "Carrot",
      "Celery",
      "Oregano",
      "Parmesan",
    ],
    steps: [
      "Brown mince in a large pan.",
      "Saute diced onion, carrot, celery and garlic.",
      "Add tinned tomatoes, oregano and simmer 20 min.",
      "Cook spaghetti. Drain.",
      "Serve sauce over spaghetti with parmesan.",
    ],
  },
  {
    id: "6",
    name: "Grilled Salmon & Greens",
    time: "20 min",
    servings: 2,
    calories: 450,
    protein: "38g",
    carbs: "12g",
    fat: "28g",
    type: "meal",
    mealTime: "dinner",
    available: 5,
    total: 7,
    ingredients: [
      "2 salmon fillets",
      "Broccoli",
      "Asparagus",
      "Lemon",
      "Olive oil",
      "Garlic",
      "Salt & pepper",
    ],
    steps: [
      "Season salmon with olive oil, garlic, lemon.",
      "Grill salmon skin-side down for 6-8 min.",
      "Steam broccoli and asparagus.",
      "Plate greens, top with salmon.",
    ],
  },
  {
    id: "7",
    name: "Chicken Stir Fry",
    time: "20 min",
    servings: 2,
    calories: 410,
    protein: "34g",
    carbs: "30g",
    fat: "14g",
    type: "meal",
    mealTime: "dinner",
    available: 4,
    total: 8,
    ingredients: [
      "2 chicken breasts",
      "Broccoli",
      "Carrot",
      "Soy sauce",
      "Garlic",
      "Ginger",
      "Basmati rice",
      "Sesame oil",
    ],
    steps: [
      "Slice chicken and vegetables.",
      "Stir fry chicken until cooked.",
      "Add vegetables and sauces.",
      "Serve over rice.",
    ],
  },
  {
    id: "8",
    name: "Scrambled Eggs & Toast",
    time: "8 min",
    servings: 1,
    calories: 320,
    protein: "20g",
    carbs: "28g",
    fat: "14g",
    type: "meal",
    mealTime: "breakfast",
    available: 4,
    total: 5,
    ingredients: ["3 eggs", "Butter", "Sourdough", "Salt & pepper", "Chives"],
    steps: [
      "Whisk eggs with salt and pepper.",
      "Melt butter in pan, add eggs.",
      "Stir gently until just set.",
      "Serve on toasted sourdough.",
    ],
  },
  {
    id: "9",
    name: "Hummus & Veggie Sticks",
    time: "5 min",
    servings: 1,
    calories: 180,
    protein: "8g",
    carbs: "20g",
    fat: "8g",
    type: "snack",
    available: 3,
    total: 4,
    inPantry: true,
    ingredients: ["Hummus", "Cucumber", "Carrot", "Celery"],
    steps: ["Slice vegetables into sticks.", "Serve with hummus."],
  },
  {
    id: "10",
    name: "Berry Smoothie Bowl",
    time: "5 min",
    servings: 1,
    calories: 220,
    protein: "6g",
    carbs: "38g",
    fat: "4g",
    type: "snack",
    available: 3,
    total: 5,
    inPantry: false,
    ingredients: ["Mixed berries", "Banana", "Rolled oats", "Honey", "Milk"],
    steps: ["Blend berries, banana and milk until smooth.", "Pour into bowl.", "Top with oats and honey."],
  },
  {
    id: "11",
    name: "Cheese & Crackers",
    time: "3 min",
    servings: 1,
    calories: 250,
    protein: "12g",
    carbs: "18g",
    fat: "14g",
    type: "snack",
    available: 2,
    total: 3,
    inPantry: true,
    ingredients: ["Cheddar cheese", "Crackers", "Grapes"],
    steps: ["Slice cheese.", "Arrange with crackers and grapes."],
  },
  {
    id: "14",
    name: "Banana & Peanut Butter Bites",
    time: "5 min",
    servings: 1,
    calories: 200,
    protein: "6g",
    carbs: "24g",
    fat: "10g",
    type: "snack",
    available: 2,
    total: 3,
    inPantry: true,
    ingredients: ["Banana", "Peanut butter", "Dark chocolate chips"],
    steps: ["Slice banana into rounds.", "Top each with peanut butter.", "Add chocolate chips."],
  },
  {
    id: "17",
    name: "Greek Yoghurt & Honey",
    time: "2 min",
    servings: 1,
    calories: 160,
    protein: "14g",
    carbs: "18g",
    fat: "4g",
    type: "snack",
    available: 2,
    total: 2,
    inPantry: true,
    ingredients: ["Greek yoghurt", "Honey"],
    steps: ["Spoon yoghurt into a bowl.", "Drizzle with honey."],
  },
  {
    id: "18",
    name: "Trail Mix",
    time: "1 min",
    servings: 1,
    calories: 210,
    protein: "6g",
    carbs: "22g",
    fat: "12g",
    type: "snack",
    available: 1,
    total: 1,
    inPantry: false,
    ingredients: ["Mixed nuts", "Raisins", "Dark chocolate chips"],
    steps: ["Combine all ingredients in a bowl."],
  },
  {
    id: "12",
    name: "Overnight Oats",
    time: "5 min",
    servings: 1,
    calories: 310,
    protein: "12g",
    carbs: "46g",
    fat: "8g",
    type: "meal",
    mealTime: "breakfast",
    available: 4,
    total: 5,
    ingredients: ["Rolled oats", "Milk", "Honey", "Mixed berries", "Cinnamon"],
    steps: ["Mix oats and milk in a jar.", "Add honey and cinnamon.", "Refrigerate overnight.", "Top with berries and serve."],
  },
  {
    id: "13",
    name: "Egg Fried Rice",
    time: "15 min",
    servings: 2,
    calories: 380,
    protein: "14g",
    carbs: "52g",
    fat: "12g",
    type: "meal",
    mealTime: "lunch",
    available: 5,
    total: 7,
    ingredients: ["Basmati rice", "2 eggs", "Frozen peas", "Soy sauce", "Garlic", "Sesame oil", "Spring onion"],
    steps: [
      "Cook rice and let cool.",
      "Scramble eggs, set aside.",
      "Fry garlic, add rice and peas.",
      "Add soy sauce and eggs.",
      "Garnish with spring onion.",
    ],
  },
  {
    id: "15",
    name: "Chicken Caesar Salad",
    time: "15 min",
    servings: 2,
    calories: 420,
    protein: "30g",
    carbs: "16g",
    fat: "26g",
    type: "meal",
    mealTime: "lunch",
    available: 4,
    total: 7,
    ingredients: ["Chicken breast", "Romaine lettuce", "Parmesan", "Croutons", "Caesar dressing", "Lemon", "Garlic"],
    steps: ["Grill and slice chicken.", "Toss lettuce with dressing.", "Top with chicken, croutons and parmesan."],
  },
  {
    id: "16",
    name: "Lamb Chops & Mash",
    time: "30 min",
    servings: 2,
    calories: 620,
    protein: "36g",
    carbs: "40g",
    fat: "34g",
    type: "meal",
    mealTime: "dinner",
    available: 3,
    total: 8,
    ingredients: ["4 lamb chops", "Potatoes", "Butter", "Milk", "Garlic", "Rosemary", "Salt", "Pepper"],
    steps: ["Season lamb with garlic and rosemary.", "Pan-fry 4 min each side.", "Boil and mash potatoes with butter and milk.", "Serve chops over mash."],
  },
];

export function pickSuggestions(pool: Suggestion[], count: number) {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getFilteredSuggestions(
  suggestions: Suggestion[],
  typeFilter: SuggestionType | null,
  mealTimeFilter: MealTime | null,
) {
  return suggestions.filter((suggestion) => {
    if (typeFilter && suggestion.type !== typeFilter) {
      return false;
    }

    if (typeFilter === "meal" && mealTimeFilter && suggestion.mealTime !== mealTimeFilter) {
      return false;
    }

    return true;
  });
}

export function getSuggestionPool(
  typeFilter: SuggestionType | null,
  mealTimeFilter: MealTime | null,
) {
  return SUGGESTION_POOL.filter((suggestion) => {
    if (typeFilter && suggestion.type !== typeFilter) {
      return false;
    }

    if (typeFilter === "meal" && mealTimeFilter && suggestion.mealTime !== mealTimeFilter) {
      return false;
    }

    return true;
  });
}

export function getProgressPercent(suggestion: Suggestion) {
  return Math.round((suggestion.available / suggestion.total) * 100);
}

export function getMealStatusLabel(suggestion: Suggestion) {
  const pct = getProgressPercent(suggestion);

  if (pct >= 75) {
    return "Ready to cook";
  }

  if (pct >= 50) {
    return "Almost there";
  }

  return "Need to shop";
}
