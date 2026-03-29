import { KitchenScreenHeader, SectionEyebrow } from "@/components/kitchen/shared";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type FillLevel = "full" | "threeQuarter" | "half" | "quarter" | "nearlyEmpty";

type PantryBatch = {
  id: number;
  qty: number;
  fillLevel: FillLevel;
  sealed: boolean;
  bestBefore: string;
  dateMade?: string;
};

type PantryItem = {
  id: string;
  name: string;
  type: "ingredient" | "cooked";
  location: string;
  countAsUnits: boolean;
  batches: PantryBatch[];
};

const FILL_META: Record<FillLevel, { label: string; percent: number }> = {
  full: { label: "Full", percent: 100 },
  threeQuarter: { label: "Almost full", percent: 75 },
  half: { label: "Half left", percent: 50 },
  quarter: { label: "Running low", percent: 25 },
  nearlyEmpty: { label: "Almost empty", percent: 8 },
};

const ITEMS: PantryItem[] = [
  {
    id: "1",
    name: "Semi-skimmed Milk",
    type: "ingredient",
    location: "Fridge",
    countAsUnits: false,
    batches: [
      { id: 1, qty: 1, fillLevel: "half", sealed: false, bestBefore: "2026-04-01" },
      { id: 2, qty: 1, fillLevel: "full", sealed: true, bestBefore: "2026-04-08" },
    ],
  },
  {
    id: "2",
    name: "Eggs",
    type: "ingredient",
    location: "Fridge",
    countAsUnits: true,
    batches: [{ id: 3, qty: 8, fillLevel: "full", sealed: true, bestBefore: "2026-04-05" }],
  },
  {
    id: "3",
    name: "Chicken Breast",
    type: "ingredient",
    location: "Freezer",
    countAsUnits: false,
    batches: [{ id: 4, qty: 1, fillLevel: "full", sealed: true, bestBefore: "2026-06-15" }],
  },
  {
    id: "4",
    name: "Jollof Rice",
    type: "cooked",
    location: "Fridge",
    countAsUnits: false,
    batches: [
      { id: 5, qty: 1, fillLevel: "threeQuarter", sealed: false, bestBefore: "2026-03-30", dateMade: "2026-03-26" },
    ],
  },
  {
    id: "5",
    name: "Paprika",
    type: "ingredient",
    location: "Spice Rack",
    countAsUnits: false,
    batches: [{ id: 6, qty: 1, fillLevel: "nearlyEmpty", sealed: false, bestBefore: "2026-12-01" }],
  },
];

const LOCATIONS = ["All", ...Array.from(new Set(ITEMS.map((item) => item.location)))];

