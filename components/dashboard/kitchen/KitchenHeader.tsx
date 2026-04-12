import HapticPressable from "@/components/ui/HapticPressable";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

export default function KitchenHeader({
  haveCount,
  needCount,
  onPressVoice,
  onPressAdd,
}: {
  haveCount: number;
  needCount: number;
  onPressVoice: () => void;
  onPressAdd: () => void;
}) {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.title}>Kitchen</Text>
        <Text style={styles.subtitle}>
          {haveCount} items · {needCount} to get
        </Text>
      </View>

      <View style={styles.actions}>
        <HapticPressable style={styles.iconButton} pressedOpacity={0.8} onPress={onPressVoice}>
          <Feather name="mic" size={16} color={colors.text} />
        </HapticPressable>
        <HapticPressable
          style={styles.primaryIconButton}
          pressedOpacity={0.8}
          hapticType="medium"
          onPress={onPressAdd}
        >
          <Feather name="plus" size={16} color={colors.background} />
        </HapticPressable>
      </View>
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
  title: {
    fontFamily: fonts.serif,
    fontSize: 28,
    lineHeight: 32,
    color: colors.text,
  },
  subtitle: {
    marginTop: 4,
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  primaryIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.brand,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
});
