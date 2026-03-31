import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
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
  return (
    <SettingsDetailLayout
      title="Account"
      subtitle="Update the details tied to your kitchen profile."
      onBack={onBack}
      footer={<Button title="Save" onPress={onBack} />}
    >
      <View style={styles.fields}>
        <Input label="Display name" value={name} onChangeText={onChangeName} placeholder="Your name" />
        <Input
          label="Email"
          value={email}
          onChangeText={onChangeEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="you@example.com"
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
