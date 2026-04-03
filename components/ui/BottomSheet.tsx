import { colors } from "@/constants/colors";
import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Keyboard,
  KeyboardEvent,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const SHEET_CLOSED_Y = 380;
const DISMISS_DRAG_DISTANCE = 120;
const DISMISS_VELOCITY = 1.1;

type Props = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  sheetStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  header?: ReactNode;
  dragEnabled?: boolean;
  keyboardAvoiding?: boolean;
};

export default function BottomSheet({
  visible,
  onClose,
  children,
  sheetStyle,
  contentStyle,
  header,
  dragEnabled = true,
  keyboardAvoiding = false,
}: Props) {
  const insets = useSafeAreaInsets();
  const [rendered, setRendered] = useState(visible);
  const [keyboardInset, setKeyboardInset] = useState(0);
  const sheetAnim = useRef(new Animated.Value(SHEET_CLOSED_Y)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  const backdropOpacity = backdropAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.4],
  });

  useEffect(() => {
    if (!keyboardAvoiding || !rendered) {
      setKeyboardInset(0);
      return;
    }

    const handleKeyboardShow = (event: KeyboardEvent) => {
      setKeyboardInset(Math.max(0, event.endCoordinates.height - insets.bottom));
    };

    const handleKeyboardHide = () => {
      setKeyboardInset(0);
    };

    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSubscription = Keyboard.addListener(showEvent, handleKeyboardShow);
    const hideSubscription = Keyboard.addListener(hideEvent, handleKeyboardHide);

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [insets.bottom, keyboardAvoiding, rendered]);

  useEffect(() => {
    if (visible) {
      setRendered(true);

      requestAnimationFrame(() => {
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
      });

      return;
    }

    if (!rendered) {
      return;
    }

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
    ]).start(() => setRendered(false));
  }, [backdropAnim, rendered, sheetAnim, visible]);

  const restoreSheet = useCallback(() => {
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
  }, [backdropAnim, sheetAnim]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => dragEnabled,
        onStartShouldSetPanResponderCapture: () => dragEnabled,
        onMoveShouldSetPanResponderCapture: (_, gestureState) =>
          dragEnabled &&
          gestureState.dy > 4 &&
          Math.abs(gestureState.dy) > Math.abs(gestureState.dx),
        onMoveShouldSetPanResponder: (_, gestureState) =>
          dragEnabled &&
          gestureState.dy > 4 &&
          Math.abs(gestureState.dy) > Math.abs(gestureState.dx),
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
            onClose();
            return;
          }

          restoreSheet();
        },
        onPanResponderTerminate: restoreSheet,
      }),
    [backdropAnim, dragEnabled, onClose, restoreSheet, sheetAnim],
  );

  if (!rendered) {
    return null;
  }

  return (
    <Modal transparent animationType="none" visible={rendered} onRequestClose={onClose}>
      <View style={styles.modalRoot}>
        <Animated.View pointerEvents="none" style={[styles.backdrop, { opacity: backdropOpacity }]} />
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <Animated.View
          style={[
            styles.sheetFrame,
            sheetStyle,
            {
              transform: [{ translateY: sheetAnim }],
            },
          ]}
        >
          <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
            <View
              style={[
                styles.sheet,
                contentStyle,
                { paddingBottom: Math.max(insets.bottom, 16) },
              ]}
            >
              <View
                {...(dragEnabled ? panResponder.panHandlers : {})}
                style={styles.dragHandleArea}
              >
                <View style={styles.handle} />
                {header}
              </View>
              {keyboardAvoiding ? (
                <ScrollView
                  keyboardShouldPersistTaps="handled"
                  bounces={false}
                  contentContainerStyle={[
                    styles.scrollContent,
                    { paddingBottom: keyboardInset },
                  ]}
                >
                  {children}
                </ScrollView>
              ) : (
                children
              )}
            </View>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
  safeArea: {
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderColor: colors.border,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 0,
    paddingTop: 4,
  },
  dragHandleArea: {
    backgroundColor: colors.background,
    paddingBottom: 10,
  },
  handle: {
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 8,
    height: 8,
    width: 100,
    borderRadius: 999,
    backgroundColor: colors.border,
  },
});
