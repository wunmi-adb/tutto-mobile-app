import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import SettingsDetailLayout from "./SettingsDetailLayout";
import { StyleSheet } from "react-native";

type Props = {
  title: string;
  subtitle: string;
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
  return (
    <SettingsDetailLayout
      title={title}
      subtitle={subtitle}
      onBack={onBack}
      footer={<Button title="Save" onPress={onBack} />}
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

