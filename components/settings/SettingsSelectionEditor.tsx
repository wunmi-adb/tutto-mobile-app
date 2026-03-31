import Button from "@/components/ui/Button";
import SelectableRow from "@/components/ui/SelectableRow";
import { StyleSheet, View } from "react-native";
import SettingsDetailLayout from "./SettingsDetailLayout";

type SelectionOption =
  | string
  | {
      label: string;
      value: string;
      sublabel?: string;
    };

type Props = {
  title: string;
  subtitle?: string;
  options: SelectionOption[];
  selected: string[];
  onToggle: (value: string) => void;
  onBack: () => void;
  variant?: "checkbox" | "radio";
  ctaLabel?: string;
};

export default function SettingsSelectionEditor({
  title,
  subtitle,
  options,
  selected,
  onToggle,
  onBack,
  variant = "checkbox",
  ctaLabel = "Done",
}: Props) {
  return (
    <SettingsDetailLayout
      title={title}
      subtitle={subtitle}
      onBack={onBack}
      footer={<Button title={ctaLabel} onPress={onBack} />}
    >
      <View style={styles.list}>
        {options.map((option) => {
          const item = typeof option === "string"
            ? { label: option, value: option, sublabel: undefined }
            : option;

          return (
            <SelectableRow
              key={item.value}
              label={item.label}
              sublabel={item.sublabel}
              selected={selected.includes(item.value)}
              onPress={() => onToggle(item.value)}
              variant={variant}
            />
          );
        })}
      </View>
    </SettingsDetailLayout>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
  },
});
