import {
  getLocationLabel,
  getRecipeName,
  getShoppingCategoryLabel,
  type KitchenLocationId,
  type RecipeId,
  type ShoppingCategoryId,
} from "@/components/kitchen/data";
import { KitchenScreenHeader, SectionEyebrow } from "@/components/kitchen/shared";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import type { TranslationKey } from "@/i18n/messages";
import { Feather } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ShoppingReason =
  | { kind: "recipe"; recipeId: RecipeId }
  | { kind: "runningLow"; locationId: Exclude<KitchenLocationId, "all" | "other"> }
  | { kind: "almostEmpty"; locationId: Exclude<KitchenLocationId, "all" | "other"> };

type ShoppingItem = {
  id: string;
  name?: string;
  nameKey?: TranslationKey;
  category: ShoppingCategoryId;
  suggested: boolean;
  reason?: ShoppingReason;
  bought: boolean;
};

const INITIAL_ITEMS: ShoppingItem[] = [
  {
    id: "1",
    nameKey: "kitchen.items.avocado",
    category: "fresh",
    suggested: true,
    reason: { kind: "recipe", recipeId: "avocadoEggsToast" },
    bought: false,
  },
  {
    id: "2",
    nameKey: "kitchen.items.sourdoughBread",
    category: "bakery",
    suggested: true,
    reason: { kind: "recipe", recipeId: "avocadoEggsToast" },
    bought: false,
  },
  {
    id: "3",
    nameKey: "kitchen.items.beefMince500g",
    category: "meat",
    suggested: true,
    reason: { kind: "recipe", recipeId: "spaghettiBolognese" },
    bought: false,
  },
  {
    id: "4",
    nameKey: "kitchen.items.milkSemiSkimmed",
    category: "dairy",
    suggested: true,
    reason: { kind: "runningLow", locationId: "fridge" },
    bought: false,
  },
  {
    id: "5",
    nameKey: "kitchen.items.paprika",
    category: "spices",
    suggested: true,
    reason: { kind: "almostEmpty", locationId: "spiceRack" },
    bought: false,
  },
];

const CATEGORY_ORDER: ShoppingCategoryId[] = [
  "fresh",
  "meat",
  "dairy",
  "bakery",
  "dryGoods",
  "spices",
  "other",
];

function getItemName(t: ReturnType<typeof useI18n>["t"], item: ShoppingItem) {
  if (item.name) {
    return item.name;
  }

  return item.nameKey ? t(item.nameKey) : "";
}

function getReasonLabel(
  t: ReturnType<typeof useI18n>["t"],
  reason: ShoppingReason | undefined,
) {
  if (!reason) {
    return "";
  }

  switch (reason.kind) {
    case "recipe":
      return t("kitchen.shopping.reason.forRecipe", {
        recipe: getRecipeName(t, reason.recipeId),
      });
    case "runningLow":
      return t("kitchen.shopping.reason.runningLow", {
        location: getLocationLabel(t, reason.locationId),
      });
    case "almostEmpty":
      return t("kitchen.shopping.reason.almostEmpty", {
        location: getLocationLabel(t, reason.locationId),
      });
  }
}

export default function ShoppingTab() {
  const { t } = useI18n();
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
    [unboughtItems],
  );

  const toggleBought = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, bought: !item.bought } : item)));
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const addItem = () => {
    const trimmed = newItemName.trim();

    if (!trimmed) {
      return;
    }

    setItems((prev) => [
      ...prev,
      { id: `custom-${Date.now()}`, name: trimmed, category: "other", suggested: false, bought: false },
    ]);
    setNewItemName("");
    setShowAdding(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <KitchenScreenHeader
          title={t("kitchen.shopping.title")}
          subtitle={t("kitchen.shopping.subtitle", { count: unboughtItems.length })}
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
              placeholder={t("kitchen.shopping.addPlaceholder")}
              placeholderTextColor={colors.muted}
              style={styles.addInput}
              autoFocus
            />
            <TouchableOpacity style={styles.addConfirm} activeOpacity={0.75} onPress={addItem}>
              <Text style={styles.addConfirmText}>{t("kitchen.shopping.addButton")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeBtn}
              activeOpacity={0.75}
              onPress={() => {
                setShowAdding(false);
                setNewItemName("");
              }}
            >
              <Feather name="x" size={18} color={colors.muted} />
            </TouchableOpacity>
          </View>
        ) : null}

        {groupedItems.length === 0 && !showAdding ? (
          <View style={styles.emptyState}>
            <Feather name="shopping-cart" size={36} color={colors.border} />
            <Text style={styles.emptyTitle}>{t("kitchen.shopping.empty.title")}</Text>
            <Text style={styles.emptySubtitle}>{t("kitchen.shopping.empty.subtitle")}</Text>
          </View>
        ) : (
          <View style={styles.groupList}>
            {groupedItems.map((group) => (
              <View key={group.category}>
                <SectionEyebrow>{getShoppingCategoryLabel(t, group.category)}</SectionEyebrow>
                <View style={styles.groupCard}>
                  {group.items.map((item, index) => (
                    <View key={item.id} style={[styles.itemRow, index > 0 && styles.itemRowBorder]}>
                      <TouchableOpacity style={styles.checkCircle} activeOpacity={0.75} onPress={() => toggleBought(item.id)} />
                      <View style={styles.itemCopy}>
                        <Text style={styles.itemName}>{getItemName(t, item)}</Text>
                        {item.suggested && item.reason ? (
                          <Text style={styles.itemReason}>{getReasonLabel(t, item.reason)}</Text>
                        ) : null}
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
            <TouchableOpacity
              style={styles.boughtToggle}
              activeOpacity={0.75}
              onPress={() => setShowBought((value) => !value)}
            >
              <Text style={styles.boughtToggleText}>
                {t("kitchen.shopping.boughtToggle", { count: boughtItems.length })}
              </Text>
              <Feather name={showBought ? "chevron-up" : "chevron-down"} size={14} color={colors.muted} />
            </TouchableOpacity>
            {showBought ? (
              <View style={styles.groupCard}>
                {boughtItems.map((item, index) => (
                  <View key={item.id} style={[styles.itemRow, index > 0 && styles.itemRowBorder]}>
                    <TouchableOpacity
                      style={styles.checkCircleFilled}
                      activeOpacity={0.75}
                      onPress={() => toggleBought(item.id)}
                    >
                      <Feather name="check" size={11} color={colors.background} />
                    </TouchableOpacity>
                    <Text style={styles.boughtItem}>{getItemName(t, item)}</Text>
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
