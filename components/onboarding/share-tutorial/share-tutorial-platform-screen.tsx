import BackButton from "@/components/ui/BackButton";
import Button from "@/components/ui/Button";
import HapticPressable from "@/components/ui/HapticPressable";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  PLATFORM_STEPS,
  SHARE_TUTORIAL_DEFAULT_ROUTE,
  getPlatformDefinition,
  type Platform,
  type ShareTutorialReturnTo,
} from "./share-tutorial-config";
import { TutorialVisual } from "./share-tutorial-visuals";

export default function ShareTutorialPlatformScreen({
  platform,
  returnTo,
}: {
  platform: Platform;
  returnTo?: ShareTutorialReturnTo;
}) {
  const router = useRouter();
  const { t } = useI18n();
  const [currentStep, setCurrentStep] = useState(0);
  const contentOpacity = useRef(new Animated.Value(1)).current;
  const contentTranslateX = useRef(new Animated.Value(0)).current;

  const steps = useMemo(() => PLATFORM_STEPS[platform], [platform]);
  const currentStepData = steps[currentStep];
  const platformData = getPlatformDefinition(platform);
  const isLastStep = currentStep === steps.length - 1;

  useEffect(() => {
    contentOpacity.setValue(0);
    contentTranslateX.setValue(28);

    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(contentTranslateX, {
        toValue: 0,
        damping: 18,
        stiffness: 190,
        mass: 0.9,
        useNativeDriver: true,
      }),
    ]).start();
  }, [contentOpacity, contentTranslateX, currentStep]);

  const finishTutorial = () => {
    router.replace(returnTo ?? SHARE_TUTORIAL_DEFAULT_ROUTE);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      return;
    }

    router.back();
  };

  const handleNext = () => {
    if (isLastStep) {
      finishTutorial();
      return;
    }

    setCurrentStep((prev) => prev + 1);
  };

  if (!currentStepData || !platformData) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton onPress={handleBack} />
        <View style={styles.headerCenter}>
          <platformData.Icon />
          <Text style={styles.headerPlatform}>{t(platformData.nameKey)}</Text>
        </View>
        <HapticPressable
          style={styles.skipLink}
          pressedOpacity={0.7}
          onPress={finishTutorial}
          hapticType="selection"
        >
          <Text style={styles.skipLinkText}>{t("shareTutorial.skip")}</Text>
        </HapticPressable>
      </View>

      <View style={styles.progressWrap}>
        {steps.map((step, index) => (
          <View
            key={`${step.visual}-${index}`}
            style={[styles.progressSegment, index <= currentStep && styles.progressSegmentActive]}
          />
        ))}
      </View>

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{
            opacity: contentOpacity,
            transform: [{ translateX: contentTranslateX }],
          }}
        >
          <View style={styles.stepCountRow}>
            <View style={styles.stepBubble}>
              <Text style={styles.stepBubbleText}>{currentStep + 1}</Text>
            </View>
            <Text style={styles.stepCountText}>
              {t("shareTutorial.stepProgress", {
                current: currentStep + 1,
                total: steps.length,
              })}
            </Text>
          </View>

          <Text style={styles.title}>{t(currentStepData.titleKey)}</Text>
          <Text style={styles.description}>{t(currentStepData.descriptionKey)}</Text>

          <TutorialVisual visual={currentStepData.visual} platform={platform} />
        </Animated.View>

        <View style={styles.spacer} />

        <Button
          title={isLastStep ? t("shareTutorial.done") : t("shareTutorial.next")}
          onPress={handleNext}
          rightIcon={
            isLastStep ? (
              <Feather name="check" size={18} color={colors.background} />
            ) : (
              <Feather name="arrow-right" size={16} color={colors.background} />
            )
          }
          style={styles.primaryButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerPlatform: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    lineHeight: 16,
    color: colors.muted,
  },
  skipLink: {
    minWidth: 36,
    alignItems: "flex-end",
  },
  skipLinkText: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    lineHeight: 16,
    color: colors.muted,
  },
  progressWrap: {
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 4,
  },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: 999,
    backgroundColor: colors.secondary,
  },
  progressSegmentActive: {
    backgroundColor: colors.brand,
  },
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 32,
  },
  stepCountRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  stepBubble: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  stepBubbleText: {
    fontFamily: fonts.sansBold,
    fontSize: 12,
    lineHeight: 14,
    color: colors.brand,
  },
  stepCountText: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    lineHeight: 16,
    color: colors.muted,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 28,
    lineHeight: 32,
    color: colors.text,
    marginBottom: 8,
  },
  description: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 22,
    color: colors.muted,
    marginBottom: 24,
  },
  spacer: {
    flex: 1,
    minHeight: 20,
  },
  primaryButton: {
    marginTop: 12,
  },
});
