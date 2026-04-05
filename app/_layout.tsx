import { I18nProvider, useI18nController } from "@/i18n";
import { AppProviders } from "@/providers/AppProviders";
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
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Toaster } from "sonner-native";

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
          <Stack screenOptions={{ headerShown: false }} />
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
