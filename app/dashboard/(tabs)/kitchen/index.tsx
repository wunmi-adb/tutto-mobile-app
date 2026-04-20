import KitchenAddItemRow from "@/components/dashboard/kitchen/KitchenAddItemRow";
import KitchenDetailSheet from "@/components/dashboard/kitchen/KitchenDetailSheet";
import KitchenHeader from "@/components/dashboard/kitchen/KitchenHeader";
import KitchenInventoryRow from "@/components/dashboard/kitchen/KitchenInventoryRow";
import KitchenItemsSkeleton from "@/components/dashboard/kitchen/KitchenItemsSkeleton";
import PantryEmptyState from "@/components/dashboard/kitchen/PantryEmptyState";
import BottomSheet from "@/components/ui/BottomSheet";
import Button from "@/components/ui/Button";
import HapticPressable from "@/components/ui/HapticPressable";
import SegmentedTabs from "@/components/ui/SegmentedTabs";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { handleCaughtApiError } from "@/lib/api/handle-caught-api-error";
import { type KitchenItem, useCreateInventoryItems, useDeleteInventoryItem, useKitchenItems } from "@/lib/api/items";
import { Feather } from "@expo/vector-icons";
import { usePantryPalKitchenState } from "@/stores/pantryPalKitchenStore";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type KitchenListItem = KitchenItem & {
  categoryName: string;
  effectiveAvailable: boolean;
  effectiveName: string;
};

type KitchenGroup = {
  title: string;
  items: KitchenListItem[];
};

function getCategoryName(item: KitchenItem) {
  return item.category?.name?.trim() || "Uncategorised";
}

function sortKitchenItems(items: KitchenListItem[]) {
  return [...items].sort((left, right) => left.effectiveName.localeCompare(right.effectiveName));
}

function sortKitchenGroups(groups: KitchenGroup[]) {
  return [...groups].sort((left, right) => {
    if (left.title === "Uncategorised") {
      return 1;
    }

    if (right.title === "Uncategorised") {
      return -1;
    }

    return left.title.localeCompare(right.title);
  });
}

function groupKitchenItems(items: KitchenListItem[]) {
  const groups = new Map<string, KitchenListItem[]>();

  for (const item of items) {
    const existing = groups.get(item.categoryName) ?? [];
    existing.push(item);
    groups.set(item.categoryName, existing);
  }

  return sortKitchenGroups(
    Array.from(groups.entries()).map(([title, groupedItems]) => ({
      title,
      items: sortKitchenItems(groupedItems),
    })),
  );
}

