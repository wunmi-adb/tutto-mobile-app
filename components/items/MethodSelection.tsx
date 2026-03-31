import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import { Feather } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  storageName: string;
  onBack: () => void;
  onSelectCamera: () => void;
  onSelectVoice: () => void;
  onSelectManual: () => void;
};

export default function MethodSelection({
  storageName,
  onBack,
  onSelectCamera,
  onSelectVoice,
  onSelectManual,
}: Props) {
  const { t } = useI18n();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
          <Feather name="arrow-left" size={16} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headingBlock}>
          <Text style={styles.title}>{t("addItems.method.title", { storageName })}</Text>
          <Text style={styles.subtitle}>{t("addItems.method.subtitle")}</Text>
        </View>

        <View style={styles.list}>
          <TouchableOpacity style={styles.row} onPress={onSelectCamera} activeOpacity={0.97}>
            <View style={[styles.icon, styles.iconBrand]}>
              <Feather name="camera" size={22} color={colors.brand} />
            </View>
            <View style={styles.text}>
              <Text style={styles.label}>{t("addItems.method.camera.title")}</Text>
              <Text style={styles.sublabel}>{t("addItems.method.camera.subtitle")}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.row} onPress={onSelectVoice} activeOpacity={0.97}>
            <View style={[styles.icon, styles.iconBrand]}>
              <Feather name="mic" size={22} color={colors.brand} />
            </View>
            <View style={styles.text}>
              <Text style={styles.label}>{t("addItems.method.voice.title")}</Text>
              <Text style={styles.sublabel}>{t("addItems.method.voice.subtitle")}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.row} onPress={onSelectManual} activeOpacity={0.97}>
            <View style={[styles.icon, styles.iconSecondary]}>
              <Feather name="edit-2" size={22} color={colors.muted} />
            </View>
            <View style={styles.text}>
              <Text style={styles.label}>{t("addItems.method.manual.title")}</Text>
              <Text style={styles.sublabel}>{t("addItems.method.manual.subtitle")}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 8,
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  headingBlock: {
    marginBottom: 32,
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
  },
  list: {
    gap: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBrand: {
    backgroundColor: colors.brand + "1a",
  },
  iconSecondary: {
    backgroundColor: colors.secondary,
  },
  text: {
    flex: 1,
  },
  label: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.text,
    marginBottom: 2,
  },
  sublabel: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.muted,
    letterSpacing: 0.3,
  },
});
