import DetectedItemsReviewScreen from "@/components/inventory/DetectedItemsReviewScreen";
import OnboardingTopBar from "@/components/onboarding/OnboardingTopBar";
import BackButton from "@/components/ui/BackButton";
import Button from "@/components/ui/Button";
import HapticPressable from "@/components/ui/HapticPressable";
import Input from "@/components/ui/Input";
import KeyboardAvoidingContainer from "@/components/ui/KeyboardAvoidingContainer";
import { colors } from "@/constants/colors";
import { useI18n } from "@/i18n";
import { Feather } from "@expo/vector-icons";
import { ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import StorageCaptureErrorState from "./StorageCaptureErrorState";
import StorageProcessingOverlay from "./StorageProcessingOverlay";
import StorageVoiceView from "./StorageVoiceView";
import { styles } from "./styles";
import { useOnboardingStorage } from "./useOnboardingStorage";

type CaptureMethodCardProps = {
  icon: "mic" | "edit-2";
  title: string;
  subtitle: string;
  onPress: () => void;
};

function CaptureMethodCard({ icon, title, subtitle, onPress }: CaptureMethodCardProps) {
  return (
    <HapticPressable style={styles.captureCard} pressedOpacity={0.96} onPress={onPress}>
      <View style={styles.captureIcon}>
        <Feather name={icon} size={20} color={colors.brand} />
      </View>
      <Text style={styles.captureTitle}>{title}</Text>
      <Text style={styles.captureSubtitle}>{subtitle}</Text>
    </HapticPressable>
  );
}

type ManualInputRowProps = {
  inputRef: React.RefObject<TextInput | null>;
  value: string;
  onChangeText: (value: string) => void;
  onSubmit: () => void;
  addLabel: string;
  placeholder: string;
};

function ManualInputRow({
  inputRef,
  value,
  onChangeText,
  onSubmit,
  addLabel,
  placeholder,
}: ManualInputRowProps) {
  return (
    <View style={styles.manualInputRow}>
      <Input
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        autoCapitalize="words"
        returnKeyType="done"
        onSubmitEditing={onSubmit}
        containerStyle={styles.manualInputContainer}
      />
      <Button
        title={addLabel}
        disabled={!value.trim()}
        onPress={onSubmit}
        style={styles.inlineAddButton}
      />
    </View>
  );
}

type ItemsSectionProps = {
  captureMode: null | "manual" | "voice";
  items: string[];
  onAddMore: () => void;
  onRemoveItem: (index: number) => void;
};

function ItemsSection({ captureMode, items, onAddMore, onRemoveItem }: ItemsSectionProps) {
  const { t } = useI18n();

  return (
    <View style={styles.itemsSection}>
      <View style={styles.itemsHeader}>
        <Text style={styles.itemsLabel}>
          {t("storage.onboarding.itemsLabel")} ({items.length})
        </Text>
        {captureMode !== "manual" && (
          <HapticPressable style={styles.addMoreButton} pressedOpacity={0.7} onPress={onAddMore}>
            <Feather name="plus" size={12} color={colors.brand} />
            <Text style={styles.addMoreButtonText}>{t("storage.onboarding.addMore")}</Text>
          </HapticPressable>
        )}
      </View>

      <View style={styles.itemsList}>
        {items.map((item, index) => (
          <View key={`${item}-${index}`} style={styles.itemRow}>
            <View style={styles.itemCheckBubble}>
              <Feather name="check" size={12} color={colors.brand} />
            </View>
            <Text style={styles.itemName} numberOfLines={1}>
              {item}
            </Text>
            <HapticPressable
              style={styles.removeButton}
              pressedOpacity={0.7}
              onPress={() => onRemoveItem(index)}
            >
              <Feather name="x" size={14} color={colors.muted} />
            </HapticPressable>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function OnboardingStorageShell() {
  const { t } = useI18n();
  const {
    captureMode,
    reviewItems,
    items,
    isSaving,
    isVoiceProcessing,
    kitchenLabel,
    manualInputRef,
    manualValue,
    saveButtonTitle,
    showVoiceEmptyState,
    showVoiceError,
    voiceErrorKey,
    addManualItem,
    handleBack,
    handleSave,
    handleVoiceDone,
    removeItem,
    removeReviewItem,
    cancelReview,
    confirmReview,
    retryVoiceCapture,
    setCaptureMode,
    setManualValue,
  } = useOnboardingStorage();

  if (captureMode === "voice") {
    return (
      <StorageVoiceView
        storageName={kitchenLabel}
        onDone={(recordingUri) => {
          void handleVoiceDone(recordingUri);
        }}
        onBack={() => setCaptureMode(null)}
      />
    );
  }

  if (isVoiceProcessing) {
    return <StorageProcessingOverlay />;
  }

  if (showVoiceError) {
    return (
      <StorageCaptureErrorState
        variant="error"
        errorKey={voiceErrorKey}
        onTryAgain={retryVoiceCapture}
      />
    );
  }

  if (showVoiceEmptyState) {
    return <StorageCaptureErrorState variant="empty" onTryAgain={retryVoiceCapture} />;
  }

  if (reviewItems.length > 0) {
    return (
      <DetectedItemsReviewScreen
        items={reviewItems}
        onRemoveItem={removeReviewItem}
        onCancel={cancelReview}
        onConfirm={confirmReview}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <OnboardingTopBar leftAccessory={<BackButton onPress={handleBack} />} />

      <KeyboardAvoidingContainer style={styles.keyboard}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headingBlock}>
            <Text style={styles.title}>{t("storage.onboarding.title")}</Text>
            <Text style={styles.subtitle}>{t("storage.onboarding.subtitle")}</Text>
          </View>

          {captureMode !== "manual" && (
            <View style={styles.captureMethods}>
              <CaptureMethodCard
                icon="mic"
                title={t("storage.onboarding.voiceTitle")}
                subtitle={t("storage.onboarding.voiceSubtitle")}
                onPress={() => setCaptureMode("voice")}
              />
              <CaptureMethodCard
                icon="edit-2"
                title={t("storage.onboarding.manualTitle")}
                subtitle={t("storage.onboarding.manualSubtitle")}
                onPress={() => setCaptureMode("manual")}
              />
            </View>
          )}

          {captureMode === "manual" && (
            <ManualInputRow
              inputRef={manualInputRef}
              value={manualValue}
              onChangeText={setManualValue}
              onSubmit={addManualItem}
              addLabel={t("kitchen.shopping.addButton")}
              placeholder={t("storage.onboarding.manualPlaceholder")}
            />
          )}

          {items.length > 0 && (
            <ItemsSection
              captureMode={captureMode}
              items={items}
              onAddMore={() => setCaptureMode("manual")}
              onRemoveItem={removeItem}
            />
          )}

          {items.length === 0 && captureMode !== "manual" && (
            <View style={styles.shellNote}>
              <Text style={styles.shellNoteText}>{t("storage.onboarding.emptyHint")}</Text>
            </View>
          )}

          {items.length > 0 && (
            <>
              <View style={styles.flexSpacer} />
              {captureMode === "manual" && (
                <View style={styles.secondaryActions}>
                  <Button
                    title={t("storage.onboarding.addMoreByVoice")}
                    variant="secondary"
                    leftIcon={<Feather name="mic" size={16} color={colors.text} />}
                    onPress={() => setCaptureMode("voice")}
                    style={styles.secondaryActionButton}
                  />
                </View>
              )}

              <Button
                title={saveButtonTitle}
                disabled={items.length === 0}
                loading={isSaving}
                onPress={() => {
                  void handleSave();
                }}
                style={styles.saveButton}
              />
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingContainer>
    </SafeAreaView>
  );
}
