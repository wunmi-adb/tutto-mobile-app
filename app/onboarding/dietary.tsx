import OnboardingTopBar from "@/components/onboarding/OnboardingTopBar";
import Button from "@/components/ui/Button";
import Chip from "@/components/ui/Chip";
import ChipInput from "@/components/ui/ChipInput";
import KeyboardAvoidingContainer from "@/components/ui/KeyboardAvoidingContainer";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COMMON_DIETS = [
  { id: "vegetarian", key: "dietary.options.vegetarian" },
  { id: "vegan", key: "dietary.options.vegan" },
  { id: "pescatarian", key: "dietary.options.pescatarian" },
  { id: "keto", key: "dietary.options.keto" },
  { id: "glutenFree", key: "dietary.options.glutenFree" },
  { id: "dairyFree", key: "dietary.options.dairyFree" },
  { id: "halal", key: "dietary.options.halal" },
  { id: "kosher", key: "dietary.options.kosher" },
  { id: "paleo", key: "dietary.options.paleo" },
  { id: "lowCarb", key: "dietary.options.lowCarb" },
  { id: "whole30", key: "dietary.options.whole30" },
  { id: "mediterranean", key: "dietary.options.mediterranean" },
] as const;

type CommonDietId = (typeof COMMON_DIETS)[number]["id"];

export default function Dietary() {
  const router = useRouter();
  const { t } = useI18n();
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

  return (
    <SafeAreaView style={styles.container}>
      <OnboardingTopBar
        leftAccessory={
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <Feather name="arrow-left" size={16} color={colors.text} />
          </TouchableOpacity>
        }
        rightAccessory={
          <TouchableOpacity onPress={() => router.push("/onboarding/allergies")} activeOpacity={0.7}>
            <Text style={styles.skip}>{t("dietary.skip")}</Text>
          </TouchableOpacity>
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
            onPress={() => router.push("/onboarding/allergies")}
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
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  skip: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.muted,
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
