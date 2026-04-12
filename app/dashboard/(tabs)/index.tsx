import HomeDashboardHeader from "@/components/dashboard/home/HomeDashboardHeader";
import HomeMealSection from "@/components/dashboard/home/HomeMealSection";
import HomeRecipeDetail from "@/components/dashboard/home/HomeRecipeDetail";
import HomeShoppingList from "@/components/dashboard/home/HomeShoppingList";
import { colors } from "@/constants/colors";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getMealSections, type DashboardMeal } from "@/components/dashboard/home/data";

export default function HomeTab() {
  const router = useRouter();
  const [sections] = useState(() => getMealSections());
  const [selectedMeal, setSelectedMeal] = useState<DashboardMeal | null>(null);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <HomeDashboardHeader />
        <View style={styles.sections}>
          {sections.map((section, index) => (
            <HomeMealSection
              key={section.label}
              section={section}
              actionLabel={index === 0 ? "View all" : undefined}
              onPressAction={index === 0 ? () => router.push("/dashboard/plan") : undefined}
              onSelectMeal={setSelectedMeal}
            />
          ))}

          <HomeShoppingList onPressAction={() => router.push("/dashboard/shopping")} />
        </View>
      </ScrollView>

      <HomeRecipeDetail meal={selectedMeal} onClose={() => setSelectedMeal(null)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 },
  sections: { gap: 32, marginTop: 32 },
});
