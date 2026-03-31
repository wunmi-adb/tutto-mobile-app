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

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [copied, setCopied] = useState(false);
  const [profileName, setProfileName] = useState("Oluwole");
  const [email, setEmail] = useState("oluwole@email.com");
  const [kitchenName, setKitchenName] = useState("The Okafor Family");
  const [inviteCode] = useState("OKFR-2847");
  const [appliances, setAppliances] = useState(["Oven", "Microwave", "Air fryer", "Blender"]);
  const [dietary, setDietary] = useState(["Halal"]);
  const [allergies, setAllergies] = useState(["Tree nuts"]);
  const [dislikes, setDislikes] = useState(["Liver", "Blue cheese"]);
  const [cuisines, setCuisines] = useState(["Nigerian", "Italian", "Indian"]);
  const [mealSlots, setMealSlots] = useState(["Breakfast", "Lunch", "Dinner"]);
  const [anythingElse, setAnythingElse] = useState("");

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timeout = setTimeout(() => setCopied(false), 2000);

    return () => clearTimeout(timeout);
  }, [copied]);

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
