import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  LayoutChangeEvent,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useReducedMotion } from "react-native-reanimated";
import { FillLevel, INGREDIENT_FILL_OPTIONS } from "./types";

type FillOption = { key: FillLevel; label: string; percent: number };

type Props = {
  level: FillLevel;
  onChange: (l: FillLevel) => void;
  options?: FillOption[];
};

const JAR_HEIGHT = 96;
const TRACK_HEIGHT = 6;
const TOUCH_TARGET_HEIGHT = 44;
const THUMB_SIZE = 24;
const ANIMATION_DURATION = 220;
const MIN_PROGRESS = 0.05;

const DEFAULT_OPTIONS = INGREDIENT_FILL_OPTIONS.map((option) => ({
  ...option,
  label: option.key,
}));

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function fillLevelToProgress(level: FillLevel, options: FillOption[]): number {
  const option = options.find((o) => o.key === level);
  return option ? option.percent / 100 : 1;
}

// Options are sorted highest percent → lowest. Uses midpoints between adjacent
// options as zone boundaries so the user's exact thumb position determines the level.
function progressToFillLevel(progress: number, options: FillOption[]): FillLevel {
  for (let i = 0; i < options.length - 1; i++) {
    const midpoint = (options[i].percent + options[i + 1].percent) / 200;
    if (progress >= midpoint) {
      return options[i].key;
    }
  }
  return options[options.length - 1].key;
}

function getProgressColor(progress: number) {
  if (progress > 0.6) {
    return colors.success;
  }

  if (progress > 0.3) {
    return colors.warning;
  }

  return colors.danger;
}

function getThumbFill(progress: number) {
  if (progress > 0.6) {
    return "#f3fff7";
  }

  if (progress > 0.3) {
    return "#fff6de";
  }

  return "#fff6f5";
}

function getThumbBorder(progress: number) {
  if (progress > 0.6) {
    return "#a6d7b7";
  }

  if (progress > 0.3) {
    return "#ebcf93";
  }

  return "#f0b6b0";
}

