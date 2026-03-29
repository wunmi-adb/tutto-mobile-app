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

export const FILL_OPTIONS: { key: FillLevel; label: string; percent: number }[] = [
  { key: "full", label: "Full", percent: 100 },
  { key: "three-quarter", label: "¾", percent: 75 },
  { key: "half", label: "½", percent: 50 },
  { key: "quarter", label: "¼", percent: 25 },
  { key: "nearly-empty", label: "Nearly empty", percent: 8 },
];

export const USE_WITHIN = [
  { label: "2 days", days: 2 },
  { label: "3 days", days: 3 },
  { label: "5 days", days: 5 },
  { label: "1 week", days: 7 },
  { label: "2 weeks", days: 14 },
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
