import TuttoLogo from "@/assets/images/tutto-wordmark.svg";
import LanguageSelector from "@/components/LanguageSelector";
import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

type OnboardingTopBarProps = {
  showLogo?: boolean;
  showLanguageSelector?: boolean;
  leftAccessory?: ReactNode;
  rightAccessory?: ReactNode;
};

export default function OnboardingTopBar({
  showLogo = false,
  showLanguageSelector = true,
  leftAccessory,
  rightAccessory,
}: OnboardingTopBarProps) {
  const hasControls = !!leftAccessory || !!rightAccessory;

  const renderLanguageControl = (showSpacerWhenHidden: boolean) => {
    if (showLanguageSelector) {
      return <LanguageSelector />;
    }

    if (showSpacerWhenHidden) {
      return <View style={styles.languageSpacer} />;
    }

    return null;
  };

  const renderRightAccessory = () => {
    if (!rightAccessory) {
      return null;
    }

    return <View style={styles.rightAccessory}>{rightAccessory}</View>;
  };

  const renderBrandRow = () => (
    <View style={styles.brandRow}>
      <TuttoLogo width={88} height={24} />
      {renderLanguageControl(true)}
    </View>
  );

  const renderCompactControlsRow = () => (
    <View style={[styles.controlsRow, styles.controlsRowCompact]}>
      <View style={styles.accessory}>{leftAccessory}</View>
      <View style={styles.rightControls}>
        {renderRightAccessory()}
        {renderLanguageControl(false)}
      </View>
    </View>
  );

  const renderTopRow = () => {
    if (showLogo) {
      return renderBrandRow();
    }

    return renderCompactControlsRow();
  };

  const renderControlsRow = () => {
    if (!showLogo || !hasControls) {
      return null;
    }

    return (
      <View style={styles.controlsRow}>
        <View style={styles.accessory}>{leftAccessory}</View>
        <View style={styles.rightAccessory}>{rightAccessory}</View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderTopRow()}
      {renderControlsRow()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
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
  languageSpacer: {
    width: 36,
    height: 36,
  },
});
