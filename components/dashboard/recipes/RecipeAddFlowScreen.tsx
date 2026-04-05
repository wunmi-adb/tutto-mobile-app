import RecipeSourceBadge from "@/components/dashboard/recipes/RecipeSourceBadge";
import HapticPressable from "@/components/ui/HapticPressable";
import Input from "@/components/ui/Input";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import { Feather } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RecipeDraft, RecipeSource } from "@/components/dashboard/recipes/types";

type Props = {
  visible: boolean;
  draft: RecipeDraft;
  onBack: () => void;
  onChangeTitle: (value: string) => void;
  onChangeSource: (value: RecipeSource) => void;
  onChangeMinutes: (value: string) => void;
  onChangeServings: (value: string) => void;
  onSubmit: () => void;
};

type SourceOption = {
  source: RecipeSource;
  icon: keyof typeof Feather.glyphMap;
};

const RECIPE_SOURCES: SourceOption[] = [
  { source: "link", icon: "link-2" },
  { source: "document", icon: "file-text" },
  { source: "video", icon: "video" },
  { source: "ai", icon: "zap" },
];

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

function isSourceSelected(draft: RecipeDraft) {
  return draft.source !== "manual";
}

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

export default function RecipeAddFlowScreen({
  visible,
  draft,
  onBack,
  onChangeTitle,
  onChangeSource,
  onChangeMinutes,
  onChangeServings,
  onSubmit,
}: Props) {
  const { t } = useI18n();
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiWordIndex, setAiWordIndex] = useState(0);

  const aiWords = useMemo(() => AI_WORD_KEYS.map((key) => t(key)), [t]);
  const sourceSelected = isSourceSelected(draft);

  useEffect(() => {
    if (!visible) {
      setAiGenerating(false);
      setAiWordIndex(0);
    }
  }, [visible]);

  useEffect(() => {
    if (!aiGenerating) {
      return;
    }

    const interval = setInterval(() => {
      setAiWordIndex((current) => {
        if (current >= aiWords.length - 1) {
          clearInterval(interval);
          return current;
        }

        return current + 1;
      });
    }, 650);

    return () => clearInterval(interval);
  }, [aiGenerating, aiWords.length]);

  if (!visible) {
    return null;
  }

  const handleSubmit = () => {
    if (draft.source === "ai") {
      setAiGenerating(true);
      setAiWordIndex(0);
      setTimeout(() => {
        onSubmit();
        setAiGenerating(false);
      }, 5200);
      return;
    }

    onSubmit();
  };

  const showSourceOptions = !sourceSelected && !aiGenerating;
  const showForm = sourceSelected && !aiGenerating;

  return (
    <SafeAreaView style={styles.overlay} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <HapticPressable style={styles.backButton} onPress={onBack} hapticType="selection">
          <Feather name="arrow-left" size={18} color={colors.text} />
        </HapticPressable>
        <Text style={styles.title}>{t("recipes.addRecipe.title")}</Text>
      </View>

      <View style={styles.content}>
        {showSourceOptions ? (
          <View style={styles.optionList}>
            <Text style={styles.helper}>{t("recipes.addRecipe.sourceIntro")}</Text>
            {RECIPE_SOURCES.map((option) => (
              <HapticPressable
                key={option.source}
                style={styles.optionCard}
                onPress={() => onChangeSource(option.source)}
                hapticType="medium"
                pressedOpacity={0.82}
              >
                <View style={styles.optionIconWrap}>
                  <Feather name={option.icon} size={18} color={colors.brand} />
                </View>
                <View style={styles.optionText}>
                  <Text style={styles.optionTitle}>{t(`recipes.source.${option.source}` as const)}</Text>
                  <Text style={styles.optionSubtitle}>
                    {t(getSourceDescriptionKey(option.source))}
                  </Text>
                </View>
                <Feather name="chevron-right" size={16} color={colors.muted} />
              </HapticPressable>
            ))}
          </View>
        ) : null}

        {showForm ? (
          <View style={styles.form}>
            <HapticPressable
              style={styles.inlineBack}
              onPress={() => onChangeSource("manual")}
              hapticType="selection"
              pressedOpacity={0.75}
            >
              <Feather name="arrow-left" size={14} color={colors.brand} />
              <Text style={styles.inlineBackLabel}>{t("recipes.addRecipe.changeSource")}</Text>
            </HapticPressable>

            <View style={styles.badgeRow}>
              <RecipeSourceBadge source={draft.source} />
            </View>

            <Text style={styles.helper}>
              {t(getInputPromptKey(draft.source))}
            </Text>

            <Input
              label={t("recipes.addRecipe.nameLabel")}
              value={draft.title}
              onChangeText={onChangeTitle}
              placeholder={t(getPlaceholderKey(draft.source))}
              autoCapitalize="words"
            />

            <View style={styles.metaRow}>
              <Input
                label={t("recipes.addRecipe.timeLabel")}
                value={draft.totalMinutes}
                onChangeText={onChangeMinutes}
                placeholder={t("recipes.addRecipe.timePlaceholder")}
                keyboardType="number-pad"
                containerStyle={styles.metaField}
              />
              <Input
                label={t("recipes.addRecipe.servingsLabel")}
                value={draft.servings}
                onChangeText={onChangeServings}
                placeholder={t("recipes.addRecipe.servingsPlaceholder")}
                keyboardType="number-pad"
                containerStyle={styles.metaField}
              />
            </View>

            <HapticPressable
              style={[styles.primaryButton, !draft.title.trim() && styles.primaryButtonDisabled]}
              onPress={handleSubmit}
              hapticType="medium"
              disabled={!draft.title.trim()}
            >
              <Text style={styles.primaryButtonLabel}>
                {draft.source === "ai"
                  ? t("recipes.addRecipe.generateAction")
                  : t("recipes.addRecipe.saveAction")}
              </Text>
            </HapticPressable>
          </View>
        ) : null}

        {aiGenerating ? (
          <View style={styles.aiWrap}>
            <View style={styles.aiIconCircle}>
              <Feather name="zap" size={24} color={colors.brand} />
            </View>
            <ActivityIndicator color={colors.brand} />
            <Text style={styles.aiWord}>{aiWords[aiWordIndex] ?? aiWords[0]}</Text>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background,
    zIndex: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 24,
    color: colors.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  optionList: {
    gap: 12,
  },
  helper: {
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
    borderRadius: 20,
    padding: 16,
    backgroundColor: colors.background,
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
  inlineBack: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
  },
  inlineBackLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.brand,
  },
  badgeRow: {
    alignSelf: "flex-start",
  },
  metaRow: {
    flexDirection: "row",
    gap: 12,
  },
  metaField: {
    flex: 1,
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
