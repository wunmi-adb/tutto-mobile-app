import { KitchenScreenHeader, SectionEyebrow } from "@/components/kitchen/shared";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { Feather } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ShoppingItem = {
  id: string;
  name: string;
  category: string;
  suggested: boolean;
  reason?: string;
  bought: boolean;
};

const INITIAL_ITEMS: ShoppingItem[] = [
  { id: "1", name: "Avocado", category: "Fresh", suggested: true, reason: "For Avocado & Eggs on Toast", bought: false },
  { id: "2", name: "Sourdough bread", category: "Bakery", suggested: true, reason: "For Avocado & Eggs on Toast", bought: false },
  { id: "3", name: "Beef mince (500g)", category: "Meat", suggested: true, reason: "For Spaghetti Bolognese", bought: false },
  { id: "4", name: "Milk (semi-skimmed)", category: "Dairy", suggested: true, reason: "Running low in Fridge", bought: false },
  { id: "5", name: "Paprika", category: "Spices", suggested: true, reason: "Almost empty in Spice Rack", bought: false },
];

const CATEGORY_ORDER = ["Fresh", "Meat", "Dairy", "Bakery", "Dry goods", "Spices", "Other"];

export default function ShoppingTab() {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [showAdding, setShowAdding] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [showBought, setShowBought] = useState(false);

  const unboughtItems = items.filter((item) => !item.bought);
  const boughtItems = items.filter((item) => item.bought);

  const groupedItems = useMemo(
    () =>
      CATEGORY_ORDER.map((category) => ({
        category,
        items: unboughtItems.filter((item) => item.category === category),
      })).filter((group) => group.items.length > 0),
    [unboughtItems]
  );

  const toggleBought = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, bought: !item.bought } : item)));
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const addItem = () => {
    const trimmed = newItemName.trim();
    if (!trimmed) return;
    setItems((prev) => [
      ...prev,
      { id: `custom-${Date.now()}`, name: trimmed, category: "Other", suggested: false, bought: false },
    ]);
    setNewItemName("");
    setShowAdding(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <KitchenScreenHeader
          title="Shopping List"
          subtitle={`${unboughtItems.length} items to buy`}
          rightAction={
            <TouchableOpacity style={styles.addBtn} activeOpacity={0.75} onPress={() => setShowAdding(true)}>
              <Feather name="plus" size={16} color={colors.background} />
            </TouchableOpacity>
          }
        />

        {showAdding ? (
          <View style={styles.addRow}>
            <TextInput
              value={newItemName}
              onChangeText={setNewItemName}
              placeholder="Add an item..."
              placeholderTextColor={colors.muted}
              style={styles.addInput}
              autoFocus
            />
            <TouchableOpacity style={styles.addConfirm} activeOpacity={0.75} onPress={addItem}>
              <Text style={styles.addConfirmText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeBtn} activeOpacity={0.75} onPress={() => { setShowAdding(false); setNewItemName(""); }}>
              <Feather name="x" size={18} color={colors.muted} />
            </TouchableOpacity>
          </View>
        ) : null}

        {groupedItems.length === 0 && !showAdding ? (
          <View style={styles.emptyState}>
            <Feather name="shopping-cart" size={36} color={colors.border} />
            <Text style={styles.emptyTitle}>All done!</Text>
            <Text style={styles.emptySubtitle}>Your shopping list is empty.</Text>
          </View>
        ) : (
          <View style={styles.groupList}>
            {groupedItems.map((group) => (
              <View key={group.category}>
                <SectionEyebrow>{group.category}</SectionEyebrow>
                <View style={styles.groupCard}>
                  {group.items.map((item, index) => (
                    <View key={item.id} style={[styles.itemRow, index > 0 && styles.itemRowBorder]}>
                      <TouchableOpacity style={styles.checkCircle} activeOpacity={0.75} onPress={() => toggleBought(item.id)} />
                      <View style={styles.itemCopy}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        {item.suggested && item.reason ? <Text style={styles.itemReason}>{item.reason}</Text> : null}
                      </View>
                      {!item.suggested ? (
                        <TouchableOpacity activeOpacity={0.75} onPress={() => removeItem(item.id)}>
                          <Feather name="x" size={14} color={colors.muted} />
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {boughtItems.length > 0 ? (
          <View style={styles.boughtSection}>
            <TouchableOpacity style={styles.boughtToggle} activeOpacity={0.75} onPress={() => setShowBought((value) => !value)}>
              <Text style={styles.boughtToggleText}>Bought ({boughtItems.length})</Text>
              <Feather name={showBought ? "chevron-up" : "chevron-down"} size={14} color={colors.muted} />
            </TouchableOpacity>
            {showBought ? (
              <View style={styles.groupCard}>
                {boughtItems.map((item, index) => (
                  <View key={item.id} style={[styles.itemRow, index > 0 && styles.itemRowBorder]}>
                    <TouchableOpacity style={styles.checkCircleFilled} activeOpacity={0.75} onPress={() => toggleBought(item.id)}>
                      <Feather name="check" size={11} color={colors.background} />
                    </TouchableOpacity>
                    <Text style={styles.boughtItem}>{item.name}</Text>
                    <TouchableOpacity activeOpacity={0.75} onPress={() => removeItem(item.id)}>
                      <Feather name="x" size={14} color={colors.muted} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 32 },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.brand,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  addRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 16 },
  addInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.text,
  },
  addConfirm: { backgroundColor: colors.text, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12 },
  addConfirmText: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.background },
  closeBtn: { padding: 4 },
  emptyState: { paddingVertical: 80, alignItems: "center" },
  emptyTitle: { marginTop: 12, fontFamily: fonts.sansMedium, fontSize: 14, color: colors.text },
  emptySubtitle: { marginTop: 4, fontFamily: fonts.sans, fontSize: 12, color: colors.muted },
  groupList: { gap: 18 },
  groupCard: { borderRadius: 16, borderWidth: 1, borderColor: colors.border, overflow: "hidden" },
  itemRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingVertical: 14 },
  itemRowBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  checkCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.border },
  checkCircleFilled: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.text, alignItems: "center", justifyContent: "center" },
  itemCopy: { flex: 1 },
  itemName: { fontFamily: fonts.sans, fontSize: 15, color: colors.text },
  itemReason: { marginTop: 3, fontFamily: fonts.sans, fontSize: 11, color: colors.muted },
  boughtSection: { marginTop: 20 },
  boughtToggle: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 10 },
  boughtToggleText: { fontFamily: fonts.sansMedium, fontSize: 11, letterSpacing: 1, color: colors.muted, textTransform: "uppercase" },
  boughtItem: { flex: 1, fontFamily: fonts.sans, fontSize: 15, color: colors.muted, textDecorationLine: "line-through" },
});
