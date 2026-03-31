import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DatePickerField from "./DatePickerField";
import FillGauge from "./FillGauge";
import QtyStepper from "./QtyStepper";
import { Batch, FillLevel, USE_WITHIN } from "./types";

type Props = {
  batch: Batch;
  batchIndex: number;
  totalBatches: number;
  isExpanded: boolean;
  isIngredient: boolean;
  countAsUnits: boolean;
  trackUseWithin: boolean;
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
  trackUseWithin,
  onToggle,
  onRemove,
  onUpdate,
}: Props) {
  const { t } = useI18n();

  const fillLabels: Record<FillLevel, string> = {
    full: t("addItems.batch.fill.full"),
    "three-quarter": t("addItems.batch.fill.threeQuarter"),
    half: t("addItems.batch.fill.half"),
    quarter: t("addItems.batch.fill.quarter"),
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
      : t("addItems.batch.summary.fill", {
          fill: fillLabels[batch.fillLevel],
          state: batch.sealed ? t("addItems.batch.state.sealed") : t("addItems.batch.state.opened"),
        })
    : batch.dateMade
      ? t("addItems.batch.summary.made", { date: batch.dateMade })
    : "";

  return (
    <View style={[styles.card, isExpanded && styles.cardExpanded]}>
      {/* Header row */}
      <TouchableOpacity style={styles.header} activeOpacity={0.7} onPress={onToggle}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerLabel}>{label}</Text>
          {!isExpanded && summary ? (
            <Text style={styles.headerSummary}>{summary}</Text>
          ) : null}
        </View>
        <View style={styles.headerRight}>
          {totalBatches > 1 && (
            <TouchableOpacity
              style={styles.removeBtn}
              activeOpacity={0.7}
              onPress={onRemove}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Feather name="x" size={11} color={colors.muted} />
            </TouchableOpacity>
          )}
          <Feather
            name="chevron-right"
            size={14}
            color={colors.muted}
            style={{ transform: [{ rotate: isExpanded ? "90deg" : "0deg" }] }}
          />
        </View>
      </TouchableOpacity>

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
                {/* Sealed / Opened */}
                <View style={styles.segmentRow}>
                  {(["sealed", "opened"] as const).map((s) => {
                    const active = s === "sealed" ? batch.sealed : !batch.sealed;
                    return (
                      <TouchableOpacity
                        key={s}
                        style={[styles.segment, active && styles.segmentActive]}
                        activeOpacity={0.7}
                        onPress={() =>
                          onUpdate({
                            sealed: s === "sealed",
                            ...(s === "sealed" ? { fillLevel: "full" as FillLevel } : {}),
                          })
                        }
                      >
                        <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
                          {s === "sealed" ? t("addItems.batch.state.sealed") : t("addItems.batch.state.opened")}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Fill gauge — only when opened */}
                {!batch.sealed && (
                  <View style={styles.field}>
                    <Text style={styles.fieldLabel}>{t("addItems.batch.field.amountLeft")}</Text>
                    <FillGauge
                      level={batch.fillLevel}
                      onChange={(l) => onUpdate({ fillLevel: l })}
                    />
                  </View>
                )}

                {/* Use-within or best before */}
                {trackUseWithin && !batch.sealed ? (
                  <View style={styles.field}>
                    <Text style={styles.fieldLabel}>{t("addItems.batch.field.useWithin")}</Text>
                    <View style={styles.chipRow}>
                      {USE_WITHIN.map((opt) => {
                        const active = batch.useWithinDays === opt.days;
                        return (
                          <TouchableOpacity
                            key={opt.days}
                            style={[styles.chip, active && styles.chipActive]}
                            activeOpacity={0.7}
                            onPress={() => onUpdate({ useWithinDays: opt.days })}
                          >
                            <Text style={[styles.chipText, active && styles.chipTextActive]}>
                              {t(opt.key)}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                ) : (
                  <DatePickerField
                    label={t("addItems.batch.field.bestBefore")}
                    value={batch.bestBefore}
                    onChange={(v) => onUpdate({ bestBefore: v })}
                  />
                )}
              </>
            )
          ) : (
            <>
              <DatePickerField
                label={t("addItems.batch.field.dateMade")}
                value={batch.dateMade}
                onChange={(v) => onUpdate({ dateMade: v })}
              />
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>{t("addItems.batch.field.amountLeft")}</Text>
                <FillGauge
                  level={batch.fillLevel}
                  onChange={(l) => onUpdate({ fillLevel: l })}
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
  segmentRow: { flexDirection: "row", gap: 8 },
  segment: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },
  segmentActive: { backgroundColor: colors.text, borderColor: colors.text },
  segmentText: { fontFamily: fonts.sansMedium, fontSize: 14, color: colors.muted },
  segmentTextActive: { color: colors.background },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.text, borderColor: colors.text },
  chipText: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.muted },
  chipTextActive: { color: colors.background },
});
