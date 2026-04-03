import { getMealTypeLabel, type MealTypeId } from "@/components/dashboard/data";
import { resolveMealRecipe } from "@/components/dashboard/plan/helpers";
import type { MealRecipe } from "@/components/dashboard/plan/types";
import Button from "@/components/ui/Button";
import HapticPressable from "@/components/ui/HapticPressable";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import { Feather } from "@expo/vector-icons";
import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  mealType: MealTypeId;
  onBack: () => void;
  onFinish: () => void;
  recipe: MealRecipe;
};

function parseStepDurationSeconds(step: string) {
  const hourMatch = step.match(/(\d+)\s*(?:hour|hours)/i);
  const minuteMatch = step.match(/(\d+)\s*(?:min|mins|minute|minutes)/i);
  const secondMatch = step.match(/(\d+)\s*(?:sec|secs|second|seconds)/i);

  const hours = hourMatch ? Number(hourMatch[1]) : 0;
  const minutes = minuteMatch ? Number(minuteMatch[1]) : 0;
  const seconds = secondMatch ? Number(secondMatch[1]) : 0;
  const total = hours * 3600 + minutes * 60 + seconds;

  return total > 0 ? total : null;
}

function formatTimer(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

export default function CookingStoryScreen({
  mealType,
  onBack,
  onFinish,
  recipe,
}: Props) {
  const { t } = useI18n();
  const recipeDetails = resolveMealRecipe(recipe, t);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = recipeDetails.steps[currentStepIndex] ?? "";
  const totalSteps = recipeDetails.steps.length;
  const stepDurationSeconds = useMemo(
    () => parseStepDurationSeconds(currentStep),
    [currentStep],
  );
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(stepDurationSeconds);
  const [timerRunning, setTimerRunning] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const contentOpacity = useRef(new Animated.Value(1)).current;
  const contentTranslateX = useRef(new Animated.Value(0)).current;
  const storyScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    setRemainingSeconds(stepDurationSeconds);
    setTimerRunning(false);
  }, [stepDurationSeconds, currentStepIndex]);

  useEffect(() => {
    if (!timerRunning || remainingSeconds === null || remainingSeconds <= 0) {
      return;
    }

    const intervalId = setInterval(() => {
      setRemainingSeconds((current) => {
        if (current === null || current <= 1) {
          setTimerRunning(false);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [remainingSeconds, timerRunning]);

  const transitionToStep = (nextIndex: number) => {
    if (nextIndex === currentStepIndex || isTransitioning) {
      return;
    }

    const direction = nextIndex > currentStepIndex ? 1 : -1;
    setIsTransitioning(true);

    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslateX, {
        toValue: direction * -18,
        duration: 140,
        useNativeDriver: true,
      }),
      Animated.timing(storyScale, {
        toValue: 0.985,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentStepIndex(nextIndex);
      contentTranslateX.setValue(direction * 18);
      storyScale.setValue(0.985);

      Animated.parallel([
        Animated.spring(contentOpacity, {
          toValue: 1,
          speed: 18,
          bounciness: 0,
          useNativeDriver: true,
        }),
        Animated.spring(contentTranslateX, {
          toValue: 0,
          speed: 16,
          bounciness: 4,
          useNativeDriver: true,
        }),
        Animated.spring(storyScale, {
          toValue: 1,
          speed: 16,
          bounciness: 6,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsTransitioning(false);
      });
    });
  };

  const handlePrevious = () => {
    transitionToStep(Math.max(currentStepIndex - 1, 0));
  };

  const handleNext = () => {
    transitionToStep(Math.min(currentStepIndex + 1, totalSteps - 1));
  };

  const isLastStep = currentStepIndex === totalSteps - 1;

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          <Text style={styles.eyebrow}>{getMealTypeLabel(t, mealType)}</Text>
          <HapticPressable style={styles.closeButton} onPress={onBack} pressedOpacity={0.7}>
            <Feather name="x" size={18} color={colors.text} />
          </HapticPressable>
        </View>

        <View style={styles.progressRow}>
          {recipeDetails.steps.map((_, index) => (
            <View
              key={`progress-${index}`}
              style={[
                styles.progressBar,
                index <= currentStepIndex && styles.progressBarActive,
              ]}
            />
          ))}
        </View>

        <Text style={styles.stepCounter}>
          {t("kitchen.plan.cooking.stepCounter", {
            current: currentStepIndex + 1,
            total: totalSteps,
          })}
        </Text>

        <Animated.View
          style={[
            styles.storyCard,
            {
              opacity: contentOpacity,
              transform: [{ translateX: contentTranslateX }, { scale: storyScale }],
            },
          ]}
        >
          <View style={styles.storyNumber}>
            <Text style={styles.storyNumberText}>{currentStepIndex + 1}</Text>
          </View>
          <Text style={styles.storyText}>
            {currentStep || t("kitchen.plan.cooking.noSteps")}
          </Text>

          {remainingSeconds !== null ? (
            <View style={styles.timerBlock}>
              <Text style={styles.timerLabel}>{t("kitchen.plan.cooking.timer")}</Text>
              <Text style={styles.timerValue}>{formatTimer(remainingSeconds)}</Text>

              <View style={styles.timerActions}>
                <HapticPressable
                  style={styles.timerButton}
                  onPress={() => setTimerRunning((current) => !current)}
                >
                  <Feather
                    name={timerRunning ? "pause" : "play"}
                    size={16}
                    color={colors.text}
                  />
                </HapticPressable>
                <HapticPressable
                  style={styles.timerButton}
                  onPress={() => {
                    setRemainingSeconds(stepDurationSeconds);
                    setTimerRunning(false);
                  }}
                >
                  <Feather name="rotate-ccw" size={16} color={colors.text} />
                </HapticPressable>
              </View>
            </View>
          ) : null}
        </Animated.View>

        <View style={styles.footer}>
          <Button
            title={t("kitchen.plan.cooking.previous")}
            variant="soft"
            onPress={handlePrevious}
            disabled={currentStepIndex === 0}
            pressedOpacity={1}
            style={styles.secondaryButton}
          />
          <Button
            title={isLastStep ? t("kitchen.plan.cooking.finish") : t("kitchen.plan.cooking.next")}
            onPress={isLastStep ? onFinish : handleNext}
            pressedOpacity={1}
            style={styles.primaryButton}
          />
        </View>
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
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  eyebrow: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    color: colors.muted,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  headerSpacer: {
    width: 36,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  progressRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 16,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 999,
    backgroundColor: colors.border,
  },
  progressBarActive: {
    backgroundColor: colors.text,
  },
  stepCounter: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.muted,
    marginBottom: 18,
  },
  storyCard: {
    flex: 1,
    borderRadius: 28,
    backgroundColor: colors.secondary,
    paddingHorizontal: 24,
    paddingVertical: 28,
    justifyContent: "center",
  },
  storyNumber: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.text,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  storyNumberText: {
    fontFamily: fonts.sansMedium,
    fontSize: 18,
    color: colors.background,
  },
  storyText: {
    fontFamily: fonts.serif,
    fontSize: 28,
    lineHeight: 34,
    color: colors.text,
  },
  timerBlock: {
    marginTop: 28,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  timerLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: colors.muted,
    marginBottom: 8,
  },
  timerValue: {
    fontFamily: fonts.sansMedium,
    fontSize: 32,
    color: colors.text,
  },
  timerActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  timerButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  secondaryButton: {
    flex: 1,
    marginTop: 0,
  },
  primaryButton: {
    flex: 1.4,
    marginTop: 0,
  },
});
