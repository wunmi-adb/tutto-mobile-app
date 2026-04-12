export type ItemType = "ingredient" | "cooked_meal";
export type TrackingMode = "quantity" | "fill_level";
export type FillLevel = "sealed" | "just_opened" | "half" | "almost_empty";

export interface Batch {
  id: number;
  qty: number;
  bestBefore: string;
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
