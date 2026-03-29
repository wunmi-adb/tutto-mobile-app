import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NextMealInfo } from "./data";

interface Props {
  meal: NextMealInfo;
  onShuffle: () => void;
  onViewRecipe: () => void;
}

export default function MealCard({ meal, onShuffle, onViewRecipe }: Props) {
  const router = useRouter();

  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{"TONIGHT'S DINNER"}</Text>
        <TouchableOpacity activeOpacity={0.7} onPress={() => router.push("/kitchen")}>
          <View style={styles.viewAllRow}>
            <Text style={styles.viewAll}>Meal plan</Text>
            <Feather name="arrow-right" size={10} color={colors.text} />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.mealCard}>
        <TouchableOpacity style={styles.mealCardBody} activeOpacity={0.7} onPress={onViewRecipe}>
          <View style={styles.mealCardLeft}>
            <Text style={styles.mealName}>{meal.name}</Text>
            <View style={styles.mealMeta}>
              <Feather name="clock" size={11} color={colors.muted} />
              <Text style={styles.mealMetaText}>{meal.time}</Text>
              <Feather name="zap" size={11} color={colors.muted} />
              <Text style={styles.mealMetaText}>{meal.calories} cal</Text>
              <Feather name="users" size={11} color={colors.muted} />
              <Text style={styles.mealMetaText}>{meal.servings} servings</Text>
            </View>
            <View style={styles.macroPills}>
              {[{ l: "P", v: meal.protein }, { l: "C", v: meal.carbs }, { l: "F", v: meal.fat }].map((m) => (
                <View key={m.l} style={styles.macroPill}>
                  <Text style={styles.macroPillText}>{m.l}: {m.v}</Text>
                </View>
              ))}
            </View>
          </View>
         
        </TouchableOpacity>

        <View style={styles.mealActions}>
          <TouchableOpacity style={[styles.mealAction, styles.mealActionBorder]} activeOpacity={0.7} onPress={onShuffle}>
            <Feather name="shuffle" size={13} color={colors.muted} />
            <Text style={styles.mealActionText}>Change</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.mealAction, styles.mealActionBorder]} activeOpacity={0.7} onPress={onViewRecipe}>
            <Feather name="eye" size={13} color={colors.muted} />
            <Text style={[styles.mealActionText]}>View recipe</Text>
          </TouchableOpacity>
        
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  sectionTitle: { fontFamily: fonts.sansMedium, fontSize: 11, color: colors.muted, letterSpacing: 1 },
  viewAllRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  viewAll: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.text },
  mealCard: { borderRadius: 16, borderWidth: 1, borderColor: colors.border, overflow: "hidden", marginBottom: 28 },
  mealCardBody: { flexDirection: "row", alignItems: "flex-start", padding: 20, gap: 12 },
  mealCardLeft: { flex: 1 },
  mealName: { fontFamily: fonts.serif, fontSize: 18, lineHeight: 22, color: colors.text, marginBottom: 8 },
  mealMeta: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 6, marginBottom: 10 },
  mealMetaText: { fontFamily: fonts.sans, fontSize: 11, color: colors.muted },
  mealEmoji: { width: 56, height: 56, borderRadius: 12, backgroundColor: colors.secondary, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  macroPills: { flexDirection: "row", gap: 6 },
  macroPill: { backgroundColor: colors.secondary, borderRadius: 100, paddingHorizontal: 10, paddingVertical: 3 },
  macroPillText: { fontFamily: fonts.sans, fontSize: 10, color: colors.muted },
  mealActions: { flexDirection: "row", borderTopWidth: 1, borderTopColor: colors.border },
  mealAction: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5, paddingVertical: 12 },
  mealActionBorder: { borderRightWidth: 1, borderRightColor: colors.border },
  mealActionText: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.muted },
});
