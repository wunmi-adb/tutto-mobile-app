import SettingsInviteCodeRow from "@/components/settings/SettingsInviteCodeRow";
import SettingsProfileHeader from "@/components/settings/SettingsProfileHeader";
import SettingsRow from "@/components/settings/SettingsRow";
import SettingsSection from "@/components/settings/SettingsSection";
import SettingsSubscriptionCard from "@/components/settings/SettingsSubscriptionCard";
import Button from "@/components/ui/Button";
import { SettingsView } from "@/components/settings/types";
import { colors } from "@/constants/colors";
import { useI18n } from "@/i18n";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";

type Props = {
  profileName: string;
  email: string;
  kitchenName: string;
  householdSummary: string;
  inviteCode: string;
  dietarySummary: string;
  allergiesSummary: string;
  cuisinesSummary: string;
  languageLabel: string;
  showBackButton?: boolean;
  onBack: () => void;
  onShareInviteCode: () => void;
  inviteDisabled?: boolean;
  onOpenView: (view: SettingsView) => void;
  onDeleteAccount: () => void;
  onLogOut: () => void;
};

export default function SettingsMainView({
  profileName,
  email,
  kitchenName,
  householdSummary,
  inviteCode,
  dietarySummary,
  allergiesSummary,
  cuisinesSummary,
  languageLabel,
  showBackButton = true,
  onBack,
  onShareInviteCode,
  inviteDisabled = false,
  onOpenView,
  onDeleteAccount,
  onLogOut,
}: Props) {
  const { t } = useI18n();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <SettingsProfileHeader
          name={profileName}
          email={email}
          onBack={onBack}
          showBackButton={showBackButton}
        />
        <SettingsSubscriptionCard />

        <SettingsSection title={t("settings.main.sections.kitchen")}>
          <SettingsRow
            icon={<Feather name="home" size={18} color={colors.muted} />}
            label={t("settings.main.kitchenName")}
            value={kitchenName}
            onPress={() => onOpenView("kitchen-name")}
          />
          <SettingsRow
            icon={<Feather name="users" size={18} color={colors.muted} />}
            label={t("settings.main.household")}
            value={householdSummary}
            onPress={() => onOpenView("household")}
          />
          <SettingsInviteCodeRow
            code={inviteCode}
            onPress={onShareInviteCode}
            disabled={inviteDisabled}
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
            icon={<Feather name="globe" size={18} color={colors.muted} />}
            label={t("settings.main.cuisines")}
            value={cuisinesSummary}
            onPress={() => onOpenView("cuisines")}
            showDivider={false}
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
          <SettingsRow
            icon={<Feather name="trash-2" size={18} color={colors.danger} />}
            label={t("settings.main.deleteAccount")}
            onPress={onDeleteAccount}
            danger
            showDivider={false}
          />
        </SettingsSection>

        <Button
          title={t("settings.logout.button")}
          variant="soft"
          onPress={onLogOut}
          style={styles.logoutButton}
        />
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
  logoutButton: {
    width: "100%",
    marginTop: 40,
  },
});
