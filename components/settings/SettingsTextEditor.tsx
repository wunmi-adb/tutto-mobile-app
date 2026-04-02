import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useI18n } from "@/i18n";
import SettingsDetailLayout from "./SettingsDetailLayout";
import { StyleSheet } from "react-native";

type Props = {
  title: string;
  subtitle?: string;
  label: string;
  value: string;
  placeholder: string;
  onChangeText: (value: string) => void;
  onBack: () => void;
  multiline?: boolean;
};

export default function SettingsTextEditor({
  title,
  subtitle,
  label,
  value,
  placeholder,
  onChangeText,
  onBack,
  multiline = false,
}: Props) {
  const { t } = useI18n();

  return (
    <SettingsDetailLayout
      title={title}
      subtitle={subtitle}
      onBack={onBack}
      footer={<Button title={t("settings.common.save")} onPress={onBack} />}
    >
      <Input
        label={label}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        style={multiline ? styles.multilineInput : undefined}
        containerStyle={styles.inputWrap}
      />
    </SettingsDetailLayout>
  );
}

const styles = StyleSheet.create({
  inputWrap: {
    marginTop: 4,
  },
  multilineInput: {
    minHeight: 140,
  },
});
