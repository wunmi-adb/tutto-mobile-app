import RecipeSourceBadge from "@/components/dashboard/recipes/RecipeSourceBadge";
import HapticPressable from "@/components/ui/HapticPressable";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { Feather } from "@expo/vector-icons";
import { Image, StyleSheet, Text, View } from "react-native";
import type { RecipeSource } from "@/components/dashboard/recipes/types";

type Props = {
  title: string;
  minutesLabel: string;
  servingsLabel: string;
  source: RecipeSource;
  image?: string;
  onPress?: () => void;
};

export default function RecipeListItem({
  title,
  minutesLabel,
  servingsLabel,
  source,
  image,
  onPress,
}: Props) {
  return (
    <HapticPressable style={styles.card} onPress={onPress} hapticType="medium" pressedOpacity={1}>
      {image ? (
        <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.illustration}>
          <Feather name="image" size={20} color={colors.muted} />
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.metricsRow}>
          <View style={styles.metric}>
            <Feather name="clock" size={10} color={colors.muted} />
            <Text style={styles.metaText}>{minutesLabel}</Text>
          </View>
          <View style={styles.metric}>
            <Feather name="users" size={10} color={colors.muted} />
            <Text style={styles.metaText}>{servingsLabel}</Text>
          </View>
        </View>
        <View style={styles.badgeRow}>
          <RecipeSourceBadge source={source} />
        </View>
      </View>
      <Feather name="chevron-right" size={16} color={colors.muted} />
    </HapticPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 12,
    backgroundColor: colors.background,
  },
  illustration: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.text,
    marginBottom: 8,
  },
  metricsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  metric: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  badgeRow: {
    alignItems: "flex-start",
  },
  metaText: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.muted,
  },
});
