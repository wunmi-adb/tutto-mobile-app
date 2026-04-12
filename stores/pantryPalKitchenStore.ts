import type { PantryPalKitchenItem } from "@/components/dashboard/kitchen/pantry-pal-data";
import { INITIAL_ITEMS } from "@/components/dashboard/kitchen/pantry-pal-data";
import { mergeUniqueNames } from "@/components/onboarding/storage/constants";
import { useStore } from "@nanostores/react";
import { atom } from "nanostores";

type KitchenTab = "have" | "need";

const $pantryPalKitchenItems = atom<PantryPalKitchenItem[]>(INITIAL_ITEMS);
const $pantryPalKitchenActiveTab = atom<KitchenTab>("have");
const $pantryPalKitchenReviewItems = atom<string[]>([]);

function normalizeName(value: string) {
  return value.trim().toLowerCase();
}

export function usePantryPalKitchenState() {
  const items = useStore($pantryPalKitchenItems);
  const activeTab = useStore($pantryPalKitchenActiveTab);
  const reviewItems = useStore($pantryPalKitchenReviewItems);

  const setActiveTab = (nextTab: KitchenTab) => {
    $pantryPalKitchenActiveTab.set(nextTab);
  };

  const toggleItem = (itemId: string) => {
    $pantryPalKitchenItems.set(
      items.map((item) => (item.id === itemId ? { ...item, have: !item.have } : item)),
    );
  };

  const addItem = (name: string, tab: KitchenTab) => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    const existingItem = items.find((item) => normalizeName(item.name) === normalizeName(trimmedName));

    if (existingItem) {
      $pantryPalKitchenItems.set(
        items.map((item) =>
          item.id === existingItem.id ? { ...item, have: tab === "have" } : item,
        ),
      );
      return;
    }

    $pantryPalKitchenItems.set([
      ...items,
      {
        id: `manual-${Date.now()}`,
        name: trimmedName,
        have: tab === "have",
        aisle: "Other",
      },
    ]);
  };

  const setReviewItems = (nextItems: string[]) => {
    $pantryPalKitchenReviewItems.set(nextItems);
  };

  const removeReviewItem = (index: number) => {
    $pantryPalKitchenReviewItems.set(
      reviewItems.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  const clearReviewItems = () => {
    $pantryPalKitchenReviewItems.set([]);
  };

  const confirmReviewItems = () => {
    const existingHaveItems = items.filter((item) => item.have).map((item) => item.name);
    const nextNames = mergeUniqueNames(existingHaveItems, reviewItems);
    const existingNames = new Set(items.map((item) => normalizeName(item.name)));
    const newEntries = nextNames
      .filter((name) => !existingNames.has(normalizeName(name)))
      .map((name, index) => ({
        id: `voice-${Date.now()}-${index}`,
        name,
        have: true,
        aisle: "Other",
      }));

    $pantryPalKitchenItems.set([
      ...items.map((item) =>
        reviewItems.some((name) => normalizeName(name) === normalizeName(item.name))
          ? { ...item, have: true }
          : item,
      ),
      ...newEntries,
    ]);
    $pantryPalKitchenActiveTab.set("have");
    $pantryPalKitchenReviewItems.set([]);
  };

  return {
    activeTab,
    addItem,
    clearReviewItems,
    confirmReviewItems,
    items,
    removeReviewItem,
    reviewItems,
    setActiveTab,
    setReviewItems,
    toggleItem,
  };
}
