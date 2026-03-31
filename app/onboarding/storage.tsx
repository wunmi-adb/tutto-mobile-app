import OnboardingTopBar from "@/components/onboarding/OnboardingTopBar";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import KeyboardAvoidingContainer from "@/components/ui/KeyboardAvoidingContainer";
import SelectableRow from "@/components/ui/SelectableRow";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LOCATIONS = [
  { id: "fridge", key: "storage.options.fridge" },
  { id: "freezer", key: "storage.options.freezer" },
  { id: "pantry", key: "storage.options.pantry" },
  { id: "spice-rack", key: "storage.options.spiceRack" },
] as const;

type LocationId = (typeof LOCATIONS)[number]["id"];

export default function Storage() {
  const router = useRouter();
  const { t } = useI18n();
  const [selected, setSelected] = useState<LocationId | "custom" | null>(null);
  const [customName, setCustomName] = useState("");

  const handleSelect = (id: LocationId) => {
    setSelected(id);
    setCustomName("");
  };

  const handleSelectCustom = () => {
    setSelected("custom");
    setCustomName("");
  };

  const canContinue = selected === "custom" ? customName.trim().length > 0 : !!selected;

  return (
    <SafeAreaView style={styles.container}>
      <OnboardingTopBar
        leftAccessory={
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <Feather name="arrow-left" size={16} color={colors.text} />
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
            <Text style={styles.title}>{t("storage.title")}</Text>
            <Text style={styles.subtitle}>{t("storage.subtitle")}</Text>
          </View>

          <View style={styles.list}>
            {LOCATIONS.map((loc) => (
              <SelectableRow
                key={loc.id}
                label={t(loc.key)}
                selected={selected === loc.id}
                onPress={() => handleSelect(loc.id)}
                variant="radio"
              />
            ))}
            <SelectableRow
              label={t("storage.options.custom")}
              selected={selected === "custom"}
              onPress={handleSelectCustom}
              variant="radio"
              dashed
            />
          </View>

          {selected === "custom" && (
            <Input
              label={t("storage.customLabel")}
              value={customName}
              onChangeText={setCustomName}
              placeholder={t("storage.customPlaceholder")}
              autoFocus
              containerStyle={styles.customInput}
            />
          )}

          <Button
            title={t("storage.cta")}
            disabled={!canContinue}
            onPress={() => {
              const locationName =
                selected === "custom"
                  ? customName
                  : selected
                    ? t(LOCATIONS.find((l) => l.id === selected)?.key ?? "storage.options.fridge")
                    : t("storage.options.fridge");
              router.push({ pathname: "/onboarding/add-items", params: { location: locationName } });
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
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
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
  list: {
    gap: 10,
    marginBottom: 24,
  },
  customInput: {
    marginBottom: 8,
  },
  button: {
    marginTop: 8,
  },
});
