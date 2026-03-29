import Button from "@/components/ui/Button";
import KeyboardAvoidingContainer from "@/components/ui/KeyboardAvoidingContainer";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { Feather } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BatchCard from "./add-item/BatchCard";
import { Batch, ItemType, makeBatch } from "./add-item/types";

type Item = { name: string };

type Props = {
  storageName: string;
  items: Item[];
  currentIndex: number;
  completedIndices: number[];
  onFinish: () => void;
  onBack: () => void;
};

function freshBatches() {
  const b = makeBatch();
  return { batches: [b], expandedId: b.id };
}

export default function AddItemView({
  storageName,
  items,
  currentIndex: initialIndex,
  completedIndices: initialCompleted,
  onFinish,
  onBack,
}: Props) {
  const [idx, setIdx] = useState(initialIndex);
  const [completed, setCompleted] = useState(new Set(initialCompleted));

  const [itemType, setItemType] = useState<ItemType>("ingredient");
  const [itemName, setItemName] = useState(items[initialIndex]?.name ?? "");
  const [countAsUnits, setCountAsUnits] = useState(false);
  const [trackUseWithin, setTrackUseWithin] = useState(false);
  const [batches, setBatches] = useState<Batch[]>(() => [makeBatch()]);
  const [expandedId, setExpandedId] = useState(batches[0].id);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const nameInputRef = useRef<TextInput>(null);

  const updateBatch = (id: number, updates: Partial<Batch>) =>
    setBatches((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));

  const removeBatch = (id: number) => {
    setBatches((prev) => {
      const next = prev.filter((b) => b.id !== id);
      if (expandedId === id) setExpandedId(next[0]?.id ?? -1);
      return next;
    });
  };

  const addBatch = () => {
    const nb = makeBatch();
    setBatches((prev) => [...prev, nb]);
    setExpandedId(nb.id);
  };

  const switchTo = (newIdx: number, newCompleted: Set<number>) => {
    const dir = newIdx > idx ? 1 : -1;

    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 45, easing: Easing.in(Easing.ease), useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: dir * -10, duration: 45, easing: Easing.in(Easing.ease), useNativeDriver: true }),
    ]).start(() => {
      slideAnim.setValue(dir * 10);

      const { batches: nb, expandedId: ne } = freshBatches();
      setIdx(newIdx);
      setCompleted(newCompleted);
      setItemName(items[newIdx]?.name ?? "");
      setItemType("ingredient");
      setCountAsUnits(false);
      setTrackUseWithin(false);
      setBatches(nb);
      setExpandedId(ne);

      requestAnimationFrame(() => {
        Animated.parallel([
          Animated.timing(fadeAnim, { toValue: 1, duration: 80, easing: Easing.out(Easing.ease), useNativeDriver: true }),
          Animated.timing(slideAnim, { toValue: 0, duration: 80, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        ]).start(() => nameInputRef.current?.focus());
      });
    });
  };

  const handleSave = () => {
    const next = new Set(completed);
    next.add(idx);
    if (idx < items.length - 1) {
      switchTo(idx + 1, next);
    } else {
      onFinish();
    }
  };

  const isLast = idx === items.length - 1;
  const isIngredient = itemType === "ingredient";

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={onBack}>
          <Feather name="arrow-left" size={16} color={colors.text} />
        </TouchableOpacity>

        {/* Absolutely centered so it's always pixel-perfect regardless of side widths */}
        <View style={styles.headerCenter} pointerEvents="box-none">
          {items.length > 1 ? (
            <View style={styles.itemNav}>
              <TouchableOpacity
                style={[styles.navBtn, idx === 0 && styles.navBtnDisabled]}
                activeOpacity={0.7}
                disabled={idx === 0}
                onPress={() => idx > 0 && switchTo(idx - 1, completed)}
              >
                <Feather name="chevron-left" size={14} color={colors.muted} />
              </TouchableOpacity>
              <Text style={styles.navCounter}>{idx + 1} / {items.length}</Text>
              <TouchableOpacity
                style={[styles.navBtn, idx === items.length - 1 && styles.navBtnDisabled]}
                activeOpacity={0.7}
                disabled={idx === items.length - 1}
                onPress={() => idx < items.length - 1 && switchTo(idx + 1, completed)}
              >
                <Feather name="chevron-right" size={14} color={colors.muted} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.locationBadge}>
              <Feather name="map-pin" size={11} color={colors.muted} />
              <Text style={styles.locationText}>{storageName}</Text>
            </View>
          )}
        </View>

        {items.length > 1 ? (
          <View style={styles.locationBadge}>
            <Feather name="map-pin" size={11} color={colors.muted} />
            <Text style={styles.locationText}>{storageName}</Text>
          </View>
        ) : (
          <View style={styles.backBtn} />
        )}
      </View>

      {/* Animated form content */}
      <KeyboardAvoidingContainer style={styles.keyboard}>
        <Animated.View
          style={[styles.animatedContent, { opacity: fadeAnim, transform: [{ translateX: slideAnim }] }]}
        >
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
          {/* Item name */}
          <TextInput
            ref={nameInputRef}
            style={styles.nameInput}
            value={itemName}
            onChangeText={setItemName}
            placeholder={isIngredient ? "Item name" : "Meal name"}
            placeholderTextColor={colors.muted + "66"}
            autoCapitalize="words"
            returnKeyType="done"
            autoFocus
            selectionColor={colors.text}
          />

          {/* Type toggle */}
          <View style={styles.typeToggle}>
            {(["ingredient", "cooked"] as ItemType[]).map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.typeBtn, itemType === t && styles.typeBtnActive]}
                activeOpacity={0.7}
                onPress={() => setItemType(t)}
              >
                <Text style={[styles.typeBtnText, itemType === t && styles.typeBtnTextActive]}>
                  {t === "ingredient" ? "Ingredient" : "Cooked meal"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Ingredient ── */}
          {isIngredient && (
            <View style={styles.section}>
              <TouchableOpacity
                style={styles.toggleRow}
                activeOpacity={0.7}
                onPress={() => setCountAsUnits((v) => !v)}
              >
                <View style={styles.toggleLabel}>
                  <Text style={styles.toggleText}>Count as individual units</Text>
                  <Text style={styles.toggleHint}> (eggs, tins)</Text>
                </View>
                <Switch
                  value={countAsUnits}
                  onValueChange={setCountAsUnits}
                  trackColor={{ true: colors.text, false: colors.secondary }}
                  thumbColor={colors.background}
                />
              </TouchableOpacity>

              {!countAsUnits && (
                <TouchableOpacity
                  style={[styles.toggleRow, styles.toggleRowBorder]}
                  activeOpacity={0.7}
                  onPress={() => setTrackUseWithin((v) => !v)}
                >
                  <Text style={styles.toggleText}>Track use-within after opening</Text>
                  <Switch
                    value={trackUseWithin}
                    onValueChange={setTrackUseWithin}
                    trackColor={{ true: colors.text, false: colors.secondary }}
                    thumbColor={colors.background}
                  />
                </TouchableOpacity>
              )}

              <View style={styles.divider} />

              {batches.map((batch, i) => (
                <BatchCard
                  key={batch.id}
                  batch={batch}
                  batchIndex={i}
                  totalBatches={batches.length}
                  isExpanded={expandedId === batch.id}
                  isIngredient
                  countAsUnits={countAsUnits}
                  trackUseWithin={trackUseWithin}
                  onToggle={() => setExpandedId(expandedId === batch.id ? -1 : batch.id)}
                  onRemove={() => removeBatch(batch.id)}
                  onUpdate={(u) => updateBatch(batch.id, u)}
                />
              ))}

              <TouchableOpacity style={styles.addBatch} activeOpacity={0.7} onPress={addBatch}>
                <Feather name="plus" size={14} color={colors.muted} />
                <Text style={styles.addBatchText}>Add another batch</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ── Cooked food ── */}
          {!isIngredient && (
            <View style={styles.section}>
              {batches.map((batch, i) => (
                <BatchCard
                  key={batch.id}
                  batch={batch}
                  batchIndex={i}
                  totalBatches={batches.length}
                  isExpanded={expandedId === batch.id}
                  isIngredient={false}
                  countAsUnits={false}
                  trackUseWithin={false}
                  onToggle={() => setExpandedId(expandedId === batch.id ? -1 : batch.id)}
                  onRemove={() => removeBatch(batch.id)}
                  onUpdate={(u) => updateBatch(batch.id, u)}
                />
              ))}

              <TouchableOpacity style={styles.addBatch} activeOpacity={0.7} onPress={addBatch}>
                <Feather name="plus" size={14} color={colors.muted} />
                <Text style={styles.addBatchText}>Add another portion</Text>
              </TouchableOpacity>
            </View>
          )}

          <Button
            title={isLast ? "Save & finish" : "Save & next"}
            disabled={!itemName.trim()}
            onPress={handleSave}
          />
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  keyboard: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 8,
  },
  headerCenter: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 24,
    bottom: 8,
    alignItems: "center",
    justifyContent: "center",
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
  locationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: colors.secondary,
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  locationText: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    letterSpacing: 0.4,
    color: colors.muted,
  },
  itemNav: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  navBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  navBtnDisabled: {
    opacity: 0.2,
  },
  navCounter: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.text,
    minWidth: 32,
    textAlign: "center",
  },
  animatedContent: { flex: 1, overflow: "hidden" },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 48 },
  nameInput: {
    fontFamily: fonts.serif,
    fontSize: 32,
    lineHeight: 38,
    color: colors.text,
    paddingVertical: 8,
    marginBottom: 12,
  },
  typeToggle: {
    flexDirection: "row",
    backgroundColor: colors.secondary,
    borderRadius: 100,
    padding: 3,
    alignSelf: "flex-start",
    marginBottom: 24,
  },
  typeBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 100,
  },
  typeBtnActive: {
    backgroundColor: colors.background,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  typeBtnText: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.muted,
  },
  typeBtnTextActive: {
    color: colors.text,
  },
  section: { gap: 12 },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  toggleRowBorder: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  toggleLabel: { flexDirection: "row", alignItems: "baseline", flex: 1 },
  toggleText: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.text,
  },
  toggleHint: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.muted,
  },
  divider: { height: 1, backgroundColor: colors.border },
  addBatch: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.border,
  },
  addBatchText: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.muted,
  },
});
