import HapticPressable from "@/components/ui/HapticPressable";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

export default function KitchenHeader({
  haveCount,
  needCount,
  onPressAdd,
}: {
  haveCount: number;
  needCount: number;
  onPressAdd: () => void;
}) {
  return (
    <View style={styles.header}>
      <View style={styles.copyBlock}>
        <Text style={styles.title}>Kitchen</Text>
        <Text style={styles.subtitle}>
          {haveCount} items · {needCount} to get
        </Text>
      </View>

      <HapticPressable
        style={styles.addButton}
        pressedOpacity={0.86}
        hapticType="medium"
        onPress={onPressAdd}
      >
        <Feather name="plus" size={15} color={colors.background} />
        <Text style={styles.addButtonText}>Add items</Text>
      </HapticPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
  },
  copyBlock: {
    flex: 1,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 28,
    lineHeight: 32,
    letterSpacing: -0.3,
    color: colors.text,
  },
  subtitle: {
    marginTop: 4,
    fontFamily: fonts.sans,
    fontSize: 13,
    lineHeight: 18,
    color: colors.muted,
  },
  addButton: {
    height: 38,
    borderRadius: 999,
    backgroundColor: colors.brand,
    paddingHorizontal: 16,
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.brand,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 2,
  },
  addButtonText: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.background,
  },
});
