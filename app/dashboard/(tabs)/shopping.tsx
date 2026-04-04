import { KitchenScreenHeader, SectionEyebrow } from "@/components/dashboard/shared";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import { useShoppingState } from "@/stores/shoppingStore";
import { Feather } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ShoppingTab() {
  const { t } = useI18n();
  const {
    showAdding,
    newItemName,
    showBought,
    boughtItems,
    groupedItems,
    getItemName,
    getReasonLabel,
    getCategoryLabel,
    subtitle,
    toggleBought,
    removeItem,
    openAdding,
    closeAdding,
    addItem,
    setNewItemName,
    toggleBoughtVisibility,
  } = useShoppingState();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <KitchenScreenHeader
          title={t("kitchen.shopping.title")}
          subtitle={subtitle}
          rightAction={
            <TouchableOpacity style={styles.addBtn} activeOpacity={0.75} onPress={openAdding}>
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
              onPress={closeAdding}
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
                <SectionEyebrow>{getCategoryLabel(group.category)}</SectionEyebrow>
                <View style={styles.groupCard}>
                  {group.items.map((item, index) => (
                    <View key={item.id} style={[styles.itemRow, index > 0 && styles.itemRowBorder]}>
                      <TouchableOpacity style={styles.checkCircle} activeOpacity={0.75} onPress={() => toggleBought(item.id)} />
                      <View style={styles.itemCopy}>
                        <Text style={styles.itemName}>{getItemName(item)}</Text>
                        {item.suggested && item.reason ? (
                          <Text style={styles.itemReason}>{getReasonLabel(item.reason)}</Text>
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
              onPress={toggleBoughtVisibility}
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
                    <Text style={styles.boughtItem}>{getItemName(item)}</Text>
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
