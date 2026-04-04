import { useI18n } from "@/i18n";
import { translations } from "@/i18n/messages";
import { CURRENT_USER_QUERY_KEY, CurrentUser, getCurrentUser } from "@/lib/api/profile";
import { MEAL_SLOT_OPTIONS } from "./data";
import { useQuery } from "@tanstack/react-query";
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";

type SettingsContextValue = {
  copied: boolean;
  profileName: string;
  email: string;
  kitchenName: string;
  inviteCode: string;
  appliances: string[];
  dietary: string[];
  allergies: string[];
  dislikes: string[];
  cuisines: string[];
  mealSlots: string[];
  anythingElse: string;
  copyInviteCode: () => void;
  setProfileName: (value: string) => void;
  setEmail: (value: string) => void;
  setKitchenName: (value: string) => void;
  setAppliances: Dispatch<SetStateAction<string[]>>;
  setDietary: Dispatch<SetStateAction<string[]>>;
  setAllergies: Dispatch<SetStateAction<string[]>>;
  setDislikes: Dispatch<SetStateAction<string[]>>;
  setCuisines: Dispatch<SetStateAction<string[]>>;
  setMealSlots: Dispatch<SetStateAction<string[]>>;
  setAnythingElse: (value: string) => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

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

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { language } = useI18n();
  const currentUserQuery = useQuery({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: getCurrentUser,
  });
  const currentUser = currentUserQuery.data;
  const [copied, setCopied] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [email, setEmail] = useState("");
  const [kitchenName, setKitchenName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [appliances, setAppliances] = useState<string[]>([]);
  const [dietary, setDietary] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [dislikes, setDislikes] = useState<string[]>([]);
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [mealSlots, setMealSlots] = useState<string[]>([]);
  const [anythingElse, setAnythingElse] = useState("");

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timeout = setTimeout(() => setCopied(false), 2000);

    return () => clearTimeout(timeout);
  }, [copied]);

  useEffect(() => {
    if (!currentUser) {
      setProfileName("");
      setEmail("");
      setKitchenName("");
      setInviteCode("");
      setAppliances([]);
      setDietary([]);
      setAllergies([]);
      setDislikes([]);
      setCuisines([]);
      setMealSlots([]);
      setAnythingElse("");
      setCopied(false);
      return;
    }

    setProfileName(currentUser.name);
    setEmail(currentUser.email);
    setKitchenName(currentUser.household?.name ?? "");
    setInviteCode(currentUser.household?.invite_code ?? "");
    setAppliances(splitCommaSeparated(currentUser.household?.kitchen_appliances));
    setDietary(splitCommaSeparated(currentUser.household?.dietary));
    setAllergies(splitCommaSeparated(currentUser.household?.allergies));
    setDislikes(splitCommaSeparated(currentUser.household?.dislike));
    setCuisines(splitCommaSeparated(currentUser.household?.love));
    setMealSlots(getMealSlotLabels(currentUser, language));
  }, [currentUser, language]);

  return (
    <SettingsContext.Provider
      value={{
        copied,
        profileName,
        email,
        kitchenName,
        inviteCode,
        appliances,
        dietary,
        allergies,
        dislikes,
        cuisines,
        mealSlots,
        anythingElse,
        copyInviteCode: () => setCopied(true),
        setProfileName,
        setEmail,
        setKitchenName,
        setAppliances,
        setDietary,
        setAllergies,
        setDislikes,
        setCuisines,
        setMealSlots,
        setAnythingElse,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettingsState() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error("useSettingsState must be used within a SettingsProvider.");
  }

  return context;
}
