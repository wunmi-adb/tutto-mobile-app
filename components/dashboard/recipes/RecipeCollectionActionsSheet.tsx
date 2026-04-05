import BottomSheet from "@/components/ui/BottomSheet";
import HapticPressable from "@/components/ui/HapticPressable";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  visible: boolean;
  canDelete: boolean;
  onRename: () => void;
  onDelete: () => void;
  onClose: () => void;
};

export default function RecipeCollectionActionsSheet({
  visible,
  canDelete,
  onRename,
  onDelete,
  onClose,
}: Props) {
  return (
    <BottomSheet visible={visible} onClose={onClose} dragEnabled={false}>
      <View style={styles.content}>
        <HapticPressable style={styles.row} onPress={onRename} hapticType="selection">
          <Feather name="edit-2" size={16} color={colors.text} />
          <Text style={styles.label}>Rename</Text>
        </HapticPressable>
        {canDelete ? (
          <HapticPressable style={styles.row} onPress={onDelete} hapticType="light">
            <Feather name="trash-2" size={16} color={colors.danger} />
            <Text style={styles.dangerLabel}>Delete</Text>
          </HapticPressable>
        ) : null}
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: colors.secondary,
  },
  label: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.text,
  },
  dangerLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.danger,
  },
});
