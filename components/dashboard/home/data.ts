export type MealTime = "breakfast" | "lunch" | "dinner" | "snack";

export type DashboardMeal = {
  id: string;
  mealTime: MealTime;
  name: string;
  time: string;
  calories: number;
  servings: number;
  protein: string;
  carbs: string;
  fat: string;
  ingredients: string[];
  availableIngredients: number;
  steps: string[];
  inPantry?: boolean;
};

export type MealSection = {
  label: string;
  meals: DashboardMeal[];
};

export type ShoppingListItem = {
  name: string;
  aisle: string;
};

const BREAKFAST_POOL: DashboardMeal[] = [
  {
    id: "avocado-eggs-toast",
    mealTime: "breakfast",
    name: "Avocado & Eggs on Toast",
    time: "15 min",
    calories: 380,
    servings: 2,
    protein: "18g",
    carbs: "32g",
    fat: "22g",
    ingredients: ["2 eggs", "1 avocado", "2 slices sourdough", "Chilli flakes", "Lemon juice", "Salt & pepper"],
    availableIngredients: 5,
    steps: ["Toast sourdough.", "Mash avocado with lemon.", "Fry eggs.", "Assemble and serve."],
  },
  {
    id: "oat-porridge-berries",
    mealTime: "breakfast",
    name: "Oat Porridge with Berries",
    time: "10 min",
    calories: 290,
    servings: 2,
    protein: "10g",
    carbs: "48g",
    fat: "6g",
    ingredients: ["Rolled oats", "Milk", "Honey", "Mixed berries", "Cinnamon"],
    availableIngredients: 4,
    steps: ["Cook oats with milk.", "Top with berries, honey and cinnamon."],
  },
  {
    id: "scrambled-eggs-toast",
    mealTime: "breakfast",
    name: "Scrambled Eggs & Toast",
    time: "8 min",
    calories: 320,
    servings: 1,
    protein: "20g",
    carbs: "28g",
    fat: "14g",
    ingredients: ["3 eggs", "Butter", "Sourdough", "Salt & pepper", "Chives"],
    availableIngredients: 4,
    steps: ["Whisk eggs.", "Scramble in butter.", "Serve on toast."],
  },
  {
    id: "overnight-oats",
    mealTime: "breakfast",
    name: "Overnight Oats",
    time: "5 min",
    calories: 310,
    servings: 1,
    protein: "12g",
    carbs: "46g",
    fat: "8g",
    ingredients: ["Rolled oats", "Milk", "Honey", "Mixed berries", "Cinnamon"],
    availableIngredients: 5,
    steps: ["Mix oats and milk.", "Refrigerate overnight.", "Top with berries."],
  },
  {
    id: "pancakes-maple-syrup",
    mealTime: "breakfast",
    name: "Pancakes & Maple Syrup",
    time: "20 min",
    calories: 420,
    servings: 2,
    protein: "10g",
    carbs: "58g",
    fat: "16g",
    ingredients: ["Flour", "Eggs", "Milk", "Butter", "Maple syrup"],
    availableIngredients: 4,
    steps: ["Mix batter.", "Cook pancakes.", "Serve with syrup."],
  },
];

