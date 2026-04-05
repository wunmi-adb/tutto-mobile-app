import HapticPressable from "@/components/ui/HapticPressable";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { Feather } from "@expo/vector-icons";
import { Image, StyleSheet, Text, View } from "react-native";

type Props = {
  title: string;
  countLabel: string;
  image?: string;
  onPress: () => void;
  onLongPress?: () => void;
};

export default function RecipeCollectionCard({
  title,
  countLabel,
  image,
  onPress,
  onLongPress,
}: Props) {
  return (
    <HapticPressable
      style={[
        styles.card,
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
      hapticType="medium"
      pressedOpacity={0.88}
    >
      {image ? (
        <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.imageFallback}>
          <Feather name="folder" size={26} color={colors.muted} />
        </View>
      )}

      <View style={styles.body}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        <Text style={styles.count}>{countLabel}</Text>
      </View>
    </HapticPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    minHeight: 188,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  image: {
    width: "100%",
    height: 112,
  },
  imageFallback: {
    width: "100%",
    height: 112,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    padding: 14,
  },
  title: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.text,
    marginBottom: 4,
  },
  count: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.muted,
  },
});
