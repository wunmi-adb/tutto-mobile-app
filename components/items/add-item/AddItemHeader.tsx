import HapticPressable from "@/components/ui/HapticPressable";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  currentIndex: number;
  itemCount: number;
  onBack: () => void;
  onDelete?: () => void;
  onNext: () => void;
  onPrevious: () => void;
  storageName: string;
};

function LocationBadge({ storageName }: { storageName: string }) {
  return (
    <View style={styles.locationBadge}>
      <Feather name="map-pin" size={11} color={colors.muted} />
      <Text style={styles.locationText}>{storageName}</Text>
    </View>
  );
}

export default function AddItemHeader({
  currentIndex,
  itemCount,
  onBack,
  onDelete,
  onNext,
  onPrevious,
  storageName,
}: Props) {
  const showItemNavigation = itemCount > 1;

  const renderHeaderCenter = () => {
    if (!showItemNavigation) {
      return <LocationBadge storageName={storageName} />;
    }

    return (
      <View style={styles.itemNav}>
        <HapticPressable
          style={[styles.navBtn, currentIndex === 0 && styles.navBtnDisabled]}
          pressedOpacity={0.7}
          disabled={currentIndex === 0}
          onPress={onPrevious}
        >
          <Feather name="chevron-left" size={14} color={colors.muted} />
        </HapticPressable>
        <Text style={styles.navCounter}>
          {currentIndex + 1} / {itemCount}
        </Text>
        <HapticPressable
          style={[styles.navBtn, currentIndex === itemCount - 1 && styles.navBtnDisabled]}
          pressedOpacity={0.7}
          disabled={currentIndex === itemCount - 1}
          onPress={onNext}
        >
          <Feather name="chevron-right" size={14} color={colors.muted} />
        </HapticPressable>
      </View>
    );
  };

  const renderHeaderRight = () => {
    if (showItemNavigation) {
      return <LocationBadge storageName={storageName} />;
    }

    if (onDelete) {
      return (
        <HapticPressable style={styles.deleteBtn} pressedOpacity={0.7} onPress={onDelete}>
          <Feather name="trash-2" size={15} color={colors.danger} />
        </HapticPressable>
      );
    }

    return <View style={styles.headerSpacer} />;
  };

  return (
    <View style={styles.header}>
      <HapticPressable style={styles.backBtn} pressedOpacity={0.7} onPress={onBack}>
        <Feather name="arrow-left" size={16} color={colors.text} />
      </HapticPressable>

      <View style={styles.headerCenter} pointerEvents="box-none">
        {renderHeaderCenter()}
      </View>

      {renderHeaderRight()}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 8,
  },
  headerCenter: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 24,
    bottom: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  headerSpacer: {
    width: 36,
    height: 36,
  },
  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.danger + "33",
    alignItems: "center",
    justifyContent: "center",
  },
  locationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: colors.secondary,
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  locationText: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    letterSpacing: 0.4,
    color: colors.muted,
  },
  itemNav: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  navBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  navBtnDisabled: {
    opacity: 0.2,
  },
  navCounter: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.text,
    minWidth: 32,
    textAlign: "center",
  },
});
