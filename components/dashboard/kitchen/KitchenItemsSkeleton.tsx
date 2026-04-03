import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { colors } from "@/constants/colors";

const SKELETON_ITEMS = [0, 1, 2];

export default function KitchenItemsSkeleton() {
  const pulseAnim = useRef(new Animated.Value(0.55)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 850,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.55,
          duration: 850,
          useNativeDriver: true,
        }),
      ]),
    );

    loop.start();

    return () => loop.stop();
  }, [pulseAnim]);

  return (
    <View style={styles.list}>
      {SKELETON_ITEMS.map((item) => (
        <Animated.View key={item} style={[styles.card, { opacity: pulseAnim }]}>
          <View style={styles.header}>
            <View style={styles.titleBlock}>
              <View style={[styles.line, styles.titleLine]} />
              <View style={[styles.line, styles.metaLine]} />
            </View>
            <View style={styles.chevronStub} />
          </View>
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  titleBlock: {
    flex: 1,
    gap: 10,
  },
  line: {
    borderRadius: 999,
    backgroundColor: colors.secondary,
  },
  titleLine: {
    width: "48%",
    height: 14,
  },
  metaLine: {
    width: "78%",
    height: 11,
  },
  chevronStub: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.secondary,
  },
});
