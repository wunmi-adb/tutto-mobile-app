import Button from "@/components/ui/Button";
import HapticPressable from "@/components/ui/HapticPressable";
import Input from "@/components/ui/Input";
import { colors } from "@/constants/colors";
import { Feather } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

export default function KitchenAddItemRow({
  value,
  onChangeText,
  onSubmit,
  onClose,
}: {
  value: string;
  onChangeText: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}) {
  return (
    <View style={styles.row}>
      <Input
        value={value}
        onChangeText={onChangeText}
        placeholder="Add an item..."
        autoFocus
        onSubmitEditing={onSubmit}
        returnKeyType="done"
        containerStyle={styles.inputContainer}
      />
      <Button title="Add" style={styles.addButton} disabled={!value.trim()} onPress={onSubmit} />
      <HapticPressable style={styles.closeButton} pressedOpacity={0.75} onPress={onClose}>
        <Feather name="x" size={18} color={colors.muted} />
      </HapticPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  inputContainer: {
    flex: 1,
  },
  addButton: {
    marginTop: 0,
    paddingHorizontal: 16,
    paddingVertical: 0,
    minHeight: 52,
  },
  closeButton: {
    padding: 4,
  },
});
