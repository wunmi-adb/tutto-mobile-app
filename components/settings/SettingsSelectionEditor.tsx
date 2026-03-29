import Button from "@/components/ui/Button";
import SelectableRow from "@/components/ui/SelectableRow";
import SettingsDetailLayout from "./SettingsDetailLayout";

type Props = {
  title: string;
  subtitle: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  onBack: () => void;
  variant?: "checkbox" | "radio";
};

export default function SettingsSelectionEditor({
  title,
  subtitle,
  options,
  selected,
  onToggle,
  onBack,
  variant = "checkbox",
}: Props) {
  return (
    <SettingsDetailLayout
      title={title}
      subtitle={subtitle}
      onBack={onBack}
      footer={<Button title="Done" onPress={onBack} />}
    >
      {options.map((option) => (
        <SelectableRow
          key={option}
          label={option}
          selected={selected.includes(option)}
          onPress={() => onToggle(option)}
          variant={variant}
        />
      ))}
    </SettingsDetailLayout>
  );
}

