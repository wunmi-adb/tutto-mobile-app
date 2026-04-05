import HapticPressable from "@/components/ui/HapticPressable";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import { StyleSheet, Text, View } from "react-native";
import { ItemType } from "./types";

type Props = {
  itemType: ItemType;
  onChange: (itemType: ItemType) => void;
};

const ITEM_TYPES: ItemType[] = ["ingredient", "cooked_meal"];

export default function AddItemTypeToggle({ itemType, onChange }: Props) {
  const { t } = useI18n();

  return (
    <View style={styles.typeToggle}>
      {ITEM_TYPES.map((typeOption) => (
        <HapticPressable
          key={typeOption}
          style={[styles.typeBtn, itemType === typeOption && styles.typeBtnActive]}
          pressedOpacity={0.7}
          onPress={() => onChange(typeOption)}
        >
          <Text style={[styles.typeBtnText, itemType === typeOption && styles.typeBtnTextActive]}>
            {typeOption === "ingredient"
              ? t("addItems.detail.type.ingredient")
              : t("addItems.detail.type.cooked")}
          </Text>
        </HapticPressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  typeToggle: {
    flexDirection: "row",
    backgroundColor: colors.secondary,
    borderRadius: 100,
    padding: 3,
    alignSelf: "flex-start",
    marginBottom: 24,
  },
  typeBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 100,
  },
  typeBtnActive: {
    backgroundColor: colors.background,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  typeBtnText: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.muted,
  },
  typeBtnTextActive: {
    color: colors.text,
  },
});
