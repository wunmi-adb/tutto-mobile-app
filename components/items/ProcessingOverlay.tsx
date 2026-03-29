import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProcessingOverlay() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <ActivityIndicator size="large" color={colors.brand} />
        </View>
        <View style={styles.textBlock}>
          <Text style={styles.title}>Detecting items…</Text>
          <Text style={styles.subtitle}>
            Our AI is scanning for groceries and pantry items
          </Text>
        </View>
        <View style={styles.dots}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={styles.dot} />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
    gap: 24,
    paddingHorizontal: 32,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.brand + "1a",
    alignItems: "center",
    justifyContent: "center",
  },
  textBlock: {
    alignItems: "center",
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 24,
    color: colors.text,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.muted,
    textAlign: "center",
    lineHeight: 21,
  },
  dots: {
    flexDirection: "row",
    gap: 6,
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.brand,
  },
});
