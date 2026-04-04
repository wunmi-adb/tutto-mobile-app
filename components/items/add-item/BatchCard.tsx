import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import { Feather } from "@expo/vector-icons";
import HapticPressable from "@/components/ui/HapticPressable";
import { StyleSheet, Text, View } from "react-native";
import DatePickerField from "./DatePickerField";
import FillGauge from "./FillGauge";
import QtyStepper from "./QtyStepper";
import { Batch, COOKED_FILL_OPTIONS, FillLevel, INGREDIENT_FILL_OPTIONS } from "./types";

type Props = {
  batch: Batch;
  batchIndex: number;
  totalBatches: number;
  isExpanded: boolean;
  isIngredient: boolean;
  countAsUnits: boolean;
  isEditMode?: boolean;
  onToggle: () => void;
  onRemove: () => void;
  onMarkFinished?: () => void;
  onUpdate: (updates: Partial<Batch>) => void;
};

export default function BatchCard({
  batch,
  batchIndex,
  totalBatches,
  isExpanded,
  isIngredient,
  countAsUnits,
  isEditMode = false,
  onToggle,
  onRemove,
  onMarkFinished,
  onUpdate,
}: Props) {
  const { t } = useI18n();

  const getIngredientFillLabel = (level: FillLevel) => {
    switch (level) {
      case "sealed":
        return t("addItems.batch.fill.full");
      case "just_opened":
        return t("addItems.batch.fill.justOpened");
      case "half":
        return t("addItems.batch.fill.half");
      case "almost_empty":
      default:
        return t("addItems.batch.fill.nearlyEmpty");
    }
  };

  const getCookedFillLabel = (level: FillLevel) => {
    switch (level) {
      case "just_opened":
        return t("addItems.batch.fill.full");
      case "half":
        return t("addItems.batch.fill.half");
      case "sealed":
      case "almost_empty":
      default:
        return t("addItems.batch.fill.nearlyEmpty");
    }
  };

  const ingredientFillOptions = INGREDIENT_FILL_OPTIONS.map((option) => ({
    ...option,
    label: getIngredientFillLabel(option.key),
  }));

  const cookedFillOptions = COOKED_FILL_OPTIONS.map((option) => ({
    ...option,
    label: getCookedFillLabel(option.key),
  }));

  const fillLabels: Record<FillLevel, string> = {
    sealed: t("addItems.batch.fill.full"),
    just_opened: isIngredient ? t("addItems.batch.fill.justOpened") : t("addItems.batch.fill.full"),
    half: t("addItems.batch.fill.half"),
    almost_empty: t("addItems.batch.fill.nearlyEmpty"),
  };

  let label = t("addItems.batch.label.details");

  if (totalBatches > 1) {
    if (isIngredient) {
      label = t("addItems.batch.label.batch", { index: batchIndex + 1 });
    } else {
      label = t("addItems.batch.label.portion", { index: batchIndex + 1 });
    }
  }

  let summary = "";

  if (isIngredient) {
    summary = countAsUnits
      ? t("addItems.batch.summary.quantity", { qty: batch.qty })
      : fillLabels[batch.fillLevel];
  }

  const fillGaugeOptions = isIngredient
    ? ingredientFillOptions
    : (cookedFillOptions as { key: FillLevel; label: string; percent: number }[]);

  return (
    <View style={[styles.card, isExpanded && styles.cardExpanded]}>
      {/* Header row */}
      <HapticPressable style={styles.header} pressedOpacity={0.7} onPress={onToggle}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerLabel}>{label}</Text>
          {!isExpanded && summary ? (
            <Text style={styles.headerSummary}>{summary}</Text>
          ) : null}
        </View>
        <View style={styles.headerRight}>
          {isEditMode && onMarkFinished ? (
            <HapticPressable
              style={styles.finishedBtn}
              pressedOpacity={0.85}
              onPress={(event) => {
                event.stopPropagation();
                onMarkFinished();
              }}
            >
              <Feather name="check-circle" size={13} color={colors.text} />
              <Text style={styles.finishedBtnText}>{t("addItems.batch.finished.cta")}</Text>
            </HapticPressable>
          ) : null}
          {totalBatches > 1 && !isEditMode ? (
            <HapticPressable
              style={styles.removeBtn}
              pressedOpacity={0.7}
              onPress={(event) => {
                event.stopPropagation();
                onRemove();
              }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Feather name="x" size={11} color={colors.muted} />
            </HapticPressable>
          ) : null}
          <Feather
            name="chevron-right"
            size={14}
            color={colors.muted}
            style={{ transform: [{ rotate: isExpanded ? "90deg" : "0deg" }] }}
          />
        </View>
      </HapticPressable>

      {/* Expanded content */}
      {isExpanded && (
        <View style={styles.body}>
          {isIngredient && countAsUnits ? (
            <>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>{t("addItems.batch.field.quantity")}</Text>
                <QtyStepper value={batch.qty} onChange={(n) => onUpdate({ qty: n })} />
              </View>
              <DatePickerField
                label={t("addItems.batch.field.bestBefore")}
                value={batch.bestBefore}
                onChange={(v) => onUpdate({ bestBefore: v })}
              />
            </>
          ) : (
            <>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>{t("addItems.batch.field.amountLeft")}</Text>
                <FillGauge
                  level={batch.fillLevel}
                  onChange={(level) => onUpdate({ fillLevel: level })}
                  options={fillGaugeOptions}
                />
              </View>
              <DatePickerField
                label={t("addItems.batch.field.bestBefore")}
                value={batch.bestBefore}
                onChange={(v) => onUpdate({ bestBefore: v })}
              />
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  cardExpanded: {
    borderColor: colors.text + "26",
    backgroundColor: colors.text + "05",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 8, flex: 1 },
  headerLabel: { fontFamily: fonts.sansMedium, fontSize: 14, color: colors.text },
  headerSummary: { fontFamily: fonts.sans, fontSize: 12, color: colors.muted },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  removeBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  finishedBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: colors.text + "08",
    borderWidth: 1,
    borderColor: colors.border,
  },
  finishedBtnText: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    color: colors.text,
  },
  body: { paddingHorizontal: 16, paddingBottom: 16, gap: 16 },
  field: { gap: 8 },
  fieldLabel: { fontFamily: fonts.sans, fontSize: 12, color: colors.muted },
});
