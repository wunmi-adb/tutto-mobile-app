import SettingsSupportView from "@/components/settings/SettingsSupportView";
import { useRouter } from "expo-router";

export default function SettingsSupportScreen() {
  const router = useRouter();

  return <SettingsSupportView onBack={() => router.back()} />;
}
