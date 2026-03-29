import TuttoLogo from "@/assets/images/tutto-wordmark.svg";
import LanguageSelector from "@/components/LanguageSelector";
import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

type OnboardingTopBarProps = {
  showLogo?: boolean;
  leftAccessory?: ReactNode;
  rightAccessory?: ReactNode;
};

export default function OnboardingTopBar({
  showLogo = false,
  leftAccessory,
  rightAccessory,
}: OnboardingTopBarProps) {
  const hasControls = !!leftAccessory || !!rightAccessory;

  return (
    <View style={styles.container}>
      {showLogo ? (
        <View style={styles.brandRow}>
          <TuttoLogo width={88} height={24} />
          <LanguageSelector />
        </View>
      ) : (
        <View style={[styles.controlsRow, styles.controlsRowCompact]}>
          <View style={styles.accessory}>{leftAccessory}</View>
          <View style={styles.rightControls}>
            {rightAccessory ? <View style={styles.rightAccessory}>{rightAccessory}</View> : null}
            <LanguageSelector />
          </View>
        </View>
      )}

      {showLogo && hasControls ? (
        <View style={styles.controlsRow}>
          <View style={styles.accessory}>{leftAccessory}</View>
          <View style={styles.rightAccessory}>{rightAccessory}</View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 32,
    paddingTop: 8,
    paddingBottom: 8,
  },
  brandRow: {
    minHeight: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  controlsRow: {
    minHeight: 36,
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  controlsRowCompact: {
    marginTop: 0,
  },
  accessory: {
    minWidth: 36,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  rightControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  rightAccessory: {
    minWidth: 36,
    alignItems: "flex-end",
    justifyContent: "center",
  },
});
