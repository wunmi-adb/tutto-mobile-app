export const SUGGESTED_LOCATIONS = [
  { id: "fridge", key: "storage.options.fridge" },
  { id: "freezer", key: "storage.options.freezer" },
  { id: "pantry", key: "storage.options.pantry" },
  { id: "spice-rack", key: "storage.options.spiceRack" },
] as const;

export type DraftCaptureMode = null | "manual" | "voice";

export const INVENTORY_EXTRACTION_POLL_MAX_ATTEMPTS = 40;

export function mergeUniqueNames(existing: string[], next: string[]) {
  const seen = new Set(existing.map((item) => item.trim().toLowerCase()).filter(Boolean));
  const merged = [...existing];

  for (const item of next) {
    const trimmed = item.trim();
    const normalized = trimmed.toLowerCase();

    if (!trimmed || seen.has(normalized)) {
      continue;
    }

    seen.add(normalized);
    merged.push(trimmed);
  }

  return merged;
}
