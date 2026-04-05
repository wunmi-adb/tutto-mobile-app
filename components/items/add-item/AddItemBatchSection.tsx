import HapticPressable from "@/components/ui/HapticPressable";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import BatchCard from "./BatchCard";
import { Batch, ItemDraft } from "./types";

type Props = {
  draft: ItemDraft;
  isEditMode: boolean;
  onAddBatch: () => void;
  onMarkFinished: (batchId: number) => void;
  onRemoveBatch: (batchId: number) => void;
  onToggleBatch: (batchId: number) => void;
  onToggleTracking: () => void;
  onUpdateBatch: (batchId: number, updates: Partial<Batch>) => void;
};

export default function AddItemBatchSection({
  draft,
  isEditMode,
  onAddBatch,
  onMarkFinished,
  onRemoveBatch,
  onToggleBatch,
  onToggleTracking,
  onUpdateBatch,
}: Props) {
  const { t } = useI18n();
  const isIngredient = draft.itemType === "ingredient";
  const batchesEmpty = draft.batches.length === 0;
  const addAnotherLabel = isIngredient
    ? t("addItems.detail.addAnotherItem", {
        name: draft.name.trim() || t("addItems.detail.addAnotherItemFallback"),
      })
    : t("addItems.detail.addAnotherPortion", {
        name: draft.name.trim() || t("addItems.detail.addAnotherPortionFallback"),
      });

  const renderFinishedEmptyState = () => {
    if (!batchesEmpty || !isEditMode) {
      return null;
    }

    const titleKey = isIngredient
      ? "addItems.batch.finished.empty.ingredient.title"
      : "addItems.batch.finished.empty.cooked.title";
    const subtitleKey = isIngredient
      ? "addItems.batch.finished.empty.ingredient.subtitle"
      : "addItems.batch.finished.empty.cooked.subtitle";

    return (
      <View style={styles.finishedEmptyState}>
        <Feather name="check-circle" size={24} color={colors.muted + "66"} />
        <Text style={styles.finishedEmptyTitle}>{t(titleKey)}</Text>
        <Text style={styles.finishedEmptySubtitle}>{t(subtitleKey)}</Text>
      </View>
    );
  };

  return (
    <View style={styles.section}>
      {isIngredient ? (
        <>
          <View style={styles.field}>
            <View style={styles.trackingRow}>
              <View style={styles.trackingCopy}>
                <Text style={styles.trackingTitle}>{t("addItems.detail.fillLevelTracking")}</Text>
                <Text style={styles.trackingHint}>{t("addItems.detail.trackBy.fillLevelHint")}</Text>
              </View>

              <HapticPressable
                style={[
                  styles.switchTrack,
                  !draft.countAsUnits ? styles.switchTrackActive : styles.switchTrackInactive,
                ]}
                pressedOpacity={0.85}
                accessibilityRole="switch"
                accessibilityState={{ checked: !draft.countAsUnits }}
                onPress={onToggleTracking}
              >
                <View
                  style={[styles.switchThumb, !draft.countAsUnits && styles.switchThumbActive]}
                />
              </HapticPressable>
            </View>
          </View>

          <View style={styles.divider} />
        </>
      ) : null}

      {draft.batches.map((batch, index) => (
        <BatchCard
          key={batch.id}
          batch={batch}
          batchIndex={index}
          totalBatches={draft.batches.length}
          isExpanded={draft.expandedBatchId === batch.id}
          isIngredient={isIngredient}
          countAsUnits={isIngredient ? draft.countAsUnits : false}
          isEditMode={isEditMode}
          onToggle={() => onToggleBatch(batch.id)}
          onRemove={() => onRemoveBatch(batch.id)}
          onMarkFinished={() => onMarkFinished(batch.id)}
          onUpdate={(updates) => onUpdateBatch(batch.id, updates)}
        />
      ))}

      {renderFinishedEmptyState()}

      <HapticPressable style={styles.addBatch} pressedOpacity={0.7} onPress={onAddBatch}>
        <Feather name="plus" size={14} color={colors.muted} />
        <Text style={styles.addBatchText}>{addAnotherLabel}</Text>
      </HapticPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 12 },
  field: { gap: 8 },
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
