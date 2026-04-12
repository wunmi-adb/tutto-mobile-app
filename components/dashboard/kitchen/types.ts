import type { FillLevel, ItemType } from "@/lib/inventory/types";

export type PantryStatusFilter = "expiring" | "low" | "finished";

export type PantryBatch = {
  id: number;
  qty: number;
  fillLevel: FillLevel;
  sealed: boolean;
  bestBefore: string;
  dateMade?: string;
  finished?: boolean;
};

export type PantryItem = {
  id: string;
  name: string;
  type: ItemType;
  location: string;
  storageLocationKey?: string;
  countAsUnits: boolean;
  batches: PantryBatch[];
};

export type PantryLocationFilter = {
  key: string;
  label: string;
  count: number;
};
