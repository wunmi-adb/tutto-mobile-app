import HapticPressable from "@/components/ui/HapticPressable";
import { fonts } from "@/constants/fonts";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";

export type SegmentedTabOption<Value extends string> = {
  value: Value;
  label: string;
  badge?: number | string;
  icon?: (state: { active: boolean; color: string }) => ReactNode;
};

type Props<Value extends string> = {
  options: SegmentedTabOption<Value>[];
  value: Value;
  onChange: (value: Value) => void;
  backgroundColor: string;
  activeBackgroundColor: string;
  inactiveTextColor: string;
  activeTextColor: string;
  containerStyle?: StyleProp<ViewStyle>;
  tabStyle?: StyleProp<ViewStyle>;
  activeTabStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  activeLabelStyle?: StyleProp<TextStyle>;
  badgeStyle?: StyleProp<TextStyle>;
  indicatorStyle?: StyleProp<ViewStyle>;
  pressedOpacity?: number;
};

const CONTAINER_PADDING = 4;
const TAB_GAP = 8;

export default function SegmentedTabs<Value extends string>({
  options,
  value,
  onChange,
  backgroundColor,
  activeBackgroundColor,
  inactiveTextColor,
  activeTextColor,
  containerStyle,
  tabStyle,
  activeTabStyle,
  labelStyle,
  activeLabelStyle,
  badgeStyle,
  indicatorStyle,
  pressedOpacity = 0.9,
}: Props<Value>) {
  const translateX = useRef(new Animated.Value(0)).current;
  const [containerWidth, setContainerWidth] = useState(0);
  const activeIndex = Math.max(
    0,
    options.findIndex((item) => item.value === value),
  );

  const indicatorWidth = useMemo(() => {
    if (!containerWidth || options.length === 0) {
      return 0;
    }

    return (
      (containerWidth - CONTAINER_PADDING * 2 - TAB_GAP * (options.length - 1)) /
      options.length
    );
  }, [containerWidth, options.length]);

  useEffect(() => {
    if (!indicatorWidth) {
      return;
    }

    Animated.timing(translateX, {
      toValue: activeIndex * (indicatorWidth + TAB_GAP),
      duration: 180,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [activeIndex, indicatorWidth, translateX]);

  const handleLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  return (
    <View
      style={[styles.container, { backgroundColor }, containerStyle]}
      onLayout={handleLayout}
    >
      {indicatorWidth > 0 ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.indicator,
            {
              width: indicatorWidth,
              backgroundColor: activeBackgroundColor,
              transform: [{ translateX }],
            },
            indicatorStyle,
          ]}
        />
      ) : null}

      {options.map((option) => {
        const active = option.value === value;
        const textColor = active ? activeTextColor : inactiveTextColor;

        return (
          <HapticPressable
            key={option.value}
            style={[styles.tab, tabStyle, active && activeTabStyle]}
            pressedOpacity={pressedOpacity}
            onPress={() => onChange(option.value)}
          >
            <View style={styles.tabContent}>
              {option.icon?.({ active, color: textColor })}
              <Text
                style={[
                  styles.label,
                  { color: textColor },
                  labelStyle,
                  active && activeLabelStyle,
                ]}
              >
                {option.label}
              </Text>
              {option.badge !== undefined ? (
                <Text style={[styles.badge, { color: textColor }, badgeStyle]}>
                  {option.badge}
                </Text>
              ) : null}
            </View>
          </HapticPressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flexDirection: "row",
    gap: TAB_GAP,
    borderRadius: 16,
    padding: CONTAINER_PADDING,
  },
  indicator: {
    position: "absolute",
    top: CONTAINER_PADDING,
    left: CONTAINER_PADDING,
    bottom: CONTAINER_PADDING,
    borderRadius: 12,
  },
  tab: {
    flex: 1,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    zIndex: 1,
  },
  tabContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  label: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
  },
  badge: {
    fontFamily: fonts.sans,
    fontSize: 12,
  },
});
