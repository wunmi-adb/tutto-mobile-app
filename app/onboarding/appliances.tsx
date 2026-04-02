import OnboardingTopBar from "@/components/onboarding/OnboardingTopBar";
import BackButton from "@/components/ui/BackButton";
import Button from "@/components/ui/Button";
import Chip from "@/components/ui/Chip";
import ChipInput from "@/components/ui/ChipInput";
import KeyboardAvoidingContainer from "@/components/ui/KeyboardAvoidingContainer";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COMMON_APPLIANCES = [
  { id: "oven", key: "appliances.options.oven" },
  { id: "microwave", key: "appliances.options.microwave" },
  { id: "airFryer", key: "appliances.options.airFryer" },
  { id: "blender", key: "appliances.options.blender" },
  { id: "toaster", key: "appliances.options.toaster" },
  { id: "slowCooker", key: "appliances.options.slowCooker" },
  { id: "instantPot", key: "appliances.options.instantPot" },
  { id: "foodProcessor", key: "appliances.options.foodProcessor" },
  { id: "standMixer", key: "appliances.options.standMixer" },
  { id: "riceCooker", key: "appliances.options.riceCooker" },
  { id: "grill", key: "appliances.options.grill" },
  { id: "stovetop", key: "appliances.options.stovetop" },
  { id: "dishwasher", key: "appliances.options.dishwasher" },
  { id: "waffleMaker", key: "appliances.options.waffleMaker" },
] as const;

type CommonApplianceId = (typeof COMMON_APPLIANCES)[number]["id"];

export default function Appliances() {
  const router = useRouter();
  const { t } = useI18n();
  const [selectedAppliances, setSelectedAppliances] = useState<CommonApplianceId[]>([]);
  const [customAppliances, setCustomAppliances] = useState<string[]>([]);

  const isSelected = (id: CommonApplianceId) =>
    selectedAppliances.includes(id);

  const toggleChip = (id: CommonApplianceId) => {
    if (isSelected(id)) {
      setSelectedAppliances(selectedAppliances.filter((value) => value !== id));
    } else {
      setSelectedAppliances([...selectedAppliances, id]);
    }
  };

  const addCustom = (value: string) => {
    const exists = customAppliances.some(
      (appliance) => appliance.toLowerCase() === value.toLowerCase(),
    );

    if (!exists) {
      setCustomAppliances((prev) => [...prev, value]);
    }
  };

  const removeCustom = (chip: string) => {
    setCustomAppliances(customAppliances.filter((appliance) => appliance !== chip));
  };
  const canContinue = selectedAppliances.length > 0 || customAppliances.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <OnboardingTopBar leftAccessory={<BackButton onPress={() => router.back()} />} />

      <KeyboardAvoidingContainer style={styles.keyboard}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headingBlock}>
            <Text style={styles.title}>{t("appliances.title")}</Text>
            <Text style={styles.subtitle}>{t("appliances.subtitle")}</Text>
          </View>

          <View style={styles.chipGrid}>
            {COMMON_APPLIANCES.map((appliance) => (
              <Chip
                key={appliance.id}
                label={t(appliance.key)}
                selected={isSelected(appliance.id)}
                onPress={() => toggleChip(appliance.id)}
              />
            ))}
          </View>

          <ChipInput
            label={t("appliances.addCustom")}
            chips={customAppliances}
            onAdd={addCustom}
            onRemove={removeCustom}
            placeholder={t("appliances.customPlaceholder")}
          />

          <Button
            title={t("appliances.cta")}
            disabled={!canContinue}
            onPress={() => router.push("/onboarding/dietary")}
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
