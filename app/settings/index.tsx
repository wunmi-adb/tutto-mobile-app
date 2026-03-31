import SettingsMainView from "@/components/settings/SettingsMainView";
import { useSettingsState } from "@/components/settings/SettingsProvider";
import { SettingsView } from "@/components/settings/types";
import { useI18n } from "@/i18n";
import { useRouter } from "expo-router";
import type { Href } from "expo-router";

function summariseList(values: string[]) {
  if (!values.length) return "Not set";
  if (values.length === 1) return values[0];
  if (values.length === 2) return values.join(", ");
  return `${values[0]}, ${values[1]} +${values.length - 2}`;
}

const SETTINGS_ROUTES: Record<Exclude<SettingsView, "main">, Href> = {
  account: "/settings/account",
  "kitchen-name": "/settings/kitchen-name",
  appliances: "/settings/appliances",
  dietary: "/settings/dietary",
  allergies: "/settings/allergies",
  dislikes: "/settings/dislikes",
  cuisines: "/settings/cuisines",
  "meal-slots": "/settings/meal-slots",
  "anything-else": "/settings/anything-else",
  support: "/settings/support",
  language: "/settings/language",
};

export default function SettingsIndexScreen() {
  const router = useRouter();
  const { language, languages } = useI18n();
  const {
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
    copyInviteCode,
  } = useSettingsState();

  const languageLabel =
    languages.find((item) => item.code === language)?.label ?? "English";

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
      dislikesSummary={summariseList(dislikes)}
      cuisinesSummary={summariseList(cuisines)}
      mealSlotsSummary={summariseList(mealSlots)}
      languageLabel={languageLabel}
      anythingElseSummary={anythingElse.trim() ? anythingElse.trim() : "Not set"}
      onBack={() => router.back()}
      onCopyInviteCode={copyInviteCode}
      onOpenView={(view) => {
        if (view === "main") {
          return;
        }

        router.push(SETTINGS_ROUTES[view]);
      }}
    />
  );
}