const LUNCH_POOL: DashboardMeal[] = [
  {
    id: "mediterranean-wrap",
    mealTime: "lunch",
    name: "Mediterranean Wrap",
    time: "10 min",
    calories: 420,
    servings: 1,
    protein: "22g",
    carbs: "40g",
    fat: "18g",
    ingredients: ["Tortilla wrap", "Hummus", "Feta", "Cucumber", "Tomato", "Mixed leaves", "Olives"],
    availableIngredients: 5,
    steps: ["Spread hummus on wrap.", "Add fillings.", "Roll and slice."],
  },
  {
    id: "jollof-rice-chicken",
    mealTime: "lunch",
    name: "Jollof Rice with Chicken",
    time: "45 min",
    calories: 520,
    servings: 4,
    protein: "32g",
    carbs: "58g",
    fat: "16g",
    ingredients: ["2 cups rice", "400g tin tomatoes", "4 chicken thighs", "1 onion", "Scotch bonnet", "Thyme"],
    availableIngredients: 4,
    steps: ["Brown chicken.", "Blend and fry tomato mix.", "Add rice and cook."],
  },
  {
    id: "chicken-caesar-salad",
    mealTime: "lunch",
    name: "Chicken Caesar Salad",
    time: "15 min",
    calories: 420,
    servings: 2,
    protein: "30g",
    carbs: "16g",
    fat: "26g",
    ingredients: ["Chicken breast", "Romaine lettuce", "Parmesan", "Croutons", "Caesar dressing", "Lemon"],
    availableIngredients: 4,
    steps: ["Grill chicken.", "Toss salad.", "Top and serve."],
  },
  {
    id: "egg-fried-rice",
    mealTime: "lunch",
    name: "Egg Fried Rice",
    time: "15 min",
    calories: 380,
    servings: 2,
    protein: "14g",
    carbs: "52g",
    fat: "12g",
    ingredients: ["Basmati rice", "2 eggs", "Frozen peas", "Soy sauce", "Garlic", "Sesame oil"],
    availableIngredients: 5,
    steps: ["Cook rice.", "Scramble eggs.", "Stir-fry together."],
  },
  {
    id: "tomato-soup-bread",
    mealTime: "lunch",
    name: "Tomato Soup & Bread",
    time: "20 min",
    calories: 310,
    servings: 2,
    protein: "8g",
    carbs: "42g",
    fat: "12g",
    ingredients: ["Tinned tomatoes", "Onion", "Garlic", "Basil", "Cream", "Sourdough"],
    availableIngredients: 5,
    steps: ["Saute onion and garlic.", "Add tomatoes, simmer.", "Blend and serve with bread."],
  },
];

const DINNER_POOL: DashboardMeal[] = [
  {
    id: "spaghetti-bolognese",
    mealTime: "dinner",
    name: "Spaghetti Bolognese",
    time: "35 min",
    calories: 580,
    servings: 4,
    protein: "28g",
    carbs: "62g",
    fat: "22g",
    ingredients: ["400g spaghetti", "500g beef mince", "400g tin tomatoes", "1 onion", "2 garlic cloves", "Carrot", "Celery", "Oregano", "Parmesan"],
    availableIngredients: 5,
    steps: ["Brown mince.", "Saute vegetables.", "Simmer sauce 20 min.", "Cook pasta.", "Serve."],
  },
  {
    id: "grilled-salmon-greens",
    mealTime: "dinner",
    name: "Grilled Salmon & Greens",
    time: "20 min",
    calories: 450,
    servings: 2,
    protein: "38g",
    carbs: "12g",
    fat: "28g",
    ingredients: ["2 salmon fillets", "Broccoli", "Asparagus", "Lemon", "Olive oil", "Garlic"],
    availableIngredients: 3,
    steps: ["Season salmon.", "Grill 6-8 min.", "Steam greens.", "Serve."],
  },
  {
    id: "butter-chicken",
    mealTime: "dinner",
    name: "Butter Chicken",
    time: "40 min",
    calories: 550,
    servings: 4,
    protein: "34g",
    carbs: "28g",
    fat: "30g",
    ingredients: ["Chicken thighs", "Yoghurt", "Butter", "Tomato passata", "Cream", "Garam masala", "Garlic", "Ginger", "Rice"],
    availableIngredients: 4,
    steps: ["Marinate chicken.", "Cook in butter.", "Simmer with passata.", "Serve with rice."],
  },
  {
    id: "thai-green-curry",
    mealTime: "dinner",
    name: "Thai Green Curry",
    time: "25 min",
    calories: 460,
    servings: 3,
    protein: "28g",
    carbs: "34g",
    fat: "24g",
    ingredients: ["Chicken breast", "Coconut milk", "Green curry paste", "Bamboo shoots", "Thai basil", "Fish sauce", "Rice"],
    availableIngredients: 2,
    steps: ["Fry paste.", "Add chicken.", "Pour in coconut milk.", "Serve with rice."],
  },
  {
    id: "beef-stew",
    mealTime: "dinner",
    name: "Beef Stew",
    time: "60 min",
    calories: 480,
    servings: 4,
    protein: "36g",
    carbs: "32g",
    fat: "20g",
    ingredients: ["Stewing beef", "Potatoes", "Carrots", "Onion", "Beef stock", "Tomato paste", "Thyme", "Bay leaf"],
    availableIngredients: 5,
    steps: ["Brown beef.", "Saute vegetables.", "Simmer 45 min."],
  },
  {
    id: "chicken-tacos",
    mealTime: "dinner",
    name: "Chicken Tacos",
    time: "25 min",
    calories: 420,
    servings: 3,
    protein: "30g",
    carbs: "38g",
    fat: "18g",
    ingredients: ["Chicken breast", "Tortillas", "Avocado", "Lime", "Coriander", "Red onion", "Sour cream"],
    availableIngredients: 2,
    steps: ["Grill chicken.", "Prep toppings.", "Assemble tacos."],
  },
];