export default function FillGauge({ level, onChange, options = DEFAULT_OPTIONS }: Props) {
  const reducedMotion = useReducedMotion();
  const [liveProgress, setLiveProgress] = useState(() => fillLevelToProgress(level, options));
  const [trackWidth, setTrackWidth] = useState(0);

  const progressAnim = useRef(
    new Animated.Value(fillLevelToProgress(level, options)),
  ).current;
  const liveProgressRef = useRef(liveProgress);
  const committedLevelRef = useRef(level);
  const grabOffsetRef = useRef(0);

  useEffect(() => {
    // Skip animation if this level change came from our own onChange call —
    // the thumb is already in the correct position.
    if (level === committedLevelRef.current) return;

    const nextProgress = fillLevelToProgress(level, options);
    committedLevelRef.current = level;
    setLiveProgress(nextProgress);
    liveProgressRef.current = nextProgress;

    if (reducedMotion) {
      progressAnim.setValue(nextProgress);
      return;
    }

    Animated.timing(progressAnim, {
      toValue: nextProgress,
      duration: ANIMATION_DURATION,
      easing: Easing.bezier(0.22, 1, 0.36, 1),
      useNativeDriver: false,
    }).start();
  }, [level, progressAnim, reducedMotion]);

  const updateProgress = (locationX: number) => {
    if (trackWidth <= 0) return;

    const raw = (locationX - THUMB_SIZE / 2) / trackWidth;
    const progress = clamp(raw, MIN_PROGRESS, 1);

    progressAnim.setValue(progress);
    setLiveProgress(progress);
    liveProgressRef.current = progress;

    const newLevel = progressToFillLevel(progress, options);
    if (newLevel !== committedLevelRef.current) {
      committedLevelRef.current = newLevel;
      onChange(newLevel);
    }
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (event) => {
      const { locationX } = event.nativeEvent;
      // Thumb center in trackShell coords = left padding + progress * trackWidth
      const thumbCenterX = THUMB_SIZE / 2 + liveProgressRef.current * trackWidth;
      const distFromThumb = Math.abs(locationX - thumbCenterX);
      // If the finger lands on or near the thumb, preserve the offset so it
      // doesn't jump. If it's a deliberate tap elsewhere, jump normally.
      grabOffsetRef.current = distFromThumb <= THUMB_SIZE * 1.5 ? thumbCenterX - locationX : 0;
      updateProgress(locationX + grabOffsetRef.current);
    },
    onPanResponderMove: (event) => {
      updateProgress(event.nativeEvent.locationX + grabOffsetRef.current);
    },
    onPanResponderRelease: (event) => {
      updateProgress(event.nativeEvent.locationX + grabOffsetRef.current);
    },
    onPanResponderTerminate: () => {
      // Touch was stolen — stay at current position, no snap.
    },
    onPanResponderTerminationRequest: () => false,
  });

  const handleTrackLayout = (event: LayoutChangeEvent) => {
    setTrackWidth(Math.max(0, event.nativeEvent.layout.width - THUMB_SIZE));
  };

  const currentLevel = progressToFillLevel(liveProgress, options);
  const current = options.find((o) => o.key === currentLevel) ?? options[0];
  const emptyLabel = options[options.length - 1]?.label ?? "";
  const fullLabel = options[0]?.label ?? "";

  const jarColor = getProgressColor(liveProgress);
  const thumbColor = getThumbFill(liveProgress);
  const thumbBorder = getThumbBorder(liveProgress);

  const fillHeight = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, JAR_HEIGHT],
  });

  const thumbTranslateX = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, trackWidth],
  });

  const activeTrackWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, trackWidth],
  });

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.jarWrap}>
          <View style={styles.jar}>
            <View style={styles.jarLid} />
            <Animated.View
              style={[
                styles.jarFill,
                {
                  height: fillHeight,
                  backgroundColor: jarColor,
                },
              ]}
            />
            <View style={styles.jarHighlight} />
          </View>
        </View>

        <View style={styles.copy}>
          <Text style={styles.valueLabel}>{current.label}</Text>
        </View>
      </View>

      <View style={styles.sliderArea}>
        <View style={styles.trackShell} onLayout={handleTrackLayout}>
          <View style={styles.trackSegmentDanger} />
          <View style={styles.trackSegmentWarning} />
          <View style={styles.trackSegmentSuccess} />
          <Animated.View
            pointerEvents="none"
            style={[
              styles.activeTrack,
              {
                width: activeTrackWidth,
                backgroundColor: jarColor,
              },
            ]}
          />
          <View style={styles.dragLayer} {...panResponder.panHandlers} />
          <Animated.View
            pointerEvents="none"
            style={[
              styles.thumb,
              {
                backgroundColor: thumbColor,
                borderColor: thumbBorder,
                transform: [{ translateX: thumbTranslateX }],
              },
            ]}
          />
        </View>

        <View style={styles.rangeLabels}>
          <Text style={[styles.rangeLabel, styles.rangeLabelStart]}>{emptyLabel}</Text>
          <Text style={[styles.rangeLabel, styles.rangeLabelEnd]}>{fullLabel}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 18,
  },
  jarWrap: {
    width: 64,
    alignItems: "center",
  },
  jar: {
    width: 54,
    height: JAR_HEIGHT,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: colors.text + "1f",
    backgroundColor: "#f7f4f1",
    overflow: "hidden",
    position: "relative",
    justifyContent: "flex-end",
  },
  jarLid: {
    position: "absolute",
    top: 1,
    left: "50%",
    marginLeft: -16,
    width: 32,
    height: 7,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: colors.text + "18",
    zIndex: 2,
  },
  jarFill: {
    width: "100%",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  jarHighlight: {
    position: "absolute",
    top: 14,
    left: 6,
    width: 5,
    height: 30,
    borderRadius: 999,
    backgroundColor: "#ffffff55",
  },
  copy: {
    flex: 1,
    paddingBottom: 4,
  },
  valueLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 19,
    lineHeight: 24,
    color: colors.text,
  },
  sliderArea: {
    paddingTop: 2,
  },
  trackShell: {
    position: "relative",
    height: TOUCH_TARGET_HEIGHT,
    justifyContent: "center",
    paddingHorizontal: THUMB_SIZE / 2,
  },
  trackSegmentDanger: {
    position: "absolute",
    left: THUMB_SIZE / 2,
    right: "66%",
    top: (TOUCH_TARGET_HEIGHT - TRACK_HEIGHT) / 2,
    height: TRACK_HEIGHT,
    borderTopLeftRadius: 999,
    borderBottomLeftRadius: 999,
    backgroundColor: "#f6d4cf",
  },
  trackSegmentWarning: {
    position: "absolute",
    left: "33%",
    right: "33%",
    top: (TOUCH_TARGET_HEIGHT - TRACK_HEIGHT) / 2,
    height: TRACK_HEIGHT,
    backgroundColor: "#f3e1b0",
  },
  trackSegmentSuccess: {
    position: "absolute",
    left: "66%",
    right: THUMB_SIZE / 2,
    top: (TOUCH_TARGET_HEIGHT - TRACK_HEIGHT) / 2,
    height: TRACK_HEIGHT,
    borderTopRightRadius: 999,
    borderBottomRightRadius: 999,
    backgroundColor: "#d2eadb",
  },
  activeTrack: {
    position: "absolute",
    left: THUMB_SIZE / 2,
    top: (TOUCH_TARGET_HEIGHT - TRACK_HEIGHT) / 2,
    height: TRACK_HEIGHT,
    borderRadius: 999,
  },
  dragLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  thumb: {
    position: "absolute",
    top: (TOUCH_TARGET_HEIGHT - THUMB_SIZE) / 2,
    left: 0,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: 999,
    borderWidth: 1,
    shadowColor: "#00000030",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    zIndex: 2,
  },
  rangeLabels: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: THUMB_SIZE / 2,
  },
  rangeLabel: {
    flex: 1,
    fontFamily: fonts.sans,
    fontSize: 11,
    lineHeight: 14,
    color: colors.muted,
  },
  rangeLabelStart: {
    textAlign: "left",
  },
  rangeLabelEnd: {
    textAlign: "right",
  },
});
