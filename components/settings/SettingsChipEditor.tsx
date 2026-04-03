import Button from "@/components/ui/Button";
import ChipInput from "@/components/ui/ChipInput";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import SettingsDetailLayout from "./SettingsDetailLayout";
import { StyleSheet, Text } from "react-native";

type Props = {
  title: string;
  subtitle?: string;
  label: string;
  chips: string[];
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
  onBack: () => void;
  placeholder?: string;
  hint?: string;
  minHeight?: number;
  onSave?: () => Promise<void> | void;
  saving?: boolean;
};

export default function SettingsChipEditor({
  title,
  subtitle,
  label,
  chips,
  onAdd,
  onRemove,
  onBack,
  placeholder,
  hint,
  minHeight,
  onSave,
  saving = false,
}: Props) {
  const { t } = useI18n();

  return (
    <SettingsDetailLayout
      title={title}
      subtitle={subtitle}
      onBack={onBack}
      footer={
        <Button
          title={t("settings.common.done")}
          onPress={() => {
            if (onSave) {
              void onSave();
              return;
            }

            onBack();
          }}
          loading={saving}
        />
      }
    >
      <ChipInput
        label={label}
        chips={chips}
        onAdd={onAdd}
        onRemove={onRemove}
        placeholder={placeholder}
        minHeight={minHeight}
      />
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </SettingsDetailLayout>
  );
}

const styles = StyleSheet.create({
  hint: {
    marginTop: 10,
    fontFamily: fonts.sans,
    fontSize: 12,
    lineHeight: 18,
    color: colors.muted,
  },
});
