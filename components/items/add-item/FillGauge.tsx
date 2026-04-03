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
const THUMB_SIZE = 24;
const ANIMATION_DURATION = 220;

const DEFAULT_OPTIONS = INGREDIENT_FILL_OPTIONS.map((option) => ({
  ...option,
  label: option.key,
}));

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function indexToProgress(index: number, optionCount: number) {
  if (optionCount <= 1) {
    return 1;
  }

  return (optionCount - 1 - index) / (optionCount - 1);
}

function progressToIndex(progress: number, optionCount: number) {
  if (optionCount <= 1) {
    return 0;
  }

  const rawIndex = Math.round((1 - progress) * (optionCount - 1));
  return clamp(rawIndex, 0, optionCount - 1);
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
  const optionCount = options.length;
  const currentIndex = Math.max(0, options.findIndex((option) => option.key === level));
  const [previewIndex, setPreviewIndex] = useState(currentIndex);
  const [trackWidth, setTrackWidth] = useState(0);

  const current = options[previewIndex] ?? options[0];
  const emptyLabel = options[optionCount - 1]?.label ?? "";
  const fullLabel = options[0]?.label ?? "";

  const progressAnim = useRef(new Animated.Value(indexToProgress(currentIndex, optionCount))).current;
  const committedIndexRef = useRef(currentIndex);

  useEffect(() => {
    const nextProgress = indexToProgress(currentIndex, optionCount);
    committedIndexRef.current = currentIndex;
    setPreviewIndex(currentIndex);

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
  }, [currentIndex, optionCount, progressAnim, reducedMotion]);

  const moveToPoint = (locationX: number) => {
    if (trackWidth <= 0) {
      return currentIndex;
    }

    const normalized = clamp((locationX - THUMB_SIZE / 2) / trackWidth, 0, 1);
    const nextIndex = progressToIndex(normalized, optionCount);

    progressAnim.setValue(normalized);

    if (nextIndex !== previewIndex) {
      setPreviewIndex(nextIndex);
    }

    return nextIndex;
  };

  const settleAtIndex = (nextIndex: number) => {
    const nextProgress = indexToProgress(nextIndex, optionCount);

    if (reducedMotion) {
      progressAnim.setValue(nextProgress);
    } else {
      Animated.timing(progressAnim, {
        toValue: nextProgress,
        duration: 180,
        easing: Easing.bezier(0.22, 1, 0.36, 1),
        useNativeDriver: false,
      }).start();
    }

    setPreviewIndex(nextIndex);

    if (nextIndex !== committedIndexRef.current && options[nextIndex]) {
      committedIndexRef.current = nextIndex;
      onChange(options[nextIndex].key);
    }
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (event) => {
      moveToPoint(event.nativeEvent.locationX);
    },
    onPanResponderMove: (event) => {
      moveToPoint(event.nativeEvent.locationX);
    },
    onPanResponderRelease: (event) => {
      settleAtIndex(moveToPoint(event.nativeEvent.locationX));
    },
    onPanResponderTerminate: () => {
      settleAtIndex(previewIndex);
    },
  });

  const handleTrackLayout = (event: LayoutChangeEvent) => {
    setTrackWidth(Math.max(0, event.nativeEvent.layout.width - THUMB_SIZE));
  };

  const currentProgress = indexToProgress(previewIndex, optionCount);
  const jarColor = getProgressColor(currentProgress);
  const thumbColor = getThumbFill(currentProgress);
  const thumbBorder = getThumbBorder(currentProgress);

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
          <Text style={styles.valuePercent}>{current.percent}%</Text>
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
  valuePercent: {
    marginTop: 4,
    fontFamily: fonts.sans,
    fontSize: 12,
    lineHeight: 16,
    color: colors.muted,
  },
  sliderArea: {
    paddingTop: 2,
  },
  trackShell: {
    position: "relative",
    height: THUMB_SIZE,
    justifyContent: "center",
    paddingHorizontal: THUMB_SIZE / 2,
  },
  trackSegmentDanger: {
    position: "absolute",
    left: THUMB_SIZE / 2,
    right: "66%",
    top: 9,
    height: 6,
    borderTopLeftRadius: 999,
    borderBottomLeftRadius: 999,
    backgroundColor: "#f6d4cf",
  },
  trackSegmentWarning: {
    position: "absolute",
    left: "33%",
    right: "33%",
    top: 9,
    height: 6,
    backgroundColor: "#f3e1b0",
  },
  trackSegmentSuccess: {
    position: "absolute",
    left: "66%",
    right: THUMB_SIZE / 2,
    top: 9,
    height: 6,
    borderTopRightRadius: 999,
    borderBottomRightRadius: 999,
    backgroundColor: "#d2eadb",
  },
  activeTrack: {
    position: "absolute",
    left: THUMB_SIZE / 2,
    top: 9,
    height: 6,
    borderRadius: 999,
  },
  dragLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  thumb: {
    position: "absolute",
    top: 0,
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
