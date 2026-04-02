import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useI18n } from "@/i18n";
import SettingsDetailLayout from "./SettingsDetailLayout";
import { StyleSheet, View } from "react-native";

type Props = {
  name: string;
  email: string;
  onChangeName: (value: string) => void;
  onChangeEmail: (value: string) => void;
  onBack: () => void;
};

export default function SettingsAccountEditor({
  name,
  email,
  onChangeName,
  onChangeEmail,
  onBack,
}: Props) {
  const { t } = useI18n();

  return (
    <SettingsDetailLayout
      title={t("settings.account.title")}
      subtitle={t("settings.account.subtitle")}
      onBack={onBack}
      footer={<Button title={t("settings.common.save")} onPress={onBack} />}
    >
      <View style={styles.fields}>
        <Input
          label={t("settings.account.nameLabel")}
          value={name}
          onChangeText={onChangeName}
          placeholder={t("settings.account.namePlaceholder")}
        />
        <Input
          label={t("settings.account.emailLabel")}
          value={email}
          onChangeText={onChangeEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder={t("settings.account.emailPlaceholder")}
        />
      </View>
    </SettingsDetailLayout>
  );
}

const styles = StyleSheet.create({
  fields: {
    gap: 16,
  },
});
