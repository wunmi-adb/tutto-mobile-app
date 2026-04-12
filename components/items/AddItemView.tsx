import SettingsConfirmationSheet from "@/components/settings/SettingsConfirmationSheet";
import Button from "@/components/ui/Button";
import KeyboardAvoidingContainer from "@/components/ui/KeyboardAvoidingContainer";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import { Feather } from "@expo/vector-icons";
import { useCallback, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AddItemBatchSection from "./add-item/AddItemBatchSection";
import AddItemHeader from "./add-item/AddItemHeader";
import AddItemTypeToggle from "./add-item/AddItemTypeToggle";
import {
  Batch,
  ItemDraft,
  PrefillableItem,
  makeItemDraft,
  makeItemDraftFromPrefill,
} from "./add-item/types";

type Props = {
  storageName: string;
  items: PrefillableItem[];
  currentIndex: number;
  completedIndices: number[];
  onFinish: (drafts: ItemDraft[]) => Promise<void> | void;
  onBack: () => void;
  onDelete?: () => Promise<void> | void;
  deleting?: boolean;
  saving?: boolean;
};

export default function AddItemView({
  storageName,
  items,
  currentIndex: initialIndex,
  completedIndices: initialCompleted,
  onFinish,
  onBack,
  onDelete,
  deleting = false,
  saving = false,
}: Props) {
  const { t } = useI18n();
  const [drafts, setDrafts] = useState<ItemDraft[]>(() =>
    items.map((item) => makeItemDraftFromPrefill(item)),
  );
  const [idx, setIdx] = useState(() => {
    const initialDraftCount = items.length;

    if (initialDraftCount === 0) {
      return 0;
    }

    const normalizedInitialIndex = Number.isFinite(initialIndex) ? initialIndex : 0;
    return Math.min(Math.max(normalizedInitialIndex, 0), initialDraftCount - 1);
  });
  const [completed, setCompleted] = useState(new Set(initialCompleted));
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [pendingFinishedBatchId, setPendingFinishedBatchId] = useState<number | null>(null);
  const safeIndex = drafts.length === 0 ? 0 : Math.min(Math.max(idx, 0), drafts.length - 1);
  const currentDraft = useMemo(() => drafts[safeIndex], [drafts, safeIndex]);
  const isEditMode = Boolean(onDelete);
  const pendingFinishedBatch =
    pendingFinishedBatchId == null
      ? undefined
      : currentDraft?.batches.find((batch) => batch.id === pendingFinishedBatchId);

  const updateCurrentDraft = useCallback(
    (updater: (draft: ItemDraft) => ItemDraft) => {
      setDrafts((prev) =>
        prev.map((draft, draftIndex) => (draftIndex === safeIndex ? updater(draft) : draft)),
      );
    },
    [safeIndex],
  );

  const updateBatch = useCallback(
    (id: number, updates: Partial<Batch>) => {
      updateCurrentDraft((draft) => ({
        ...draft,
        batches: draft.batches.map((batch) => (batch.id === id ? { ...batch, ...updates } : batch)),
      }));
    },
    [updateCurrentDraft],
  );

  const removeBatch = useCallback(
    (id: number) => {
      updateCurrentDraft((draft) => {
        const nextBatches = draft.batches.filter((batch) => batch.id !== id);

        return {
          ...draft,
          batches: nextBatches,
          expandedBatchId:
            draft.expandedBatchId === id ? (nextBatches[0]?.id ?? -1) : draft.expandedBatchId,
        };
      });
    },
    [updateCurrentDraft],
  );

  const addBatch = useCallback(() => {
    updateCurrentDraft((draft) => {
      const nextDraft = makeItemDraft(draft.name);
      const nextBatch = nextDraft.batches[0];

      return {
        ...draft,
        batches: [...draft.batches, nextBatch],
        expandedBatchId: nextBatch.id,
      };
    });
  }, [updateCurrentDraft]);

  const switchTo = useCallback((newIdx: number, newCompleted: Set<number>) => {
    setIdx(newIdx);
    setCompleted(newCompleted);
  }, []);

  const handleSave = async () => {
    if (saving) {
      return;
    }

    const next = new Set(completed);
    next.add(idx);

    if (idx < items.length - 1) {
      switchTo(idx + 1, next);
    } else {
      await onFinish(drafts);
    }
  };

  if (!currentDraft) {
    return (
      <SafeAreaView style={styles.container}>
        <AddItemHeader
          currentIndex={0}
          itemCount={items.length}
          onBack={onBack}
          onNext={() => undefined}
          onPrevious={() => undefined}
          storageName={storageName}
        />

        <View style={styles.finishedEmptyState}>
          <Feather name="package" size={20} color={colors.muted} />
          <Text style={styles.finishedEmptyTitle}>{t("dashboard.kitchen.empty.noItems")}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isLast = safeIndex === items.length - 1;
  const isIngredient = currentDraft.itemType === "ingredient";

  return (
    <SafeAreaView style={styles.container}>
      <AddItemHeader
        currentIndex={idx}
        itemCount={items.length}
        onBack={onBack}
        onDelete={onDelete ? () => setConfirmDeleteVisible(true) : undefined}
        onNext={() => idx < items.length - 1 && switchTo(idx + 1, completed)}
        onPrevious={() => idx > 0 && switchTo(idx - 1, completed)}
        storageName={storageName}
      />

      <KeyboardAvoidingContainer style={styles.keyboard}>
        <View style={styles.animatedContent}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <TextInput
              style={styles.nameInput}
              value={currentDraft.name}
              onChangeText={(value) =>
                updateCurrentDraft((draft) => ({
                  ...draft,
                  name: value,
                }))
              }
              placeholder={
                isIngredient
                  ? t("addItems.detail.namePlaceholder.ingredient")
                  : t("addItems.detail.namePlaceholder.cooked")
              }
              placeholderTextColor={`${colors.muted}66`}
              autoCapitalize="words"
              returnKeyType="done"
              selectionColor={colors.text}
            />

            <AddItemTypeToggle
              itemType={currentDraft.itemType}
              onChange={(itemType) =>
                updateCurrentDraft((draft) => ({
                  ...draft,
                  itemType,
                }))
              }
            />

            <AddItemBatchSection
              draft={currentDraft}
              isEditMode={isEditMode}
              onAddBatch={addBatch}
              onMarkFinished={(batchId) => setPendingFinishedBatchId(batchId)}
              onRemoveBatch={removeBatch}
              onToggleBatch={(batchId) =>
                updateCurrentDraft((draft) => ({
                  ...draft,
                  expandedBatchId: draft.expandedBatchId === batchId ? -1 : batchId,
                }))
              }
              onToggleTracking={() =>
                updateCurrentDraft((draft) => ({
                  ...draft,
                  countAsUnits: !draft.countAsUnits,
                }))
              }
              onUpdateBatch={updateBatch}
            />

            <Button
              title={isLast ? t("addItems.detail.saveFinish") : t("addItems.detail.saveNext")}
              disabled={!currentDraft.name.trim()}
              loading={isLast && saving}
              onPress={() => {
                void handleSave();
              }}
            />
          </ScrollView>
        </View>
      </KeyboardAvoidingContainer>

      {confirmDeleteVisible ? (
        <SettingsConfirmationSheet
          visible
          title={t("addItems.detail.delete.title", {
            name: currentDraft.name.trim() || t("addItems.detail.delete.fallbackName"),
          })}
          subtitle={t("addItems.detail.delete.subtitle", {
            name: currentDraft.name.trim() || t("addItems.detail.delete.fallbackName"),
          })}
          confirmLabel={t("addItems.detail.delete.confirm")}
          cancelLabel={t("addItems.detail.delete.cancel")}
          destructive
          confirmLoading={deleting}
          onCancel={() => setConfirmDeleteVisible(false)}
          onConfirm={async () => {
            setConfirmDeleteVisible(false);
            await onDelete?.();
          }}
        />
      ) : null}

      {pendingFinishedBatchId != null ? (
        <SettingsConfirmationSheet
          visible
          title={t(
            isIngredient
              ? "addItems.batch.finished.title.ingredient"
              : "addItems.batch.finished.title.cooked",
          )}
          subtitle={t(
            isIngredient
              ? "addItems.batch.finished.subtitle.ingredient"
              : "addItems.batch.finished.subtitle.cooked",
            {
              target:
                currentDraft.batches.length > 1
                  ? t(
                      isIngredient
                        ? "addItems.batch.finished.target.batch"
                        : "addItems.batch.finished.target.portion",
                      {
                        index:
                          (pendingFinishedBatch
                            ? currentDraft.batches.findIndex(
                                (batch) => batch.id === pendingFinishedBatch.id,
                              )
                            : -1) + 1,
                      },
                    )
                  : t(
                      isIngredient
                        ? "addItems.batch.finished.target.thisBatch"
                        : "addItems.batch.finished.target.thisPortion",
                    ),
              name: currentDraft.name.trim() || t("addItems.detail.delete.fallbackName"),
            },
          )}
          confirmLabel={t("addItems.batch.finished.confirm")}
          cancelLabel={t("addItems.batch.finished.cancel")}
          onCancel={() => setPendingFinishedBatchId(null)}
          onConfirm={async () => {
            if (pendingFinishedBatchId == null) {
              return;
            }

            removeBatch(pendingFinishedBatchId);
            setPendingFinishedBatchId(null);
          }}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  keyboard: { flex: 1 },
  animatedContent: { flex: 1, overflow: "hidden" },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 48 },
  nameInput: {
    fontFamily: fonts.serif,
    fontSize: 32,
    lineHeight: 38,
    color: colors.text,
    paddingVertical: 8,
    marginBottom: 12,
  },
  finishedEmptyState: {
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.border,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  finishedEmptyTitle: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.muted,
  },
});
