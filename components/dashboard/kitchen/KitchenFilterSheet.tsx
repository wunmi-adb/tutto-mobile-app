import BottomSheet from "@/components/ui/BottomSheet";
import HapticPressable from "@/components/ui/HapticPressable";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import type { PantryLocationFilter, PantryStatusFilter } from "./types";

type StatusOption = {
  key: PantryStatusFilter;
  label: string;
  count: number;
  icon?: "clock" | "alert-triangle" | "check-circle" | "map-pin";
};

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string;
  clearLabel: string;
  statusLabel: string;
  locationLabel: string;
  activeFilterCount: number;
  statusOptions: StatusOption[];
  activeStatus: PantryStatusFilter;
  onSelectStatus: (key: PantryStatusFilter) => void;
  locationOptions: PantryLocationFilter[];
  activeLocation: string;
  onSelectLocation: (key: string) => void;
  onClearAll: () => void;
};

function FilterRow({
  label,
  count,
  icon,
  active,
  onPress,
}: {
  label: string;
  count: number;
  icon?: "clock" | "alert-triangle" | "check-circle" | "map-pin";
  active: boolean;
  onPress: () => void;
}) {
  const iconColor =
    icon === "clock"
      ? colors.danger
      : icon === "alert-triangle"
        ? colors.warning
        : colors.muted;

  return (
    <HapticPressable
      style={[styles.rowButton, active && styles.rowButtonActive]}
      onPress={onPress}
      hapticType="selection"
    >
      {icon ? <Feather name={icon} size={14} color={iconColor} /> : <View style={styles.iconSpacer} />}
      <Text style={[styles.rowLabel, active && styles.rowLabelActive]}>{label}</Text>
      <Text style={styles.rowCount}>{count}</Text>
      {active ? <Feather name="check" size={14} color={colors.brand} /> : <View style={styles.checkSpacer} />}
    </HapticPressable>
  );
}

export default function KitchenFilterSheet({
  visible,
  onClose,
  title,
  clearLabel,
  statusLabel,
  locationLabel,
  activeFilterCount,
  statusOptions,
  activeStatus,
  onSelectStatus,
  locationOptions,
  activeLocation,
  onSelectLocation,
  onClearAll,
}: Props) {
  return (
    <BottomSheet visible={visible} onClose={onClose} contentStyle={styles.sheetContent}>
      <View style={styles.topRow}>
        <Text style={styles.title}>{title}</Text>
        {activeFilterCount > 0 ? (
          <HapticPressable onPress={onClearAll} hapticType="selection">
            <Text style={styles.clearText}>{clearLabel}</Text>
          </HapticPressable>
        ) : null}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>{statusLabel}</Text>
        <View style={styles.sectionBody}>
          {statusOptions.map((option) => (
            <FilterRow
              key={option.key}
              label={option.label}
              count={option.count}
              icon={option.icon}
              active={activeStatus === option.key}
              onPress={() => onSelectStatus(option.key)}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>{locationLabel}</Text>
        <View style={styles.sectionBody}>
          {locationOptions.map((option) => (
            <FilterRow
              key={option.key}
              label={option.label}
              count={option.count}
              icon="map-pin"
              active={activeLocation === option.key}
              onPress={() => onSelectLocation(option.key)}
            />
          ))}
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheetContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  title: {
    fontFamily: fonts.sansMedium,
    fontSize: 16,
    color: colors.text,
  },
  clearText: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.brand,
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    color: colors.muted,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  sectionBody: {
    gap: 4,
  },
  rowButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  rowButtonActive: {
    backgroundColor: colors.secondary,
  },
  iconSpacer: {
    width: 14,
  },
  rowLabel: {
    flex: 1,
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.muted,
  },
  rowLabelActive: {
    color: colors.text,
    fontFamily: fonts.sansMedium,
  },
  rowCount: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.muted,
  },
  checkSpacer: {
    width: 14,
  },
});
