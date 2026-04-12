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
  onPressOptions?: () => void;
};

export default function RecipeCollectionCard({
  title,
  countLabel,
  image,
  onPress,
  onLongPress,
  onPressOptions,
}: Props) {
  return (
    <HapticPressable
      style={styles.card}
      onPress={onPress}
      onLongPress={onLongPress}
      hapticType="medium"
      pressedOpacity={1}
    >
      {onPressOptions ? (
        <HapticPressable
          style={styles.optionsButton}
          onPress={(event) => {
            event.stopPropagation();
            onPressOptions();
          }}
          hapticType="selection"
          pressedOpacity={1}
        >
          <Feather name="more-horizontal" size={14} color={colors.text} />
        </HapticPressable>
      ) : null}

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
    borderRadius: 16,
    position: "relative",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    boxShadow: "0 2px 10px rgba(26, 18, 8, 0.04)",
  },
  optionsButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.92)",
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
