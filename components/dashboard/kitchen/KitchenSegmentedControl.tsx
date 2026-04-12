import HapticPressable from "@/components/ui/HapticPressable";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

type TabId = "have" | "need";

export default function KitchenSegmentedControl({
  activeTab,
  haveCount,
  needCount,
  onChange,
}: {
  activeTab: TabId;
  haveCount: number;
  needCount: number;
  onChange: (tab: TabId) => void;
}) {
  return (
    <View style={styles.wrapper}>
      <HapticPressable
        style={[styles.segment, activeTab === "have" && styles.segmentActive]}
        pressedOpacity={0.8}
        onPress={() => onChange("have")}
      >
        <Feather name="check-circle" size={14} color={activeTab === "have" ? colors.text : colors.muted} />
        <Text style={[styles.label, activeTab === "have" && styles.labelActive]}>You have</Text>
        <Text style={styles.count}>{haveCount}</Text>
      </HapticPressable>

      <HapticPressable
        style={[styles.segment, activeTab === "need" && styles.segmentActive]}
        pressedOpacity={0.8}
        onPress={() => onChange("need")}
      >
        <Feather name="shopping-bag" size={14} color={activeTab === "need" ? colors.text : colors.muted} />
        <Text style={[styles.label, activeTab === "need" && styles.labelActive]}>To buy</Text>
        <Text style={styles.count}>{needCount}</Text>
      </HapticPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    gap: 8,
    borderRadius: 16,
    backgroundColor: colors.secondary,
    padding: 4,
  },
  segment: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: 12,
    paddingVertical: 11,
  },
  segmentActive: {
    backgroundColor: colors.background,
  },
  label: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.muted,
  },
  labelActive: {
    color: colors.text,
  },
  count: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: `${colors.muted}cc`,
  },
});
