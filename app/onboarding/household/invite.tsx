import OnboardingBackButton from "@/components/onboarding/OnboardingBackButton";
import OnboardingTopBar from "@/components/onboarding/OnboardingTopBar";
import HapticPressable from "@/components/ui/HapticPressable";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import {
  CURRENT_USER_QUERY_KEY,
  CurrentUser,
  getCurrentUser,
} from "@/lib/api/profile";
import { Feather } from "@expo/vector-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { ActivityIndicator, Share, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";

export default function HouseholdInvite() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { t } = useI18n();
  const currentUserQuery = useQuery({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: getCurrentUser,
    initialData: () => queryClient.getQueryData<CurrentUser>(CURRENT_USER_QUERY_KEY),
    placeholderData: (previousData) => previousData,
    staleTime: 60_000,
  });

  const inviteCode = currentUserQuery.data?.household?.invite_code?.trim() ?? "";
  const householdName = currentUserQuery.data?.household?.name?.trim() ?? t("household.invite.defaultName");
  const shareMessage = useMemo(() => {
    if (!inviteCode) {
      return "";
    }

    return t("household.invite.shareMessage", {
      code: inviteCode,
      householdName,
    });
  }, [householdName, inviteCode, t]);

  const handleShare = async () => {
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

  const handleContinue = () => {
    router.replace("/onboarding/notifications");
  };

  return (
    <SafeAreaView style={styles.container}>
      <OnboardingTopBar leftAccessory={<OnboardingBackButton />} />

      <View style={styles.content}>
        <View style={styles.headingBlock}>
          <Text style={styles.title}>{t("household.invite.title")}</Text>
          <Text style={styles.subtitle}>{t("household.invite.subtitle")}</Text>
        </View>

        {currentUserQuery.isPending && !currentUserQuery.data ? (
          <View style={styles.loadingState}>
            <ActivityIndicator size="small" color={colors.text} />
            <Text style={styles.loadingText}>{t("household.invite.loading")}</Text>
          </View>
        ) : (
          <>
            <View style={styles.codeCard}>
              <Text style={styles.codeLabel}>{t("household.invite.codeLabel")}</Text>
              <Text selectable style={styles.codeValue}>
                {inviteCode || t("household.invite.codeFallback")}
              </Text>
              <HapticPressable
                style={[styles.shareCta, !inviteCode && styles.shareCtaDisabled]}
                onPress={() => {
                  void handleShare();
                }}
                disabled={!inviteCode}
                pressedOpacity={0.85}
              >
                <Feather name="share-2" size={16} color={colors.text} />
                <Text style={styles.shareCtaText}>{t("household.invite.share")}</Text>
              </HapticPressable>
            </View>
          </>
        )}

        <View style={styles.footer}>
          <HapticPressable style={styles.skipButton} onPress={handleContinue} pressedOpacity={0.7}>
            <Text style={styles.skipText}>{t("household.invite.skip")}</Text>
          </HapticPressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headingBlock: {
    marginBottom: 40,
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
    maxWidth: 320,
  },
  loadingState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
  },
  codeCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 24,
    paddingVertical: 28,
    alignItems: "center",
    marginBottom: 28,
  },
  codeLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: colors.muted,
    marginBottom: 12,
  },
  codeValue: {
    fontFamily: fonts.sansMedium,
    fontSize: 28,
    letterSpacing: 4,
    color: colors.text,
    marginBottom: 18,
    textAlign: "center",
  },
  shareCta: {
    alignSelf: "stretch",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.text + "08",
  },
  shareCtaDisabled: {
    opacity: 0.5,
  },
  shareCtaText: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.text,
  },
  footer: {
    marginTop: "auto",
    paddingTop: 24,
  },
  skipButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  skipText: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
    letterSpacing: 0.2,
  },
});