export default function KitchenScreen() {
  const router = useRouter();
  const { activeTab, setActiveTab } = usePantryPalKitchenState();
  const createInventoryItemsMutation = useCreateInventoryItems();
  const deleteInventoryItemMutation = useDeleteInventoryItem();
  const availableKitchenItemsQuery = useKitchenItems("available");
  const unavailableKitchenItemsQuery = useKitchenItems("unavailable");
  const [availabilityOverrides, setAvailabilityOverrides] = useState<Record<string, boolean>>({});
  const [nameOverrides, setNameOverrides] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showAdding, setShowAdding] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [selectedItemKey, setSelectedItemKey] = useState<string | null>(null);

  const allItems = useMemo(() => {
    const byKey = new Map<string, KitchenItem>();

    for (const item of availableKitchenItemsQuery.data ?? []) {
      byKey.set(item.key, item);
    }

    for (const item of unavailableKitchenItemsQuery.data ?? []) {
      byKey.set(item.key, item);
    }

    return sortKitchenItems(
      Array.from(byKey.values()).map((item) => ({
        ...item,
        categoryName: getCategoryName(item),
        effectiveAvailable: availabilityOverrides[item.key] ?? item.available,
        effectiveName: nameOverrides[item.key] ?? item.name,
      })),
    );
  }, [
    availabilityOverrides,
    availableKitchenItemsQuery.data,
    nameOverrides,
    unavailableKitchenItemsQuery.data,
  ]);

  const filteredItems = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return allItems;
    }

    return allItems.filter((item) => item.effectiveName.toLowerCase().includes(normalizedSearch));
  }, [allItems, search]);

  const totalHaveItems = useMemo(
    () => allItems.filter((item) => item.effectiveAvailable),
    [allItems],
  );

  const totalNeedItems = useMemo(
    () => allItems.filter((item) => !item.effectiveAvailable),
    [allItems],
  );

  const haveItems = useMemo(
    () => filteredItems.filter((item) => item.effectiveAvailable),
    [filteredItems],
  );

  const needItems = useMemo(
    () => filteredItems.filter((item) => !item.effectiveAvailable),
    [filteredItems],
  );

  const tabOptions = useMemo(
    () => [
      {
        value: "have" as const,
        label: "You have",
        badge: haveItems.length,
        icon: ({ color }: { active: boolean; color: string }) => (
          <Feather name="package" size={13} color={color} />
        ),
      },
      {
        value: "need" as const,
        label: "To buy",
        badge: needItems.length,
        icon: ({ color }: { active: boolean; color: string }) => (
          <Feather name="shopping-bag" size={13} color={color} />
        ),
      },
    ],
    [haveItems.length, needItems.length],
  );

  const activeItems = activeTab === "have" ? haveItems : needItems;
  const activeTabItemCount = activeTab === "have" ? totalHaveItems.length : totalNeedItems.length;
  const groupedActiveItems = useMemo(() => groupKitchenItems(activeItems), [activeItems]);
  const activeItemsQuery = activeTab === "have" ? availableKitchenItemsQuery : unavailableKitchenItemsQuery;
  const searchDisabled = activeTabItemCount === 0;
  const selectedItem = useMemo(
    () => allItems.find((item) => item.key === selectedItemKey) ?? null,
    [allItems, selectedItemKey],
  );

  const handleManualAdd = useCallback(async () => {
    const trimmedName = newItemName.trim();

    if (!trimmedName || createInventoryItemsMutation.isPending) {
      return;
    }

    try {
      await createInventoryItemsMutation.mutateAsync({
        available: activeTab === "have",
        items: [trimmedName],
      });
      setNewItemName("");
      setShowAdding(false);
      setShowAddMenu(false);
    } catch (error) {
      handleCaughtApiError(error);
    }
  }, [activeTab, createInventoryItemsMutation, newItemName]);

  const handleToggleAvailability = useCallback((itemKey: string) => {
    const currentItem = allItems.find((item) => item.key === itemKey);

    if (!currentItem) {
      return;
    }

    setAvailabilityOverrides((current) => {
      return {
        ...current,
        [itemKey]: current[itemKey] == null ? !currentItem.effectiveAvailable : !current[itemKey],
      };
    });
  }, [allItems]);

  const handleRemoveSelectedItem = useCallback(async () => {
    if (!selectedItem || deleteInventoryItemMutation.isPending) {
      return;
    }

    try {
      await deleteInventoryItemMutation.mutateAsync(selectedItem.key);
      setAvailabilityOverrides((current) => {
        if (!(selectedItem.key in current)) {
          return current;
        }

        const next = { ...current };
        delete next[selectedItem.key];
        return next;
      });
      setNameOverrides((current) => {
        if (!(selectedItem.key in current)) {
          return current;
        }

        const next = { ...current };
        delete next[selectedItem.key];
        return next;
      });
      setSelectedItemKey(null);
    } catch (error) {
      handleCaughtApiError(error);
    }
  }, [deleteInventoryItemMutation, selectedItem]);

  useEffect(() => {
    if (selectedItemKey && !selectedItem) {
      setSelectedItemKey(null);
    }
  }, [selectedItem, selectedItemKey]);

  const handleOpenAddMenu = useCallback(() => {
    setShowAddMenu(true);
  }, []);

  const handleStartManualAdd = useCallback(() => {
    setShowAddMenu(false);
    setShowAdding(true);
  }, []);

  const handleStartVoiceCapture = useCallback(() => {
    setShowAddMenu(false);
    setShowAdding(false);
    router.push("/dashboard/kitchen/voice");
  }, [router]);

  const renderEmptyState = useCallback(() => {
    const iconName = activeTab === "have" ? "package" : "shopping-bag";
    const title = search.trim()
      ? "No items match your search"
      : activeTab === "have"
        ? "Nothing here yet"
        : "You've got everything";
    const subtitle = search.trim()
      ? "Try another keyword or clear the search to see everything again."
      : activeTab === "have"
        ? "Tap Add items to start building your kitchen."
        : "Your shopping side is clear for now.";

    return (
      <View style={styles.emptyState}>
        <Feather name={iconName} size={30} color={`${colors.muted}44`} />
        <Text style={styles.emptyTitle}>{title}</Text>
        <Text style={styles.emptySubtitle}>{subtitle}</Text>
      </View>
    );
  }, [activeTab, search]);

  const renderContent = () => {
    if ((availableKitchenItemsQuery.isPending || unavailableKitchenItemsQuery.isPending) && allItems.length === 0) {
      return <KitchenItemsSkeleton />;
    }

    if ((activeItemsQuery.isError || availableKitchenItemsQuery.isError || unavailableKitchenItemsQuery.isError) && allItems.length === 0) {
      return (
        <View style={styles.feedbackBlock}>
          <PantryEmptyState
            title="We couldn't load your kitchen"
            subtitle="Pull to retry isn't available here yet, but you can try again now."
          />
          <Button
            title="Try again"
            variant="secondary"
            style={styles.retryButton}
            onPress={() => {
              void activeItemsQuery.refetch();
              void availableKitchenItemsQuery.refetch();
              void unavailableKitchenItemsQuery.refetch();
            }}
          />
        </View>
      );
    }

    if (activeItems.length === 0) {
      return renderEmptyState();
    }

    return (
      <View style={styles.groupList}>
        {groupedActiveItems.map((group) => (
          <View key={group.title} style={styles.groupSection}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            <View style={styles.groupRows}>
              {group.items.map((item) => (
                <KitchenInventoryRow
                  key={item.key}
                  name={item.effectiveName}
                  isAvailable={item.effectiveAvailable}
                  subtitle={activeTab === "need" ? "Shopping list" : null}
                  onToggleAvailability={() => handleToggleAvailability(item.key)}
                  onOpenActions={() => setSelectedItemKey(item.key)}
                />
              ))}
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <KitchenHeader
          haveCount={haveItems.length}
          needCount={needItems.length}
          onPressAdd={handleOpenAddMenu}
        />

        <SegmentedTabs
          options={tabOptions}
          value={activeTab}
          onChange={setActiveTab}
          backgroundColor={colors.secondary}
          activeBackgroundColor={colors.background}
          inactiveTextColor={colors.muted}
          activeTextColor={colors.text}
          containerStyle={styles.segmentedTabs}
          tabStyle={styles.segmentedTab}
          indicatorStyle={styles.segmentedIndicator}
        />

        <View style={[styles.searchBox, searchDisabled && styles.searchBoxDisabled]}>
          <Feather name="search" size={16} color={searchDisabled ? `${colors.muted}66` : `${colors.muted}bb`} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            editable={!searchDisabled}
            placeholder="Search items..."
            placeholderTextColor={searchDisabled ? `${colors.muted}66` : `${colors.muted}99`}
            style={styles.searchInput}
            returnKeyType="search"
          />
        </View>

        {showAdding ? (
          <View style={styles.addRowWrap}>
            <KitchenAddItemRow
              value={newItemName}
              loading={createInventoryItemsMutation.isPending}
              onChangeText={setNewItemName}
              onSubmit={() => {
                void handleManualAdd();
              }}
              onClose={() => {
                setShowAdding(false);
                setNewItemName("");
              }}
            />
          </View>
        ) : null}

        {renderContent()}
      </ScrollView>

      <BottomSheet
        visible={showAddMenu}
        onClose={() => setShowAddMenu(false)}
        sheetStyle={styles.addSheetFrame}
        contentStyle={styles.addSheetContent}
      >
        <View style={styles.addSheetHeader}>
          <Text style={styles.addSheetTitle}>Add items</Text>
          <Text style={styles.addSheetSubtitle}>
            Choose how you want to update your kitchen.
          </Text>
        </View>

        <HapticPressable style={styles.sheetAction} pressedOpacity={0.9} onPress={handleStartManualAdd}>
          <View style={styles.sheetActionIcon}>
            <Feather name="type" size={18} color={colors.text} />
          </View>
          <View style={styles.sheetActionCopy}>
            <Text style={styles.sheetActionTitle}>Type manually</Text>
            <Text style={styles.sheetActionSubtitle}>Add one item at a time</Text>
          </View>
        </HapticPressable>

        <HapticPressable style={styles.sheetAction} pressedOpacity={0.9} onPress={handleStartVoiceCapture}>
          <View style={[styles.sheetActionIcon, styles.sheetActionIconAccent]}>
            <Feather name="mic" size={18} color={colors.brand} />
          </View>
          <View style={styles.sheetActionCopy}>
            <Text style={styles.sheetActionTitle}>Voice capture</Text>
            <Text style={styles.sheetActionSubtitle}>Speak your list and review it before saving</Text>
          </View>
        </HapticPressable>

        <HapticPressable
          style={styles.sheetCancelButton}
          pressedOpacity={0.9}
          onPress={() => setShowAddMenu(false)}
        >
          <Text style={styles.sheetCancelText}>Cancel</Text>
        </HapticPressable>
      </BottomSheet>

      <KitchenDetailSheet
        visible={!!selectedItem}
        itemName={selectedItem?.effectiveName ?? ""}
        onClose={() => setSelectedItemKey(null)}
        onRename={(nextName) => {
          if (!selectedItem) {
            return;
          }

          setNameOverrides((current) => ({
            ...current,
            [selectedItem.key]: nextName,
          }));
        }}
        onRemove={() => {
          void handleRemoveSelectedItem();
        }}
        removing={deleteInventoryItemMutation.isPending}
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
    paddingBottom: 36,
    gap: 16,
  },
  feedbackBlock: {
    gap: 12,
  },
  retryButton: {
    marginTop: 0,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: colors.background,
  },
  searchBoxDisabled: {
    opacity: 0.55,
  },
  searchInput: {
    flex: 1,
    padding: 0,
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.text,
  },
  addRowWrap: {
    marginTop: -2,
  },
  segmentedTabs: {
    borderRadius: 14,
  },
  segmentedTab: {
    minHeight: 42,
    borderRadius: 10,
  },
  segmentedIndicator: {
    borderRadius: 10,
    shadowColor: "#1a1208",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  groupList: {
    gap: 18,
  },
  groupSection: {
    gap: 8,
  },
  groupTitle: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    letterSpacing: 1,
    color: colors.muted,
    textTransform: "uppercase",
  },
  groupRows: {
    gap: 8,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 52,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    marginTop: 12,
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.muted,
  },
  emptySubtitle: {
    marginTop: 4,
    fontFamily: fonts.sans,
    fontSize: 12,
    lineHeight: 18,
    color: `${colors.muted}aa`,
    textAlign: "center",
  },
  addSheetFrame: {
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  addSheetContent: {
    paddingHorizontal: 20,
    paddingTop: 6,
  },
  addSheetHeader: {
    paddingTop: 8,
    paddingBottom: 18,
  },
  addSheetTitle: {
    fontFamily: fonts.serif,
    fontSize: 26,
    lineHeight: 28,
    letterSpacing: -0.2,
    color: colors.text,
  },
  addSheetSubtitle: {
    marginTop: 6,
    fontFamily: fonts.sans,
    fontSize: 13,
    lineHeight: 19,
    color: colors.muted,
  },
  sheetAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    backgroundColor: colors.background,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 10,
  },
  sheetActionIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  sheetActionIconAccent: {
    backgroundColor: `${colors.brand}14`,
  },
  sheetActionCopy: {
    flex: 1,
    minWidth: 0,
  },
  sheetActionTitle: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.text,
  },
  sheetActionSubtitle: {
    marginTop: 2,
    fontFamily: fonts.sans,
    fontSize: 12,
    lineHeight: 17,
    color: colors.muted,
  },
  sheetCancelButton: {
    marginTop: 6,
    marginBottom: 4,
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  sheetCancelText: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.text,
  },
});
