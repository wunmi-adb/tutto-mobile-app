import SettingsInviteCodeRow from "@/components/settings/SettingsInviteCodeRow";
import SettingsProfileHeader from "@/components/settings/SettingsProfileHeader";
import SettingsRow from "@/components/settings/SettingsRow";
import SettingsSection from "@/components/settings/SettingsSection";
import SettingsSubscriptionCard from "@/components/settings/SettingsSubscriptionCard";
import { SettingsView } from "@/components/settings/types";
import { colors } from "@/constants/colors";
import { useI18n } from "@/i18n";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";

type Props = {
  profileName: string;
  email: string;
  kitchenName: string;
  inviteCode: string;
  copied: boolean;
  appliancesSummary: string;
  dietarySummary: string;
  allergiesSummary: string;
  dislikesSummary: string;
  cuisinesSummary: string;
  mealSlotsSummary: string;
  languageLabel: string;
  anythingElseSummary: string;
  onBack: () => void;
  onCopyInviteCode: () => void;
  onOpenView: (view: SettingsView) => void;
};

export default function SettingsMainView({
  profileName,
  email,
  kitchenName,
  inviteCode,
  copied,
  appliancesSummary,
  dietarySummary,
  allergiesSummary,
  dislikesSummary,
  cuisinesSummary,
  mealSlotsSummary,
  languageLabel,
  anythingElseSummary,
  onBack,
  onCopyInviteCode,
  onOpenView,
}: Props) {
  const { t } = useI18n();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <SettingsProfileHeader name={profileName} email={email} onBack={onBack} />
        <SettingsSubscriptionCard />

        <SettingsSection title={t("settings.main.sections.kitchen")}>
          <SettingsRow
            icon={<Feather name="home" size={18} color={colors.muted} />}
            label={t("settings.main.kitchenName")}
            value={kitchenName}
            onPress={() => onOpenView("kitchen-name")}
          />
          <SettingsInviteCodeRow
            code={inviteCode}
            copied={copied}
            onCopy={onCopyInviteCode}
          />
          <SettingsRow
            icon={<MaterialCommunityIcons name="silverware-fork-knife" size={18} color={colors.muted} />}
            label={t("settings.main.appliances")}
            value={appliancesSummary}
            onPress={() => onOpenView("appliances")}
          />
          <SettingsRow
            icon={<MaterialCommunityIcons name="leaf" size={18} color={colors.muted} />}
            label={t("settings.main.dietary")}
            value={dietarySummary}
            onPress={() => onOpenView("dietary")}
          />
          <SettingsRow
            icon={<MaterialCommunityIcons name="shield-alert-outline" size={18} color={colors.muted} />}
            label={t("settings.main.allergies")}
            value={allergiesSummary}
            onPress={() => onOpenView("allergies")}
          />
          <SettingsRow
            icon={<Feather name="thumbs-down" size={18} color={colors.muted} />}
            label={t("settings.main.dislikes")}
            value={dislikesSummary}
            onPress={() => onOpenView("dislikes")}
          />
          <SettingsRow
            icon={<Feather name="globe" size={18} color={colors.muted} />}
            label={t("settings.main.cuisines")}
            value={cuisinesSummary}
            onPress={() => onOpenView("cuisines")}
          />
          <SettingsRow
            icon={<Feather name="clock" size={18} color={colors.muted} />}
            label={t("settings.main.mealSlots")}
            value={mealSlotsSummary}
            onPress={() => onOpenView("meal-slots")}
          />
          <SettingsRow
            icon={<Feather name="message-square" size={18} color={colors.muted} />}
            label={t("settings.main.anythingElse")}
            value={anythingElseSummary}
            onPress={() => onOpenView("anything-else")}
          />
        </SettingsSection>

        <SettingsSection title={t("settings.main.sections.general")}>
          <SettingsRow
            icon={<Feather name="globe" size={18} color={colors.muted} />}
            label={t("settings.main.language")}
            value={languageLabel}
            onPress={() => onOpenView("language")}
          />
          <SettingsRow
            icon={<Feather name="user" size={18} color={colors.muted} />}
            label={t("settings.main.account")}
            onPress={() => onOpenView("account")}
          />
          <SettingsRow
            icon={<Feather name="help-circle" size={18} color={colors.muted} />}
            label={t("settings.main.support")}
            onPress={() => onOpenView("support")}
          />
        </SettingsSection>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 32,
  },
});
