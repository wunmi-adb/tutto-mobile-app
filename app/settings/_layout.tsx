import { SettingsProvider } from "@/components/settings/SettingsProvider";
import { Stack } from "expo-router";

export default function SettingsLayout() {
  return (
    <SettingsProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </SettingsProvider>
  );
}
