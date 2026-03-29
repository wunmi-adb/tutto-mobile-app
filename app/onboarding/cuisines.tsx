import OnboardingTopBar from "@/components/onboarding/OnboardingTopBar";
import Button from "@/components/ui/Button";
import Chip from "@/components/ui/Chip";
import ChipInput from "@/components/ui/ChipInput";
import KeyboardAvoidingContainer from "@/components/ui/KeyboardAvoidingContainer";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COMMON_CUISINES = [
  "Italian",
  "Japanese",
  "Mexican",
  "Indian",
  "Thai",
  "Chinese",
  "Korean",
  "French",
  "Mediterranean",
  "Ethiopian",
  "Vietnamese",
  "Greek",
  "Middle Eastern",
  "American",
];

export default function Cuisines() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  const isSelected = (name: string) =>
    selected.some((c) => c.toLowerCase() === name.toLowerCase());

  const toggleChip = (name: string) => {
    if (isSelected(name)) {
      setSelected(selected.filter((c) => c.toLowerCase() !== name.toLowerCase()));
    } else {
      setSelected([...selected, name]);
    }
  };

  const addCustom = (value: string) => {
    if (!isSelected(value)) {
      setSelected((prev) => [...prev, value]);
    }
  };

  const removeCustom = (chip: string) => {
    setSelected(selected.filter((c) => c !== chip));
  };

  const customChips = selected.filter(
    (c) => !COMMON_CUISINES.some((a) => a.toLowerCase() === c.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <OnboardingTopBar
        leftAccessory={
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <Feather name="arrow-left" size={16} color={colors.text} />
          </TouchableOpacity>
        }
        rightAccessory={
          <TouchableOpacity onPress={() => router.push("/onboarding/meals")} activeOpacity={0.7}>
            <Text style={styles.skip}>Skip</Text>
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
          <Text style={styles.title}>What do you love to eat?</Text>
          <Text style={styles.subtitle}>
            Tell us your favourite cuisines so we can inspire your next meal
          </Text>
        </View>

        <View style={styles.chipGrid}>
          {COMMON_CUISINES.map((name) => (
            <Chip
              key={name}
              label={name}
              selected={isSelected(name)}
              onPress={() => toggleChip(name)}
            />
          ))}
        </View>

        <ChipInput
          label="ADD CUSTOM"
          chips={customChips}
          onAdd={addCustom}
          onRemove={removeCustom}
        />

        <Button
          title="Continue"
          disabled={selected.length === 0}
          onPress={() => router.push("/onboarding/meals")}
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
