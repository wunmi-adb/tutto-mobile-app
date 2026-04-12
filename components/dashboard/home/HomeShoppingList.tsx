import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TO_BUY_ITEMS } from "./data";

export default function HomeShoppingList({
  onPressAction,
}: {
  onPressAction: () => void;
}) {
  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>TO BUY</Text>
        <TouchableOpacity style={styles.actionButton} activeOpacity={0.75} onPress={onPressAction}>
          <Text style={styles.actionLabel}>View more</Text>
          <Feather name="arrow-right" size={12} color={colors.brand} />
        </TouchableOpacity>
      </View>

      <View style={styles.list}>
        {TO_BUY_ITEMS.map((item, index) => (
          <View key={item.name} style={[styles.row, index > 0 && styles.rowBorder]}>
            <View style={styles.checkCircle} />
            <View style={styles.copy}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.aisle}>{item.aisle}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    letterSpacing: 1,
    color: colors.muted,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.brand,
  },
  list: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowBorder: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
  },
  copy: {
    flex: 1,
  },
  name: {
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.text,
  },
  aisle: {
    marginTop: 2,
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.muted,
  },
});
