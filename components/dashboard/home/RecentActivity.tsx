import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { CATEGORY_IMAGES } from "@/components/dashboard/home/categoryIcons";
import { RECENT_ACTIVITY, getActivityText, getRelativeTimeLabel } from "@/components/dashboard/data";
import { useI18n } from "@/i18n";
import { Image, StyleSheet, Text, View } from "react-native";

export default function RecentActivity() {
  const { t } = useI18n();

  return (
    <>
      <Text style={styles.sectionTitle}>{t("kitchen.home.activity.title")}</Text>
      {RECENT_ACTIVITY.map((activity, i) => (
        <View key={activity.id} style={styles.activityRow}>
          <View style={styles.activityLeft}>
            <View style={styles.activityDot}>
              <Image source={CATEGORY_IMAGES[activity.category]} style={styles.activityImage} resizeMode="contain" />
            </View>
            {i < RECENT_ACTIVITY.length - 1 && <View style={styles.activityLine} />}
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityText}>{getActivityText(t, activity)}</Text>
            <Text style={styles.activityTime}>{getRelativeTimeLabel(t, activity.time)}</Text>
          </View>
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { fontFamily: fonts.sansMedium, fontSize: 11, color: colors.muted, letterSpacing: 1, marginBottom: 8 },
  activityRow: { flexDirection: "row", gap: 12, paddingVertical: 12 },
  activityLeft: { alignItems: "center", width: 28 },
  activityDot: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.secondary, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  activityImage: { width: 32, height: 32 },
  activityLine: { flex: 1, width: 1, backgroundColor: colors.border, marginTop: 4 },
  activityContent: { flex: 1, paddingTop: 4 },
  activityText: { fontFamily: fonts.sans, fontSize: 13, color: colors.text, lineHeight: 18 },
  activityTime: { fontFamily: fonts.sans, fontSize: 11, color: colors.muted + "99", marginTop: 2 },
});
