import SettingsAccountEditor from "@/components/settings/SettingsAccountEditor";
import { useSettingsState } from "@/components/settings/SettingsProvider";
import { useRouter } from "expo-router";

export default function SettingsAccountScreen() {
  const router = useRouter();
  const { profileName, email, setProfileName, setEmail } = useSettingsState();

  return (
    <SettingsAccountEditor
      name={profileName}
      email={email}
      onChangeName={setProfileName}
      onChangeEmail={setEmail}
      onBack={() => router.back()}
    />
  );
}
