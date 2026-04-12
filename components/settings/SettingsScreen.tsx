import SettingsConfirmationSheet from "@/components/settings/SettingsConfirmationSheet";
import SettingsMainView from "@/components/settings/SettingsMainView";
import { SettingsView } from "@/components/settings/types";
import { useI18n } from "@/i18n";
import { isTranslationKey } from "@/i18n/messages";
import { clearAllClientState } from "@/lib/app/reset";
import { handleCaughtApiError } from "@/lib/api/handle-caught-api-error";
import { deleteCurrentUserAccount } from "@/lib/api/profile";
import { getApiErrorDetails } from "@/lib/api/types";
import { useAuth } from "@/providers/AuthProvider";
import { useSettingsState } from "@/stores/settingsStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import type { Href } from "expo-router";
import { useMemo, useState } from "react";
import { Share } from "react-native";
import { toast } from "sonner-native";

type Props = {
  showBackButton?: boolean;
};

function summariseList(values: string[]) {
  if (!values.length) return "";
  if (values.length === 1) return values[0];
  if (values.length === 2) return values.join(", ");
  return `${values[0]}, ${values[1]} +${values.length - 2}`;
}

const SETTINGS_ROUTES: Record<Exclude<SettingsView, "main">, Href> = {
  account: "/settings/account",
  "kitchen-name": "/settings/kitchen-name",
  household: "/settings/household",
  dietary: "/settings/dietary",
  allergies: "/settings/allergies",
  cuisines: "/settings/cuisines",
  support: "/settings/support",
  language: "/settings/language",
};

export default function SettingsScreen({ showBackButton = true }: Props) {
  const router = useRouter();
  const { language, languages, t } = useI18n();
  const queryClient = useQueryClient();
  const { clearSession } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteEmail, setDeleteEmail] = useState("");
  const {
    profileName,
    email,
    kitchenName,
    householdSize,
    inviteCode,
    dietary,
    allergies,
    cuisines,
  } = useSettingsState();

  const languageLabel =
    languages.find((item) => item.code === language)?.label ?? "English";
  const householdName = kitchenName.trim() || t("household.invite.defaultName");
  const shareMessage = useMemo(() => {
    if (!inviteCode) {
      return "";
    }

    return t("household.invite.shareMessage", {
      code: inviteCode,
      householdName,
    });
  }, [householdName, inviteCode, t]);
  const householdSummary =
    householdSize && householdSize > 0
      ? t(
          householdSize === 1
            ? "settings.household.memberSingular"
            : "settings.household.memberPlural",
          { count: householdSize },
        )
      : t("settings.common.notSet");
  const deleteEmailMatches = deleteEmail.trim().toLowerCase() === email.trim().toLowerCase();
  const handleShareInviteCode = async () => {
    if (!inviteCode) {
      return;
    }

    try {
      await Share.share({
        message: shareMessage,
      });
    } catch {
      toast.error(t("household.invite.shareError"));
    }
  };
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
      await clearAllClientState(queryClient);
      router.replace("/");
    },
  });

  return (
    <>
      <SettingsMainView
        profileName={profileName}
        email={email}
        kitchenName={kitchenName}
        householdSummary={householdSummary}
        inviteCode={inviteCode}
        dietarySummary={summariseList(dietary) || t("settings.common.notSet")}
        allergiesSummary={summariseList(allergies) || t("settings.common.notSet")}
        cuisinesSummary={summariseList(cuisines) || t("settings.common.notSet")}
        languageLabel={languageLabel}
        showBackButton={showBackButton}
        onBack={() => router.back()}
        onShareInviteCode={() => {
          void handleShareInviteCode();
        }}
        inviteDisabled={!inviteCode}
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
          await clearAllClientState(queryClient);
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
        onConfirm={async () => {
          try {
            await deleteAccountMutation.mutateAsync();
          } catch (error) {
            handleCaughtApiError(error);
          }
        }}
      />
    </>
  );
}
