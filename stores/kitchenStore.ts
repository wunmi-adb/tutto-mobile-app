import {
  isItemExpiringSoon,
  isItemFinished,
  isItemRunningLow,
} from "@/components/dashboard/kitchen/helpers";
import type {
  PantryItem,
  PantryLocationFilter,
  PantryStatusFilter,
} from "@/components/dashboard/kitchen/types";
import { useI18n } from "@/i18n";
import { handleCaughtApiError } from "@/lib/api/handle-caught-api-error";
import { useInfiniteInventoryItems } from "@/lib/api/inventory";
import type { CapturedInventoryItem } from "@/lib/api/item-capture";
import { useStorageLocations } from "@/lib/api/storage-locations";
import { useStore } from "@nanostores/react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { atom } from "nanostores";
import { useEffect, useMemo } from "react";

export const $kitchenQuery = atom("");
export const $kitchenDebouncedQuery = atom("");
export const $kitchenSelectedLocation = atom<string | undefined>(undefined);
export const $kitchenSelectedStatus = atom<PantryStatusFilter | undefined>(undefined);
export const $kitchenFiltersOpen = atom(false);
export const $kitchenRefreshing = atom(false);

function getKitchenSummaryKey(itemCount: number, locationCount: number) {
  if (itemCount === 1 && locationCount === 1) {
    return "dashboard.kitchen.summary.singleItemSingleLocation" as const;
  }

  if (itemCount === 1) {
    return "dashboard.kitchen.summary.singleItemMultipleLocations" as const;
  }

  if (locationCount === 1) {
    return "dashboard.kitchen.summary.multipleItemsSingleLocation" as const;
  }

  return "dashboard.kitchen.summary.multipleItemsMultipleLocations" as const;
}

function getKitchenItems(data: ReturnType<typeof useInfiniteInventoryItems>["data"]) {
  return data?.pages.flatMap((page) => page.items) ?? [];
}

export function useKitchenState() {
  const router = useRouter();
  const { t } = useI18n();
  const { source } = useLocalSearchParams<{ source?: string }>();
  const query = useStore($kitchenQuery);
  const debouncedQuery = useStore($kitchenDebouncedQuery);
  const selectedLocation = useStore($kitchenSelectedLocation);
  const selectedStatus = useStore($kitchenSelectedStatus);
  const filtersOpen = useStore($kitchenFiltersOpen);
  const refreshing = useStore($kitchenRefreshing);
  const storageLocationsQuery = useStorageLocations();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      $kitchenDebouncedQuery.set(query);
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const inventoryQuery = useInfiniteInventoryItems({
    search: debouncedQuery,
    status: selectedStatus,
    storageLocationKey: selectedLocation,
  });

  const items = useMemo(() => getKitchenItems(inventoryQuery.data), [inventoryQuery.data]);

  const locationFilters = useMemo<PantryLocationFilter[]>(() => {
    const storageLocations = storageLocationsQuery.data ?? [];
    const usedStorageLocationKeys = new Set<string>();

    const storageLocationOptions = storageLocations.map((location) => {
      usedStorageLocationKeys.add(location.key);

      return {
        key: location.key,
        label: location.name,
        count: items.filter((item) => item.storageLocationKey === location.key).length,
      };
    });

    const orphanedLocationOptions = items
      .filter((item) => item.storageLocationKey && !usedStorageLocationKeys.has(item.storageLocationKey))
      .reduce<PantryLocationFilter[]>((acc, item) => {
        if (!item.storageLocationKey || acc.some((option) => option.key === item.storageLocationKey)) {
          return acc;
        }

        acc.push({
          key: item.storageLocationKey,
          label: item.location,
          count: items.filter((candidate) => candidate.storageLocationKey === item.storageLocationKey)
            .length,
        });

        return acc;
      }, []);

    return [...storageLocationOptions, ...orphanedLocationOptions];
  }, [items, storageLocationsQuery.data]);

  useEffect(() => {
    if (selectedLocation && !locationFilters.some((location) => location.key === selectedLocation)) {
      $kitchenSelectedLocation.set(undefined);
    }
  }, [locationFilters, selectedLocation]);

  const statusOptions = useMemo(
    () => [
      {
        key: "expiring" as const,
        label: t("dashboard.kitchen.status.expiringSoon"),
        count: items.filter(isItemExpiringSoon).length,
        icon: "clock" as const,
      },
      {
        key: "low" as const,
        label: t("dashboard.kitchen.status.runningLow"),
        count: items.filter(isItemRunningLow).length,
        icon: "alert-triangle" as const,
      },
      {
        key: "finished" as const,
        label: t("dashboard.kitchen.status.finished"),
        count: items.filter(isItemFinished).length,
        icon: "check-circle" as const,
      },
    ],
    [items, t],
  );

  const activeFilterCount = (selectedLocation ? 1 : 0) + (selectedStatus ? 1 : 0);
  const isInventoryLoading = inventoryQuery.isPending;
  const summaryKey = getKitchenSummaryKey(items.length, locationFilters.length);

  const handleAddItem = () => {
    router.push({
      pathname: "/onboarding/storage",
      params: { source: source ?? "pantry" },
    });
  };

  const handleEditItem = (item: PantryItem, prefill: CapturedInventoryItem) => {
    const matchedLocation = (storageLocationsQuery.data ?? []).find((location) => {
      if (item.storageLocationKey) {
        return location.key === item.storageLocationKey;
      }

      return location.name === item.location;
    });

    if (!matchedLocation) {
      handleAddItem();
      return;
    }

    router.push({
      pathname: "/onboarding/add-items/detail",
      params: {
        itemKey: item.id,
        location: matchedLocation.name,
        storageKey: matchedLocation.key,
        items: JSON.stringify([prefill]),
        currentIndex: "0",
        completedIndices: "[]",
        source: source ?? "pantry",
      },
    });
  };

  const handleRefresh = async () => {
    $kitchenRefreshing.set(true);

    try {
      await Promise.all([inventoryQuery.refetch(), storageLocationsQuery.refetch()]);
    } catch (error) {
      handleCaughtApiError(error);
    } finally {
      $kitchenRefreshing.set(false);
    }
  };

  const handleLoadMore = () => {
    if (inventoryQuery.hasNextPage && !inventoryQuery.isFetchingNextPage) {
      void inventoryQuery.fetchNextPage().catch(handleCaughtApiError);
    }
  };

  const toggleStatus = (key: PantryStatusFilter) => {
    $kitchenSelectedStatus.set(selectedStatus === key ? undefined : key);
  };

  const toggleLocation = (key: string) => {
    $kitchenSelectedLocation.set(selectedLocation === key ? undefined : key);
  };

  const clearFilters = () => {
    $kitchenSelectedLocation.set(undefined);
    $kitchenSelectedStatus.set(undefined);
  };

  return {
    items,
    query,
    setQuery: (value: string) => $kitchenQuery.set(value),
    selectedLocation,
    selectedStatus,
    filtersOpen,
    refreshing,
    storageLocationsQuery,
    inventoryQuery,
    locationFilters,
    statusOptions,
    activeFilterCount,
    isInventoryLoading,
    summaryKey,
    handleAddItem,
    handleEditItem,
    handleRefresh,
    handleLoadMore,
    openFilters: () => $kitchenFiltersOpen.set(true),
    closeFilters: () => $kitchenFiltersOpen.set(false),
    toggleStatus,
    toggleLocation,
    clearFilters,
  };
}
