import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import { StyleSheet, Text, View } from "react-native";
import { getGreetingKey } from "@/components/dashboard/data";

export default function HomeHeader() {
  const { t } = useI18n();

  return (
    <View style={styles.pageHeader}>
      <View>
        <Text style={styles.greeting}>{t(getGreetingKey())} 👋</Text>
        <Text style={styles.greetingSubtitle}>{t("kitchen.home.header.subtitle")}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pageHeader: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 },
  greeting: { fontFamily: fonts.serif, fontSize: 32, lineHeight: 36, color: colors.text },
  greetingSubtitle: { fontFamily: fonts.sans, fontSize: 13, color: colors.muted, marginTop: 4 },
});
