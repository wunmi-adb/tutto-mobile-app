import { formatDateLabel } from "@/components/dashboard/data";
import type { PantryItem } from "@/components/dashboard/kitchen/types";
import type { AppLanguage } from "@/i18n/config";
import type { TranslationKey } from "@/i18n/messages";
import type { FillLevel } from "@/lib/inventory/types";

type Translate = (key: TranslationKey, params?: Record<string, number | string>) => string;

export function normalizeKitchenLocation(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function getActiveBatches(item: PantryItem) {
  return item.batches.filter((batch) => !batch.finished);
}

export function isItemFinished(item: PantryItem) {
  return item.batches.length > 0 && item.batches.every((batch) => batch.finished);
}

export function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getExpiryUrgency(dateStr: string): "danger" | "warn" | "ok" {
  const days = daysUntil(dateStr);

  if (days <= 2) {
    return "danger";
  }

  if (days <= 5) {
    return "warn";
  }

  return "ok";
}

export function getEarliestExpiry(item: PantryItem) {
  const activeBatches = getActiveBatches(item);

  return activeBatches
    .filter((batch) => batch.bestBefore)
    .sort((a, b) => a.bestBefore.localeCompare(b.bestBefore))[0]?.bestBefore;
}

export function isItemExpiringSoon(item: PantryItem) {
  const earliestExpiry = getEarliestExpiry(item);
  return earliestExpiry ? daysUntil(earliestExpiry) <= 5 : false;
}

export function isItemRunningLow(item: PantryItem) {
  const activeBatches = getActiveBatches(item);

  if (activeBatches.length === 0) {
    return false;
  }

  if (item.countAsUnits) {
    return activeBatches.reduce((sum, batch) => sum + batch.qty, 0) <= 2;
  }

  return activeBatches.some((batch) => batch.fillLevel === "almost_empty");
}

export function getFillPercent(fillLevel: FillLevel) {
  switch (fillLevel) {
    case "sealed":
      return 100;
    case "just_opened":
      return 90;
    case "half":
      return 50;
    case "almost_empty":
      return 12;
  }
}

export function getFillLabel(t: Translate, fillLevel: FillLevel) {
  switch (fillLevel) {
    case "sealed":
      return t("addItems.batch.fill.full");
    case "just_opened":
      return t("addItems.batch.fill.justOpened");
    case "half":
      return t("addItems.batch.fill.half");
    case "almost_empty":
      return t("addItems.batch.fill.nearlyEmpty");
  }
}

export function getExpiryLabel(t: Translate, language: AppLanguage, dateStr: string) {
  const days = daysUntil(dateStr);

  if (days < 0) {
    return t("kitchen.expiry.expired");
  }

  if (days === 0) {
    return t("kitchen.expiry.expiresToday");
  }

  if (days === 1) {
    return t("kitchen.expiry.expiresTomorrow");
  }

  if (days <= 7) {
    return t("kitchen.expiry.daysLeftLong", { count: days });
  }

  return t("kitchen.expiry.short", {
    date: formatDateLabel(language, new Date(dateStr), { day: "numeric", month: "short" }),
  });
}

export function getItemSummary(t: Translate, item: PantryItem) {
  const activeBatches = getActiveBatches(item);

  if (activeBatches.length === 0) {
    return t("dashboard.kitchen.status.finished");
  }

  if (item.countAsUnits) {
    return t("kitchen.common.units", {
      count: activeBatches.reduce((sum, batch) => sum + batch.qty, 0),
    });
  }

  if (activeBatches.length === 1) {
    return getFillLabel(t, activeBatches[0].fillLevel);
  }

  return t("dashboard.kitchen.batches", { count: activeBatches.length });
}
