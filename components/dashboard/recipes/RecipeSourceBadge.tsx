import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import { getRecipeSourceLabel } from "@/components/dashboard/recipes/helpers";
import type { RecipeSource } from "@/components/dashboard/recipes/types";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  source: RecipeSource;
};

function renderSourceIcon(source: RecipeSource) {
  switch (source) {
    case "link":
      return <Feather name="link-2" size={10} color={colors.muted} />;
    case "document":
      return <Feather name="file-text" size={10} color={colors.muted} />;
    case "video":
      return <Feather name="video" size={10} color={colors.muted} />;
    case "ai":
      return <MaterialIcons name="auto-awesome" size={10} color={colors.muted} />;
    case "manual":
    default:
      return <Feather name="edit-3" size={10} color={colors.muted} />;
  }
}

export default function RecipeSourceBadge({ source }: Props) {
  const { t } = useI18n();

  return (
    <View style={styles.badge}>
      {renderSourceIcon(source)}
      <Text style={styles.label}>{getRecipeSourceLabel(t, source)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    backgroundColor: colors.secondary,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  label: {
    fontFamily: fonts.sansMedium,
    fontSize: 9.5,
    color: colors.muted,
  },
});
