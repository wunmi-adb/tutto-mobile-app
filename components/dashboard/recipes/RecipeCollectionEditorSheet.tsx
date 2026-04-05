import Button from "@/components/ui/Button";
import BottomSheet from "@/components/ui/BottomSheet";
import Input from "@/components/ui/Input";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  visible: boolean;
  title: string;
  actionLabel: string;
  name: string;
  placeholder: string;
  onChangeName: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
};

export default function RecipeCollectionEditorSheet({
  visible,
  title,
  actionLabel,
  name,
  placeholder,
  onChangeName,
  onSubmit,
  onClose,
}: Props) {
  return (
    <BottomSheet visible={visible} onClose={onClose} keyboardAvoiding dragEnabled={false}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Input
          label={placeholder}
          value={name}
          onChangeText={onChangeName}
          placeholder={placeholder}
          autoCapitalize="words"
          returnKeyType="done"
          onSubmitEditing={onSubmit}
        />
        <Button title={actionLabel} onPress={onSubmit} disabled={!name.trim()} />
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 28,
    lineHeight: 32,
    color: colors.text,
    marginBottom: 20,
  },
});
