import OnboardingTopBar from "@/components/onboarding/OnboardingTopBar";
import Button from "@/components/ui/Button";
import SelectableRow from "@/components/ui/SelectableRow";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MEALS = [
  { id: "breakfast", label: "Breakfast", time: "Morning" },
  { id: "brunch", label: "Brunch", time: "Late morning" },
  { id: "lunch", label: "Lunch", time: "Midday" },
  { id: "snacks", label: "Snacks", time: "Between meals" },
  { id: "dinner", label: "Dinner", time: "Evening" },
  { id: "supper", label: "Supper", time: "Late evening" },
];

export default function Meals() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <OnboardingTopBar
        leftAccessory={
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <Feather name="arrow-left" size={16} color={colors.text} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headingBlock}>
          <Text style={styles.title}>How does your household eat?</Text>
          <Text style={styles.subtitle}>
            {"Select the meals you typically plan for — we'll tailor your weekly plan around them"}
          </Text>
        </View>

        <View style={styles.list}>
          {MEALS.map((meal) => (
            <SelectableRow
              key={meal.id}
              label={meal.label}
              sublabel={meal.time}
              selected={selected.includes(meal.id)}
              onPress={() => toggle(meal.id)}
            />
          ))}
        </View>

        <Button
          title="Continue"
          disabled={selected.length === 0}
          onPress={() => router.push("/onboarding/storage")}
          style={styles.button}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  headingBlock: {
    marginBottom: 32,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 36,
    lineHeight: 40,
    color: colors.text,
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: fonts.sans,
    fontSize: 14,
    letterSpacing: 0.3,
    color: colors.muted,
    lineHeight: 21,
  },
  list: {
    gap: 12,
  },
  button: {
    marginTop: 24,
  },
});