const SNACK_POOL: DashboardMeal[] = [
  {
    id: "hummus-veggie-sticks",
    mealTime: "snack",
    name: "Hummus & Veggie Sticks",
    time: "5 min",
    calories: 180,
    servings: 1,
    protein: "8g",
    carbs: "20g",
    fat: "8g",
    ingredients: ["Hummus", "Cucumber", "Carrot", "Celery"],
    availableIngredients: 4,
    inPantry: true,
    steps: ["Slice veg.", "Serve with hummus."],
  },
  {
    id: "cheese-crackers",
    mealTime: "snack",
    name: "Cheese & Crackers",
    time: "3 min",
    calories: 250,
    servings: 1,
    protein: "12g",
    carbs: "18g",
    fat: "14g",
    ingredients: ["Cheddar", "Crackers", "Grapes"],
    availableIngredients: 3,
    inPantry: true,
    steps: ["Slice cheese.", "Arrange and serve."],
  },
  {
    id: "greek-yoghurt-honey",
    mealTime: "snack",
    name: "Greek Yoghurt & Honey",
    time: "2 min",
    calories: 160,
    servings: 1,
    protein: "14g",
    carbs: "18g",
    fat: "4g",
    ingredients: ["Greek yoghurt", "Honey"],
    availableIngredients: 2,
    inPantry: true,
    steps: ["Spoon yoghurt.", "Drizzle honey."],
  },
  {
    id: "banana-peanut-butter",
    mealTime: "snack",
    name: "Banana & Peanut Butter",
    time: "5 min",
    calories: 200,
    servings: 1,
    protein: "6g",
    carbs: "24g",
    fat: "10g",
    ingredients: ["Banana", "Peanut butter", "Dark chocolate chips"],
    availableIngredients: 2,
    inPantry: false,
    steps: ["Slice banana.", "Top with peanut butter."],
  },
  {
    id: "berry-smoothie-bowl",
    mealTime: "snack",
    name: "Berry Smoothie Bowl",
    time: "5 min",
    calories: 220,
    servings: 1,
    protein: "6g",
    carbs: "38g",
    fat: "4g",
    ingredients: ["Mixed berries", "Banana", "Oats", "Honey", "Milk"],
    availableIngredients: 3,
    inPantry: false,
    steps: ["Blend.", "Pour into bowl.", "Top with oats."],
  },
];

export const TO_BUY_ITEMS: ShoppingListItem[] = [
  { name: "Salmon fillets", aisle: "Meat & Fish" },
  { name: "Broccoli", aisle: "Fresh Produce" },
  { name: "Coconut milk", aisle: "Tinned & Jarred" },
  { name: "Soy sauce", aisle: "Oils & Condiments" },
  { name: "Tortilla wraps", aisle: "Bakery" },
];

