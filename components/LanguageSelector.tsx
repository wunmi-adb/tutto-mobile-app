import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import { Feather } from "@expo/vector-icons";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  Animated,
  Modal,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SHEET_CLOSED_Y = 380;
const DISMISS_DRAG_DISTANCE = 120;
const DISMISS_VELOCITY = 1.1;

export default function LanguageSelector() {
  const { language, languages, setLanguage, t } = useI18n();
  const [open, setOpen] = useState(false);
  const insets = useSafeAreaInsets();

  const sheetAnim = useRef(new Animated.Value(SHEET_CLOSED_Y)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  const backdropOpacity = backdropAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.4],
  });

  const openSheet = () => {
    setOpen(true);
    Animated.parallel([
      Animated.timing(backdropAnim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.spring(sheetAnim, {
        toValue: 0,
        bounciness: 0,
        speed: 16,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeSheet = useCallback(() => {
    Animated.parallel([
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(sheetAnim, {
        toValue: SHEET_CLOSED_Y,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => setOpen(false));
  }, [backdropAnim, sheetAnim]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onStartShouldSetPanResponderCapture: () => true,
        onMoveShouldSetPanResponderCapture: (_, gestureState) =>
          gestureState.dy > 4 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx),
        onMoveShouldSetPanResponder: (_, gestureState) =>
          gestureState.dy > 4 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx),
        onPanResponderTerminationRequest: () => false,
        onPanResponderMove: (_, gestureState) => {
          if (gestureState.dy <= 0) {
            sheetAnim.setValue(0);
            return;
          }

          sheetAnim.setValue(Math.min(gestureState.dy, SHEET_CLOSED_Y));
          backdropAnim.setValue(Math.max(0, 1 - gestureState.dy / 260));
        },
        onPanResponderRelease: (_, gestureState) => {
          if (
            gestureState.dy > DISMISS_DRAG_DISTANCE ||
            gestureState.vy > DISMISS_VELOCITY
          ) {
            closeSheet();
            return;
          }

          Animated.parallel([
            Animated.timing(backdropAnim, {
              toValue: 1,
              duration: 180,
              useNativeDriver: true,
            }),
            Animated.spring(sheetAnim, {
              toValue: 0,
              bounciness: 0,
              speed: 16,
              useNativeDriver: true,
            }),
          ]).start();
        },
        onPanResponderTerminate: () => {
          Animated.parallel([
            Animated.timing(backdropAnim, {
              toValue: 1,
              duration: 180,
              useNativeDriver: true,
            }),
            Animated.spring(sheetAnim, {
              toValue: 0,
              bounciness: 0,
              speed: 16,
              useNativeDriver: true,
            }),
          ]).start();
        },
      }),
    [backdropAnim, closeSheet, sheetAnim],
  );

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={openSheet}>
        <Feather name="globe" size={13} color={colors.muted} />
        <Text style={styles.buttonText}>{language.toUpperCase()}</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="none" onRequestClose={closeSheet}>
        <View style={styles.modalRoot}>
          <Animated.View
            pointerEvents="none"
            style={[styles.backdrop, { opacity: backdropOpacity }]}
          />
          <Pressable style={StyleSheet.absoluteFill} onPress={closeSheet} />
          <Animated.View
            style={[
              styles.sheetFrame,
              {
                transform: [{ translateY: sheetAnim }],
              },
            ]}
          >
            <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) }]}>
              <View {...panResponder.panHandlers} style={styles.dragHandleArea}>
                <View style={styles.handle} />
                <View style={styles.sheetHeader}>
                  <Text style={styles.sheetTitle}>{t("common.language")}</Text>
                </View>
              </View>

              <View style={styles.list}>
                {languages.map((lang) => {
                  const active = language === lang.code;

                  return (
                    <Pressable
                      key={lang.code}
                      style={({ pressed }) => [
                        styles.langRow,
                        active && styles.langRowActive,
                        pressed && styles.langRowPressed,
                      ]}
                      onPress={() => {
                        void setLanguage(lang.code);
                        closeSheet();
                      }}
                    >
                      <Text style={[styles.langLabel, active && styles.langLabelActive]}>
                        {lang.label}
                      </Text>
                      {active ? (
                        <View style={styles.checkBadge}>
                          <Feather name="check" size={14} color={colors.background} />
                        </View>
                      ) : null}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </Animated.View>
        </View>
      </Modal>
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
  modalRoot: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
  },
  sheetFrame: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: "hidden",
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingTop: 4,
  },
  dragHandleArea: {
    backgroundColor: colors.background,
  },
  handle: {
    alignSelf: "center",
    marginTop: 12,
    height: 8,
    width: 100,
    borderRadius: 999,
    backgroundColor: colors.border,
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
