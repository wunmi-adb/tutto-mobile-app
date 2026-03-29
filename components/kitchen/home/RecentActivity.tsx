import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { Image, StyleSheet, Text, View } from "react-native";
import { getCategoryImage } from "./categoryIcons";
import { RECENT_ACTIVITY } from "./data";

export default function RecentActivity() {
  return (
    <>
      <Text style={styles.sectionTitle}>RECENT ACTIVITY</Text>
      {RECENT_ACTIVITY.map((activity, i) => (
        <View key={activity.id} style={styles.activityRow}>
          <View style={styles.activityLeft}>
            <View style={styles.activityDot}>
              <Image source={getCategoryImage(activity.text)} style={styles.activityImage} resizeMode="contain" />
            </View>
            {i < RECENT_ACTIVITY.length - 1 && <View style={styles.activityLine} />}
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityText}>{activity.text}</Text>
            <Text style={styles.activityTime}>{activity.time}</Text>
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
