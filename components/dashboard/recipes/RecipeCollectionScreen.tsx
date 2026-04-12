import RecipeListItem from "@/components/dashboard/recipes/RecipeListItem";
import RecipeSearchField from "@/components/dashboard/recipes/RecipeSearchField";
import HapticPressable from "@/components/ui/HapticPressable";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import { useRecipeCollectionState } from "@/stores/recipesStore";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  collectionId: string;
};

export default function RecipeCollectionScreen({ collectionId }: Props) {
  const router = useRouter();
  const { t } = useI18n();
  const {
    collection,
    collectionCountLabel,
    collectionSearchQuery,
    filteredRecipes,
    getRecipeImage,
    getRecipeMinutesLabel,
    getRecipeServingsLabel,
    getRecipeTitle,
    setCollectionSearchQuery,
  } = useRecipeCollectionState(collectionId);

  const handleOpenAddRecipe = () => {
    router.push({
      pathname: "/dashboard/recipes/add",
      params: { collectionId },
    });
  };

  const handleOpenRecipe = (recipeId: string) => {
    router.push({
      pathname: "/dashboard/recipes/recipe",
      params: { recipeId },
    });
  };

  if (!collection) {
    return (
      <SafeAreaView style={styles.stateScreen} edges={["top"]}>
        <View style={styles.stateCard}>
          <Text style={styles.stateTitle}>{t("recipes.collection.missing.title")}</Text>
          <Text style={styles.stateSubtitle}>{t("recipes.collection.missing.subtitle")}</Text>
          <HapticPressable style={styles.backButton} onPress={() => router.back()} hapticType="selection">
            <Text style={styles.backButtonLabel}>{t("recipes.collection.back")}</Text>
          </HapticPressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <HapticPressable style={styles.headerIcon} onPress={() => router.back()} hapticType="selection">
            <Feather name="arrow-left" size={18} color={colors.text} />
          </HapticPressable>
          <HapticPressable style={styles.headerIconPrimary} onPress={handleOpenAddRecipe} hapticType="medium">
            <Feather name="plus" size={18} color={colors.background} />
          </HapticPressable>
        </View>

        <Text style={styles.title}>{collection.name}</Text>
        <Text style={styles.subtitle}>{collectionCountLabel}</Text>

        {collection.recipeIds.length > 3 ? (
          <RecipeSearchField
            placeholder={t("recipes.collection.searchPlaceholder")}
            value={collectionSearchQuery}
            onChangeText={setCollectionSearchQuery}
          />
        ) : null}

        <View style={styles.list}>
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => (
              <RecipeListItem
                key={recipe.id}
                title={getRecipeTitle(recipe)}
                minutesLabel={getRecipeMinutesLabel(recipe)}
                servingsLabel={getRecipeServingsLabel(recipe)}
                source={recipe.source}
                image={getRecipeImage(recipe)}
                onPress={() => handleOpenRecipe(recipe.id)}
              />
            ))
          ) : (
            <View style={styles.emptyWrap}>
              <View style={styles.emptyIconWrap}>
                <Feather name="book-open" size={24} color={colors.muted} />
              </View>
              <Text style={styles.emptyTitle}>
                {collectionSearchQuery.trim() ? "No recipes match your search" : "No recipes yet"}
              </Text>
              {!collectionSearchQuery.trim() ? (
                <HapticPressable
                  style={styles.emptyAction}
                  onPress={handleOpenAddRecipe}
                  hapticType="medium"
                  pressedOpacity={1}
                >
                  <Feather name="plus" size={16} color={colors.brand} />
                  <Text style={styles.emptyActionLabel}>{t("recipes.collection.addFirstRecipe")}</Text>
                </HapticPressable>
              ) : null}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  headerIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  headerIconPrimary: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.brand,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 28,
    lineHeight: 32,
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
    marginBottom: 18,
  },
  list: {
    marginTop: 18,
    gap: 12,
  },
  emptyWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },
  emptyIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  emptyTitle: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.muted,
    textAlign: "center",
  },
  emptyAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    marginTop: 12,
  },
  emptyActionLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.brand,
  },
  stateScreen: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  stateCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 28,
    alignItems: "center",
    gap: 10,
  },
  stateTitle: {
    fontFamily: fonts.sansMedium,
    fontSize: 16,
    color: colors.text,
    textAlign: "center",
  },
  stateSubtitle: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
    textAlign: "center",
  },
  backButton: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  backButtonLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.text,
  },
});
