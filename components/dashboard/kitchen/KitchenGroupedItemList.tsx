import HapticPressable from "@/components/ui/HapticPressable";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import type { PantryPalKitchenItem } from "./pantry-pal-data";

type GroupedItems = {
  aisle: string;
  items: PantryPalKitchenItem[];
};

export default function KitchenGroupedItemList({
  groups,
  activeTab,
  search,
  onToggleItem,
}: {
  groups: GroupedItems[];
  activeTab: "have" | "need";
  search: string;
  onToggleItem: (itemId: string) => void;
}) {
  if (groups.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Feather
          name={activeTab === "have" ? "package" : "shopping-bag"}
          size={32}
          color={`${colors.muted}33`}
        />
        <Text style={styles.emptyText}>
          {search
            ? "No items match your search"
            : activeTab === "have"
              ? "Nothing here yet"
              : "You've got everything!"}
        </Text>
        {!search && activeTab === "have" ? (
          <Text style={styles.emptyHint}>Tap + to add {"what's"} in your kitchen</Text>
        ) : null}
      </View>
    );
  }

  return (
    <View style={styles.groups}>
      {groups.map((group) => (
        <View key={group.aisle}>
          <Text style={styles.groupTitle}>{group.aisle}</Text>
          <View style={styles.groupRows}>
            {group.items.map((item) => (
              <View key={item.id} style={styles.itemRow}>
                <HapticPressable
                  style={[
                    styles.statusButton,
                    item.have ? styles.statusButtonHave : styles.statusButtonNeed,
                  ]}
                  pressedOpacity={0.8}
                  onPress={() => onToggleItem(item.id)}
                >
                  {item.have ? <Feather name="check" size={11} color={colors.background} /> : null}
                </HapticPressable>

                <View style={styles.itemCopy}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  {!item.have && item.source ? (
                    <View style={styles.itemSourceRow}>
                      <Feather name="zap" size={10} color={`${colors.muted}99`} />
                      <Text style={styles.itemSource}>From {item.source}</Text>
                    </View>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  groups: {
    gap: 18,
  },
  groupTitle: {
    marginBottom: 8,
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    letterSpacing: 1,
    color: colors.muted,
    textTransform: "uppercase",
  },
  groupRows: {
    gap: 8,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  statusButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  statusButtonHave: {
    backgroundColor: "#22c55e",
  },
  statusButtonNeed: {
    borderWidth: 2,
    borderColor: colors.border,
  },
  itemCopy: {
    flex: 1,
  },
  itemName: {
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.text,
  },
  itemSourceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 3,
  },
  itemSource: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: `${colors.muted}cc`,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },
  emptyText: {
    marginTop: 12,
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.muted,
  },
  emptyHint: {
    marginTop: 4,
    fontFamily: fonts.sans,
    fontSize: 12,
    color: `${colors.muted}99`,
  },
});
