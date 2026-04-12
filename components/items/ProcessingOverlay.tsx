import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import type { TranslationKey } from "@/i18n/messages";
import { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export type ProcessingWordStage = {
  maxElapsedMs: number;
  keys: readonly TranslationKey[];
};

function getWordPool(wordStages: readonly ProcessingWordStage[], elapsedMs: number) {
  return wordStages.find((stage) => elapsedMs < stage.maxElapsedMs)?.keys ?? wordStages[wordStages.length - 1]?.keys ?? [];
}

function getNextRandomWordKey(
  currentKey: TranslationKey,
  wordStages: readonly ProcessingWordStage[],
  elapsedMs: number,
) {
  const pool = getWordPool(wordStages, elapsedMs);

  if (pool.length <= 1) {
    return currentKey;
  }

  let nextKey = currentKey;

  while (nextKey === currentKey) {
    nextKey = pool[Math.floor(Math.random() * pool.length)];
  }

  return nextKey;
}

type Props = {
  subtitle?: string | null;
  wordStages: readonly ProcessingWordStage[];
  wordCycleMs?: number;
};

export default function ProcessingOverlay({
  subtitle,
  wordStages,
  wordCycleMs = 1800,
}: Props) {
  const { t } = useI18n();
  const initialWordKey = wordStages[0]?.keys[0] ?? ("common.language" as TranslationKey);
  const outerSpin = useRef(new Animated.Value(0)).current;
  const innerSpin = useRef(new Animated.Value(0)).current;
  const dotsPulse = useRef(new Animated.Value(0)).current;
  const wordOpacity = useRef(new Animated.Value(1)).current;
  const wordTranslateY = useRef(new Animated.Value(0)).current;
  const startedAtRef = useRef(Date.now());
  const [wordKey, setWordKey] = useState<TranslationKey>(initialWordKey);

  useEffect(() => {
    startedAtRef.current = Date.now();
    setWordKey(initialWordKey);
  }, [initialWordKey]);

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

    const dotsLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(dotsPulse, {
          toValue: 1,
          duration: 480,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(dotsPulse, {
          toValue: 0,
          duration: 480,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    outerLoop.start();
    innerLoop.start();
    dotsLoop.start();

    return () => {
      outerLoop.stop();
      innerLoop.stop();
      dotsLoop.stop();
      outerSpin.stopAnimation();
      innerSpin.stopAnimation();
      dotsPulse.stopAnimation();
    };
  }, [dotsPulse, innerSpin, outerSpin]);

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.parallel([
        Animated.timing(wordOpacity, {
          toValue: 0,
          duration: 180,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(wordTranslateY, {
          toValue: -10,
          duration: 180,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => {
        setWordKey((prev) => getNextRandomWordKey(prev, wordStages, Date.now() - startedAtRef.current));
        wordTranslateY.setValue(10);

        Animated.parallel([
          Animated.timing(wordOpacity, {
            toValue: 1,
            duration: 260,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(wordTranslateY, {
            toValue: 0,
            duration: 260,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]).start();
      });
    }, wordCycleMs);

    return () => clearInterval(interval);
  }, [wordCycleMs, wordOpacity, wordStages, wordTranslateY]);

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
            style={[
              styles.spinnerOuter,
              {
                transform: [{ rotate: outerRotation }],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.spinnerInner,
              {
                transform: [{ rotate: innerRotation }],
              },
            ]}
          />
        </View>

        <View style={styles.wordBlock}>
          <Animated.Text
            style={[
              styles.wordText,
              {
                opacity: wordOpacity,
                transform: [{ translateY: wordTranslateY }],
              },
            ]}
          >
            {t(wordKey)}
          </Animated.Text>
        </View>

        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

        <View style={styles.dots}>
          {[0, 1, 2].map((index) => {
            const opacity = dotsPulse.interpolate({
              inputRange: [0, 1],
              outputRange: index === 1 ? [0.45, 1] : [0.25, 0.75],
            });

            const scale = dotsPulse.interpolate({
              inputRange: [0, 1],
              outputRange: index === 1 ? [0.9, 1.15] : [0.85, 1],
            });

            return (
              <Animated.View
                key={index}
                style={[styles.dot, { opacity, transform: [{ scale }] }]}
              />
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    width: "100%",
    maxWidth: 360,
    alignItems: "center",
    paddingHorizontal: 32,
  },
  spinnerShell: {
    width: 96,
    height: 96,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 36,
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
    borderTopColor: colors.text,
  },
  spinnerInner: {
    position: "absolute",
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2.5,
    borderColor: "transparent",
    borderBottomColor: colors.text + "66",
  },
  wordBlock: {
    minHeight: 72,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  wordText: {
    fontFamily: fonts.serif,
    fontSize: 28,
    lineHeight: 34,
    color: colors.text,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 21,
    color: colors.muted,
    textAlign: "center",
    maxWidth: 280,
  },
  dots: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 28,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: colors.text,
  },
});
