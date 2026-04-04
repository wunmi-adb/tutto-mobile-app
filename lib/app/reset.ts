import AsyncStorage from "@react-native-async-storage/async-storage";
import { QueryClient } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const APP_STORAGE_PREFIXES = ["tutto.", "@tutto/"];

export async function clearLocalAppData() {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const appKeys = keys.filter((key) =>
      APP_STORAGE_PREFIXES.some((prefix) => key.startsWith(prefix)),
    );

    if (appKeys.length) {
      await AsyncStorage.multiRemove(appKeys);
    }
  } catch (error) {
    console.warn("Failed to clear local app storage.", error);
  }

  try {
    await Notifications.dismissAllNotificationsAsync();
  } catch {}

  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {}

  try {
    await Notifications.setBadgeCountAsync(0);
  } catch {}

  if (Platform.OS === "android") {
    try {
      await Notifications.deleteNotificationChannelAsync("default");
    } catch {}
  }
}

export async function clearAllClientState(queryClient: QueryClient) {
  await queryClient.cancelQueries();
  queryClient.clear();
  await clearLocalAppData();
}
