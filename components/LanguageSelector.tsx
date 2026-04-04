import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import { APP_LANGUAGE_TO_LOCALE, AppLanguage } from "@/i18n/config";
import { updateCurrentUserLocale } from "@/lib/api/profile";
import { useAuth } from "@/providers/AuthProvider";
import BottomSheet from "@/components/ui/BottomSheet";
import { Feather } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View, type PressableStateCallbackType } from "react-native";

export default function LanguageSelector() {
  const { language, languages, setLanguage, t } = useI18n();
  const { isAuthenticated, session } = useAuth();
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const openSheet = () => {
    setOpen(true);
  };

  const closeSheet = useCallback(() => {
    setOpen(false);
  }, []);

  const handleSelectLanguage = useCallback(
    async (nextLanguage: AppLanguage) => {
      if (isSaving) {
        return;
      }

      if (nextLanguage === language) {
        closeSheet();
        return;
      }

      await setLanguage(nextLanguage);
      closeSheet();

      if (!isAuthenticated || !session?.access_token) {
        return;
      }

      setIsSaving(true);

      try {
        await updateCurrentUserLocale(APP_LANGUAGE_TO_LOCALE[nextLanguage]);
      } catch (error) {
        console.warn("Failed to update user locale.", error);
      } finally {
        setIsSaving(false);
      }
    },
    [closeSheet, isAuthenticated, isSaving, language, session?.access_token, setLanguage],
  );

  const getRowStyle = ({ pressed }: PressableStateCallbackType, active: boolean) => [
    styles.langRow,
    active && styles.langRowActive,
    pressed && styles.langRowPressed,
    isSaving && styles.langRowDisabled,
  ];

  const createSelectLanguageHandler = (nextLanguage: AppLanguage) => {
    return () => {
      void handleSelectLanguage(nextLanguage);
    };
  };

  const renderCheckBadge = (active: boolean) => {
    if (!active) {
      return null;
    }

    return (
      <View style={styles.checkBadge}>
        <Feather name="check" size={14} color={colors.background} />
      </View>
    );
  };

  const renderLanguageRow = (lang: (typeof languages)[number]) => {
    const active = language === lang.code;

    return (
      <Pressable
        key={lang.code}
        style={(state) => getRowStyle(state, active)}
        disabled={isSaving}
        onPress={createSelectLanguageHandler(lang.code)}
      >
        <Text style={[styles.langLabel, active && styles.langLabelActive]}>{lang.label}</Text>
        {renderCheckBadge(active)}
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={openSheet}>
        <Feather name="globe" size={13} color={colors.muted} />
        <Text style={styles.buttonText}>{language.toUpperCase()}</Text>
      </Pressable>

      <BottomSheet
        visible={open}
        onClose={closeSheet}
        header={
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>{t("common.language")}</Text>
          </View>
        }
        contentStyle={styles.sheet}
      >
        <View style={styles.list}>
          {languages.map(renderLanguageRow)}
        </View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  buttonText: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.muted,
  },
  sheet: {
    paddingTop: 0,
  },
  sheetHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    alignItems: "center",
  },
  sheetTitle: {
    fontFamily: fonts.sansBold,
    fontSize: 16,
    color: colors.text,
  },
  list: {
    paddingHorizontal: 8,
    paddingBottom: 6,
  },
  langRow: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  langRowActive: {
    backgroundColor: colors.secondary,
  },
  langRowPressed: {
    opacity: 0.82,
  },
  langRowDisabled: {
    opacity: 0.45,
  },
  langLabel: {
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.text,
  },
  langLabelActive: {
    fontFamily: fonts.sansBold,
  },
  checkBadge: {
    width: 24,
    height: 24,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.text,
  },
});
