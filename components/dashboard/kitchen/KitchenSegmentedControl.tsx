import SegmentedTabs from "@/components/ui/SegmentedTabs";
import { colors } from "@/constants/colors";
import { Feather } from "@expo/vector-icons";
import { StyleSheet } from "react-native";

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
    <SegmentedTabs
      options={[
        {
          value: "have",
          label: "You have",
          badge: haveCount,
          icon: ({ color }) => <Feather name="check-circle" size={14} color={color} />,
        },
        {
          value: "need",
          label: "To buy",
          badge: needCount,
          icon: ({ color }) => <Feather name="shopping-bag" size={14} color={color} />,
        },
      ]}
      value={activeTab}
      onChange={onChange}
      backgroundColor={colors.secondary}
      activeBackgroundColor={colors.background}
      inactiveTextColor={colors.muted}
      activeTextColor={colors.text}
      badgeStyle={styles.count}
      indicatorStyle={styles.indicator}
      pressedOpacity={0.8}
    />
  );
}

const styles = StyleSheet.create({
  count: {
    color: `${colors.muted}cc`,
  },
  indicator: {
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.06)",
  },
});
