import type { RecipeDraft, RecipeSource } from "@/components/dashboard/recipes/types";
import HapticPressable from "@/components/ui/HapticPressable";
import Input from "@/components/ui/Input";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import { Feather } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type SourceOption = {
  source: RecipeSource;
  icon: keyof typeof Feather.glyphMap;
};

const RECIPE_SOURCES: SourceOption[] = [
  { source: "link", icon: "link-2" },
  { source: "document", icon: "file-text" },
  { source: "video", icon: "video" },
  { source: "ai", icon: "zap" },
] as const;

const AI_WORD_KEYS = [
  "recipes.addRecipe.aiWords.1",
  "recipes.addRecipe.aiWords.2",
  "recipes.addRecipe.aiWords.3",
  "recipes.addRecipe.aiWords.4",
  "recipes.addRecipe.aiWords.5",
  "recipes.addRecipe.aiWords.6",
  "recipes.addRecipe.aiWords.7",
  "recipes.addRecipe.aiWords.8",
] as const;

function getSourceDescriptionKey(source: RecipeSource) {
  switch (source) {
    case "link":
      return "recipes.addRecipe.sourceDescription.link" as const;
    case "document":
      return "recipes.addRecipe.sourceDescription.document" as const;
    case "video":
      return "recipes.addRecipe.sourceDescription.video" as const;
    case "ai":
      return "recipes.addRecipe.sourceDescription.ai" as const;
    case "manual":
    default:
      return "recipes.addRecipe.sourceDescription.link" as const;
  }
}

function getInputPromptKey(source: RecipeSource) {
  switch (source) {
    case "link":
      return "recipes.addRecipe.inputPrompt.link" as const;
    case "document":
      return "recipes.addRecipe.inputPrompt.document" as const;
    case "video":
      return "recipes.addRecipe.inputPrompt.video" as const;
    case "ai":
      return "recipes.addRecipe.inputPrompt.ai" as const;
    case "manual":
    default:
      return "recipes.addRecipe.inputPrompt.link" as const;
  }
}

function getPlaceholderKey(source: RecipeSource) {
  switch (source) {
    case "link":
      return "recipes.addRecipe.placeholder.link" as const;
    case "document":
      return "recipes.addRecipe.placeholder.document" as const;
    case "video":
      return "recipes.addRecipe.placeholder.video" as const;
    case "ai":
      return "recipes.addRecipe.placeholder.ai" as const;
    case "manual":
    default:
      return "recipes.addRecipe.placeholder.document" as const;
  }
}

function Header({ onBack }: { onBack: () => void }) {
  const { t } = useI18n();

  return (
    <View style={styles.header}>
      <HapticPressable style={styles.backButton} onPress={onBack} hapticType="selection" pressedOpacity={1}>
        <Feather name="arrow-left" size={18} color={colors.text} />
      </HapticPressable>
      <Text style={styles.title}>{t("recipes.addRecipe.title")}</Text>
    </View>
  );
}

