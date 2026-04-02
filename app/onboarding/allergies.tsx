import OnboardingTopBar from "@/components/onboarding/OnboardingTopBar";
import BackButton from "@/components/ui/BackButton";
import Button from "@/components/ui/Button";
import Chip from "@/components/ui/Chip";
import ChipInput from "@/components/ui/ChipInput";
import KeyboardAvoidingContainer from "@/components/ui/KeyboardAvoidingContainer";
import SkipButton from "@/components/ui/SkipButton";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COMMON_ALLERGIES = [
  { id: "peanuts", key: "allergies.options.peanuts" },
  { id: "treeNuts", key: "allergies.options.treeNuts" },
  { id: "milk", key: "allergies.options.milk" },
  { id: "eggs", key: "allergies.options.eggs" },
  { id: "wheat", key: "allergies.options.wheat" },
  { id: "soy", key: "allergies.options.soy" },
  { id: "fish", key: "allergies.options.fish" },
  { id: "shellfish", key: "allergies.options.shellfish" },
  { id: "sesame", key: "allergies.options.sesame" },
  { id: "gluten", key: "allergies.options.gluten" },
  { id: "corn", key: "allergies.options.corn" },
  { id: "mustard", key: "allergies.options.mustard" },
  { id: "celery", key: "allergies.options.celery" },
  { id: "lupin", key: "allergies.options.lupin" },
] as const;

type CommonAllergyId = (typeof COMMON_ALLERGIES)[number]["id"];

export default function Allergies() {
  const router = useRouter();
  const { t } = useI18n();
  const [selectedAllergies, setSelectedAllergies] = useState<CommonAllergyId[]>([]);
  const [customAllergies, setCustomAllergies] = useState<string[]>([]);

  const isSelected = (id: CommonAllergyId) => selectedAllergies.includes(id);

  const toggleChip = (id: CommonAllergyId) => {
    if (isSelected(id)) {
      setSelectedAllergies(selectedAllergies.filter((value) => value !== id));
    } else {
      setSelectedAllergies([...selectedAllergies, id]);
    }
  };

  const addCustom = (value: string) => {
    const exists = customAllergies.some((allergy) => allergy.toLowerCase() === value.toLowerCase());

    if (!exists) {
      setCustomAllergies((prev) => [...prev, value]);
    }
  };

  const removeCustom = (chip: string) => {
    setCustomAllergies(customAllergies.filter((allergy) => allergy !== chip));
  };
  const canContinue = selectedAllergies.length > 0 || customAllergies.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <OnboardingTopBar
        leftAccessory={<BackButton onPress={() => router.back()} />}
        rightAccessory={
          <SkipButton label={t("allergies.skip")} onPress={() => router.push("/onboarding/cuisines")} />
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
            <Text style={styles.title}>{t("allergies.title")}</Text>
            <Text style={styles.subtitle}>{t("allergies.subtitle")}</Text>
          </View>

          <View style={styles.chipGrid}>
            {COMMON_ALLERGIES.map((allergy) => (
              <Chip
                key={allergy.id}
                label={t(allergy.key)}
                selected={isSelected(allergy.id)}
                onPress={() => toggleChip(allergy.id)}
              />
            ))}
          </View>

          <ChipInput
            label={t("allergies.addCustom")}
            chips={customAllergies}
            onAdd={addCustom}
            onRemove={removeCustom}
            placeholder={t("allergies.customPlaceholder")}
          />

          <Button
            title={t("allergies.cta")}
            disabled={!canContinue}
            onPress={() => router.push("/onboarding/cuisines")}
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
