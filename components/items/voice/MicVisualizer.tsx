import { colors } from "@/constants/colors";
import { Feather } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

type Props = {
  isRecording: boolean;
  isPaused: boolean;
};

export default function MicVisualizer({ isRecording, isPaused }: Props) {
  const pingAnim = useRef(new Animated.Value(0)).current;

  const isActive = isRecording && !isPaused;

  useEffect(() => {
    if (!isActive) {
      pingAnim.stopAnimation();
      pingAnim.setValue(0);
      return;
    }
    Animated.loop(
      Animated.sequence([
        Animated.timing(pingAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(pingAnim, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    ).start();
    return () => pingAnim.stopAnimation();
  }, [isActive, pingAnim]);

  const pingScale = pingAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.75] });
  const pingOpacity = pingAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 0] });

  return (
    <View style={styles.container}>
      {isActive && <View style={styles.ringOuter} />}
      {isActive && <View style={styles.ringInner} />}
      <View style={[styles.micWrap, isActive && styles.micWrapActive, isPaused && styles.micWrapPaused]}>
        <Feather name={isPaused ? "pause" : "mic"} size={40} color={isActive ? colors.brand : colors.muted} />
      </View>
      {isActive && (
        <Animated.View
          style={[styles.pingRing, { transform: [{ scale: pingScale }], opacity: pingOpacity }]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 192,
    height: 192,
    alignItems: "center",
    justifyContent: "center",
  },
  ringOuter: {
    position: "absolute",
    width: 192,
    height: 192,
    borderRadius: 96,
    backgroundColor: colors.brand + "05",
  },
  ringInner: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.brand + "0d",
  },
  micWrap: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  micWrapActive: {
    backgroundColor: colors.brand + "1a",
  },
  micWrapPaused: {
    backgroundColor: colors.secondary,
  },
  pingRing: {
    position: "absolute",
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 2,
    borderColor: colors.brand + "4d",
  },
});
