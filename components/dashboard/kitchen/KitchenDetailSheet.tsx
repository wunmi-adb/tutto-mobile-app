import BottomSheet from "@/components/ui/BottomSheet";
import HapticPressable from "@/components/ui/HapticPressable";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  itemName: string;
  onRename: (nextName: string) => void;
  onClose: () => void;
  onRemove: () => void;
  removing?: boolean;
  visible: boolean;
};

type DetailMode = "actions" | "rename";

function ActionRow({
  danger = false,
  disabled = false,
  icon,
  label,
  onPress,
}: {
  danger?: boolean;
  disabled?: boolean;
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <HapticPressable
      style={[styles.actionRow, disabled && styles.actionRowDisabled]}
      disabled={disabled}
      pressedOpacity={0.92}
      onPress={onPress}
    >
      <Feather
        name={icon}
        size={18}
        color={danger ? colors.brand : colors.muted}
        strokeWidth={1.9}
      />
      <Text style={[styles.actionText, danger && styles.actionTextDanger]}>{label}</Text>
    </HapticPressable>
  );
}

export default function KitchenDetailSheet({
  itemName,
  onRename,
  onClose,
  onRemove,
  removing = false,
  visible,
}: Props) {
  const [mode, setMode] = useState<DetailMode>("actions");
  const [draftName, setDraftName] = useState(itemName);

  useEffect(() => {
    if (!visible) {
      setMode("actions");
      setDraftName(itemName);
      return;
    }

    setDraftName(itemName);
  }, [itemName, visible]);

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      contentStyle={styles.sheetContent}
      sheetStyle={styles.sheetFrame}
      dragEnabled
      keyboardAvoiding={mode === "rename"}
    >
      {mode === "actions" ? (
        <View style={styles.actionSheet}>
          <Text style={styles.sheetTitle}>{itemName}</Text>

          <View style={styles.actionList}>
            <ActionRow
              icon="edit-2"
              label="Rename"
              onPress={() => setMode("rename")}
            />

            <View style={styles.divider} />

            <ActionRow
              danger
              disabled={removing}
              icon="trash-2"
              label={removing ? "Removing..." : "Remove from kitchen"}
              onPress={onRemove}
            />
          </View>

          <HapticPressable
            style={styles.cancelButton}
            pressedOpacity={0.92}
            onPress={onClose}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </HapticPressable>
        </View>
      ) : (
        <View style={styles.renameSheet}>
          <Text style={styles.sheetTitle}>Rename item</Text>

          <TextInput
            value={draftName}
            onChangeText={setDraftName}
            onSubmitEditing={() => {
              const trimmed = draftName.trim();

              if (!trimmed) {
                return;
              }

              onRename(trimmed);
              onClose();
            }}
            placeholder="Item name"
            placeholderTextColor={`${colors.muted}88`}
            style={styles.nameInput}
            autoFocus
            returnKeyType="done"
          />

          <View style={styles.renameActions}>
            <HapticPressable
              style={styles.secondaryButton}
              pressedOpacity={0.92}
              onPress={onClose}
            >
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </HapticPressable>

            <HapticPressable
              style={[styles.primaryButton, !draftName.trim() && styles.primaryButtonDisabled]}
              disabled={!draftName.trim()}
              pressedOpacity={0.92}
              onPress={() => {
                const trimmed = draftName.trim();

                if (!trimmed) {
                  return;
                }

                onRename(trimmed);
                onClose();
              }}
            >
              <Text style={styles.primaryButtonText}>Save</Text>
            </HapticPressable>
          </View>
        </View>
      )}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheetFrame: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  sheetContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  actionSheet: {
    paddingTop: 8,
  },
  renameSheet: {
    paddingTop: 8,
  },
  sheetTitle: {
    fontFamily: fonts.serif,
    fontSize: 26,
    lineHeight: 28,
    letterSpacing: -0.2,
    color: colors.text,
    marginBottom: 18,
  },
  actionList: {
    overflow: "hidden",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 16,
  },
  actionRowDisabled: {
    opacity: 0.6,
  },
  actionText: {
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.text,
  },
  actionTextDanger: {
    color: colors.brand,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  cancelButton: {
    marginTop: 14,
    minHeight: 50,
    borderRadius: 14,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.text,
  },
  nameInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: fonts.sans,
    fontSize: 16,
    color: colors.text,
  },
  renameActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  secondaryButton: {
    flex: 1,
    minHeight: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.text,
  },
  primaryButton: {
    flex: 1,
    minHeight: 50,
    borderRadius: 14,
    backgroundColor: colors.brand,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonDisabled: {
    opacity: 0.3,
  },
  primaryButtonText: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.background,
  },
});
