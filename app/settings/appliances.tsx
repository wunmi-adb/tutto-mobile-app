import { useSettingsState } from "@/components/settings/SettingsProvider";
import SettingsChipEditor from "@/components/settings/SettingsChipEditor";
import { useRouter } from "expo-router";

export default function SettingsAppliancesScreen() {
  const router = useRouter();
  const { appliances, setAppliances } = useSettingsState();

  return (
    <SettingsChipEditor
      title="Appliances"
      subtitle="Add the appliances you use most so Tutto can tailor recipe suggestions to your kitchen."
      label="Appliances"
      chips={appliances}
      placeholder="Type an appliance, press comma to add"
      hint="e.g. Oven, Microwave, Air Fryer, Blender, Toaster"
      onAdd={(value) =>
        setAppliances((prev) =>
          prev.some((item) => item.toLowerCase() === value.toLowerCase()) ? prev : [...prev, value],
        )
      }
      onRemove={(value) => setAppliances((prev) => prev.filter((item) => item !== value))}
      onBack={() => router.back()}
    />
  );
}
