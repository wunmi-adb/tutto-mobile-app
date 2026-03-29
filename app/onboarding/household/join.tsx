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
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HouseholdJoin() {
  const router = useRouter();
  const { t } = useI18n();
  const [inviteCode, setInviteCode] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <OnboardingTopBar
        leftAccessory={
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <Feather name="arrow-left" size={16} color={colors.text} />
          </TouchableOpacity>
        }
      />

      <KeyboardAvoidingContainer style={styles.content} extraOffset>
        <View style={styles.headingBlock}>
          <Text style={styles.title}>{t("household.join.title")}</Text>
          <Text style={styles.subtitle}>{t("household.join.subtitle")}</Text>
        </View>

        <View style={{ flex: 1 }}>
          <Input
            label={t("household.join.codeLabel")}
            variant="code"
            value={inviteCode}
            onChangeText={(v) => setInviteCode(v.toUpperCase())}
            placeholder={t("household.join.codePlaceholder")}
            maxLength={14}
            autoCapitalize="characters"
          />
        </View>

        <Button
          title={t("household.join.cta")}
          disabled={inviteCode.length < 4}
          onPress={() => router.push("/onboarding/notifications")}
        />
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
    paddingHorizontal: 32,
    paddingTop: 16,
    paddingBottom: 32,
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
});
