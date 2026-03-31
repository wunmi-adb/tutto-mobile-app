import ExpiringSection from "@/components/kitchen/home/ExpiringSection";
import HomeHeader from "@/components/kitchen/home/HomeHeader";
import MealCard from "@/components/kitchen/home/MealCard";
import RecentActivity from "@/components/kitchen/home/RecentActivity";
import RecipeDetail from "@/components/kitchen/home/RecipeDetail";
import StatsRow from "@/components/kitchen/home/StatsRow";
import { HOME_MEAL_IDS, type RecipeId } from "@/components/kitchen/data";
import { colors } from "@/constants/colors";
import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeTab() {
  const [nextMealId, setNextMealId] = useState<RecipeId>(HOME_MEAL_IDS[0]);
  const [viewingRecipe, setViewingRecipe] = useState(false);

  const shuffleMeal = () => {
    const otherMealIds = HOME_MEAL_IDS.filter((mealId) => mealId !== nextMealId);
    setNextMealId(otherMealIds[Math.floor(Math.random() * otherMealIds.length)]);
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
        <MealCard mealId={nextMealId} onShuffle={shuffleMeal} onViewRecipe={() => setViewingRecipe(true)} />
        <RecentActivity />
      </ScrollView>

      {viewingRecipe && (
        <RecipeDetail mealId={nextMealId} onClose={() => setViewingRecipe(false)} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 },
});
