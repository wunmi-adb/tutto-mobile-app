import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { Feather } from "@expo/vector-icons";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NextMealInfo } from "./data";

interface Props {
  meal: NextMealInfo;
  onClose: () => void;
}

export default function RecipeDetail({ meal, onClose }: Props) {
  return (
    <Modal animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={onClose}>
              <Feather name="arrow-left" size={16} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.mealType}>{meal.type.toUpperCase()}</Text>
            <View style={styles.backBtn} />
          </View>

          <Text style={styles.title}>{meal.name}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Feather name="clock" size={14} color={colors.muted} />
              <Text style={styles.metaText}>{meal.time}</Text>
            </View>
            <View style={styles.metaItem}>
              <Feather name="users" size={14} color={colors.muted} />
              <Text style={styles.metaText}>{meal.servings} servings</Text>
            </View>
            <View style={styles.metaItem}>
              <Feather name="zap" size={14} color={colors.muted} />
              <Text style={styles.metaText}>{meal.calories} cal</Text>
            </View>
          </View>

          <View style={styles.macroRow}>
            {[{ label: "Protein", value: meal.protein }, { label: "Carbs", value: meal.carbs }, { label: "Fat", value: meal.fat }].map((m) => (
              <View key={m.label} style={styles.macroCard}>
                <Text style={styles.macroValue}>{m.value}</Text>
                <Text style={styles.macroLabel}>{m.label.toUpperCase()}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionHeading}>INGREDIENTS</Text>
          {meal.ingredients.map((ing, i) => (
            <View key={i} style={styles.ingredientRow}>
              <View style={styles.dot} />
              <Text style={styles.ingredientText}>{ing}</Text>
            </View>
          ))}

          <Text style={[styles.sectionHeading, { marginTop: 24 }]}>INSTRUCTIONS</Text>
          {meal.steps.map((step, i) => (
            <View key={i} style={styles.stepRow}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>{i + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: 24, paddingBottom: 48 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 16 },
  backBtn: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" },
  mealType: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.muted, letterSpacing: 1 },
  title: { fontFamily: fonts.serif, fontSize: 28, lineHeight: 32, color: colors.text, marginBottom: 16 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 20 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  metaText: { fontFamily: fonts.sans, fontSize: 12, color: colors.muted },
  macroRow: { flexDirection: "row", gap: 10, marginBottom: 28 },
  macroCard: { flex: 1, backgroundColor: colors.secondary, borderRadius: 12, padding: 12, alignItems: "center" },
  macroValue: { fontFamily: fonts.sansMedium, fontSize: 14, color: colors.text },
  macroLabel: { fontFamily: fonts.sans, fontSize: 10, color: colors.muted, letterSpacing: 0.8, marginTop: 2 },
  sectionHeading: { fontFamily: fonts.sansMedium, fontSize: 11, color: colors.muted, letterSpacing: 1, marginBottom: 12 },
  ingredientRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 8 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.text + "4d", flexShrink: 0 },
  ingredientText: { fontFamily: fonts.sans, fontSize: 14, color: colors.text },
  stepRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
  stepNum: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.text, alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 },
  stepNumText: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.background },
  stepText: { flex: 1, fontFamily: fonts.sans, fontSize: 14, color: colors.text, lineHeight: 21 },
});
