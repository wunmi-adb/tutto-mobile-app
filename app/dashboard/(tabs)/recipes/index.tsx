import RecipeAddCollectionCard from "@/components/dashboard/recipes/RecipeAddCollectionCard";
import RecipeCollectionActionsSheet from "@/components/dashboard/recipes/RecipeCollectionActionsSheet";
import RecipeCollectionCard from "@/components/dashboard/recipes/RecipeCollectionCard";
import RecipeCollectionEditorSheet from "@/components/dashboard/recipes/RecipeCollectionEditorSheet";
import RecipesEmptyState from "@/components/dashboard/recipes/RecipesEmptyState";
import type { RecipeCollection } from "@/components/dashboard/recipes/types";
import HapticPressable from "@/components/ui/HapticPressable";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import { useRecipesHomeState } from "@/stores/recipesStore";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RecipesHomeScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const [activeCollectionActions, setActiveCollectionActions] = useState<RecipeCollection | null>(null);
  const {
    collectionEditor,
    collectionNameDraft,
    filteredCollections,
    getCollectionCountLabel,
    openCreateCollection,
    openRenameCollection,
    closeCollectionEditor,
    submitCollectionEditor,
    setCollectionNameDraft,
    deleteCollection,
  } = useRecipesHomeState();

  const handleOpenImportTutorial = () => {
    router.push({
      pathname: "/onboarding/share-tutorial",
      params: { returnTo: "/dashboard/recipes" },
    });
  };

  const openCollection = (collectionId: string) => {
    router.push(`/dashboard/recipes/${collectionId}`);
  };

  const closeActions = () => {
    setActiveCollectionActions(null);
  };

  const handleRenameCollection = () => {
    if (!activeCollectionActions) {
      return;
    }

    closeActions();
    openRenameCollection(activeCollectionActions.id);
  };

  const handleDeleteCollection = () => {
    if (!activeCollectionActions) {
      return;
    }

    deleteCollection(activeCollectionActions.id);
    closeActions();
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{t("recipes.home.title")}</Text>
            <Text style={styles.subtitle}>
              {t("recipes.home.collectionCount", { count: filteredCollections.length })}
            </Text>
          </View>
          <HapticPressable style={styles.plusButton} onPress={openCreateCollection} hapticType="medium">
            <Feather name="plus" size={16} color={colors.background} />
          </HapticPressable>
        </View>

        <HapticPressable
          style={styles.importCard}
          onPress={handleOpenImportTutorial}
          hapticType="light"
          pressedOpacity={1}
        >
          <View style={styles.importIconWrap}>
            <Feather name="video" size={18} color={colors.brand} />
          </View>
          <View style={styles.importCopy}>
            <Text style={styles.importTitle}>Import from IG, TikTok & more</Text>
            <Text style={styles.importSubtitle} numberOfLines={2}>
              Learn how to send recipes to Tutto
            </Text>
          </View>
          <Feather name="chevron-right" size={16} color={colors.muted} />
        </HapticPressable>

        <View style={styles.section}>
          {filteredCollections.length === 0 ? (
            <RecipesEmptyState
              title={t("recipes.home.empty.title")}
              subtitle={t("recipes.home.empty.subtitle")}
            />
          ) : null}

          <View style={styles.grid}>
            {filteredCollections.map((collection) => (
              <RecipeCollectionCard
                key={collection.id}
                title={collection.name}
                countLabel={getCollectionCountLabel(collection)}
                image={collection.image}
                onPress={() => openCollection(collection.id)}
                onLongPress={() => setActiveCollectionActions(collection)}
                onPressOptions={() => setActiveCollectionActions(collection)}
              />
            ))}
            <RecipeAddCollectionCard
              onPress={openCreateCollection}
              label={t("recipes.home.newCollection")}
            />
          </View>
        </View>
      </ScrollView>

      <RecipeCollectionEditorSheet
        visible={Boolean(collectionEditor)}
        title={
          collectionEditor?.mode === "rename"
            ? t("recipes.collectionEditor.renameTitle")
            : t("recipes.collectionEditor.createTitle")
        }
        actionLabel={
          collectionEditor?.mode === "rename"
            ? t("recipes.collectionEditor.saveAction")
            : t("recipes.collectionEditor.createAction")
        }
        name={collectionNameDraft}
        placeholder={t("recipes.collectionEditor.namePlaceholder")}
        onChangeName={setCollectionNameDraft}
        onSubmit={submitCollectionEditor}
        onClose={closeCollectionEditor}
      />

      <RecipeCollectionActionsSheet
        visible={Boolean(activeCollectionActions)}
        canDelete={activeCollectionActions?.recipeIds.length === 0}
        onRename={handleRenameCollection}
        onDelete={handleDeleteCollection}
        onClose={closeActions}
      />
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
    gap: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 28,
    lineHeight: 32,
    color: colors.text,
  },
  subtitle: {
    marginTop: 4,
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
  },
  plusButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.brand,
    marginTop: 4,
  },
  importCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 14,
    backgroundColor: colors.background,
    boxShadow: "0 2px 10px rgba(26, 18, 8, 0.04)",
  },
  importIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: `${colors.brand}12`,
  },
  importCopy: {
    flex: 1,
  },
  importTitle: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  importSubtitle: {
    fontFamily: fonts.sans,
    fontSize: 12,
    lineHeight: 18,
    color: colors.muted,
  },
  section: {
    gap: 14,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
});
