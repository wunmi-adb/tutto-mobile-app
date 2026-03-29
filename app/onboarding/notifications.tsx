import OnboardingTopBar from "@/components/onboarding/OnboardingTopBar";
import Button from "@/components/ui/Button";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type NotificationStatusKey =
  | "notifications.status.off"
  | "notifications.status.error";

export default function NotificationsScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const [requesting, setRequesting] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [statusMessageKey, setStatusMessageKey] = useState<NotificationStatusKey | null>(null);

  const handleContinue = () => {
    router.push("/onboarding/appliances");
  };

  useEffect(() => {
    const loadPermissionStatus = async () => {
      const settings = await Notifications.getPermissionsAsync();
      setPermissionGranted(settings.granted);
    };

    loadPermissionStatus();
  }, []);

  const handleEnableNotifications = async () => {
    setRequesting(true);
    setStatusMessageKey(null);

    try {
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.DEFAULT,
        });
      }

      const existingPermissions = await Notifications.getPermissionsAsync();
      let granted = existingPermissions.granted;

      if (!granted) {
        const requestedPermissions = await Notifications.requestPermissionsAsync({
          ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
          },
        });
        granted = requestedPermissions.granted;
      }

      setPermissionGranted(granted);

      if (granted) {
        handleContinue();
        return;
      }

      setStatusMessageKey("notifications.status.off");
    } catch {
      setStatusMessageKey("notifications.status.error");
    } finally {
      setRequesting(false);
    }
  };

  const handleOpenSettings = async () => {
    await Linking.openSettings();
  };

  return (
    <SafeAreaView style={styles.container}>
      <OnboardingTopBar
        leftAccessory={
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <Feather name="arrow-left" size={16} color={colors.text} />
          </TouchableOpacity>
        }
      />

        <View style={styles.content}>
        <View style={styles.illustrationWrap}>
          <Image source={require("@/assets/images/notification-bell.png")} style={styles.bellImage} contentFit="contain" />
        </View>

        <Text style={styles.title}>{t("notifications.title")}</Text>
        <Text style={styles.subtitle}>
          {t("notifications.subtitle")}
        </Text>
      </View>

      <View style={styles.footer}>
        <Button
          title={
            requesting
              ? t("notifications.cta.requesting")
              : permissionGranted
                ? t("notifications.cta.enabled")
                : t("notifications.cta.default")
          }
          onPress={handleEnableNotifications}
          disabled={requesting || permissionGranted}
        />
        {statusMessageKey ? <Text style={styles.statusMessage}>{t(statusMessageKey)}</Text> : null}
        {statusMessageKey ? (
          <TouchableOpacity onPress={handleOpenSettings} activeOpacity={0.7} style={styles.settingsButton}>
            <Text style={styles.settingsText}>{t("notifications.openSettings")}</Text>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity onPress={handleContinue} activeOpacity={0.7} style={styles.laterButton}>
          <Text style={styles.laterText}>{t("notifications.later")}</Text>
        </TouchableOpacity>
      </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 32,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 32,
  },
  illustrationWrap: {
    marginBottom: 32,
  },
  bellImage: {
    width: 144,
    height: 144,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 36,
    lineHeight: 40,
    color: colors.text,
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    maxWidth: 300,
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: 0.3,
    color: colors.muted,
    textAlign: "center",
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: 32,
  },
  statusMessage: {
    marginTop: 14,
    fontFamily: fonts.sans,
    fontSize: 13,
    lineHeight: 20,
    color: colors.muted,
    textAlign: "center",
  },
  settingsButton: {
    alignItems: "center",
    paddingTop: 12,
  },
  settingsText: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.text,
  },
  laterButton: {
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 8,
  },
  laterText: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.muted,
  },
});
