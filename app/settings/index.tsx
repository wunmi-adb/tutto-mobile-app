import SettingsConfirmationSheet from "@/components/settings/SettingsConfirmationSheet";
import SettingsMainView from "@/components/settings/SettingsMainView";
import { useSettingsState } from "@/components/settings/SettingsProvider";
import { SettingsView } from "@/components/settings/types";
import { useI18n } from "@/i18n";
import { isTranslationKey } from "@/i18n/messages";
import { clearLocalAppData } from "@/lib/app/reset";
import { CURRENT_USER_QUERY_KEY, deleteCurrentUserAccount } from "@/lib/api/profile";
import { getApiErrorDetails } from "@/lib/api/types";
import { useAuth } from "@/providers/AuthProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import type { Href } from "expo-router";
import { useState } from "react";
import { toast } from "sonner-native";

function summariseList(values: string[]) {
  if (!values.length) return "";
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
  const { language, languages, t } = useI18n();
  const queryClient = useQueryClient();
  const { clearSession } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteEmail, setDeleteEmail] = useState("");
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
  const deleteEmailMatches = deleteEmail.trim().toLowerCase() === email.trim().toLowerCase();
  const deleteAccountMutation = useMutation({
    mutationFn: () => deleteCurrentUserAccount(deleteEmail.trim()),
    onError: (error) => {
      const errorDetails = getApiErrorDetails(error);
      toast.error(
        errorDetails.message && isTranslationKey(errorDetails.message)
          ? t(errorDetails.message)
          : t("settings.delete.error"),
      );
    },
    onSuccess: async () => {
      setShowDeleteConfirm(false);
      setDeleteEmail("");
      await clearSession();
      await clearLocalAppData();
      queryClient.clear();
      router.replace("/");
    },
  });

  return (
    <>
      <SettingsMainView
        profileName={profileName}
        email={email}
        kitchenName={kitchenName}
        inviteCode={inviteCode}
        copied={copied}
        appliancesSummary={summariseList(appliances) || t("settings.common.notSet")}
        dietarySummary={summariseList(dietary) || t("settings.common.notSet")}
        allergiesSummary={summariseList(allergies) || t("settings.common.notSet")}
        dislikesSummary={summariseList(dislikes) || t("settings.common.notSet")}
        cuisinesSummary={summariseList(cuisines) || t("settings.common.notSet")}
        mealSlotsSummary={summariseList(mealSlots) || t("settings.common.notSet")}
        languageLabel={languageLabel}
        anythingElseSummary={anythingElse.trim() ? anythingElse.trim() : t("settings.common.notSet")}
        onBack={() => router.back()}
        onCopyInviteCode={copyInviteCode}
        onOpenView={(view) => {
          if (view === "main") {
            return;
          }

          router.push(SETTINGS_ROUTES[view]);
        }}
        onDeleteAccount={() => setShowDeleteConfirm(true)}
        onLogOut={() => setShowLogoutConfirm(true)}
      />

      <SettingsConfirmationSheet
        visible={showLogoutConfirm}
        title={t("settings.logout.title")}
        subtitle={t("settings.logout.subtitle")}
        confirmLabel={t("settings.logout.confirm")}
        cancelLabel={t("settings.logout.cancel")}
        destructive
        onCancel={() => setShowLogoutConfirm(false)}
        onConfirm={async () => {
          setShowLogoutConfirm(false);
          await clearSession();
          queryClient.removeQueries({ queryKey: CURRENT_USER_QUERY_KEY });
          router.replace("/");
        }}
      />

      <SettingsConfirmationSheet
        visible={showDeleteConfirm}
        title={t("settings.delete.title")}
        subtitle={t("settings.delete.subtitle")}
        confirmLabel={t("settings.delete.confirm")}
        cancelLabel={t("settings.delete.cancel")}
        destructive
        confirmDisabled={!deleteEmailMatches}
        inputLabel={t("settings.delete.emailLabel")}
        inputPlaceholder={email}
        inputValue={deleteEmail}
        onChangeInput={setDeleteEmail}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setDeleteEmail("");
          deleteAccountMutation.reset();
        }}
        confirmLoading={deleteAccountMutation.isPending}
        onConfirm={() => {
          void deleteAccountMutation.mutateAsync();
        }}
      />
    </>
  );
}
