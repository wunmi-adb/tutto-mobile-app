import { useStore } from "@nanostores/react";
import { atom } from "nanostores";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { CURRENT_USER_QUERY_KEY, type CurrentUser, getCurrentUser } from "@/lib/api/profile";

type SettingsState = {
  profileName: string;
  email: string;
  kitchenName: string;
  householdSize: number | null;
  inviteCode: string;
  dietary: string[];
  allergies: string[];
  cuisines: string[];
};

const INITIAL_SETTINGS_STATE: SettingsState = {
  profileName: "",
  email: "",
  kitchenName: "",
  householdSize: null,
  inviteCode: "",
  dietary: [],
  allergies: [],
  cuisines: [],
};

export const $settingsState = atom<SettingsState>(INITIAL_SETTINGS_STATE);

function splitCommaSeparated(value: string | null | undefined) {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
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
  $settingsState.set(INITIAL_SETTINGS_STATE);
}

export function syncSettingsState(currentUser: CurrentUser | undefined) {
  if (!currentUser) {
    resetSettingsState();
    return;
  }

  updateSettingsState((current) => ({
    ...current,
    profileName: currentUser.name,
    email: currentUser.email,
    kitchenName: currentUser.household?.name ?? "",
    householdSize: currentUser.household?.number_of_household ?? null,
    inviteCode: currentUser.household?.invite_code ?? "",
    dietary: splitCommaSeparated(currentUser.household?.dietary),
    allergies: splitCommaSeparated(currentUser.household?.allergies),
    cuisines: splitCommaSeparated(currentUser.household?.love),
  }));
}

export function useSettingsSync() {
  const currentUserQuery = useQuery({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: getCurrentUser,
  });

  useEffect(() => {
    syncSettingsState(currentUserQuery.data);
  }, [currentUserQuery.data]);

  return currentUserQuery;
}

export function useSettingsState() {
  const state = useStore($settingsState);

  return {
    ...state,
    setProfileName: (value: string) => setSettingsField("profileName", value),
    setEmail: (value: string) => setSettingsField("email", value),
    setKitchenName: (value: string) => setSettingsField("kitchenName", value),
    setHouseholdSize: (value: number | null) => setSettingsField("householdSize", value),
    setDietary: (value: string[] | ((current: string[]) => string[])) =>
      setSettingsField("dietary", value),
    setAllergies: (value: string[] | ((current: string[]) => string[])) =>
      setSettingsField("allergies", value),
    setCuisines: (value: string[] | ((current: string[]) => string[])) =>
      setSettingsField("cuisines", value),
  };
}
