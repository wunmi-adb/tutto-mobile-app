import KitchenFilterSheet from "@/components/dashboard/kitchen/KitchenFilterSheet";
import PantryEmptyState from "@/components/dashboard/kitchen/PantryEmptyState";
import KitchenItemsSkeleton from "@/components/dashboard/kitchen/KitchenItemsSkeleton";
import PantryItemCard from "@/components/dashboard/kitchen/PantryItemCard";
import PantrySearchBar from "@/components/dashboard/kitchen/PantrySearchBar";
import { KitchenScreenHeader } from "@/components/dashboard/shared";
import HapticPressable from "@/components/ui/HapticPressable";
import { colors } from "@/constants/colors";
import { useI18n } from "@/i18n";
import { useKitchenState } from "@/stores/kitchenStore";
import { Feather } from "@expo/vector-icons";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function KitchenScreen() {
  const { t } = useI18n();
  const {
    items,
    query,
    setQuery,
    selectedLocation,
    selectedStatus,
    filtersOpen,
    refreshing,
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
    openFilters,
    closeFilters,
    toggleStatus,
    toggleLocation,
    clearFilters,
  } = useKitchenState();
  const hasQuery = query.trim().length > 0;
  const hasActiveFilters = activeFilterCount > 0;
  const showTrueEmptyState = !isInventoryLoading && !hasQuery && !hasActiveFilters && items.length === 0;

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
              subtitle={t(summaryKey, {
                count: items.length,
                locations: locationFilters.length,
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
              disabled={showTrueEmptyState}
              onOpenFilters={openFilters}
            />
          </>
        }
        ListEmptyComponent={
          isInventoryLoading ? (
            <KitchenItemsSkeleton />
          ) : (
            <PantryEmptyState
              title={
                showTrueEmptyState
                  ? t("dashboard.kitchen.empty.noItems")
                  : t("dashboard.kitchen.empty.title")
              }
              subtitle={showTrueEmptyState ? undefined : t("dashboard.kitchen.empty.subtitle")}
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
        onClose={closeFilters}
        title={t("dashboard.kitchen.filters.title")}
        clearLabel={t("dashboard.kitchen.filters.clearAll")}
        statusLabel={t("dashboard.kitchen.filters.status")}
        locationLabel={t("dashboard.kitchen.filters.location")}
        activeFilterCount={activeFilterCount}
        statusOptions={statusOptions}
        activeStatus={selectedStatus}
        onSelectStatus={toggleStatus}
        locationOptions={locationFilters}
        activeLocation={selectedLocation}
        onSelectLocation={toggleLocation}
        onClearAll={clearFilters}
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
