export type PantryPalKitchenItem = {
  id: string;
  name: string;
  have: boolean;
  source?: string;
  aisle?: string;
};

export const AISLE_ORDER = [
  "Fresh Produce",
  "Meat & Fish",
  "Dairy & Eggs",
  "Bakery",
  "Pasta & Grains",
  "Tinned & Jarred",
  "Frozen",
  "Spices",
  "Oils & Condiments",
  "Other",
] as const;

export const INITIAL_ITEMS: PantryPalKitchenItem[] = [
  { id: "1", name: "Semi-skimmed Milk", have: true, aisle: "Dairy & Eggs" },
  { id: "2", name: "Eggs", have: true, aisle: "Dairy & Eggs" },
  { id: "3", name: "Chicken Breast", have: true, aisle: "Meat & Fish" },
  { id: "4", name: "Cheddar Cheese", have: true, aisle: "Dairy & Eggs" },
  { id: "5", name: "Frozen Peas", have: true, aisle: "Frozen" },
  { id: "6", name: "Cumin", have: true, aisle: "Spices" },
  { id: "7", name: "Paprika", have: true, aisle: "Spices" },
  { id: "8", name: "Basmati Rice", have: true, aisle: "Pasta & Grains" },
  { id: "9", name: "Olive Oil", have: true, aisle: "Oils & Condiments" },
  { id: "10", name: "Avocado", have: false, source: "Avocado & Eggs on Toast", aisle: "Fresh Produce" },
  { id: "11", name: "Sourdough Bread", have: false, source: "Avocado & Eggs on Toast", aisle: "Bakery" },
  { id: "12", name: "Beef Mince", have: false, source: "Spaghetti Bolognese", aisle: "Meat & Fish" },
  { id: "13", name: "Spaghetti", have: false, source: "Spaghetti Bolognese", aisle: "Pasta & Grains" },
  { id: "14", name: "Tinned Tomatoes", have: false, source: "Jollof Rice", aisle: "Tinned & Jarred" },
  { id: "15", name: "Salmon Fillets", have: false, source: "Grilled Salmon & Greens", aisle: "Meat & Fish" },
  { id: "16", name: "Broccoli", have: false, source: "Grilled Salmon & Greens", aisle: "Fresh Produce" },
];
