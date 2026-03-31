import { LIBRARY_RECIPE_KEYS } from "@/components/kitchen/data";
import { KitchenScreenHeader, SectionEyebrow } from "@/components/kitchen/shared";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import { Feather } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LibraryTab() {
  const { t } = useI18n();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <KitchenScreenHeader
          title={t("kitchen.library.title")}
          subtitle={t("kitchen.library.subtitle")}
        />

        <View style={styles.searchBox}>
          <Feather name="search" size={16} color={colors.muted} />
          <TextInput
            placeholder={t("kitchen.library.searchPlaceholder")}
            placeholderTextColor={colors.muted}
            style={styles.searchInput}
          />
        </View>

        <SectionEyebrow>{t("kitchen.library.curatedTitle")}</SectionEyebrow>
        <View style={styles.grid}>
          {LIBRARY_RECIPE_KEYS.map((titleKey, index) => (
            <View key={titleKey} style={[styles.card, index % 2 === 0 ? styles.cardWarm : styles.cardSoft]}>
              <View style={styles.cardIllustration}>
                <Feather name="book-open" size={24} color={colors.muted} />
              </View>
              <Text style={styles.cardTitle}>{t(titleKey)}</Text>
              <Text style={styles.cardMeta}>{t("kitchen.library.cardMeta")}</Text>
            </View>
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
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 18,
  },
  searchInput: { flex: 1, fontFamily: fonts.sans, fontSize: 14, color: colors.text },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  card: {
    width: "48%",
    minHeight: 180,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardWarm: { backgroundColor: "#FBF5EF" },
  cardSoft: { backgroundColor: "#F5F7F3" },
  cardIllustration: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  cardTitle: { fontFamily: fonts.sansMedium, fontSize: 15, color: colors.text, marginBottom: 6 },
  cardMeta: { fontFamily: fonts.sans, fontSize: 12, color: colors.muted },
});
