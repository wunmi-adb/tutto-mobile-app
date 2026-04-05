export type ItemType = "ingredient" | "cooked_meal";
export type TrackingMode = "quantity" | "fill_level";
export type FillLevel = "sealed" | "just_opened" | "half" | "almost_empty";

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

export type PrefillableBatch = {
  best_before?: string;
  fill_level?: string;
  quantity?: number;
};

export type PrefillableItem = {
  name: string;
  item_type?: ItemType;
  tracking_mode?: TrackingMode;
  batches?: PrefillableBatch[];
  preserve_empty_batches?: boolean;
};

export const INGREDIENT_FILL_OPTIONS: { key: FillLevel; percent: number }[] = [
  { key: "sealed", percent: 100 },
  { key: "just_opened", percent: 90 },
  { key: "half", percent: 50 },
  { key: "almost_empty", percent: 12 },
];

export const COOKED_FILL_OPTIONS: { key: Exclude<FillLevel, "sealed">; percent: number }[] = [
  { key: "just_opened", percent: 100 },
  { key: "half", percent: 50 },
  { key: "almost_empty", percent: 12 },
];

let _batchId = 1;
export const makeBatch = (): Batch => ({
  id: _batchId++,
  qty: 1,
  bestBefore: "",
  fillLevel: "sealed",
});

function isFillLevel(value: unknown): value is FillLevel {
  return (
    value === "sealed" ||
    value === "just_opened" ||
    value === "half" ||
    value === "almost_empty"
  );
}

function normalizeItemType(value: unknown): ItemType {
  if (value === "cooked" || value === "cooked_meal") {
    return "cooked_meal";
  }

  return "ingredient";
}

function normalizeFillLevel(value: unknown, itemType: ItemType): FillLevel {
  if (isFillLevel(value)) {
    if (itemType === "cooked_meal" && value === "sealed") {
      return "just_opened";
    }

    return value;
  }

  return itemType === "cooked_meal" ? "just_opened" : "sealed";
}

function makeBatchFromPrefill(batch: PrefillableBatch | undefined, itemType: ItemType): Batch {
  return {
    id: _batchId++,
    qty:
      typeof batch?.quantity === "number" && Number.isFinite(batch.quantity) && batch.quantity > 0
        ? Math.round(batch.quantity)
        : 1,
    bestBefore: typeof batch?.best_before === "string" ? batch.best_before : "",
    fillLevel: normalizeFillLevel(batch?.fill_level, itemType),
  };
}

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

export const makeItemDraftFromPrefill = (item: PrefillableItem): ItemDraft => {
  const itemType = normalizeItemType(item.item_type);
  const countAsUnits = item.tracking_mode === "quantity";
  const shouldPreserveEmptyBatches = item.preserve_empty_batches && Array.isArray(item.batches);
  let batches: Batch[];

  if (Array.isArray(item.batches) && item.batches.length > 0) {
    batches = item.batches.map((batch) => makeBatchFromPrefill(batch, itemType));
  } else if (shouldPreserveEmptyBatches) {
    batches = [];
  } else {
    batches = [makeBatchFromPrefill(undefined, itemType)];
  }

  return {
    name: item.name,
    itemType,
    countAsUnits,
    batches,
    expandedBatchId: batches[0]?.id ?? -1,
  };
};
