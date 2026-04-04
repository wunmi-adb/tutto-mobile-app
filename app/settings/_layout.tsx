import { useSettingsSync } from "@/stores/settingsStore";
import { Stack } from "expo-router";

export default function SettingsLayout() {
  useSettingsSync();

  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}
