import SettingsInviteCodeRow from "@/components/settings/SettingsInviteCodeRow";
import SettingsProfileHeader from "@/components/settings/SettingsProfileHeader";
import SettingsRow from "@/components/settings/SettingsRow";
import SettingsSection from "@/components/settings/SettingsSection";
import SettingsSubscriptionCard from "@/components/settings/SettingsSubscriptionCard";
import { SettingsView } from "@/components/settings/types";
import { colors } from "@/constants/colors";
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
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <SettingsProfileHeader name={profileName} email={email} onBack={onBack} />
        <SettingsSubscriptionCard />

        <SettingsSection title="Kitchen">
          <SettingsRow
            icon={<Feather name="home" size={18} color={colors.muted} />}
            label="Kitchen name"
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
            label="Appliances"
            value={appliancesSummary}
            onPress={() => onOpenView("appliances")}
          />
          <SettingsRow
            icon={<MaterialCommunityIcons name="leaf" size={18} color={colors.muted} />}
            label="Dietary preferences"
            value={dietarySummary}
            onPress={() => onOpenView("dietary")}
          />
          <SettingsRow
            icon={<MaterialCommunityIcons name="shield-alert-outline" size={18} color={colors.muted} />}
            label="Allergies"
            value={allergiesSummary}
            onPress={() => onOpenView("allergies")}
          />
          <SettingsRow
            icon={<Feather name="thumbs-down" size={18} color={colors.muted} />}
            label="Dislikes"
            value={dislikesSummary}
            onPress={() => onOpenView("dislikes")}
          />
          <SettingsRow
            icon={<Feather name="globe" size={18} color={colors.muted} />}
            label="Cuisines"
            value={cuisinesSummary}
            onPress={() => onOpenView("cuisines")}
          />
          <SettingsRow
            icon={<Feather name="clock" size={18} color={colors.muted} />}
            label="Meal slots"
            value={mealSlotsSummary}
            onPress={() => onOpenView("meal-slots")}
          />
          <SettingsRow
            icon={<Feather name="message-square" size={18} color={colors.muted} />}
            label="Anything else?"
            value={anythingElseSummary}
            onPress={() => onOpenView("anything-else")}
          />
        </SettingsSection>

        <SettingsSection title="General">
          <SettingsRow
            icon={<Feather name="globe" size={18} color={colors.muted} />}
            label="Language"
            value={languageLabel}
            onPress={() => onOpenView("language")}
          />
          <SettingsRow
            icon={<Feather name="user" size={18} color={colors.muted} />}
            label="Account"
            onPress={() => onOpenView("account")}
          />
          <SettingsRow
            icon={<Feather name="help-circle" size={18} color={colors.muted} />}
            label="Support & feedback"
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
