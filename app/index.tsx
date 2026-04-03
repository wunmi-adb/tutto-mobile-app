import homeIllustration from "@/assets/images/home-illustration.png";
import AuthButtons from "@/components/AuthButtons";
import OnboardingTopBar from "@/components/onboarding/OnboardingTopBar";
import SlideProgressBars from "@/components/SlideProgressBars";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { useI18n } from "@/i18n";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SCREEN_HEIGHT = Dimensions.get("window").height;

const SLIDE_DURATION = 4000;

export default function Welcome() {
  const router = useRouter();
  const { t } = useI18n();
  const { isAuthenticated, ready } = useAuth();
  const [current, setCurrent] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;
  const googleAuth = useGoogleAuth({
    onSuccess: () => {},
  });

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

  if (!ready || isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.authenticatedState}>
          <ActivityIndicator size="small" color={colors.brand} />
          <Text style={styles.sessionTitle}>{t("welcome.session.loading")}</Text>
          <Text style={styles.sessionSubtitle}>{t("welcome.session.loadingSubtitle")}</Text>
        </View>
      </SafeAreaView>
    );
  }

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
          onGoogle={googleAuth.open}
        />

        {googleAuth.isLoading ? (
          <View style={styles.authStatusRow}>
            <ActivityIndicator size="small" color={colors.brand} />
            <Text style={styles.authStatusText}>{t("auth.google.loading")}</Text>
          </View>
        ) : null}

        {googleAuth.error ? (
          <View style={styles.authErrorContainer}>
            <Text style={styles.authErrorText}>{googleAuth.error}</Text>
            <TouchableOpacity onPress={googleAuth.retry} activeOpacity={0.7}>
              <Text style={styles.authRetryText}>{t("auth.google.retry")}</Text>
            </TouchableOpacity>
          </View>
        ) : null}
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
  authenticatedState: {
    flex: 1,
    paddingHorizontal: 32,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
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
  authStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 16,
  },
  authStatusText: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 22,
    color: colors.muted,
    textAlign: "center",
  },
  authErrorContainer: {
    alignItems: "center",
    marginTop: 16,
    gap: 6,
  },
  authErrorText: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    lineHeight: 22,
    color: colors.danger,
    textAlign: "center",
  },
  authRetryText: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.brand,
  },
  sessionTitle: {
    fontFamily: fonts.sansMedium,
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
    textAlign: "center",
  },
  sessionSubtitle: {
    maxWidth: 320,
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 22,
    color: colors.muted,
    textAlign: "center",
  },
});
