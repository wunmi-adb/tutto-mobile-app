import Button from "@/components/ui/Button";
import KeyboardAvoidingContainer from "@/components/ui/KeyboardAvoidingContainer";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import { CapturedInventoryItem } from "@/lib/api/item-capture";
import { Feather } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export type DetectedItem = CapturedInventoryItem;

type Props = {
  storageName: string;
  initialItems: DetectedItem[];
  onContinue: (items: DetectedItem[]) => void;
  onSaveAll: (items: DetectedItem[]) => Promise<void> | void;
  onBack: () => void;
  savingAll?: boolean;
};

export default function ReviewItemsView({
  storageName,
  initialItems,
  onContinue,
  onSaveAll,
  onBack,
  savingAll = false,
}: Props) {
  const { t } = useI18n();
  const [items, setItems] = useState<DetectedItem[]>(initialItems);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [confirmingDelete, setConfirmingDelete] = useState<number | null>(null);
  const inputRef = useRef<TextInput>(null);

  const startEdit = (index: number) => {
    setConfirmingDelete(null);
    setEditingIndex(index);
    setEditValue(items[index].name);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const saveEdit = () => {
    if (editingIndex === null) return;
    const trimmed = editValue.trim();
    if (trimmed) {
      setItems((prev) =>
        prev.map((item, i) => (i === editingIndex ? { ...item, name: trimmed } : item))
      );
    }
    setEditingIndex(null);
  };

  const handleDeletePress = (index: number) => {
    if (editingIndex !== null) {
      saveEdit();
      return;
    }
    if (confirmingDelete === index) {
      setItems((prev) => prev.filter((_, i) => i !== index));
      setConfirmingDelete(null);
    } else {
      setConfirmingDelete(index);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={onBack}>
          <Feather name="arrow-left" size={16} color={colors.text} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingContainer style={styles.keyboard}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
        <View style={styles.locationBadge}>
          <Feather name="map-pin" size={11} color={colors.muted} />
          <Text style={styles.locationText}>{storageName}</Text>
        </View>

        <View style={styles.headingBlock}>
          <Text style={styles.title}>
            {t(
              items.length === 1
                ? "addItems.review.found.singular"
                : "addItems.review.found.plural",
              { count: items.length },
            )}
          </Text>
          <Text style={styles.subtitle}>{t("addItems.review.subtitle")}</Text>
        </View>

        <View style={styles.list}>
          {items.map((item, index) => {
            const isEditing = editingIndex === index;
            const isConfirming = confirmingDelete === index;

            if (isEditing) {
              return (
                <View key={index} style={[styles.row, styles.rowEditing]}>
                  <TextInput
                    ref={inputRef}
                    style={styles.input}
                    value={editValue}
                    onChangeText={setEditValue}
                    onSubmitEditing={saveEdit}
                    returnKeyType="done"
                    autoCapitalize="words"
                    selectTextOnFocus
                  />
                  <TouchableOpacity
                    style={styles.checkBtn}
                    activeOpacity={0.8}
                    onPress={saveEdit}
                  >
                    <Feather name="check" size={14} color={colors.background} />
                  </TouchableOpacity>
                </View>
              );
            }

            return (
              <View key={index} style={styles.row}>
                <View style={styles.indexBubble}>
                  <Text style={styles.indexBubbleText}>{index + 1}</Text>
                </View>
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.name}
                </Text>

                <View style={styles.actions}>
                  {!isConfirming && (
                    <TouchableOpacity
                      style={styles.iconBtn}
                      activeOpacity={0.7}
                      onPress={() => startEdit(index)}
                    >
                      <Feather name="edit-2" size={13} color={colors.muted} />
                    </TouchableOpacity>
                  )}

                  {isConfirming ? (
                    <View style={styles.confirmRow}>
                      <TouchableOpacity
                        style={styles.iconBtn}
                        activeOpacity={0.7}
                        onPress={() => setConfirmingDelete(null)}
                      >
                        <Feather name="x" size={14} color={colors.muted} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.removeBtn}
                        activeOpacity={0.8}
                        onPress={() => handleDeletePress(index)}
                      >
                        <Text style={styles.removeBtnText}>{t("addItems.review.remove")}</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.iconBtn}
                      activeOpacity={0.7}
                      onPress={() => handleDeletePress(index)}
                    >
                      <Feather name="x" size={14} color={colors.muted} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}

          {items.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>{t("addItems.review.empty")}</Text>
            </View>
          )}
        </View>
        </ScrollView>

        <View style={styles.ctaBlock}>
          <Button
            title={
              items.length > 0
                ? t(
                    items.length === 1
                      ? "addItems.review.saveAll.singular"
                      : "addItems.review.saveAll.plural",
                    { count: items.length },
                  )
                : t("addItems.review.saveAll.empty")
            }
            leftIcon={<Feather name="check-circle" size={18} color={colors.background} />}
            disabled={items.length === 0}
            loading={savingAll}
            onPress={() => {
              void onSaveAll(items);
            }}
            style={styles.ctaButton}
          />

          <Button
            title={t("addItems.review.reviewEach")}
            variant="secondary"
            leftIcon={<Feather name="list" size={18} color={colors.text} />}
            disabled={items.length === 0 || savingAll}
            onPress={() => onContinue(items)}
            style={styles.ctaButton}
          />

          <Text style={styles.reviewHint}>{t("addItems.review.reviewHint")}</Text>
        </View>
      </KeyboardAvoidingContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboard: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 8,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 24,
  },
  locationBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: colors.secondary,
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 20,
  },
  locationText: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    letterSpacing: 0.4,
    color: colors.muted,
  },
  headingBlock: {
    marginBottom: 24,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 36,
    lineHeight: 40,
    color: colors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.muted,
    lineHeight: 21,
    letterSpacing: 0.2,
  },
  list: {
    gap: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  rowEditing: {
    borderColor: colors.text + "4d",
    backgroundColor: colors.text + "05",
  },
  indexBubble: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.brand + "14",
  },
  indexBubbleText: {
    fontFamily: fonts.sansBold,
    fontSize: 12,
    color: colors.brand,
  },
  input: {
    flex: 1,
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.text,
    padding: 0,
  },
  checkBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.text,
    alignItems: "center",
    justifyContent: "center",
  },
  itemName: {
    flex: 1,
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.text,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  iconBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  removeBtn: {
    borderRadius: 8,
    backgroundColor: colors.text,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  removeBtnText: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.background,
  },
  emptyState: {
    paddingVertical: 48,
    alignItems: "center",
  },
  emptyText: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.muted,
  },
  ctaBlock: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border + "80",
    gap: 12,
  },
  ctaButton: {
    marginTop: 0,
  },
  reviewHint: {
    marginTop: 12,
    textAlign: "center",
    fontFamily: fonts.sans,
    fontSize: 12,
    lineHeight: 18,
    color: colors.muted,
  },
});
