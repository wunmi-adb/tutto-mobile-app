import Button from "@/components/ui/Button";
import HapticPressable from "@/components/ui/HapticPressable";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { Feather } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DetectedItemsReviewScreen({
  items,
  onRemoveItem,
  onCancel,
  onConfirm,
}: {
  items: string[];
  onRemoveItem: (index: number) => void;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text style={styles.title}>We heard these</Text>
          <Text style={styles.subtitle}>
            {items.length} item{items.length !== 1 ? "s" : ""} detected. Remove any you{" don't want"}
            to keep.
          </Text>
        </View>

        {items.length === 0 ? (
          <View style={styles.emptyState}>
            <Feather name="mic" size={32} color={`${colors.muted}33`} />
            <Text style={styles.emptyText}>All items removed</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {items.map((item, index) => (
              <View key={`${item}-${index}`} style={styles.row}>
                <Text style={styles.itemName}>{item}</Text>
                <HapticPressable pressedOpacity={0.75} onPress={() => onRemoveItem(index)}>
                  <Feather name="x" size={16} color={colors.muted} />
                </HapticPressable>
              </View>
            ))}
          </View>
        )}

        <View style={styles.actions}>
          <Button title="Cancel" variant="secondary" style={styles.actionButton} onPress={onCancel} />
          <Button
            title={`Add ${items.length} item${items.length !== 1 ? "s" : ""}`}
            style={styles.actionButton}
            disabled={items.length === 0}
            onPress={onConfirm}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
    gap: 20,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 28,
    lineHeight: 32,
    color: colors.text,
  },
  subtitle: {
    marginTop: 6,
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 21,
    color: colors.muted,
    maxWidth: 320,
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
  list: {
    gap: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  itemName: {
    flex: 1,
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.text,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    flex: 1,
    marginTop: 0,
  },
});
