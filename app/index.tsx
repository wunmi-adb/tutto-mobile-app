import homeIllustration from "@/assets/images/home-illustration.png";
import AuthButtons from "@/components/AuthButtons";
import OnboardingTopBar from "@/components/onboarding/OnboardingTopBar";
import SlideProgressBars from "@/components/SlideProgressBars";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SCREEN_HEIGHT = Dimensions.get("window").height;

const SLIDE_DURATION = 4000;

export default function Welcome() {
  const router = useRouter();
  const { t } = useI18n();
  const [current, setCurrent] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;

  const slides = [
    {
      title: t("welcome.slides.organized.title"),
      subtitle: t("welcome.slides.organized.subtitle"),
    },
    {
      title: t("welcome.slides.cook.title"),
      subtitle: t("welcome.slides.cook.subtitle"),
    },
    {
      title: t("welcome.slides.plan.title"),
      subtitle: t("welcome.slides.plan.subtitle"),
    },
  ];

  useEffect(() => {
    progress.setValue(0);
    const anim = Animated.timing(progress, {
      toValue: 1,
      duration: SLIDE_DURATION,
      useNativeDriver: false,
    });
    anim.start();

    const timer = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, SLIDE_DURATION);

    return () => {
      clearTimeout(timer);
      anim.stop();
    };
  }, [current, progress, slides.length]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.illustrationArea}>
        <View style={styles.topBar}>
          <OnboardingTopBar showLogo />
        </View>
        <Image source={homeIllustration} style={styles.illustration} resizeMode="contain" />
      </View>

      <View style={styles.content}>
        <Text style={styles.heading}>{slides[current].title}</Text>
        <Text style={styles.subtitle}>{slides[current].subtitle}</Text>

        <SlideProgressBars
          count={slides.length}
          current={current}
          progress={progress}
        />

        <AuthButtons
          onApple={() => router.push("/onboarding/household")}
          onGoogle={() => router.push("/onboarding/household")}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  illustrationArea: {
    height: SCREEN_HEIGHT * 0.46,
    alignItems: "center",
    justifyContent: "center",
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  illustration: {
    width: "80%",
    height: "80%",
  },
  content: {
    paddingHorizontal: 24,
  },
  heading: {
    fontFamily: fonts.serif,
    fontSize: 40,
    lineHeight: 42,
    color: colors.text,
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 22,
    color: colors.muted,
    maxWidth: 320,
    minHeight: 80,
  },
});
