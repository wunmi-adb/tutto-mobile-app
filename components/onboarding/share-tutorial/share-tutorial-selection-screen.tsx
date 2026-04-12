import LanguageSelector from "@/components/LanguageSelector";
import BackButton from "@/components/ui/BackButton";
import HapticPressable from "@/components/ui/HapticPressable";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Easing, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getShareTutorialPlatformHref,
  PLATFORMS,
  SHARE_TUTORIAL_DEFAULT_ROUTE,
  type ShareTutorialReturnTo,
} from "./share-tutorial-config";

export default function ShareTutorialSelectionScreen({
  returnTo,
}: {
  returnTo?: ShareTutorialReturnTo;
}) {
  const router = useRouter();
  const { t } = useI18n();
  const contentOpacity = useRef(new Animated.Value(1)).current;
  const contentTranslateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    contentOpacity.setValue(0);
    contentTranslateY.setValue(16);

    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslateY, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [contentOpacity, contentTranslateY]);

  const finishTutorial = () => {
    router.replace(returnTo ?? SHARE_TUTORIAL_DEFAULT_ROUTE);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton onPress={() => router.back()} />
        <LanguageSelector />
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
            transform: [{ translateY: contentTranslateY }],
          }}
        >
          <Text style={styles.title}>{t("shareTutorial.title")}</Text>
          <Text style={styles.subtitle}>{t("shareTutorial.subtitle")}</Text>
        </Animated.View>

        <Animated.View
          style={{
            opacity: contentOpacity,
            transform: [{ translateY: contentTranslateY }],
          }}
        >
          <Text style={styles.prompt}>{t("shareTutorial.platformPrompt")}</Text>
          <View style={styles.platformList}>
            {PLATFORMS.map((platform) => (
              <HapticPressable
                key={platform.id}
                style={styles.platformCard}
                pressedOpacity={0.97}
                onPress={() => router.push(getShareTutorialPlatformHref(platform.id, returnTo))}
              >
                <View style={styles.platformIconWrap}>
                  <platform.Icon />
                </View>
                <View style={styles.platformTextWrap}>
                  <Text style={styles.platformName}>{t(platform.nameKey)}</Text>
                  <Text style={styles.platformLearn}>{t(platform.learnKey)}</Text>
                </View>
                <Text style={styles.platformChevron}>›</Text>
              </HapticPressable>
            ))}
          </View>
        </Animated.View>

        <View style={styles.spacer} />

        <Animated.View style={{ opacity: contentOpacity }}>
          <HapticPressable
            style={styles.laterLink}
            pressedOpacity={0.7}
            onPress={finishTutorial}
            hapticType="selection"
          >
            <Text style={styles.laterLinkText}>{t("shareTutorial.later")}</Text>
          </HapticPressable>
        </Animated.View>
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
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 32,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 32,
    lineHeight: 36,
    color: colors.text,
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 22,
    color: colors.muted,
    marginBottom: 32,
  },
  prompt: {
    fontFamily: fonts.sansBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: colors.muted,
    marginBottom: 12,
  },
  platformList: {
    gap: 10,
  },
  platformCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    borderCurve: "continuous",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.background,
  },
  platformIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderCurve: "continuous",
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  platformTextWrap: {
    flex: 1,
  },
  platformName: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    lineHeight: 20,
    color: colors.text,
    marginBottom: 2,
  },
  platformLearn: {
    fontFamily: fonts.sans,
    fontSize: 12,
    lineHeight: 16,
    color: colors.muted,
  },
  platformChevron: {
    fontFamily: fonts.sansMedium,
    fontSize: 20,
    lineHeight: 20,
    color: colors.muted,
  },
  spacer: {
    flex: 1,
  },
  laterLink: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  laterLinkText: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    lineHeight: 18,
    color: colors.muted,
  },
});