function pickMeals(pool: DashboardMeal[], count: number) {
  return [...pool].sort(() => Math.random() - 0.5).slice(0, count);
}

export function getGreeting(date = new Date()) {
  const hour = date.getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 17) {
    return "Good afternoon";
  }

  return "Good evening";
}

export function getSubtitle(date = new Date()) {
  const hour = date.getHours();

  if (hour < 10) {
    return "What's for breakfast?";
  }

  if (hour < 14) {
    return "What's for lunch?";
  }

  if (hour < 17) {
    return "What's for dinner?";
  }

  return "What are we eating tonight?";
}

export function getMealSections(date = new Date()): MealSection[] {
  const hour = date.getHours();

  if (hour < 10) {
    return [
      { label: "Today's breakfast", meals: pickMeals(BREAKFAST_POOL, 5) },
      { label: "Today's lunch", meals: pickMeals(LUNCH_POOL, 5) },
      { label: "Today's dinner", meals: pickMeals(DINNER_POOL, 5) },
      { label: "Snacks", meals: pickMeals(SNACK_POOL, 5) },
    ];
  }

  if (hour < 14) {
    return [
      { label: "Today's lunch", meals: pickMeals(LUNCH_POOL, 5) },
      { label: "Today's dinner", meals: pickMeals(DINNER_POOL, 5) },
      { label: "Tomorrow's breakfast", meals: pickMeals(BREAKFAST_POOL, 5) },
      { label: "Snacks", meals: pickMeals(SNACK_POOL, 5) },
    ];
  }

  if (hour < 17) {
    return [
      { label: "Today's dinner", meals: pickMeals(DINNER_POOL, 5) },
      { label: "Tomorrow's breakfast", meals: pickMeals(BREAKFAST_POOL, 5) },
      { label: "Tomorrow's lunch", meals: pickMeals(LUNCH_POOL, 5) },
      { label: "Snacks", meals: pickMeals(SNACK_POOL, 5) },
    ];
  }

  return [
    { label: "Tonight's dinner", meals: pickMeals(DINNER_POOL, 5) },
    { label: "Tomorrow's breakfast", meals: pickMeals(BREAKFAST_POOL, 5) },
    { label: "Tomorrow's lunch", meals: pickMeals(LUNCH_POOL, 5) },
    { label: "Snacks", meals: pickMeals(SNACK_POOL, 5) },
  ];
}

export function getMealReadiness(meal: DashboardMeal) {
  if (meal.mealTime === "snack") {
    if (meal.inPantry) {
      return {
        label: "Ready to eat · In your kitchen",
        accentColor: "#2d7a4f",
        backgroundColor: "#eef7f1",
        dotColor: "#2d7a4f",
      };
    }

    return {
      label: "Need to buy",
      accentColor: "#D4A017",
      backgroundColor: "#fff8e8",
      dotColor: "#D4A017",
    };
  }

  const percent = Math.round((meal.availableIngredients / meal.ingredients.length) * 100);

  if (percent >= 75) {
    return {
      label: "Ready to cook",
      accentColor: "#2d7a4f",
      backgroundColor: "#eef7f1",
      dotColor: "#2d7a4f",
    };
  }

  if (percent >= 50) {
    return {
      label: "Almost there",
      accentColor: "#D4A017",
      backgroundColor: "#fff8e8",
      dotColor: "#D4A017",
    };
  }

  return {
    label: "Need to shop",
    accentColor: "#6b5e4e",
    backgroundColor: "#f3f2f1",
    dotColor: "#6b5e4e",
  };
}

export function getMealAvailabilityPercent(meal: DashboardMeal) {
  return Math.round((meal.availableIngredients / meal.ingredients.length) * 100);
}
