import OnboardingBackButton from "@/components/onboarding/OnboardingBackButton";
import OnboardingTopBar from "@/components/onboarding/OnboardingTopBar";
import Button from "@/components/ui/Button";
import SelectableRow from "@/components/ui/SelectableRow";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import { useUpdateHouseholdProfile } from "@/lib/api/household";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MEALS = [
  { id: "breakfast", labelKey: "meals.options.breakfast.label", timeKey: "meals.options.breakfast.time" },
  { id: "brunch", labelKey: "meals.options.brunch.label", timeKey: "meals.options.brunch.time" },
  { id: "lunch", labelKey: "meals.options.lunch.label", timeKey: "meals.options.lunch.time" },
  { id: "snacks", labelKey: "meals.options.snacks.label", timeKey: "meals.options.snacks.time" },
  { id: "dinner", labelKey: "meals.options.dinner.label", timeKey: "meals.options.dinner.time" },
  { id: "supper", labelKey: "meals.options.supper.label", timeKey: "meals.options.supper.time" },
] as const;

type MealId = (typeof MEALS)[number]["id"];

export default function Meals() {
  const router = useRouter();
  const { t } = useI18n();
  const updateHouseholdMutation = useUpdateHouseholdProfile();
  const [selected, setSelected] = useState<MealId[]>([]);

  const toggle = (id: MealId) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const handleContinue = async () => {
    if (updateHouseholdMutation.isPending) {
      return;
    }

    const selectedValues = MEALS
      .filter((meal) => selected.includes(meal.id))
      .map((meal) => meal.id);

    try {
      await updateHouseholdMutation.mutateAsync({
        meals: selectedValues.join(", "),
      });

      router.replace("/onboarding/storage");
    } catch {
      // The mutation hook already shows the translated error toast.
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <OnboardingTopBar leftAccessory={<OnboardingBackButton />} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headingBlock}>
          <Text style={styles.title}>{t("meals.title")}</Text>
          <Text style={styles.subtitle}>{t("meals.subtitle")}</Text>
        </View>

        <View style={styles.list}>
          {MEALS.map((meal) => (
            <SelectableRow
              key={meal.id}
              label={t(meal.labelKey)}
              sublabel={t(meal.timeKey)}
              selected={selected.includes(meal.id)}
              onPress={() => toggle(meal.id)}
            />
          ))}
        </View>

        <Button
          title={t("meals.cta")}
          disabled={selected.length === 0}
          loading={updateHouseholdMutation.isPending}
          onPress={() => {
            void handleContinue();
          }}
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
