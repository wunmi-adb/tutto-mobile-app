import OnboardingTopBar from "@/components/onboarding/OnboardingTopBar";
import BackButton from "@/components/ui/BackButton";
import Button from "@/components/ui/Button";
import HapticPressable from "@/components/ui/HapticPressable";
import Input from "@/components/ui/Input";
import KeyboardAvoidingContainer from "@/components/ui/KeyboardAvoidingContainer";
import SelectableRow from "@/components/ui/SelectableRow";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import { useCreateStorageLocation, useStorageLocations } from "@/lib/api/storage-locations";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SUGGESTED_LOCATIONS = [
  { id: "fridge", key: "storage.options.fridge" },
  { id: "freezer", key: "storage.options.freezer" },
  { id: "pantry", key: "storage.options.pantry" },
  { id: "spice-rack", key: "storage.options.spiceRack" },
] as const;

export default function Storage() {
  const router = useRouter();
  const { source } = useLocalSearchParams<{ source?: string }>();
  const { t } = useI18n();
  const storageLocationsQuery = useStorageLocations();
  const isPantryFlow = source === "pantry";
  const navigateToAddItems = (locationName: string, storageKey: string) => {
    const nextRoute = {
      pathname: "/onboarding/add-items" as const,
      params: {
        location: locationName,
        storageKey,
        ...(source ? { source } : {}),
      },
    };

    if (isPantryFlow) {
      router.push(nextRoute);
      return;
    }

    router.replace(nextRoute);
  };
  const createStorageLocationMutation = useCreateStorageLocation({
    onSuccess: async (storageLocation) => {
      navigateToAddItems(storageLocation.name, storageLocation.key);
    },
  });
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [isAddingNew, setIsAddingNew] = useState(false);

  const hasResolvedLocations = Array.isArray(storageLocationsQuery.data);
  const shouldShowInitialLoading = !hasResolvedLocations && !storageLocationsQuery.isError;
  const storageLocations = storageLocationsQuery.data ?? [];
  const hasExisting = storageLocations.length > 0;
  const isFirstTime = hasResolvedLocations && !hasExisting && !isAddingNew;
  const showBackButton =
    isPantryFlow ||
    isFirstTime ||
    isAddingNew ||
    storageLocationsQuery.isLoading ||
    storageLocationsQuery.isError;

  const canContinue =
    isFirstTime || isAddingNew ? newName.trim().length > 0 : !!selectedKey;

  const handleBackPress = () => {
    if (isAddingNew && hasExisting) {
      setIsAddingNew(false);
      setNewName("");
      return;
    }

    router.back();
  };

  const handleContinue = async () => {
    if (createStorageLocationMutation.isPending || storageLocationsQuery.isLoading) {
      return;
    }

    try {
      if (!isFirstTime && !isAddingNew) {
        const selectedLocation = storageLocations.find((location) => location.key === selectedKey);

        if (!selectedLocation) {
          return;
        }

        navigateToAddItems(selectedLocation.name, selectedLocation.key);
        return;
      }

      await createStorageLocationMutation.mutateAsync({ name: newName.trim() });
    } catch {
      // The mutation hook already shows the translated error toast.
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <OnboardingTopBar leftAccessory={showBackButton ? <BackButton onPress={handleBackPress} /> : undefined} />

      <KeyboardAvoidingContainer style={styles.keyboard}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {shouldShowInitialLoading ? (
            <View style={styles.loadingState}>
              <ActivityIndicator size="small" color={colors.text} />
              <Text style={styles.loadingText}>{t("storage.loading")}</Text>
            </View>
          ) : storageLocationsQuery.isError ? (
            <View style={styles.errorState}>
              <Text style={styles.title}>{t("storage.errorTitle")}</Text>
              <Text style={styles.subtitle}>{t("storage.errorSubtitle")}</Text>
              <Button
                title={t("storage.retry")}
                onPress={() => {
                  void storageLocationsQuery.refetch();
                }}
                style={styles.retryButton}
              />
            </View>
          ) : isFirstTime || isAddingNew ? (
            <>
              <View style={styles.headingBlock}>
                <Text style={styles.title}>
                  {isAddingNew ? t("storage.addNew.title") : t("storage.firstTime.title")}
                </Text>
                <Text style={styles.subtitle}>
                  {isAddingNew ? t("storage.addNew.subtitle") : t("storage.firstTime.subtitle")}
                </Text>
              </View>

              <Input
                label={t("storage.customLabel")}
                value={newName}
                onChangeText={setNewName}
                placeholder={t("storage.customPlaceholder")}
                autoFocus={isAddingNew}
                containerStyle={styles.customInput}
              />

              {isFirstTime && (
                <>
                  <Text style={styles.suggestionsLabel}>{t("storage.suggestionsLabel")}</Text>
                  <View style={styles.suggestions}>
                    {SUGGESTED_LOCATIONS.map((location) => {
                      const label = t(location.key);
                      const active = newName.trim() === label;

                      return (
                        <HapticPressable
                          key={location.id}
                          style={[styles.suggestionChip, active && styles.suggestionChipActive]}
                          pressedOpacity={0.7}
                          onPress={() => setNewName(label)}
                        >
                          <Text style={[styles.suggestionText, active && styles.suggestionTextActive]}>
                            {label}
                          </Text>
                        </HapticPressable>
                      );
                    })}
                  </View>

                  <View style={styles.infoCard}>
                    <Feather name="map-pin" size={16} color={colors.muted} />
                    <View style={styles.infoCopy}>
                      <Text style={styles.infoTitle}>{t("storage.howItWorks.title")}</Text>
                      <Text style={styles.infoBody}>{t("storage.howItWorks.body")}</Text>
                    </View>
                  </View>
                </>
              )}
            </>
          ) : (
            <>
              <View style={styles.headingBlock}>
                <Text style={styles.title}>{t("storage.pickExisting.title")}</Text>
                <Text style={styles.subtitle}>{t("storage.pickExisting.subtitle")}</Text>
              </View>

              <View style={styles.list}>
                {storageLocations.map((location) => (
                  <SelectableRow
                    key={location.key}
                    label={location.name}
                    selected={selectedKey === location.key}
                    onPress={() => setSelectedKey(location.key)}
                    variant="radio"
                  />
                ))}

                <HapticPressable
                  style={styles.newLocationRow}
                  pressedOpacity={0.7}
                  onPress={() => {
                    setIsAddingNew(true);
                    setSelectedKey(null);
                    setNewName("");
                  }}
                >
                  <Feather name="plus" size={16} color={colors.muted} />
                  <Text style={styles.newLocationText}>{t("storage.newLocation")}</Text>
                </HapticPressable>
              </View>
            </>
          )}

          <Button
            title={t("storage.cta")}
            disabled={!canContinue}
            loading={createStorageLocationMutation.isPending || storageLocationsQuery.isFetching}
            onPress={() => {
              void handleContinue();
            }}
            style={styles.button}
          />
        </ScrollView>
      </KeyboardAvoidingContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  keyboard: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  headingBlock: {
    marginBottom: 32,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 36,
    lineHeight: 40,
    color: colors.text,
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: fonts.sans,
    fontSize: 14,
    letterSpacing: 0.3,
    color: colors.muted,
    lineHeight: 21,
  },
  list: {
    gap: 10,
    marginBottom: 24,
  },
  customInput: {
    marginBottom: 24,
  },
  suggestionsLabel: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.muted,
    marginBottom: 10,
  },
  suggestions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 24,
  },
  suggestionChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.secondary,
  },
  suggestionChipActive: {
    backgroundColor: colors.text,
  },
  suggestionText: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.muted,
  },
  suggestionTextActive: {
    color: colors.background,
  },
  infoCard: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.border,
    backgroundColor: colors.secondary + "66",
    marginBottom: 8,
  },
  infoCopy: {
    flex: 1,
  },
  infoTitle: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.text,
    marginBottom: 4,
  },
  infoBody: {
    fontFamily: fonts.sans,
    fontSize: 12,
    lineHeight: 18,
    color: colors.muted,
  },
  newLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.border,
  },
  newLocationText: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.muted,
  },
  loadingState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    paddingBottom: 40,
    gap: 12,
  },
  loadingText: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.muted,
  },
  errorState: {
    paddingTop: 32,
    paddingBottom: 24,
  },
  retryButton: {
    marginTop: 16,
  },
  button: {
    marginTop: 8,
  },
});
