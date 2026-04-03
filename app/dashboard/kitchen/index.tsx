import KitchenFilterSheet from "@/components/dashboard/kitchen/KitchenFilterSheet";
import PantryEmptyState from "@/components/dashboard/kitchen/PantryEmptyState";
import KitchenItemsSkeleton from "@/components/dashboard/kitchen/KitchenItemsSkeleton";
import PantryItemCard from "@/components/dashboard/kitchen/PantryItemCard";
import PantrySearchBar from "@/components/dashboard/kitchen/PantrySearchBar";
import {
  isItemExpiringSoon,
  isItemFinished,
  isItemRunningLow,
  normalizeKitchenLocation,
} from "@/components/dashboard/kitchen/helpers";
import type {
  PantryItem,
  PantryLocationFilter,
  PantryStatusFilter,
} from "@/components/dashboard/kitchen/types";
import { KitchenScreenHeader } from "@/components/dashboard/shared";
import HapticPressable from "@/components/ui/HapticPressable";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import { useInfiniteInventoryItems } from "@/lib/api/inventory";
import type { CapturedInventoryItem } from "@/lib/api/item-capture";
import { useStorageLocations } from "@/lib/api/storage-locations";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function KitchenScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const { source } = useLocalSearchParams<{ source?: string }>();
  const storageLocationsQuery = useStorageLocations();
  const [items, setItems] = useState<PantryItem[]>([]);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState<PantryStatusFilter>("all");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(query);
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const inventoryQuery = useInfiniteInventoryItems({
    search: debouncedQuery,
    status: selectedStatus,
    storageLocationKey: selectedLocation === "all" ? undefined : selectedLocation,
  });

  const fetchedItems = useMemo(
    () => inventoryQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [inventoryQuery.data],
  );

  useEffect(() => {
    setItems((currentItems) =>
      fetchedItems.map((item) => {
        const currentItem = currentItems.find((current) => current.id === item.id);

        if (!currentItem) {
          return item;
        }

        return {
          ...item,
          batches: item.batches.map((batch) => {
            const currentBatch = currentItem.batches.find((current) => current.id === batch.id);
            return currentBatch?.finished ? { ...batch, finished: true } : batch;
          }),
        };
      }),
    );
  }, [fetchedItems]);

  const locationFilters = useMemo<PantryLocationFilter[]>(() => {
    const locationLabels = Array.from(
      new Set([
        ...items.map((item) => item.location),
        ...(storageLocationsQuery.data ?? []).map((location) => location.name),
      ]),
    );

    return [
      {
        key: "all",
        label: t("kitchen.locations.all"),
        count: items.length,
      },
      ...locationLabels.map((label) => ({
        key: normalizeKitchenLocation(label),
        label,
        count: items.filter(
          (item) => normalizeKitchenLocation(item.location) === normalizeKitchenLocation(label),
        ).length,
      })),
    ];
  }, [items, storageLocationsQuery.data, t]);

  useEffect(() => {
    if (!locationFilters.some((location) => location.key === selectedLocation)) {
      setSelectedLocation("all");
    }
  }, [locationFilters, selectedLocation]);

  const statusOptions = useMemo(
    () => [
      {
        key: "all" as const,
        label: t("dashboard.kitchen.status.allItems"),
        count: items.length,
      },
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

  const activeFilterCount =
    (selectedLocation !== "all" ? 1 : 0) + (selectedStatus !== "all" ? 1 : 0);

  const handleAddItem = () => {
    router.push({
      pathname: "/onboarding/storage",
      params: { source: source ?? "pantry" },
    });
  };

  const handleEditItem = (item: PantryItem, prefill: CapturedInventoryItem) => {
    const matchedLocation = (storageLocationsQuery.data ?? []).find(
      (location) =>
        normalizeKitchenLocation(location.name) === normalizeKitchenLocation(item.location),
    );

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
    setRefreshing(true);

    try {
      await Promise.all([inventoryQuery.refetch(), storageLocationsQuery.refetch()]);
    } finally {
      setRefreshing(false);
    }
  };

  const handleLoadMore = () => {
    if (inventoryQuery.hasNextPage && !inventoryQuery.isFetchingNextPage) {
      void inventoryQuery.fetchNextPage();
    }
  };

  const isInventoryLoading = inventoryQuery.isPending;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PantryItemCard
            item={item}
            onEdit={handleEditItem}
          />
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.45}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void handleRefresh()}
            tintColor={colors.brand}
            colors={[colors.brand]}
          />
        }
        ListHeaderComponent={
          <>
            <KitchenScreenHeader
              title={t("dashboard.kitchen.title")}
              subtitle={t("dashboard.kitchen.summary", {
                count: items.length,
                locations: Math.max(locationFilters.length - 1, 0),
              })}
              rightAction={
                <HapticPressable style={styles.addButton} onPress={handleAddItem}>
                  <Feather name="plus" size={16} color={colors.background} />
                </HapticPressable>
              }
            />

            <PantrySearchBar
              value={query}
              onChangeText={setQuery}
              placeholder={t("dashboard.kitchen.searchPlaceholder")}
              activeFilterCount={activeFilterCount}
              onOpenFilters={() => setFiltersOpen(true)}
            />

            {storageLocationsQuery.isLoading ? (
              <View style={styles.locationsStatusRow}>
                <ActivityIndicator size="small" color={colors.brand} />
                <Text style={styles.locationsStatusText}>{t("storage.loading")}</Text>
              </View>
            ) : null}

            {storageLocationsQuery.isError ? (
              <View style={styles.locationsStatusRow}>
                <Text style={styles.locationsStatusText}>{t("storage.errorSubtitle")}</Text>
              </View>
            ) : null}

            {inventoryQuery.isError ? (
              <View style={styles.locationsStatusRow}>
                <Text style={styles.locationsStatusText}>{t("dashboard.kitchen.error")}</Text>
              </View>
            ) : null}
          </>
        }
        ListEmptyComponent={
          isInventoryLoading ? (
            <KitchenItemsSkeleton />
          ) : (
            <PantryEmptyState
              title={t("dashboard.kitchen.empty.title")}
              subtitle={t("dashboard.kitchen.empty.subtitle")}
            />
          )
        }
        ListFooterComponent={
          inventoryQuery.isFetchingNextPage ? (
            <View style={styles.footerLoading}>
              <ActivityIndicator size="small" color={colors.brand} />
            </View>
          ) : (
            <View style={styles.footerSpacer} />
          )
        }
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
      />

      <KitchenFilterSheet
        visible={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title={t("dashboard.kitchen.filters.title")}
        clearLabel={t("dashboard.kitchen.filters.clearAll")}
        statusLabel={t("dashboard.kitchen.filters.status")}
        locationLabel={t("dashboard.kitchen.filters.location")}
        activeFilterCount={activeFilterCount}
        statusOptions={statusOptions}
        activeStatus={selectedStatus}
        onSelectStatus={setSelectedStatus}
        locationOptions={locationFilters}
        activeLocation={selectedLocation}
        onSelectLocation={setSelectedLocation}
        onClearAll={() => {
          setSelectedLocation("all");
          setSelectedStatus("all");
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
    flexGrow: 1,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.brand,
    marginTop: 4,
  },
  locationsStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: -4,
    marginBottom: 18,
  },
  locationsStatusText: {
    flex: 1,
    fontFamily: fonts.sans,
    fontSize: 12,
    lineHeight: 18,
    color: colors.muted,
  },
  itemSeparator: {
    height: 12,
  },
  footerLoading: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  footerSpacer: {
    height: 20,
  },
});
