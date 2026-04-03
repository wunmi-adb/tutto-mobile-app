export type ItemType = "ingredient" | "cooked";
export type TrackingMode = "quantity" | "fill_level";
export type FillLevel = "sealed" | "full" | "half" | "nearly-empty";

export interface Batch {
  id: number;
  qty: number;
  bestBefore: string; // "YYYY-MM-DD"
  fillLevel: FillLevel;
}

export interface ItemDraft {
  name: string;
  itemType: ItemType;
  countAsUnits: boolean;
  batches: Batch[];
  expandedBatchId: number;
}

export const INGREDIENT_FILL_OPTIONS: { key: FillLevel; percent: number }[] = [
  { key: "sealed", percent: 100 },
  { key: "full", percent: 90 },
  { key: "half", percent: 50 },
  { key: "nearly-empty", percent: 12 },
];

export const COOKED_FILL_OPTIONS: { key: Exclude<FillLevel, "sealed">; percent: number }[] = [
  { key: "full", percent: 100 },
  { key: "half", percent: 50 },
  { key: "nearly-empty", percent: 12 },
];

let _batchId = 1;
export const makeBatch = (): Batch => ({
  id: _batchId++,
  qty: 1,
  bestBefore: "",
  fillLevel: "sealed",
});

export const makeItemDraft = (name = ""): ItemDraft => {
  const batch = makeBatch();

  return {
    name,
    itemType: "ingredient",
    countAsUnits: false,
    batches: [batch],
    expandedBatchId: batch.id,
  };
};
