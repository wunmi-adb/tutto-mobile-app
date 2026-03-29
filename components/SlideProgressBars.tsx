import { colors } from "@/constants/colors";
import { Animated, StyleSheet, View } from "react-native";

type Props = {
  count: number;
  current: number;
  progress: Animated.Value;
};

export default function SlideProgressBars({ count, current, progress }: Props) {
  return (
    <View style={styles.row}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={styles.track}>
          <Animated.View
            style={[
              styles.fill,
              {
                width:
                  i < current
                    ? "100%"
                    : i === current
                      ? progress.interpolate({
                          inputRange: [0, 1],
                          outputRange: ["0%", "100%"],
                        })
                      : "0%",
              },
            ]}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 24,
  },
  track: {
    flex: 1,
    height: 2,
    borderRadius: 2,
    backgroundColor: colors.border,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    backgroundColor: colors.brand,
    borderRadius: 2,
  },
});
