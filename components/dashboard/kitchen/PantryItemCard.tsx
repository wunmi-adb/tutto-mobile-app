import { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import HapticPressable from "@/components/ui/HapticPressable";
import { formatDateLabel } from "@/components/dashboard/data";
import {
  getActiveBatches,
  getEarliestExpiry,
  getExpiryLabel,
  getExpiryUrgency,
  getFillLabel,
  getFillPercent,
  getItemSummary,
} from "@/components/dashboard/kitchen/helpers";
import type { PantryItem } from "@/components/dashboard/kitchen/types";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import type { CapturedInventoryItem } from "@/lib/api/item-capture";

type Props = {
  item: PantryItem;
  onEdit: (item: PantryItem, prefill: CapturedInventoryItem) => void;
};

export default function PantryItemCard({ item, onEdit }: Props) {
  const { language, t } = useI18n();
  const [expanded, setExpanded] = useState(false);
  const chevronRotation = useRef(new Animated.Value(0)).current;

  const activeBatches = getActiveBatches(item);
  const allFinished = activeBatches.length === 0;
  const earliestExpiry = getEarliestExpiry(item);
  const urgency = allFinished || !earliestExpiry ? "ok" : getExpiryUrgency(earliestExpiry);
  const summary = getItemSummary(t, item);
  const editableBatches = activeBatches.length > 0 ? activeBatches : item.batches;

  useEffect(() => {
    Animated.timing(chevronRotation, {
      toValue: expanded ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [chevronRotation, expanded]);

  const handleEdit = () => {
    onEdit(item, {
      name: item.name,
      item_type: item.type,
      tracking_mode: item.countAsUnits ? "quantity" : "fill_level",
      batches: editableBatches.map((batch) => ({
        best_before: batch.bestBefore,
        fill_level: batch.fillLevel,
        quantity: batch.qty,
      })),
    });
  };

  return (
    <View
      style={[
        styles.card,
        allFinished && styles.cardFinished,
        urgency === "danger" && styles.cardDanger,
        urgency === "warn" && styles.cardWarn,
      ]}
    >
      <HapticPressable
        style={[styles.headerButton, allFinished && styles.headerButtonFinished]}
        onPress={() => setExpanded((value) => !value)}
        hapticType="selection"
        pressedOpacity={1}
      >
        <View style={styles.headerText}>
          <View style={styles.titleRow}>
            <Text style={styles.itemName} numberOfLines={1}>
              {item.name}
            </Text>
            {item.type === "cooked_meal" ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{t("dashboard.kitchen.cookedBadge")}</Text>
              </View>
            ) : null}
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>{summary}</Text>
            {!allFinished && earliestExpiry ? (
              <>
                <Text style={styles.metaDivider}>·</Text>
                <Text
                  style={[
                    styles.expiryText,
                    urgency === "danger" && styles.expiryDanger,
                    urgency === "warn" && styles.expiryWarn,
                  ]}
                >
                  {getExpiryLabel(t, language, earliestExpiry)}
                </Text>
              </>
            ) : null}
          </View>
        </View>

        <Animated.View
          style={{
            transform: [
              {
                rotate: chevronRotation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0deg", "90deg"],
                }),
              },
            ],
          }}
        >
          <Feather name="chevron-right" size={14} color={colors.muted} />
        </Animated.View>
      </HapticPressable>

      {expanded ? (
        <View style={styles.details}>
          {allFinished ? (
            <View style={styles.emptyState}>
              <Feather name="package" size={20} color={colors.muted + "66"} />
              <Text style={styles.emptyStateTitle}>
                {item.type === "cooked_meal"
                  ? t("addItems.batch.finished.empty.cooked.title")
                  : t("addItems.batch.finished.empty.ingredient.title")}
              </Text>
              <Text style={styles.emptyStateSubtitle}>
                {item.type === "cooked_meal"
                  ? t("dashboard.kitchen.emptyFinished.cooked")
                  : t("dashboard.kitchen.emptyFinished.ingredient")}
              </Text>
            </View>
          ) : (
            <View style={styles.batchList}>
              {activeBatches.map((batch, index) => (
                <View
                  key={batch.id}
                  style={[styles.batchBlock, index < activeBatches.length - 1 && styles.batchDivider]}
                >
                  {activeBatches.length > 1 ? (
                    <View style={styles.batchHeader}>
                      <Text style={styles.batchLabel}>
                        {item.type === "cooked_meal"
                          ? t("addItems.batch.label.portion", { index: index + 1 })
                          : t("addItems.batch.label.batch", { index: index + 1 })}
                      </Text>
                    </View>
                  ) : null}

                  {item.countAsUnits ? (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailKey}>{t("addItems.batch.field.quantity")}</Text>
                      <Text style={styles.detailValue}>{batch.qty}</Text>
                    </View>
                  ) : (
                    <View style={styles.fillSection}>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailKey}>
                          {batch.sealed
                            ? t("addItems.batch.state.sealed")
                            : t("addItems.batch.state.opened")}
                        </Text>
                        <Text style={styles.detailValue}>{getFillLabel(t, batch.fillLevel)}</Text>
                      </View>
                      <View style={styles.fillTrack}>
                        <View
                          style={[
                            styles.fillBar,
                            { width: `${getFillPercent(batch.fillLevel)}%` },
                          ]}
                        />
                      </View>
                    </View>
                  )}

                  {batch.bestBefore ? (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailKey}>{t("addItems.batch.field.bestBefore")}</Text>
                      <Text
                        style={[
                          styles.detailValue,
                          getExpiryUrgency(batch.bestBefore) === "danger" && styles.expiryDanger,
                          getExpiryUrgency(batch.bestBefore) === "warn" && styles.expiryWarn,
                        ]}
                      >
                        {formatDateLabel(language, new Date(batch.bestBefore), {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </Text>
                    </View>
                  ) : null}

                  {batch.dateMade ? (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailKey}>{t("addItems.batch.field.dateMade")}</Text>
                      <Text style={styles.detailValue}>
                        {formatDateLabel(language, new Date(batch.dateMade), {
                          day: "numeric",
                          month: "short",
                        })}
                      </Text>
                    </View>
                  ) : null}
                </View>
              ))}
            </View>
          )}

          <Pressable
            style={({ pressed }) => [styles.editButton, pressed && styles.editButtonPressed]}
            onPress={handleEdit}
          >
            <Feather name="edit-2" size={12} color={colors.muted} />
            <Text style={styles.editButtonText}>{t("dashboard.kitchen.editItem")}</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    backgroundColor: colors.background,
  },
  cardFinished: {
    borderColor: colors.border,
  },
  cardDanger: {
    borderColor: "#efc9c9",
  },
  cardWarn: {
    borderColor: "#efdca8",
  },
  headerButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerButtonFinished: {
    opacity: 0.62,
  },
  headerText: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  itemName: {
    flexShrink: 1,
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.text,
  },
  badge: {
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: colors.secondary,
  },
  badgeText: {
    fontFamily: fonts.sansMedium,
    fontSize: 10,
    color: colors.muted,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.muted,
  },
  metaDivider: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.border,
  },
  expiryText: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.muted,
  },
  expiryDanger: {
    color: colors.danger,
  },
  expiryWarn: {
    color: colors.warning,
  },
  details: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  batchList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  batchBlock: {
    gap: 10,
    paddingVertical: 10,
  },
  batchDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  batchHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  batchLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: colors.muted,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 24,
    gap: 6,
  },
  emptyStateTitle: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.muted,
  },
  emptyStateSubtitle: {
    fontFamily: fonts.sans,
    fontSize: 12,
    lineHeight: 18,
    color: colors.muted + "AA",
    textAlign: "center",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  detailKey: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.muted,
  },
  detailValue: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.text,
  },
  fillSection: {
    gap: 6,
  },
  fillTrack: {
    height: 6,
    borderRadius: 999,
    backgroundColor: "#f1f1f1",
    overflow: "hidden",
  },
  fillBar: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: colors.success,
  },
  editButton: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
  },
  editButtonPressed: {
    backgroundColor: colors.secondary,
  },
  editButtonText: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.muted,
  },
});
