import {
  AISLE_ORDER,
} from "@/components/dashboard/kitchen/pantry-pal-data";
import KitchenAddItemRow from "@/components/dashboard/kitchen/KitchenAddItemRow";
import KitchenGroupedItemList from "@/components/dashboard/kitchen/KitchenGroupedItemList";
import KitchenHeader from "@/components/dashboard/kitchen/KitchenHeader";
import KitchenSegmentedControl from "@/components/dashboard/kitchen/KitchenSegmentedControl";
import Input from "@/components/ui/Input";
import { colors } from "@/constants/colors";
import { handleCaughtApiError } from "@/lib/api/handle-caught-api-error";
import { useCreateInventoryItems } from "@/lib/api/items";
import { usePantryPalKitchenState } from "@/stores/pantryPalKitchenStore";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function KitchenScreen() {
  const router = useRouter();
  const { activeTab, addItem, items, setActiveTab, toggleItem } = usePantryPalKitchenState();
  const createInventoryItemsMutation = useCreateInventoryItems();
  const [search, setSearch] = useState("");
  const [showAdding, setShowAdding] = useState(false);
  const [newItemName, setNewItemName] = useState("");

  const filteredItems = useMemo(
    () => items.filter((item) => item.name.toLowerCase().includes(search.trim().toLowerCase())),
    [items, search],
  );
  const haveItems = filteredItems.filter((item) => item.have);
  const needItems = filteredItems.filter((item) => !item.have);
  const activeItems = activeTab === "have" ? haveItems : needItems;

  const groupedActiveItems = useMemo(
    () =>
      AISLE_ORDER.map((aisle) => ({
        aisle,
        items: activeItems.filter((item) => (item.aisle ?? "Other") === aisle),
      })).filter((group) => group.items.length > 0),
    [activeItems],
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
      addItem(trimmedName, activeTab);
      setNewItemName("");
      setShowAdding(false);
    } catch (error) {
      handleCaughtApiError(error);
    }
  }, [activeTab, addItem, createInventoryItemsMutation, newItemName]);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <KitchenHeader
          haveCount={haveItems.length}
          needCount={needItems.length}
          onPressVoice={() => {
            setShowAdding(false);
            router.push("/dashboard/kitchen/voice");
          }}
          onPressAdd={() => setShowAdding(true)}
        />

        <KitchenSegmentedControl
          activeTab={activeTab}
          haveCount={haveItems.length}
          needCount={needItems.length}
          onChange={setActiveTab}
        />

        <View style={styles.searchBox}>
          <Input
            value={search}
            onChangeText={setSearch}
            placeholder="Search items..."
            containerStyle={styles.searchInputContainer}
          />
        </View>

        {showAdding ? (
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
        ) : null}

        <KitchenGroupedItemList
          groups={groupedActiveItems}
          activeTab={activeTab}
          search={search.trim()}
          onToggleItem={toggleItem}
        />
      </ScrollView>
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
    gap: 20,
  },
  searchBox: {
    gap: 0,
  },
  searchInputContainer: {
    flex: 1,
  },
});
