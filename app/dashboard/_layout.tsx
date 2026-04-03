import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs, useSegments } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function DashboardLayout() {
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const segments = useSegments();
  const isPlanDetailRoute =
    segments[0] === "dashboard" &&
    segments[1] === "plan" &&
    (segments[2] === "meal" || segments[2] === "cook");

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: colors.text + "66",
        tabBarStyle: {
          display: isPlanDetailRoute ? "none" : "flex",
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 56 + Math.max(insets.bottom, 10),
          paddingBottom: Math.max(insets.bottom, 10),
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.sans,
          fontSize: 10,
          letterSpacing: 0.3,
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("dashboard.tabs.home"),
          tabBarIcon: ({ color }) => <Feather name="home" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="kitchen/index"
        options={{
          title: t("dashboard.tabs.kitchen"),
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="food-outline" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: t("dashboard.tabs.library"),
          tabBarIcon: ({ color }) => <Feather name="book-open" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="plan"
        options={{
          title: t("dashboard.tabs.plan"),
          tabBarIcon: ({ color }) => <Feather name="calendar" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="shopping"
        options={{
          title: t("dashboard.tabs.shopping"),
          tabBarIcon: ({ color }) => <Feather name="shopping-cart" size={20} color={color} />,
        }}
      />
    </Tabs>
  );
}
