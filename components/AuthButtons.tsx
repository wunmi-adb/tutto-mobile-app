import GoogleIcon from "@/assets/images/google-icon.svg";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import { FontAwesome } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  onApple?: () => void;
  onGoogle?: () => void;
};

export default function AuthButtons({ onApple, onGoogle }: Props) {
  const { t } = useI18n();

  return (
    <>
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.85} disabled onPress={onApple}>
          <FontAwesome name="apple" size={18} color="#fff" />
          <Text style={styles.primaryBtnText}>{t("welcome.auth.apple")}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.85} onPress={onGoogle}>
          <GoogleIcon />
          <Text style={styles.secondaryBtnText}>{t("welcome.auth.google")}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.terms}>
        {t("welcome.terms.prefix")}
        <Text style={styles.termsLink}>{t("welcome.terms.termsOfService")}</Text>
        {t("welcome.terms.conjunction")}
        <Text style={styles.termsLink}>{t("welcome.terms.privacyPolicy")}</Text>
        {t("welcome.terms.suffix")}
      </Text>
    </>
  );
}

const styles = StyleSheet.create({
  buttons: {
    gap: 12,
    marginBottom: 12,
  },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: colors.text,
    paddingVertical: 16,
    borderRadius: 14,
  },
  primaryBtnText: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.background,
    letterSpacing: 0.3,
  },
  secondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: colors.background,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryBtnText: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.text,
    letterSpacing: 0.3,
  },
  terms: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.muted,
    textAlign: "center",
  },
  termsLink: {
    textDecorationLine: "underline",
  },
});
