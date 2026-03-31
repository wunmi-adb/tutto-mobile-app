export type ItemType = "ingredient" | "cooked";
export type FillLevel = "full" | "three-quarter" | "half" | "quarter" | "nearly-empty";

export interface Batch {
  id: number;
  qty: number;
  bestBefore: string; // "YYYY-MM-DD"
  fillLevel: FillLevel;
  sealed: boolean;
  useWithinDays: number | null;
  dateMade: string; // "YYYY-MM-DD"
}

export const FILL_OPTIONS: { key: FillLevel; percent: number }[] = [
  { key: "full", percent: 100 },
  { key: "three-quarter", percent: 75 },
  { key: "half", percent: 50 },
  { key: "quarter", percent: 25 },
  { key: "nearly-empty", percent: 8 },
];

export const USE_WITHIN = [
  { key: "addItems.batch.useWithin.2days", days: 2 },
  { key: "addItems.batch.useWithin.3days", days: 3 },
  { key: "addItems.batch.useWithin.5days", days: 5 },
  { key: "addItems.batch.useWithin.1week", days: 7 },
  { key: "addItems.batch.useWithin.2weeks", days: 14 },
];

let _batchId = 1;
export const makeBatch = (): Batch => ({
  id: _batchId++,
  qty: 1,
  bestBefore: "",
  fillLevel: "full",
  sealed: true,
  useWithinDays: null,
  dateMade: "",
});
