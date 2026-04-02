import OnboardingBackButton from "@/components/onboarding/OnboardingBackButton";
import OnboardingTopBar from "@/components/onboarding/OnboardingTopBar";
import Button from "@/components/ui/Button";
import Chip from "@/components/ui/Chip";
import ChipInput from "@/components/ui/ChipInput";
import KeyboardAvoidingContainer from "@/components/ui/KeyboardAvoidingContainer";
import SkipButton from "@/components/ui/SkipButton";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import { useUpdateHouseholdProfile } from "@/lib/api/household";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COMMON_DIETS = [
  { id: "vegetarian", key: "dietary.options.vegetarian" },
  { id: "keto", key: "dietary.options.keto" },
  { id: "glutenFree", key: "dietary.options.glutenFree" },
  { id: "dairyFree", key: "dietary.options.dairyFree" },
  { id: "halal", key: "dietary.options.halal" },
  { id: "lowCarb", key: "dietary.options.lowCarb" },
] as const;

type CommonDietId = (typeof COMMON_DIETS)[number]["id"];

export default function Dietary() {
  const router = useRouter();
  const { t } = useI18n();
  const updateHouseholdMutation = useUpdateHouseholdProfile();
  const [selectedDiets, setSelectedDiets] = useState<CommonDietId[]>([]);
  const [customDiets, setCustomDiets] = useState<string[]>([]);

  const isSelected = (id: CommonDietId) => selectedDiets.includes(id);

  const toggleChip = (id: CommonDietId) => {
    if (isSelected(id)) {
      setSelectedDiets(selectedDiets.filter((value) => value !== id));
    } else {
      setSelectedDiets([...selectedDiets, id]);
    }
  };

  const addCustom = (value: string) => {
    const exists = customDiets.some((diet) => diet.toLowerCase() === value.toLowerCase());

    if (!exists) {
      setCustomDiets((prev) => [...prev, value]);
    }
  };

  const removeCustom = (chip: string) => {
    setCustomDiets(customDiets.filter((diet) => diet !== chip));
  };
  const canContinue = selectedDiets.length > 0 || customDiets.length > 0;

  const handleContinue = async () => {
    if (updateHouseholdMutation.isPending) {
      return;
    }

    const selectedValues = COMMON_DIETS
      .filter((diet) => selectedDiets.includes(diet.id))
      .map((diet) => t(diet.key));
    const customValues = customDiets.map((diet) => diet.trim()).filter(Boolean);

    try {
      await updateHouseholdMutation.mutateAsync({
        dietary: [...selectedValues, ...customValues].join(", "),
      });

      router.replace("/onboarding/allergies");
    } catch {
      // The mutation hook already shows the translated error toast.
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <OnboardingTopBar
        leftAccessory={<OnboardingBackButton />}
        rightAccessory={
          <SkipButton label={t("dietary.skip")} onPress={() => router.replace("/onboarding/allergies")} />
        }
      />

      <KeyboardAvoidingContainer style={styles.keyboard}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headingBlock}>
            <Text style={styles.title}>{t("dietary.title")}</Text>
            <Text style={styles.subtitle}>{t("dietary.subtitle")}</Text>
          </View>

          <View style={styles.chipGrid}>
            {COMMON_DIETS.map((diet) => (
              <Chip
                key={diet.id}
                label={t(diet.key)}
                selected={isSelected(diet.id)}
                onPress={() => toggleChip(diet.id)}
              />
            ))}
          </View>

          <ChipInput
            label={t("dietary.addCustom")}
            chips={customDiets}
            onAdd={addCustom}
            onRemove={removeCustom}
            placeholder={t("dietary.customPlaceholder")}
          />

          <Button
            title={t("dietary.cta")}
            disabled={!canContinue}
            loading={updateHouseholdMutation.isPending}
            onPress={() => {
              void handleContinue();
            }}
            style={styles.button}
          />
        </ScrollView>
      </KeyboardAvoidingContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboard: {
    flex: 1,
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
  chipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 24,
  },
  button: {
    marginTop: 24,
  },
});
