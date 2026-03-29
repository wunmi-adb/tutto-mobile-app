import ExpiringSection from "@/components/kitchen/home/ExpiringSection";
import HomeHeader from "@/components/kitchen/home/HomeHeader";
import MealCard from "@/components/kitchen/home/MealCard";
import RecentActivity from "@/components/kitchen/home/RecentActivity";
import RecipeDetail from "@/components/kitchen/home/RecipeDetail";
import StatsRow from "@/components/kitchen/home/StatsRow";
import { NEXT_MEALS, NextMealInfo } from "@/components/kitchen/home/data";
import { colors } from "@/constants/colors";
import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeTab() {
  const [nextMeal, setNextMeal] = useState<NextMealInfo>(NEXT_MEALS[0]);
  const [viewingRecipe, setViewingRecipe] = useState(false);

  const shuffleMeal = () => {
    const others = NEXT_MEALS.filter((m) => m.name !== nextMeal.name);
    setNextMeal(others[Math.floor(Math.random() * others.length)]);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader />
        <StatsRow />
        <ExpiringSection />
        <MealCard meal={nextMeal} onShuffle={shuffleMeal} onViewRecipe={() => setViewingRecipe(true)} />
        <RecentActivity />
      </ScrollView>

      {viewingRecipe && (
        <RecipeDetail meal={nextMeal} onClose={() => setViewingRecipe(false)} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 },
});
