import Button from "@/components/ui/Button";
import KeyboardAvoidingContainer from "@/components/ui/KeyboardAvoidingContainer";
import SettingsConfirmationSheet from "@/components/settings/SettingsConfirmationSheet";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import { Feather } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HapticPressable from "../ui/HapticPressable";
import BatchCard from "./add-item/BatchCard";
import {
  Batch,
  ItemDraft,
  ItemType,
  PrefillableItem,
  makeItemDraft,
  makeItemDraftFromPrefill,
} from "./add-item/types";

type Props = {
  storageName: string;
  items: PrefillableItem[];
  currentIndex: number;
  completedIndices: number[];
  onFinish: (drafts: ItemDraft[]) => Promise<void> | void;
  onBack: () => void;
  onDelete?: () => Promise<void> | void;
  deleting?: boolean;
  saving?: boolean;
};

export default function AddItemView({
  storageName,
  items,
  currentIndex: initialIndex,
  completedIndices: initialCompleted,
  onFinish,
  onBack,
  onDelete,
  deleting = false,
  saving = false,
}: Props) {
  const { t } = useI18n();
  const [idx, setIdx] = useState(initialIndex);
  const [completed, setCompleted] = useState(new Set(initialCompleted));
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [pendingFinishedBatchId, setPendingFinishedBatchId] = useState<number | null>(null);
  const [drafts, setDrafts] = useState<ItemDraft[]>(() =>
    items.map((item) => makeItemDraftFromPrefill(item))
  );

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const currentDraft = drafts[idx];
  const isEditMode = Boolean(onDelete);
  const pendingFinishedBatch =
    pendingFinishedBatchId == null
      ? undefined
      : currentDraft?.batches.find((batch) => batch.id === pendingFinishedBatchId);
  let headerRight;

  if (items.length > 1) {
    headerRight = (
      <View style={styles.locationBadge}>
        <Feather name="map-pin" size={11} color={colors.muted} />
        <Text style={styles.locationText}>{storageName}</Text>
      </View>
    );
  } else if (onDelete) {
    headerRight = (
      <HapticPressable
        style={styles.deleteBtn}
        pressedOpacity={0.7}
        onPress={() => setConfirmDeleteVisible(true)}
      >
        <Feather name="trash-2" size={15} color={colors.danger} />
      </HapticPressable>
    );
  } else {
    headerRight = <View style={styles.headerSpacer} />;
  }

  const updateCurrentDraft = (updater: (draft: ItemDraft) => ItemDraft) => {
    setDrafts((prev) => prev.map((draft, draftIndex) => (draftIndex === idx ? updater(draft) : draft)));
  };

  const updateBatch = (id: number, updates: Partial<Batch>) =>
    updateCurrentDraft((draft) => ({
      ...draft,
      batches: draft.batches.map((batch) => (batch.id === id ? { ...batch, ...updates } : batch)),
    }));

  const removeBatch = (id: number) => {
    updateCurrentDraft((draft) => {
      const nextBatches = draft.batches.filter((batch) => batch.id !== id);

      return {
        ...draft,
        batches: nextBatches,
        expandedBatchId:
          draft.expandedBatchId === id ? (nextBatches[0]?.id ?? -1) : draft.expandedBatchId,
      };
    });
  };

  const addBatch = () => {
    updateCurrentDraft((draft) => {
      const nextDraft = makeItemDraft(draft.name);
      const nextBatch = nextDraft.batches[0];

      return {
        ...draft,
        batches: [...draft.batches, nextBatch],
        expandedBatchId: nextBatch.id,
      };
    });
  };

  const switchTo = (newIdx: number, newCompleted: Set<number>) => {
    const dir = newIdx > idx ? 1 : -1;

    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 45, easing: Easing.in(Easing.ease), useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: dir * -10, duration: 45, easing: Easing.in(Easing.ease), useNativeDriver: true }),
    ]).start(() => {
      slideAnim.setValue(dir * 10);

      setIdx(newIdx);
      setCompleted(newCompleted);

      requestAnimationFrame(() => {
        Animated.parallel([
          Animated.timing(fadeAnim, { toValue: 1, duration: 80, easing: Easing.out(Easing.ease), useNativeDriver: true }),
          Animated.timing(slideAnim, { toValue: 0, duration: 80, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        ]).start();
      });
    });
  };

  const handleSave = async () => {
    if (saving) {
      return;
    }

    const next = new Set(completed);
    next.add(idx);

    if (idx < items.length - 1) {
      switchTo(idx + 1, next);
    } else {
      await onFinish(drafts);
    }
  };

  const isLast = idx === items.length - 1;
  const isIngredient = currentDraft.itemType === "ingredient";
  const batchesEmpty = currentDraft.batches.length === 0;
  const addAnotherLabel = isIngredient
    ? t("addItems.detail.addAnotherItem", {
        name: currentDraft.name.trim() || t("addItems.detail.addAnotherItemFallback"),
      })
    : t("addItems.detail.addAnotherPortion", {
        name: currentDraft.name.trim() || t("addItems.detail.addAnotherPortionFallback"),
      });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <HapticPressable style={styles.backBtn} pressedOpacity={0.7} onPress={onBack}>
          <Feather name="arrow-left" size={16} color={colors.text} />
        </HapticPressable>

        {/* Absolutely centered so it's always pixel-perfect regardless of side widths */}
        <View style={styles.headerCenter} pointerEvents="box-none">
          {items.length > 1 ? (
            <View style={styles.itemNav}>
              <HapticPressable
                style={[styles.navBtn, idx === 0 && styles.navBtnDisabled]}
                pressedOpacity={0.7}
                disabled={idx === 0}
                onPress={() => idx > 0 && switchTo(idx - 1, completed)}
              >
                <Feather name="chevron-left" size={14} color={colors.muted} />
              </HapticPressable>
              <Text style={styles.navCounter}>{idx + 1} / {items.length}</Text>
              <HapticPressable
                style={[styles.navBtn, idx === items.length - 1 && styles.navBtnDisabled]}
                pressedOpacity={0.7}
                disabled={idx === items.length - 1}
                onPress={() => idx < items.length - 1 && switchTo(idx + 1, completed)}
              >
                <Feather name="chevron-right" size={14} color={colors.muted} />
              </HapticPressable>
            </View>
          ) : (
            <View style={styles.locationBadge}>
              <Feather name="map-pin" size={11} color={colors.muted} />
              <Text style={styles.locationText}>{storageName}</Text>
            </View>
          )}
        </View>

        {headerRight}
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
            style={styles.nameInput}
            value={currentDraft.name}
            onChangeText={(value) =>
              updateCurrentDraft((draft) => ({
                ...draft,
                name: value,
              }))
            }
            placeholder={
              isIngredient
                ? t("addItems.detail.namePlaceholder.ingredient")
                : t("addItems.detail.namePlaceholder.cooked")
            }
            placeholderTextColor={colors.muted + "66"}
            autoCapitalize="words"
            returnKeyType="done"
            selectionColor={colors.text}
          />

          {/* Type toggle */}
          <View style={styles.typeToggle}>
            {(["ingredient", "cooked_meal"] as ItemType[]).map((typeOption) => (
              <HapticPressable
                key={typeOption}
                style={[styles.typeBtn, currentDraft.itemType === typeOption && styles.typeBtnActive]}
                pressedOpacity={0.7}
                onPress={() =>
                  updateCurrentDraft((draft) => ({
                    ...draft,
                    itemType: typeOption,
                  }))
                }
              >
                <Text
                  style={[
                    styles.typeBtnText,
                    currentDraft.itemType === typeOption && styles.typeBtnTextActive,
                  ]}
                >
                  {typeOption === "ingredient"
                    ? t("addItems.detail.type.ingredient")
                    : t("addItems.detail.type.cooked")}
                </Text>
              </HapticPressable>
            ))}
          </View>

          {/* ── Ingredient ── */}
          {isIngredient && (
            <View style={styles.section}>
              <View style={styles.field}>
                <View style={styles.trackingRow}>
                  <View style={styles.trackingCopy}>
                    <Text style={styles.trackingTitle}>
                      {t("addItems.detail.fillLevelTracking")}
                    </Text>
                    <Text style={styles.trackingHint}>
                      {t("addItems.detail.trackBy.fillLevelHint")}
                    </Text>
                  </View>

                  <HapticPressable
                    style={[
                      styles.switchTrack,
                      !currentDraft.countAsUnits
                        ? styles.switchTrackActive
                        : styles.switchTrackInactive,
                    ]}
                    pressedOpacity={0.85}
                    accessibilityRole="switch"
                    accessibilityState={{ checked: !currentDraft.countAsUnits }}
                    onPress={() =>
                      updateCurrentDraft((draft) => ({
                        ...draft,
                        countAsUnits: !draft.countAsUnits,
                      }))
                    }
                  >
                    <View
                      style={[
                        styles.switchThumb,
                        !currentDraft.countAsUnits && styles.switchThumbActive,
                      ]}
                    />
                  </HapticPressable>
                </View>
              </View>

              <View style={styles.divider} />

              {currentDraft.batches.map((batch, i) => (
                <BatchCard
                  key={batch.id}
                  batch={batch}
                  batchIndex={i}
                  totalBatches={currentDraft.batches.length}
                  isExpanded={currentDraft.expandedBatchId === batch.id}
                  isIngredient
                  countAsUnits={currentDraft.countAsUnits}
                  isEditMode={isEditMode}
                  onToggle={() =>
                    updateCurrentDraft((draft) => ({
                      ...draft,
                      expandedBatchId: draft.expandedBatchId === batch.id ? -1 : batch.id,
                    }))
                  }
                  onRemove={() => removeBatch(batch.id)}
                  onMarkFinished={() => setPendingFinishedBatchId(batch.id)}
                  onUpdate={(u) => updateBatch(batch.id, u)}
                />
              ))}

              {batchesEmpty && isEditMode ? (
                <View style={styles.finishedEmptyState}>
                  <Feather name="check-circle" size={24} color={colors.muted + "66"} />
                  <Text style={styles.finishedEmptyTitle}>
                    {t("addItems.batch.finished.empty.ingredient.title")}
                  </Text>
                  <Text style={styles.finishedEmptySubtitle}>
                    {t("addItems.batch.finished.empty.ingredient.subtitle")}
                  </Text>
                </View>
              ) : null}

              <HapticPressable style={styles.addBatch} pressedOpacity={0.7} onPress={addBatch}>
                <Feather name="plus" size={14} color={colors.muted} />
                <Text style={styles.addBatchText}>{addAnotherLabel}</Text>
              </HapticPressable>
            </View>
          )}

          {/* ── Cooked food ── */}
          {!isIngredient && (
            <View style={styles.section}>
              {currentDraft.batches.map((batch, i) => (
                <BatchCard
                  key={batch.id}
                  batch={batch}
                  batchIndex={i}
                  totalBatches={currentDraft.batches.length}
                  isExpanded={currentDraft.expandedBatchId === batch.id}
                  isIngredient={false}
                  countAsUnits={false}
                  isEditMode={isEditMode}
                  onToggle={() =>
                    updateCurrentDraft((draft) => ({
                      ...draft,
                      expandedBatchId: draft.expandedBatchId === batch.id ? -1 : batch.id,
                    }))
                  }
                  onRemove={() => removeBatch(batch.id)}
                  onMarkFinished={() => setPendingFinishedBatchId(batch.id)}
                  onUpdate={(u) => updateBatch(batch.id, u)}
                />
              ))}

              {batchesEmpty && isEditMode ? (
                <View style={styles.finishedEmptyState}>
                  <Feather name="check-circle" size={24} color={colors.muted + "66"} />
                  <Text style={styles.finishedEmptyTitle}>
                    {t("addItems.batch.finished.empty.cooked.title")}
                  </Text>
                  <Text style={styles.finishedEmptySubtitle}>
                    {t("addItems.batch.finished.empty.cooked.subtitle")}
                  </Text>
                </View>
              ) : null}

              <HapticPressable style={styles.addBatch} pressedOpacity={0.7} onPress={addBatch}>
                <Feather name="plus" size={14} color={colors.muted} />
                <Text style={styles.addBatchText}>{addAnotherLabel}</Text>
              </HapticPressable>
            </View>
          )}

          <Button
            title={isLast ? t("addItems.detail.saveFinish") : t("addItems.detail.saveNext")}
            disabled={!currentDraft.name.trim()}
            loading={isLast && saving}
            onPress={() => {
              void handleSave();
            }}
          />
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingContainer>

      <SettingsConfirmationSheet
        visible={confirmDeleteVisible}
        title={t("addItems.detail.delete.title", {
          name: currentDraft.name.trim() || t("addItems.detail.delete.fallbackName"),
        })}
        subtitle={t("addItems.detail.delete.subtitle", {
          name: currentDraft.name.trim() || t("addItems.detail.delete.fallbackName"),
        })}
        confirmLabel={t("addItems.detail.delete.confirm")}
        cancelLabel={t("addItems.detail.delete.cancel")}
        destructive
        confirmLoading={deleting}
        onCancel={() => setConfirmDeleteVisible(false)}
        onConfirm={async () => {
          setConfirmDeleteVisible(false);
          await onDelete?.();
        }}
      />

      <SettingsConfirmationSheet
        visible={pendingFinishedBatchId != null}
        title={t(
          isIngredient
            ? "addItems.batch.finished.title.ingredient"
            : "addItems.batch.finished.title.cooked",
        )}
        subtitle={t(
          isIngredient
            ? "addItems.batch.finished.subtitle.ingredient"
            : "addItems.batch.finished.subtitle.cooked",
          {
            target:
              currentDraft.batches.length > 1
                ? t(
                    isIngredient
                      ? "addItems.batch.finished.target.batch"
                      : "addItems.batch.finished.target.portion",
                    {
                      index:
                        (pendingFinishedBatch
                          ? currentDraft.batches.findIndex((batch) => batch.id === pendingFinishedBatch.id)
                          : -1) + 1,
                    },
                  )
                : t(
                    isIngredient
                      ? "addItems.batch.finished.target.thisBatch"
                      : "addItems.batch.finished.target.thisPortion",
                  ),
            name: currentDraft.name.trim() || t("addItems.detail.delete.fallbackName"),
          },
        )}
        confirmLabel={t("addItems.batch.finished.confirm")}
        cancelLabel={t("addItems.batch.finished.cancel")}
        onCancel={() => setPendingFinishedBatchId(null)}
        onConfirm={async () => {
          if (pendingFinishedBatchId == null) {
            return;
          }

          removeBatch(pendingFinishedBatchId);
          setPendingFinishedBatchId(null);
        }}
      />
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
  headerSpacer: {
    width: 36,
    height: 36,
  },
  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.danger + "33",
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
  field: { gap: 8 },
  fieldLabel: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.muted,
  },
  trackingRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
  },
  trackingCopy: {
    flex: 1,
  },
  trackingTitle: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.text,
  },
  trackingHint: {
    fontFamily: fonts.sans,
    fontSize: 11,
    lineHeight: 16,
    color: colors.muted,
    marginTop: 4,
  },
  switchTrack: {
    width: 44,
    height: 26,
    borderRadius: 999,
    paddingHorizontal: 2,
    alignItems: "flex-start",
    justifyContent: "center",
    marginTop: 2,
  },
  switchTrackActive: {
    backgroundColor: colors.success,
  },
  switchTrackInactive: {
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  switchThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.background,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  switchThumbActive: {
    transform: [{ translateX: 18 }],
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
  finishedEmptyState: {
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.border,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  finishedEmptyTitle: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.muted,
  },
  finishedEmptySubtitle: {
    fontFamily: fonts.sans,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    color: colors.muted + "AA",
  },
});
