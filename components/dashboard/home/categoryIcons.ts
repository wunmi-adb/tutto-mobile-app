import { ImageSourcePropType } from "react-native";
import type { FoodCategory } from "@/components/dashboard/data";

export const CATEGORY_IMAGES: Record<FoodCategory, ImageSourcePropType> = {
  dairy: require("@/assets/images/category-dairy.png"),
  meat: require("@/assets/images/category-meat.png"),
  seafood: require("@/assets/images/category-seafood.png"),
  produce: require("@/assets/images/category-produce.png"),
  grains: require("@/assets/images/category-grains.png"),
  drinks: require("@/assets/images/category-drinks.png"),
  frozen: require("@/assets/images/category-frozen.png"),
  condiments: require("@/assets/images/category-condiments.png"),
  snacks: require("@/assets/images/category-snacks.png"),
  bakery: require("@/assets/images/category-bakery.png"),
  cooked: require("@/assets/images/category-cooked.png"),
};

const FOOD_CATEGORY_MAP: Record<string, FoodCategory> = {
  // Dairy
  milk: "dairy", cheese: "dairy", yogurt: "dairy", yoghurt: "dairy", butter: "dairy",
  cream: "dairy", egg: "dairy", eggs: "dairy", whey: "dairy", curd: "dairy",

  // Meat
  beef: "meat", chicken: "meat", pork: "meat", lamb: "meat", turkey: "meat",
  sausage: "meat", bacon: "meat", ham: "meat", mince: "meat", steak: "meat",

  // Seafood
  fish: "seafood", salmon: "seafood", tuna: "seafood", shrimp: "seafood",
  prawn: "seafood", prawns: "seafood", cod: "seafood", mackerel: "seafood",
  crab: "seafood", lobster: "seafood",

  // Produce
  tomato: "produce", tomatoes: "produce", onion: "produce", garlic: "produce",
  carrot: "produce", celery: "produce", pepper: "produce", lettuce: "produce",
  spinach: "produce", broccoli: "produce", asparagus: "produce", avocado: "produce",
  banana: "produce", apple: "produce", orange: "produce", lemon: "produce",
  lime: "produce", mango: "produce", pineapple: "produce", grape: "produce",
  berry: "produce", berries: "produce", potato: "produce", potatoes: "produce",
  cucumber: "produce", cabbage: "produce", kale: "produce", corn: "produce",
  plantain: "produce", yam: "produce", scotch: "produce",

  // Grains
  rice: "grains", pasta: "grains", spaghetti: "grains", noodle: "grains",
  noodles: "grains", oat: "grains", oats: "grains", cereal: "grains",
  flour: "grains", wheat: "grains", couscous: "grains", quinoa: "grains",
  semolina: "grains",

  // Drinks
  water: "drinks", juice: "drinks", soda: "drinks", smoothie: "drinks",
  coffee: "drinks", tea: "drinks", wine: "drinks", beer: "drinks",
  cola: "drinks", lemonade: "drinks",

  // Frozen
  "ice cream": "frozen", frozen: "frozen", popsicle: "frozen",

  // Condiments
  sauce: "condiments", ketchup: "condiments", mustard: "condiments",
  mayonnaise: "condiments", mayo: "condiments", oil: "condiments",
  vinegar: "condiments", soy: "condiments", salt: "condiments",
  spice: "condiments", oregano: "condiments", thyme: "condiments",
  parsley: "condiments", seasoning: "condiments",

  // Snacks
  chips: "snacks", crisps: "snacks", nuts: "snacks", biscuit: "snacks",
  biscuits: "snacks", popcorn: "snacks", cookie: "snacks", cookies: "snacks",
  chocolate: "snacks", candy: "snacks", granola: "snacks",

  // Bakery
  bread: "bakery", sourdough: "bakery", cake: "bakery", pastry: "bakery",
  croissant: "bakery", muffin: "bakery", bagel: "bakery", baguette: "bakery",
  donut: "bakery", doughnut: "bakery", roll: "bakery", pie: "bakery",

  // Cooked
  jollof: "cooked", stew: "cooked", soup: "cooked", curry: "cooked",
  bolognese: "cooked", casserole: "cooked", leftovers: "cooked", cooked: "cooked",
};

export function getCategoryForFood(name: string): FoodCategory {
  const lower = name.toLowerCase();
  for (const [keyword, category] of Object.entries(FOOD_CATEGORY_MAP)) {
    if (lower.includes(keyword)) return category;
  }
  return "produce";
}

export function getCategoryImage(name: string): ImageSourcePropType {
  return CATEGORY_IMAGES[getCategoryForFood(name)];
}
