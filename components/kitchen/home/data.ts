export type FoodCategory =
  | "bakery" | "condiments" | "cooked" | "dairy" | "drinks"
  | "frozen" | "grains" | "meat" | "produce" | "seafood" | "snacks";

export interface ExpiringItem {
  name: string;
  location: string;
  daysLeft: number;
  fillLabel: string;
  category: FoodCategory;
}

export interface NextMealInfo {
  type: string;
  name: string;
  time: string;
  calories: number;
  servings: number;
  protein: string;
  carbs: string;
  fat: string;
  ingredients: string[];
  steps: string[];
}

export interface ActivityItem {
  id: string;
  text: string;
  time: string;
}

export const EXPIRING_ITEMS: ExpiringItem[] = [
  { name: "Jollof Rice", location: "Fridge", daysLeft: 1, fillLabel: "Almost full", category: "cooked" },
  { name: "Milk", location: "Fridge", daysLeft: 3, fillLabel: "Half left", category: "dairy" },
  { name: "Eggs", location: "Fridge", daysLeft: 7, fillLabel: "8 units", category: "dairy" },
];

export const NEXT_MEALS: NextMealInfo[] = [
  {
    type: "Dinner", name: "Spaghetti Bolognese", time: "35 min",
    calories: 580, servings: 4, protein: "28g", carbs: "62g", fat: "22g",
    ingredients: ["400g spaghetti", "500g beef mince", "400g tin tomatoes", "1 onion", "2 garlic cloves", "Carrot", "Celery", "Oregano", "Parmesan"],
    steps: ["Brown mince in a large pan.", "Sauté diced onion, carrot, celery and garlic.", "Add tinned tomatoes, oregano and simmer 20 min.", "Cook spaghetti. Drain.", "Serve with grated parmesan."],
  },
  {
    type: "Dinner", name: "Grilled Salmon & Greens", time: "20 min",
    calories: 450, servings: 2, protein: "38g", carbs: "12g", fat: "28g",
    ingredients: ["2 salmon fillets", "Broccoli", "Asparagus", "Lemon", "Olive oil", "Garlic"],
    steps: ["Season salmon with olive oil, garlic, lemon.", "Grill skin-side down 6-8 min.", "Steam greens. Plate and serve."],
  },
  {
    type: "Dinner", name: "Jollof Rice with Chicken", time: "45 min",
    calories: 520, servings: 4, protein: "32g", carbs: "58g", fat: "16g",
    ingredients: ["2 cups rice", "400g tin tomatoes", "4 chicken thighs", "1 onion", "Scotch bonnet", "Thyme"],
    steps: ["Brown chicken. Set aside.", "Blend tomatoes, onion and scotch bonnet.", "Fry mix until reduced.", "Add rice and stock. Cook 30 min.", "Serve with chicken."],
  },
];

export const RECENT_ACTIVITY: ActivityItem[] = [
  { id: "1", text: "Opened Semi-skimmed Milk", time: "2h ago" },
  { id: "2", text: "Cooked Jollof Rice — added to Fridge", time: "Yesterday" },
  { id: "3", text: "Bought Avocado, Sourdough, Beef mince", time: "Yesterday" },
  { id: "4", text: "Added Stew (×2) to Freezer", time: "2 days ago" },
  { id: "5", text: "Generated meal plan for this week", time: "3 days ago" },
];

export const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

export const expiryColor = (days: number, colors: { danger: string; warning: string; muted: string }) => {
  if (days <= 1) return colors.danger;
  if (days <= 3) return colors.warning;
  return colors.muted;
};

export const expiryLabel = (days: number) => {
  if (days <= 0) return "Expired";
  if (days === 1) return "Tomorrow";
  return `${days}d left`;
};
