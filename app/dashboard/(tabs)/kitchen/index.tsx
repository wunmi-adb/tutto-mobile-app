import KitchenFilterSheet from "@/components/dashboard/kitchen/KitchenFilterSheet";
import PantryEmptyState from "@/components/dashboard/kitchen/PantryEmptyState";
import KitchenItemsSkeleton from "@/components/dashboard/kitchen/KitchenItemsSkeleton";
import PantryItemCard from "@/components/dashboard/kitchen/PantryItemCard";
import PantrySearchBar from "@/components/dashboard/kitchen/PantrySearchBar";
import { KitchenScreenHeader } from "@/components/dashboard/shared";
import HapticPressable from "@/components/ui/HapticPressable";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import { useKitchenState } from "@/stores/kitchenStore";
import { Feather } from "@expo/vector-icons";
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
  const { t } = useI18n();
  const {
    items,
    query,
    setQuery,
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
    openFilters,
    closeFilters,
    toggleStatus,
    toggleLocation,
    clearFilters,
  } = useKitchenState();

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
              onOpenFilters={openFilters}
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
