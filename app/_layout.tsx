import { I18nProvider, useI18n, useI18nController } from "@/i18n";
import {
  CURRENT_USER_QUERY_KEY,
  getAppEntryRoute,
  getCurrentUser,
  getStoredCurrentUser,
} from "@/lib/api/profile";
import { prefetchStorageLocations } from "@/lib/api/storage-locations";
import { AppProviders } from "@/providers/AppProviders";
import { useAuth } from "@/providers/AuthProvider";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import {
  DMSans_400Regular,
  DMSans_400Regular_Italic,
  DMSans_500Medium,
  DMSans_500Medium_Italic,
  DMSans_700Bold,
  DMSans_700Bold_Italic,
} from "@expo-google-fonts/dm-sans";
import {
  InstrumentSerif_400Regular,
  InstrumentSerif_400Regular_Italic,
  useFonts,
} from "@expo-google-fonts/instrument-serif";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Toaster } from "sonner-native";

function RootNavigator({
  assetsReady,
}: {
  assetsReady: boolean;
}) {
  const { t } = useI18n();
  const { ready: authReady, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();
  const segments = useSegments();
  const isRootIndex = segments[0] == null;
  const requiresSessionResolution = isRootIndex && isAuthenticated;
  const [storedCurrentUser, setStoredCurrentUser] = useState<Awaited<
    ReturnType<typeof getStoredCurrentUser>
  > | undefined>(undefined);
  const currentUserQuery = useQuery({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: getCurrentUser,
    enabled:
      assetsReady &&
      authReady &&
      requiresSessionResolution,
    retry: 1,
  });

  useEffect(() => {
    let cancelled = false;

    const hydrateStoredCurrentUser = async () => {
      if (!assetsReady || !authReady || !requiresSessionResolution) {
        if (!cancelled) {
          setStoredCurrentUser(null);
        }
        return;
      }

      try {
        const user = await getStoredCurrentUser();

        if (!cancelled) {
          setStoredCurrentUser(user);
        }
      } catch (error) {
        console.warn("Failed to hydrate stored current user.", error);

        if (!cancelled) {
          setStoredCurrentUser(null);
        }
      }
    };

    hydrateStoredCurrentUser();

    return () => {
      cancelled = true;
    };
  }, [assetsReady, authReady, requiresSessionResolution]);

  useEffect(() => {
    if (currentUserQuery.data) {
      setStoredCurrentUser(currentUserQuery.data);
    }
  }, [currentUserQuery.data]);

  const resolvedCurrentUser = storedCurrentUser ?? currentUserQuery.data ?? null;
  const resolvedEntryRoute = resolvedCurrentUser ? getAppEntryRoute(resolvedCurrentUser) : null;

  const appReady =
    assetsReady &&
    authReady &&
    (!requiresSessionResolution ||
      (storedCurrentUser !== undefined &&
        !currentUserQuery.isPending));
  const shouldRedirectAuthenticatedRoot = requiresSessionResolution && !!resolvedCurrentUser;
  const redirectHref =
    shouldRedirectAuthenticatedRoot && resolvedEntryRoute ? resolvedEntryRoute : null;
  const [storageRedirectReady, setStorageRedirectReady] = useState(false);
  const lastRedirectRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const prepareStorageRedirect = async () => {
      if (!shouldRedirectAuthenticatedRoot || resolvedEntryRoute !== "/onboarding/storage") {
        if (!cancelled) {
          setStorageRedirectReady(false);
        }
        return;
      }

      try {
        await prefetchStorageLocations(queryClient);
      } catch {
        // Let the storage screen handle query errors if prefetch fails.
      } finally {
        if (!cancelled) {
          setStorageRedirectReady(true);
        }
      }
    };

    void prepareStorageRedirect();

    return () => {
      cancelled = true;
    };
  }, [queryClient, resolvedEntryRoute, shouldRedirectAuthenticatedRoot]);

  useEffect(() => {
    if (!redirectHref) {
      lastRedirectRef.current = null;
      return;
    }

    if (redirectHref === "/onboarding/storage" && !storageRedirectReady) {
      return;
    }

    if (lastRedirectRef.current === redirectHref) {
      return;
    }

    lastRedirectRef.current = redirectHref;
    router.replace(redirectHref);
  }, [redirectHref, router, storageRedirectReady]);

  if (!appReady) {
    return null;
  }

  if (redirectHref === "/onboarding/storage" && !storageRedirectReady) {
    return null;
  }

  if (redirectHref) {
    return null;
  }

  if (requiresSessionResolution && storedCurrentUser === null && currentUserQuery.isError) {
    return (
      <View style={styles.authenticatedState}>
        <Text style={styles.sessionTitle}>{t("welcome.session.error")}</Text>
        <Text style={styles.sessionSubtitle}>{t("welcome.session.errorSubtitle")}</Text>
        <TouchableOpacity onPress={() => currentUserQuery.refetch()} activeOpacity={0.7}>
          <Text style={styles.retryText}>{t("welcome.session.retry")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  const [loaded] = useFonts({
    InstrumentSerif_400Regular,
    InstrumentSerif_400Regular_Italic,
    DMSans_400Regular,
    DMSans_400Regular_Italic,
    DMSans_500Medium,
    DMSans_500Medium_Italic,
    DMSans_700Bold,
    DMSans_700Bold_Italic,
  });
  const i18n = useI18nController();
  const assetsReady = loaded && i18n.ready;

  if (!assetsReady) return null;

  return (
    <I18nProvider value={i18n}>
      <GestureHandlerRootView style={styles.root}>
        <AppProviders>
          <StatusBar style="dark" backgroundColor="#ffffff" />
          <RootNavigator assetsReady={assetsReady} />
          <Toaster
            position="top-center"
            theme="light"
            richColors
            duration={4500}
            offset={56}
            toastOptions={{
              style: styles.toast,
              titleStyle: styles.toastTitle,
              descriptionStyle: styles.toastDescription,
            }}
          />
        </AppProviders>
      </GestureHandlerRootView>
    </I18nProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  authenticatedState: {
    flex: 1,
    paddingHorizontal: 32,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: colors.background,
  },
  sessionTitle: {
    fontFamily: fonts.sansMedium,
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
    textAlign: "center",
  },
  sessionSubtitle: {
    maxWidth: 320,
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 22,
    color: colors.muted,
    textAlign: "center",
  },
  retryText: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.brand,
  },
  toast: {
    borderRadius: 16,
  },
  toastTitle: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    lineHeight: 20,
  },
  toastDescription: {
    fontFamily: fonts.sans,
    fontSize: 13,
    lineHeight: 18,
  },
});
