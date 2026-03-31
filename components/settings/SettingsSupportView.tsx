import SettingsDetailLayout from "@/components/settings/SettingsDetailLayout";
import SettingsRow from "@/components/settings/SettingsRow";
import { colors } from "@/constants/colors";
import { Feather } from "@expo/vector-icons";
import * as Linking from "expo-linking";

type Props = {
  onBack: () => void;
};

export default function SettingsSupportView({ onBack }: Props) {
  return (
    <SettingsDetailLayout
      title="Support & feedback"
      subtitle="Need help or want to share an idea? We’re listening."
      onBack={onBack}
    >
      <SettingsRow
        icon={<Feather name="mail" size={18} color={colors.muted} />}
        label="Email support"
        value="hello@tutto.app"
        onPress={() => Linking.openURL("mailto:hello@tutto.app")}
      />
      <SettingsRow
        icon={<Feather name="message-circle" size={18} color={colors.muted} />}
        label="Share feedback"
        value="Tell us what would make Tutto better"
        onPress={() => Linking.openURL("mailto:hello@tutto.app?subject=Tutto%20feedback")}
      />
      <SettingsRow
        icon={<Feather name="shield" size={18} color={colors.muted} />}
        label="Privacy policy"
        value="Review how your data is handled"
        onPress={() => Linking.openURL("https://example.com/privacy")}
      />
    </SettingsDetailLayout>
  );
}
