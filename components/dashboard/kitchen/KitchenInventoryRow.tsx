import HapticPressable from "@/components/ui/HapticPressable";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  isAvailable: boolean;
  name: string;
  subtitle?: string | null;
  onOpenActions: () => void;
  onToggleAvailability: () => void;
};

export default function KitchenInventoryRow({
  isAvailable,
  name,
  subtitle,
  onOpenActions,
  onToggleAvailability,
}: Props) {
  return (
    <View style={styles.row}>
      <HapticPressable
        style={styles.toggleZone}
        pressedOpacity={0.8}
        hapticType="selection"
        onPress={onToggleAvailability}
      >
        <View style={[styles.toggleCircle, isAvailable && styles.toggleCircleActive]}>
          {isAvailable ? <Feather name="check" size={10} color={colors.background} strokeWidth={3} /> : null}
        </View>
      </HapticPressable>

      <View style={styles.bodyZone}>
        <View style={styles.copyBlock}>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
          {subtitle ? <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text> : null}
        </View>

        <HapticPressable
          style={styles.actionsButton}
          pressedOpacity={0.75}
          hapticType="selection"
          onPress={onOpenActions}
        >
          <Feather name="more-horizontal" size={18} color={colors.muted} />
        </HapticPressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    backgroundColor: colors.background,
    paddingLeft: 4,
    paddingRight: 4,
    paddingVertical: 4,
  },
  toggleZone: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleCircle: {
    width: 20,
    height: 20,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleCircleActive: {
    borderColor: colors.brand,
    backgroundColor: colors.brand,
  },
  bodyZone: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingRight: 2,
    paddingVertical: 8,
  },
  copyBlock: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.text,
    letterSpacing: -0.15,
  },
  subtitle: {
    marginTop: 2,
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.muted,
  },
  actionsButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
});
