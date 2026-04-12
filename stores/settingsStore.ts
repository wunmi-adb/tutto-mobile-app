import { useStore } from "@nanostores/react";
import { atom } from "nanostores";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { MEAL_SLOT_OPTIONS } from "@/components/settings/data";
import { useI18n } from "@/i18n";
import { translations } from "@/i18n/messages";
import { CURRENT_USER_QUERY_KEY, type CurrentUser, getCurrentUser } from "@/lib/api/profile";

type SettingsState = {
  copied: boolean;
  profileName: string;
  email: string;
  kitchenName: string;
  inviteCode: string;
  dietary: string[];
  allergies: string[];
  dislikes: string[];
  cuisines: string[];
  mealSlots: string[];
  anythingElse: string;
};

const INITIAL_SETTINGS_STATE: SettingsState = {
  copied: false,
  profileName: "",
  email: "",
  kitchenName: "",
  inviteCode: "",
  dietary: [],
  allergies: [],
  dislikes: [],
  cuisines: [],
  mealSlots: [],
  anythingElse: "",
};

export const $settingsState = atom<SettingsState>(INITIAL_SETTINGS_STATE);

let copiedTimeout: ReturnType<typeof setTimeout> | null = null;

function splitCommaSeparated(value: string | null | undefined) {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getMealSlotLabels(
  user: CurrentUser | undefined,
  language: ReturnType<typeof useI18n>["language"],
) {
  const mealKeys = splitCommaSeparated(user?.household?.meals);
  const dictionary = translations[language] ?? translations.en;

  return mealKeys.map((mealKey) => {
    const option = MEAL_SLOT_OPTIONS.find((item) => {
      const labelKey = item.valueKey.replace("meals.options.", "").replace(".label", "");
      return labelKey === mealKey;
    });

    return option ? dictionary[option.valueKey] : mealKey;
  });
}

function resolveNextValue<T>(currentValue: T, nextValue: T | ((current: T) => T)) {
  if (typeof nextValue === "function") {
    return (nextValue as (current: T) => T)(currentValue);
  }

  return nextValue;
}

function updateSettingsState(updater: (current: SettingsState) => SettingsState) {
  $settingsState.set(updater($settingsState.get()));
}

function setSettingsField<Key extends keyof SettingsState>(
  key: Key,
  nextValue: SettingsState[Key] | ((current: SettingsState[Key]) => SettingsState[Key]),
) {
  updateSettingsState((current) => ({
    ...current,
    [key]: resolveNextValue(current[key], nextValue),
  }));
}

export function resetSettingsState() {
  if (copiedTimeout) {
    clearTimeout(copiedTimeout);
    copiedTimeout = null;
  }

  $settingsState.set(INITIAL_SETTINGS_STATE);
}

export function syncSettingsState(currentUser: CurrentUser | undefined, language: ReturnType<typeof useI18n>["language"]) {
  if (!currentUser) {
    resetSettingsState();
    return;
  }

  updateSettingsState((current) => ({
    ...current,
    copied: false,
    profileName: currentUser.name,
    email: currentUser.email,
    kitchenName: currentUser.household?.name ?? "",
    inviteCode: currentUser.household?.invite_code ?? "",
    dietary: splitCommaSeparated(currentUser.household?.dietary),
    allergies: splitCommaSeparated(currentUser.household?.allergies),
    dislikes: splitCommaSeparated(currentUser.household?.dislike),
    cuisines: splitCommaSeparated(currentUser.household?.love),
    mealSlots: getMealSlotLabels(currentUser, language),
  }));
}

export function copyInviteCode() {
  if (copiedTimeout) {
    clearTimeout(copiedTimeout);
  }

  setSettingsField("copied", true);
  copiedTimeout = setTimeout(() => {
    setSettingsField("copied", false);
    copiedTimeout = null;
  }, 2000);
}

export function useSettingsSync() {
  const { language } = useI18n();
  const currentUserQuery = useQuery({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: getCurrentUser,
  });

  useEffect(() => {
    syncSettingsState(currentUserQuery.data, language);
  }, [currentUserQuery.data, language]);

  return currentUserQuery;
}

export function useSettingsState() {
  const state = useStore($settingsState);

  return {
    ...state,
    copyInviteCode,
    setProfileName: (value: string) => setSettingsField("profileName", value),
    setEmail: (value: string) => setSettingsField("email", value),
    setKitchenName: (value: string) => setSettingsField("kitchenName", value),
    setDietary: (value: string[] | ((current: string[]) => string[])) =>
      setSettingsField("dietary", value),
    setAllergies: (value: string[] | ((current: string[]) => string[])) =>
      setSettingsField("allergies", value),
    setDislikes: (value: string[] | ((current: string[]) => string[])) =>
      setSettingsField("dislikes", value),
    setCuisines: (value: string[] | ((current: string[]) => string[])) =>
      setSettingsField("cuisines", value),
    setMealSlots: (value: string[] | ((current: string[]) => string[])) =>
      setSettingsField("mealSlots", value),
    setAnythingElse: (value: string) => setSettingsField("anythingElse", value),
  };
}
