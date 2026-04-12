import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useRef } from "react";

export default function StorageProcessingOverlay() {
  const { t } = useI18n();
  const outerSpin = useRef(new Animated.Value(0)).current;
  const innerSpin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const outerLoop = Animated.loop(
      Animated.timing(outerSpin, {
        toValue: 1,
        duration: 780,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    const innerLoop = Animated.loop(
      Animated.timing(innerSpin, {
        toValue: 1,
        duration: 1080,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    outerLoop.start();
    innerLoop.start();

    return () => {
      outerLoop.stop();
      innerLoop.stop();
      outerSpin.stopAnimation();
      innerSpin.stopAnimation();
    };
  }, [innerSpin, outerSpin]);

  const outerRotation = outerSpin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const innerRotation = innerSpin.interpolate({
    inputRange: [0, 1],
    outputRange: ["360deg", "0deg"],
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.spinnerShell}>
          <View style={styles.spinnerBase} />
          <Animated.View
            style={[styles.spinnerOuter, { transform: [{ rotate: outerRotation }] }]}
          />
          <Animated.View
            style={[styles.spinnerInner, { transform: [{ rotate: innerRotation }] }]}
          />
        </View>

        <Text style={styles.subtitle}>{t("storage.onboarding.processingSubtitle")}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 28,
    paddingHorizontal: 32,
  },
  spinnerShell: {
    width: 96,
    height: 96,
    alignItems: "center",
    justifyContent: "center",
  },
  spinnerBase: {
    position: "absolute",
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: colors.border,
  },
  spinnerOuter: {
    position: "absolute",
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: "transparent",
    borderTopColor: colors.brand,
  },
  spinnerInner: {
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: "transparent",
    borderBottomColor: `${colors.brand}66`,
  },
  subtitle: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 21,
    color: colors.muted,
    textAlign: "center",
    maxWidth: 260,
  },
});
