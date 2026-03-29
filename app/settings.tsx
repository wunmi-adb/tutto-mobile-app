import SettingsAccountEditor from "@/components/settings/SettingsAccountEditor";
import SettingsChipEditor from "@/components/settings/SettingsChipEditor";
import {
  ALLERGY_OPTIONS,
  APPLIANCE_OPTIONS,
  CUISINE_OPTIONS,
  DIETARY_OPTIONS,
  DISLIKE_SUGGESTIONS,
  LANGUAGE_OPTIONS,
  MEAL_SLOT_OPTIONS,
} from "@/components/settings/data";
import SettingsMainView from "@/components/settings/SettingsMainView";
import SettingsSelectionEditor from "@/components/settings/SettingsSelectionEditor";
import SettingsSupportView from "@/components/settings/SettingsSupportView";
import SettingsTextEditor from "@/components/settings/SettingsTextEditor";
import { SettingsView } from "@/components/settings/types";
import { useRouter } from "expo-router";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";

function summariseList(values: string[]) {
  if (!values.length) return "Not set";
  if (values.length === 1) return values[0];
  if (values.length === 2) return values.join(", ");
  return `${values[0]}, ${values[1]} +${values.length - 2}`;
}

function addUniqueValue(current: string[], value: string) {
  if (current.some((item) => item.toLowerCase() === value.toLowerCase())) {
    return current;
  }

  return [...current, value];
}

export default function SettingsScreen() {
  const router = useRouter();
  const [view, setView] = useState<SettingsView>("main");
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
  const [languageCode, setLanguageCode] = useState("en");

  useEffect(() => {
    if (!copied) return;

    const timeout = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timeout);
  }, [copied]);

  const languageLabel =
    LANGUAGE_OPTIONS.find((language) => language.code === languageCode)?.label ?? "English";

  const toggleValue = (
    setter: Dispatch<SetStateAction<string[]>>,
    value: string,
    single = false
  ) => {
    setter((prev) => {
      if (single) {
        return prev.includes(value) ? prev : [value];
      }

      return prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value];
    });
  };

  if (view === "account") {
    return (
      <SettingsAccountEditor
        name={profileName}
        email={email}
        onChangeName={setProfileName}
        onChangeEmail={setEmail}
        onBack={() => setView("main")}
      />
    );
  }

  if (view === "kitchen-name") {
    return (
      <SettingsTextEditor
        title="Kitchen name"
        subtitle="Give your shared kitchen a name that feels familiar to everyone."
        label="Kitchen name"
        value={kitchenName}
        placeholder="The Okafor Family"
        onChangeText={setKitchenName}
        onBack={() => setView("main")}
      />
    );
  }

  if (view === "appliances") {
    return (
      <SettingsSelectionEditor
        title="Appliances"
        subtitle="Pick the tools you cook with most so recommendations stay practical."
        options={APPLIANCE_OPTIONS}
        selected={appliances}
        onToggle={(value) => toggleValue(setAppliances, value)}
        onBack={() => setView("main")}
      />
    );
  }

  if (view === "dietary") {
    return (
      <SettingsSelectionEditor
        title="Dietary preferences"
        subtitle="Choose the food preferences Tutto should respect while planning meals."
        options={DIETARY_OPTIONS}
        selected={dietary}
        onToggle={(value) => toggleValue(setDietary, value)}
        onBack={() => setView("main")}
      />
    );
  }

  if (view === "allergies") {
    return (
      <SettingsSelectionEditor
        title="Allergies"
        subtitle="Flag ingredients your household should avoid."
        options={ALLERGY_OPTIONS}
        selected={allergies}
        onToggle={(value) => toggleValue(setAllergies, value)}
        onBack={() => setView("main")}
      />
    );
  }

  if (view === "dislikes") {
    return (
      <SettingsChipEditor
        title="Dislikes"
        subtitle="Add ingredients or dishes you would rather not see in your suggestions."
        label="Dislikes"
        chips={dislikes}
        onAdd={(value) => setDislikes((prev) => addUniqueValue(prev, value))}
        onRemove={(value) => setDislikes((prev) => prev.filter((item) => item !== value))}
        onBack={() => setView("main")}
      />
    );
  }

  if (view === "cuisines") {
    return (
      <SettingsSelectionEditor
        title="Cuisines"
        subtitle="Tell Tutto which styles of cooking your kitchen leans toward."
        options={CUISINE_OPTIONS}
        selected={cuisines}
        onToggle={(value) => toggleValue(setCuisines, value)}
        onBack={() => setView("main")}
      />
    );
  }

  if (view === "meal-slots") {
    return (
      <SettingsSelectionEditor
        title="Meal slots"
        subtitle="Select the moments in the day you actively plan around."
        options={MEAL_SLOT_OPTIONS}
        selected={mealSlots}
        onToggle={(value) => toggleValue(setMealSlots, value)}
        onBack={() => setView("main")}
      />
    );
  }

  if (view === "anything-else") {
    return (
      <SettingsTextEditor
        title="Anything else?"
        subtitle="Add any notes that help Tutto understand your kitchen a little better."
        label="Notes"
        value={anythingElse}
        placeholder="We batch cook on Sundays, prefer quick lunches, and love spicy food."
        onChangeText={setAnythingElse}
        onBack={() => setView("main")}
        multiline
      />
    );
  }

  if (view === "support") {
    return <SettingsSupportView onBack={() => setView("main")} />;
  }

  if (view === "language") {
    return (
      <SettingsSelectionEditor
        title="Language"
        subtitle="Choose the app language you want to use across Tutto."
        options={LANGUAGE_OPTIONS.map((language) => language.label)}
        selected={[languageLabel]}
        onToggle={(label) => {
          const next = LANGUAGE_OPTIONS.find((language) => language.label === label);
          if (next) setLanguageCode(next.code);
        }}
        onBack={() => setView("main")}
        variant="radio"
      />
    );
  }

  return (
    <SettingsMainView
      profileName={profileName}
      email={email}
      kitchenName={kitchenName}
      inviteCode={inviteCode}
      copied={copied}
      appliancesSummary={summariseList(appliances)}
      dietarySummary={summariseList(dietary)}
      allergiesSummary={summariseList(allergies)}
      dislikesSummary={dislikes.length ? summariseList(dislikes) : summariseList(DISLIKE_SUGGESTIONS)}
      cuisinesSummary={summariseList(cuisines)}
      mealSlotsSummary={summariseList(mealSlots)}
      languageLabel={languageLabel}
      anythingElseSummary={anythingElse.trim() ? anythingElse.trim() : "Not set"}
      onBack={() => router.back()}
      onCopyInviteCode={() => setCopied(true)}
      onOpenView={setView}
    />
  );
}