const daysUntil = (dateStr: string) => {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const expiryLabel = (dateStr: string) => {
  const days = daysUntil(dateStr);
  if (days < 0) return "Expired";
  if (days === 0) return "Expires today";
  if (days === 1) return "Expires tomorrow";
  if (days <= 7) return `${days} days left`;
  return `Exp. ${new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`;
};

const expiryColor = (dateStr: string) => {
  const days = daysUntil(dateStr);
  if (days <= 2) return colors.danger;
  if (days <= 5) return colors.warning;
  return colors.muted;
};

function PantryCard({ item }: { item: PantryItem }) {
  const [expanded, setExpanded] = useState(false);
  const earliestExpiry = [...item.batches].sort((a, b) => a.bestBefore.localeCompare(b.bestBefore))[0]?.bestBefore;
  const summary = item.countAsUnits
    ? `${item.batches.reduce((sum, batch) => sum + batch.qty, 0)} units`
    : item.batches.length === 1
      ? FILL_META[item.batches[0].fillLevel].label
      : `${item.batches.length} batches`;

  return (
    <View style={styles.itemCard}>
      <TouchableOpacity style={styles.itemButton} activeOpacity={0.75} onPress={() => setExpanded((value) => !value)}>
        <View style={styles.itemText}>
          <View style={styles.itemTitleRow}>
            <Text style={styles.itemName}>{item.name}</Text>
            {item.type === "cooked" ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Cooked</Text>
              </View>
            ) : null}
          </View>
          <Text style={styles.itemMeta}>
            {summary}
            {earliestExpiry ? `  ·  ${expiryLabel(earliestExpiry)}` : ""}
          </Text>
        </View>
        <Feather name={expanded ? "chevron-down" : "chevron-right"} size={16} color={colors.muted} />
      </TouchableOpacity>

      {expanded ? (
        <View style={styles.itemDetails}>
          {item.batches.map((batch, index) => (
            <View key={batch.id} style={[styles.batchBlock, index > 0 && styles.batchDivider]}>
              {item.batches.length > 1 ? (
                <Text style={styles.batchLabel}>{item.type === "cooked" ? `Portion ${index + 1}` : `Batch ${index + 1}`}</Text>
              ) : null}
              {item.countAsUnits ? (
                <View style={styles.detailRow}>
                  <Text style={styles.detailKey}>Quantity</Text>
                  <Text style={styles.detailValue}>{batch.qty}</Text>
                </View>
              ) : (
                <>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailKey}>{batch.sealed ? "Sealed" : "Opened"}</Text>
                    <Text style={styles.detailValue}>{FILL_META[batch.fillLevel].label}</Text>
                  </View>
                  <View style={styles.fillTrack}>
                    <View style={[styles.fillBar, { width: `${FILL_META[batch.fillLevel].percent}%` }]} />
                  </View>
                </>
              )}
              <View style={styles.detailRow}>
                <Text style={styles.detailKey}>Best before</Text>
                <Text style={[styles.detailValue, { color: expiryColor(batch.bestBefore) }]}>
                  {new Date(batch.bestBefore).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </Text>
              </View>
              {batch.dateMade ? (
                <View style={styles.detailRow}>
                  <Text style={styles.detailKey}>Date made</Text>
                  <Text style={styles.detailValue}>
                    {new Date(batch.dateMade).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </Text>
                </View>
              ) : null}
            </View>
          ))}
          <TouchableOpacity style={styles.editButton} activeOpacity={0.75}>
            <Feather name="edit-2" size={12} color={colors.muted} />
            <Text style={styles.editButtonText}>Edit item</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

export default function PantryTab() {
  const [query, setQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All");

  const filteredItems = ITEMS.filter((item) => {
    const matchesLocation = selectedLocation === "All" || item.location === selectedLocation;
    const matchesQuery = item.name.toLowerCase().includes(query.toLowerCase());
    return matchesLocation && matchesQuery;
  });

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <KitchenScreenHeader
          title="Pantry"
          subtitle={`${filteredItems.length} items across your kitchen`}
          rightAction={
            <TouchableOpacity style={styles.addBtn} activeOpacity={0.75}>
              <Feather name="plus" size={16} color={colors.background} />
            </TouchableOpacity>
          }
        />

        <View style={styles.searchBox}>
          <Feather name="search" size={16} color={colors.muted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search ingredients, meals, or batches"
            placeholderTextColor={colors.muted}
            style={styles.searchInput}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {LOCATIONS.map((location) => {
            const active = location === selectedLocation;
            return (
              <TouchableOpacity
                key={location}
                style={[styles.filterChip, active && styles.filterChipActive]}
                activeOpacity={0.75}
                onPress={() => setSelectedLocation(location)}
              >
                <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>{location}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <SectionEyebrow>INVENTORY</SectionEyebrow>
        <View style={styles.list}>
          {filteredItems.map((item) => (
            <PantryCard key={item.id} item={item} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 32 },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.brand,
    marginTop: 4,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.text,
  },
  chipRow: {
    gap: 8,
    paddingBottom: 18,
  },
  filterChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: colors.background,
  },
  filterChipActive: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },
  filterChipText: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.muted,
  },
  filterChipTextActive: {
    color: colors.background,
  },
  list: {
    gap: 12,
  },
  itemCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  itemButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  itemText: { flex: 1 },
  itemTitleRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  itemName: { fontFamily: fonts.sansMedium, fontSize: 15, color: colors.text, flexShrink: 1 },
  badge: { backgroundColor: colors.secondary, borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 },
  badgeText: { fontFamily: fonts.sansMedium, fontSize: 10, color: colors.muted },
  itemMeta: { fontFamily: fonts.sans, fontSize: 12, color: colors.muted },
  itemDetails: { borderTopWidth: 1, borderTopColor: colors.border },
  batchBlock: { paddingHorizontal: 16, paddingVertical: 14, gap: 10 },
  batchDivider: { borderTopWidth: 1, borderTopColor: colors.border },
  batchLabel: { fontFamily: fonts.sansMedium, fontSize: 11, color: colors.muted, letterSpacing: 0.5, textTransform: "uppercase" },
  detailRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  detailKey: { fontFamily: fonts.sans, fontSize: 12, color: colors.muted },
  detailValue: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.text },
  fillTrack: { height: 6, borderRadius: 999, backgroundColor: colors.secondary, overflow: "hidden" },
  fillBar: { height: "100%", borderRadius: 999, backgroundColor: colors.success },
  editButton: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
  },
  editButtonText: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.muted },
});
