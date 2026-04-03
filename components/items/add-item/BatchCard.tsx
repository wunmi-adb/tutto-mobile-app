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
  onToggle: () => void;
  onRemove: () => void;
  onUpdate: (updates: Partial<Batch>) => void;
};

export default function BatchCard({
  batch,
  batchIndex,
  totalBatches,
  isExpanded,
  isIngredient,
  countAsUnits,
  onToggle,
  onRemove,
  onUpdate,
}: Props) {
  const { t } = useI18n();

  const ingredientFillOptions = INGREDIENT_FILL_OPTIONS.map((option) => ({
    ...option,
    label:
      option.key === "sealed"
        ? t("addItems.batch.fill.full")
        : option.key === "full"
          ? t("addItems.batch.fill.justOpened")
          : option.key === "half"
            ? t("addItems.batch.fill.half")
            : t("addItems.batch.fill.nearlyEmpty"),
  }));

  const cookedFillOptions = COOKED_FILL_OPTIONS.map((option) => ({
    ...option,
    label:
      option.key === "full"
        ? t("addItems.batch.fill.full")
        : option.key === "half"
          ? t("addItems.batch.fill.half")
          : t("addItems.batch.fill.nearlyEmpty"),
  }));

  const fillLabels: Record<FillLevel, string> = {
    sealed: t("addItems.batch.fill.full"),
    full: isIngredient ? t("addItems.batch.fill.justOpened") : t("addItems.batch.fill.full"),
    half: t("addItems.batch.fill.half"),
    "nearly-empty": t("addItems.batch.fill.nearlyEmpty"),
  };

  const label = isIngredient
    ? totalBatches > 1
      ? t("addItems.batch.label.batch", { index: batchIndex + 1 })
      : t("addItems.batch.label.details")
    : totalBatches > 1
      ? t("addItems.batch.label.portion", { index: batchIndex + 1 })
      : t("addItems.batch.label.details");

  const summary = isIngredient
    ? countAsUnits
      ? t("addItems.batch.summary.quantity", { qty: batch.qty })
      : fillLabels[batch.fillLevel]
    : "";

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
          {totalBatches > 1 && (
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
          )}
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
          {isIngredient ? (
            countAsUnits ? (
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
                    options={ingredientFillOptions}
                  />
                </View>

                <DatePickerField
                  label={t("addItems.batch.field.bestBefore")}
                  value={batch.bestBefore}
                  onChange={(v) => onUpdate({ bestBefore: v })}
                />
              </>
            )
          ) : (
            <>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>{t("addItems.batch.field.amountLeft")}</Text>
                <FillGauge
                  level={batch.fillLevel}
                  onChange={(level) => onUpdate({ fillLevel: level })}
                  options={cookedFillOptions as { key: FillLevel; label: string; percent: number }[]}
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
  body: { paddingHorizontal: 16, paddingBottom: 16, gap: 16 },
  field: { gap: 8 },
  fieldLabel: { fontFamily: fonts.sans, fontSize: 12, color: colors.muted },
});
