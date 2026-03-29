import Button from "@/components/ui/Button";
import ChipInput from "@/components/ui/ChipInput";
import SettingsDetailLayout from "./SettingsDetailLayout";

type Props = {
  title: string;
  subtitle: string;
  label: string;
  chips: string[];
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
  onBack: () => void;
};

export default function SettingsChipEditor({
  title,
  subtitle,
  label,
  chips,
  onAdd,
  onRemove,
  onBack,
}: Props) {
  return (
    <SettingsDetailLayout
      title={title}
      subtitle={subtitle}
      onBack={onBack}
      footer={<Button title="Done" onPress={onBack} />}
    >
      <ChipInput
        label={label}
        chips={chips}
        onAdd={onAdd}
        onRemove={onRemove}
      />
    </SettingsDetailLayout>
  );
}