export function RecipeAddSourceScreen({
  onBack,
  onSelectSource,
}: {
  onBack: () => void;
  onSelectSource: (source: RecipeSource) => void;
}) {
  const { t } = useI18n();

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <Header onBack={onBack} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.optionList}>
          <Text style={styles.helperLead}>{t("recipes.addRecipe.sourceIntro")}</Text>
          {RECIPE_SOURCES.map((option) => (
            <HapticPressable
              key={option.source}
              style={styles.optionCard}
              onPress={() => onSelectSource(option.source)}
              hapticType="medium"
              pressedOpacity={1}
              pressedStyle={styles.optionCardPressed}
            >
              <View style={styles.optionIconWrap}>
                <Feather name={option.icon} size={18} color={colors.brand} />
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>{t(`recipes.source.${option.source}` as const)}</Text>
                <Text style={styles.optionSubtitle}>{t(getSourceDescriptionKey(option.source))}</Text>
              </View>
              <Feather name="chevron-right" size={16} color={colors.muted} />
            </HapticPressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export function RecipeAddDetailsScreen({
  source,
  draft,
  onBack,
  onChangeTitle,
  onSubmit,
}: {
  source: Exclude<RecipeSource, "manual">;
  draft: RecipeDraft;
  onBack: () => void;
  onChangeTitle: (value: string) => void;
  onSubmit: () => void;
}) {
  const { t } = useI18n();

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <Header onBack={onBack} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.form}>
          <Text style={styles.helperLead}>{t(getInputPromptKey(draft.source))}</Text>

          <Input
            value={draft.title}
            onChangeText={onChangeTitle}
            placeholder={t(getPlaceholderKey(draft.source))}
            autoCapitalize="words"
            containerStyle={styles.primaryInput}
          />

          <HapticPressable
            style={[styles.primaryButton, !draft.title.trim() && styles.primaryButtonDisabled]}
            onPress={onSubmit}
            hapticType="medium"
            pressedOpacity={1}
            disabled={!draft.title.trim()}
          >
            <Text style={styles.primaryButtonLabel}>
              {source === "ai" ? t("recipes.addRecipe.generateAction") : t("recipes.addRecipe.saveAction")}
            </Text>
          </HapticPressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export function RecipeAddGeneratingScreen({
  onBack,
  onFinish,
}: {
  onBack: () => void;
  onFinish: () => void;
}) {
  const { t } = useI18n();
  const aiWords = useMemo(() => AI_WORD_KEYS.map((key) => t(key)), [t]);
  const [aiWordIndex, setAiWordIndex] = useState(0);
  const pulseScale = useMemo(() => new Animated.Value(1), []);
  const pulseOpacity = useMemo(() => new Animated.Value(0.5), []);

  useEffect(() => {
    const wordInterval = setInterval(() => {
      setAiWordIndex((current) => {
        if (current >= aiWords.length - 1) {
          return current;
        }

        return current + 1;
      });
    }, 650);

    const finishTimeout = setTimeout(() => {
      onFinish();
    }, 5200);

    return () => {
      clearInterval(wordInterval);
      clearTimeout(finishTimeout);
    };
  }, [aiWords.length, onFinish]);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseScale, {
            toValue: 1.3,
            duration: 1200,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(pulseScale, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(pulseOpacity, {
            toValue: 0,
            duration: 1200,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(pulseOpacity, {
            toValue: 0.5,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ]),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [pulseOpacity, pulseScale]);

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <Header onBack={onBack} />
      <View style={styles.content}>
        <View style={styles.aiWrap}>
          <View style={styles.aiOrbWrap}>
            <Animated.View
              pointerEvents="none"
              style={[
                styles.aiPulseRing,
                {
                  opacity: pulseOpacity,
                  transform: [{ scale: pulseScale }],
                },
              ]}
            />
            <View style={styles.aiIconCircle}>
              <Feather name="zap" size={24} color={colors.brand} />
            </View>
          </View>
          <ActivityIndicator color={colors.brand} />
          <Text style={styles.aiWord}>{aiWords[aiWordIndex] ?? aiWords[0]}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 22,
    lineHeight: 26,
    color: colors.text,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  optionList: {
    gap: 12,
  },
  helperLead: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    color: colors.muted,
    marginBottom: 4,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    borderCurve: "continuous",
    padding: 16,
    backgroundColor: colors.background,
    boxShadow: "0 1px 2px rgba(26, 18, 8, 0.04)",
  },
  optionCardPressed: {
    backgroundColor: colors.secondary,
  },
  optionIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: colors.brand + "12",
    alignItems: "center",
    justifyContent: "center",
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.text,
    marginBottom: 3,
  },
  optionSubtitle: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.muted,
  },
  form: {
    gap: 14,
  },
  primaryInput: {
    marginTop: 2,
  },
  primaryButton: {
    marginTop: 10,
    backgroundColor: colors.text,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  primaryButtonDisabled: {
    opacity: 0.35,
  },
  primaryButtonLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.background,
  },
  aiWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 18,
    paddingHorizontal: 32,
  },
  aiOrbWrap: {
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
  },
  aiPulseRing: {
    position: "absolute",
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: `${colors.brand}33`,
  },
  aiIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.brand + "12",
    alignItems: "center",
    justifyContent: "center",
  },
  aiWord: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    color: colors.muted,
    textAlign: "center",
  },
});
