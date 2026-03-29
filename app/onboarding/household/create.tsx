import OnboardingTopBar from "@/components/onboarding/OnboardingTopBar";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import KeyboardAvoidingContainer from "@/components/ui/KeyboardAvoidingContainer";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HouseholdCreate() {
  const router = useRouter();
  const { t } = useI18n();
  const [householdName, setHouseholdName] = useState("");
  const [memberCount, setMemberCount] = useState(2);

  return (
    <SafeAreaView style={styles.container}>
      <OnboardingTopBar
        leftAccessory={
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <Feather name="arrow-left" size={16} color={colors.text} />
          </TouchableOpacity>
        }
      />

      <KeyboardAvoidingContainer style={styles.content}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headingBlock}>
            <Text style={styles.title}>{t("household.create.title")}</Text>
            <Text style={styles.subtitle}>
              {t("household.create.subtitle")}
            </Text>
          </View>

          <View style={styles.fields}>
            <Input
              label={t("household.create.nameLabel")}
              value={householdName}
              onChangeText={setHouseholdName}
              placeholder={t("household.create.namePlaceholder")}
            />

            <View>
              <Text style={styles.label}>{t("household.create.peopleLabel")}</Text>
              <View style={styles.stepper}>
                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => setMemberCount(Math.max(1, memberCount - 1))}
                  activeOpacity={0.7}
                >
                  <Feather name="minus" size={16} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.stepperValue}>{memberCount}</Text>
                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => setMemberCount(Math.min(12, memberCount + 1))}
                  activeOpacity={0.7}
                >
                  <Feather name="plus" size={16} color={colors.text} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title={t("household.create.cta")}
            disabled={householdName.trim().length < 2}
            onPress={() => router.push("/onboarding/notifications")}
            style={styles.button}
          />
        </View>
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
  content: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 32,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headingBlock: {
    marginBottom: 40,
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
  },
  fields: {
    gap: 24,
  },
  footer: {
    paddingHorizontal: 32,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: colors.background,
  },
  label: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    letterSpacing: 0.5,
    color: colors.muted,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  stepperBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperValue: {
    fontFamily: fonts.sansMedium,
    fontSize: 28,
    color: colors.text,
    width: 32,
    textAlign: "center",
  },
  button: {
    marginTop: 0,
  },
});
