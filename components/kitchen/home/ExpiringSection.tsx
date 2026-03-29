import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { EXPIRING_ITEMS, expiryColor, expiryLabel } from "./data";

const dotColor = (days: number) => {
  if (days <= 1) return colors.danger;
  if (days <= 3) return colors.warning;
  return colors.muted + "66";
};

export default function ExpiringSection() {
  const router = useRouter();

  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>EXPIRING SOON</Text>
        <TouchableOpacity activeOpacity={0.7} onPress={() => router.push("/kitchen")}>
          <View style={styles.viewAllRow}>
            <Text style={styles.viewAll}>View all</Text>
            <Feather name="arrow-right" size={10} color={colors.text} />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.listContainer}>
        {EXPIRING_ITEMS.map((item, i) => (
          <View key={i} style={[styles.row, i > 0 && styles.rowBorder]}>
            <View style={[styles.dot, { backgroundColor: dotColor(item.daysLeft) }]} />
            <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.itemLocation}>{item.location}</Text>
            <Text style={[styles.itemExpiry, { color: expiryColor(item.daysLeft, colors) }]}>
              {expiryLabel(item.daysLeft)}
            </Text>
          </View>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  sectionTitle: { fontFamily: fonts.sansMedium, fontSize: 11, color: colors.muted, letterSpacing: 1 },
  viewAllRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  viewAll: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.text },
  listContainer: { borderRadius: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 28, overflow: "hidden" },
  row: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingVertical: 12 },
  rowBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  dot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  itemName: { flex: 1, fontFamily: fonts.sansMedium, fontSize: 13, color: colors.text },
  itemLocation: { fontFamily: fonts.sans, fontSize: 11, color: colors.muted, flexShrink: 0 },
  itemExpiry: { fontFamily: fonts.sansMedium, fontSize: 11, flexShrink: 0 },
});
