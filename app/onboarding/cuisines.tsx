import OnboardingBackButton from "@/components/onboarding/OnboardingBackButton";
import OnboardingTopBar from "@/components/onboarding/OnboardingTopBar";
import Button from "@/components/ui/Button";
import Chip from "@/components/ui/Chip";
import ChipInput from "@/components/ui/ChipInput";
import KeyboardAvoidingContainer from "@/components/ui/KeyboardAvoidingContainer";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import { handleCaughtApiError } from "@/lib/api/handle-caught-api-error";
import { useUpdateHouseholdProfile } from "@/lib/api/household";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COMMON_CUISINES = [
  { id: "italian", key: "cuisines.options.italian" },
  { id: "japanese", key: "cuisines.options.japanese" },
  { id: "mexican", key: "cuisines.options.mexican" },
  { id: "indian", key: "cuisines.options.indian" },
  { id: "thai", key: "cuisines.options.thai" },
  { id: "chinese", key: "cuisines.options.chinese" },
  { id: "korean", key: "cuisines.options.korean" },
  { id: "french", key: "cuisines.options.french" },
  { id: "mediterranean", key: "cuisines.options.mediterranean" },
  { id: "ethiopian", key: "cuisines.options.ethiopian" },
  { id: "vietnamese", key: "cuisines.options.vietnamese" },
  { id: "greek", key: "cuisines.options.greek" },
  { id: "middleEastern", key: "cuisines.options.middleEastern" },
  { id: "american", key: "cuisines.options.american" },
] as const;

type CommonCuisineId = (typeof COMMON_CUISINES)[number]["id"];

export default function Cuisines() {
  const router = useRouter();
  const { t } = useI18n();
  const updateHouseholdMutation = useUpdateHouseholdProfile();
  const [selectedCuisines, setSelectedCuisines] = useState<CommonCuisineId[]>([]);
  const [customCuisines, setCustomCuisines] = useState<string[]>([]);

  const isSelected = (id: CommonCuisineId) => selectedCuisines.includes(id);

  const toggleChip = (id: CommonCuisineId) => {
    if (isSelected(id)) {
      setSelectedCuisines(selectedCuisines.filter((value) => value !== id));
    } else {
      setSelectedCuisines([...selectedCuisines, id]);
    }
  };

  const addCustom = (value: string) => {
    const exists = customCuisines.some((cuisine) => cuisine.toLowerCase() === value.toLowerCase());

    if (!exists) {
      setCustomCuisines((prev) => [...prev, value]);
    }
  };

  const removeCustom = (chip: string) => {
    setCustomCuisines(customCuisines.filter((cuisine) => cuisine !== chip));
  };
  const canContinue = selectedCuisines.length > 0 || customCuisines.length > 0;

  const handleContinue = async () => {
    if (updateHouseholdMutation.isPending) {
      return;
    }

    const selectedValues = COMMON_CUISINES
      .filter((cuisine) => selectedCuisines.includes(cuisine.id))
      .map((cuisine) => t(cuisine.key));
    const customValues = customCuisines.map((cuisine) => cuisine.trim()).filter(Boolean);

    try {
      await updateHouseholdMutation.mutateAsync({
        love: [...selectedValues, ...customValues].join(", "),
      });

      router.replace("/onboarding/meals");
    } catch (error) {
      handleCaughtApiError(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <OnboardingTopBar leftAccessory={<OnboardingBackButton />} />

      <KeyboardAvoidingContainer style={styles.keyboard}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headingBlock}>
            <Text style={styles.title}>{t("cuisines.title")}</Text>
            <Text style={styles.subtitle}>{t("cuisines.subtitle")}</Text>
          </View>

          <View style={styles.chipGrid}>
            {COMMON_CUISINES.map((cuisine) => (
              <Chip
                key={cuisine.id}
                label={t(cuisine.key)}
                selected={isSelected(cuisine.id)}
                onPress={() => toggleChip(cuisine.id)}
              />
            ))}
          </View>

          <ChipInput
            label={t("cuisines.addCustom")}
            chips={customCuisines}
            onAdd={addCustom}
            onRemove={removeCustom}
            placeholder={t("cuisines.customPlaceholder")}
          />

          <Button
            title={t("cuisines.cta")}
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
