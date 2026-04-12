import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { Feather } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import type { Platform, VisualKey } from "./share-tutorial-config";

function usePulseAnimation() {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.12,
            duration: 750,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 750,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0.78,
            duration: 750,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 750,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ]),
    );

    loop.start();

    return () => {
      loop.stop();
      scale.setValue(1);
      opacity.setValue(1);
    };
  }, [opacity, scale]);

  return { scale, opacity };
}

function PulseHighlight({
  children,
  style,
  ringStyle,
}: {
  children: React.JSX.Element;
  style?: StyleProp<ViewStyle>;
  ringStyle?: StyleProp<ViewStyle>;
}) {
  const { scale, opacity } = usePulseAnimation();

  return (
    <Animated.View style={[style, { transform: [{ scale }] }]}>
      <Animated.View style={[styles.pulseRing, ringStyle, { opacity }]} />
      {children}
    </Animated.View>
  );
}

export function TutorialVisual({ visual, platform }: { visual: VisualKey; platform: Platform }) {
  if (visual === "find-recipe") {
    return <FindRecipeVisual platform={platform} />;
  }

  if (visual === "share-tray") {
    return <ShareTrayVisual platform={platform} />;
  }

  if (visual === "more-apps") {
    return <MoreAppsVisual platform={platform} />;
  }

  if (visual === "find-tutto") {
    return <FindTuttoVisual />;
  }

  return <PinTuttoVisual />;
}

function FindRecipeVisual({ platform }: { platform: Platform }) {
  if (platform === "youtube") {
    return (
      <View style={[styles.visualCard, styles.youtubeCard]}>
        <View style={styles.youtubePlayer}>
          <View style={styles.youtubePlayButton}>
            <Feather name="play" size={18} color={colors.background} />
          </View>
          <View style={styles.youtubeProgressTrack}>
            <View style={styles.youtubeProgressBar} />
          </View>
        </View>
        <View style={styles.youtubeMeta}>
          <Text style={styles.youtubeTitle}>The Best Jollof Rice Recipe You&apos;ll Ever Try</Text>
          <Text style={styles.youtubeSubtitle}>@ChefDaily · 245K views · 3 wk ago</Text>
        </View>
        <View style={styles.youtubeActions}>
          <View style={styles.youtubeActionChip}>
            <Feather name="heart" size={10} color={colors.background} />
            <Text style={styles.youtubeActionText}>354</Text>
          </View>
          <View style={styles.youtubeActionChip}>
            <Feather name="share-2" size={10} color={colors.background} />
            <Text style={styles.youtubeActionText}>Share</Text>
          </View>
        </View>
      </View>
    );
  }

  const isTikTok = platform === "tiktok";

  return (
    <View
      style={[
        styles.visualCard,
        styles.verticalVideoCard,
        isTikTok ? styles.tiktokCard : styles.instagramCard,
      ]}
    >
      <View style={styles.verticalVideoGlowPrimary} />
      <View style={styles.verticalVideoGlowSecondary} />
      <View style={styles.verticalVideoTopTabs}>
        <Text style={styles.verticalVideoTabMuted}>{isTikTok ? "Following" : "Reels"}</Text>
        {isTikTok ? <Text style={styles.verticalVideoTabActive}>For You</Text> : null}
      </View>
      <View style={styles.verticalVideoSideRail}>
        <View style={styles.verticalVideoAction}>
          <Feather name="heart" size={22} color={colors.background} />
          <Text style={styles.verticalVideoActionText}>4.2K</Text>
        </View>
        <View style={styles.verticalVideoAction}>
          <Feather name="message-circle" size={22} color={colors.background} />
          <Text style={styles.verticalVideoActionText}>78</Text>
        </View>
        <View style={styles.verticalVideoAction}>
          <Feather name={isTikTok ? "share-2" : "send"} size={22} color={colors.background} />
          <Text style={styles.verticalVideoActionText}>721</Text>
        </View>
      </View>
      <View style={styles.verticalVideoFooter}>
        <Text style={styles.verticalVideoHandle}>{isTikTok ? "@cookwithlena" : "cookwithlena"}</Text>
        <Text style={styles.verticalVideoCaption}>
          This creamy garlic pasta changed my weeknight dinners forever
        </Text>
      </View>
    </View>
  );
}

function ShareTrayVisual({ platform }: { platform: Platform }) {
  if (platform === "youtube") {
    return (
      <View style={[styles.visualCard, styles.youtubeCard]}>
        <View style={styles.youtubePlayer} />
        <View style={styles.youtubeMeta}>
          <Text style={styles.youtubeTitle}>The Best Jollof Rice Recipe You&apos;ll Ever Try</Text>
          <Text style={styles.youtubeSubtitle}>@ChefDaily · 245K views · 3 wk ago</Text>
        </View>
        <View style={styles.youtubeActions}>
          <View style={styles.youtubeActionChip}>
            <Feather name="heart" size={10} color={colors.background} />
            <Text style={styles.youtubeActionText}>354</Text>
          </View>
          <PulseHighlight style={styles.youtubeActionHighlight} ringStyle={styles.youtubeActionRing}>
            <View style={[styles.youtubeActionChip, styles.youtubeActionChipHighlighted]}>
              <Feather name="share-2" size={10} color={colors.background} />
              <Text style={styles.youtubeActionText}>Share</Text>
            </View>
          </PulseHighlight>
        </View>
        <View style={styles.inlineCallout}>
          <Text style={styles.inlineCalloutText}>Tap here ↗</Text>
        </View>
      </View>
    );
  }

  const isTikTok = platform === "tiktok";

  return (
    <View
      style={[
        styles.visualCard,
        styles.verticalVideoCard,
        isTikTok ? styles.tiktokCard : styles.instagramCard,
      ]}
    >
      <View style={styles.verticalVideoGlowPrimary} />
      <View style={styles.verticalVideoGlowSecondary} />
      <View style={styles.verticalVideoSideRail}>
        <View style={styles.verticalVideoAction}>
          <Feather name="heart" size={22} color={colors.background} />
          <Text style={styles.verticalVideoActionText}>4.2K</Text>
        </View>
        <View style={styles.verticalVideoAction}>
          <Feather name="message-circle" size={22} color={colors.background} />
          <Text style={styles.verticalVideoActionText}>78</Text>
        </View>
        <PulseHighlight
          style={styles.verticalVideoHighlightWrap}
          ringStyle={styles.verticalVideoHighlightRing}
        >
          <View style={styles.verticalVideoAction}>
            <Feather name={isTikTok ? "share-2" : "send"} size={22} color={colors.background} />
            <Text style={styles.verticalVideoActionText}>721</Text>
          </View>
        </PulseHighlight>
      </View>
      <View style={styles.inlineCalloutFloating}>
        <Text style={styles.inlineCalloutText}>{isTikTok ? "Tap here →" : "Tap here ↗"}</Text>
      </View>
    </View>
  );
}

function MoreAppsVisual({ platform }: { platform: Platform }) {
  return (
    <View style={[styles.visualCard, styles.sheetOuter]}>
      <View style={styles.sheetHandle} />
      <View style={styles.linkPreviewRow}>
        <View style={styles.linkPreviewThumb} />
        <View style={styles.linkPreviewText}>
          <Text style={styles.linkPreviewTitle}>
            {platform === "youtube" ? "YouTube Video" : platform === "tiktok" ? "TikTok Video" : "Reel from cookwithlena"}
          </Text>
          <Text style={styles.linkPreviewSubtitle}>
            {platform === "youtube" ? "youtube.com" : platform === "tiktok" ? "tiktok.com" : "instagram.com"}
          </Text>
        </View>
      </View>
      <View style={styles.shareRow}>
        {[1, 2, 3].map((item) => (
          <View key={item} style={styles.sheetIconColumn}>
            <View style={styles.sheetIcon} />
            <View style={styles.sheetIconLabel} />
          </View>
        ))}
        <PulseHighlight style={styles.sheetIconColumn} ringStyle={styles.sheetIconRing}>
          <View style={[styles.sheetIcon, styles.sheetIconMore]}>
            <Feather name="more-horizontal" size={18} color={colors.muted} />
          </View>
        </PulseHighlight>
      </View>
      <View style={styles.sheetDivider} />
      <View style={styles.sheetActionList}>
        {[1, 2, 3].map((item) => (
          <View key={item} style={styles.sheetActionRow}>
            <View style={styles.sheetActionIcon} />
            <View style={styles.sheetActionBar} />
          </View>
        ))}
      </View>
    </View>
  );
}

function FindTuttoVisual() {
  return (
    <View style={[styles.visualCard, styles.sheetOuter]}>
      <View style={styles.appsHeader}>
        <View style={styles.appsHeaderBubble}>
          <Feather name="check" size={14} color={colors.background} />
        </View>
        <Text style={styles.appsHeaderTitle}>Apps</Text>
        <View style={styles.appsHeaderEdit}>
          <Text style={styles.appsHeaderEditText}>Edit</Text>
        </View>
      </View>
      <Text style={styles.appsSectionLabel}>Suggestions</Text>
      <View style={styles.appsListCard}>
        {[1, 2].map((item) => (
          <View key={item} style={styles.appsListRow}>
            <View style={styles.appsListIcon} />
            <View style={styles.appsListBar} />
          </View>
        ))}
        <PulseHighlight style={styles.appsListRow} ringStyle={styles.appsListRing}>
          <View style={styles.appsListRowActive}>
            <View style={styles.tuttoMiniIcon}>
              <Text style={styles.tuttoMiniIconText}>T</Text>
            </View>
            <Text style={styles.appsListTitle}>Tutto</Text>
            <Feather name="chevron-right" size={14} color={colors.brand} />
          </View>
        </PulseHighlight>
      </View>
    </View>
  );
}

function PinTuttoVisual() {
  return (
    <View style={[styles.visualCard, styles.sheetOuter]}>
      <View style={styles.appsHeader}>
        <View style={styles.appsHeaderSpacer} />
        <Text style={styles.appsHeaderTitle}>Apps</Text>
        <View style={styles.appsHeaderBubble}>
          <Feather name="check" size={14} color={colors.background} />
        </View>
      </View>
      <Text style={styles.appsSectionLabel}>Favourites</Text>
      <View style={styles.appsListCard}>
        {[1, 2].map((item) => (
          <View key={item} style={styles.editRow}>
            <View style={styles.removeBubble}>
              <Text style={styles.removeBubbleText}>−</Text>
            </View>
            <View style={styles.appsListIcon} />
            <View style={styles.appsListBar} />
            <View style={styles.dragHandle}>
              {[1, 2, 3].map((line) => (
                <View key={line} style={styles.dragHandleLine} />
              ))}
            </View>
          </View>
        ))}
        <PulseHighlight style={styles.editRow} ringStyle={styles.appsListRing}>
          <View style={styles.editRowActive}>
            <View style={styles.removeBubble}>
              <Text style={styles.removeBubbleText}>−</Text>
            </View>
            <View style={styles.tuttoMiniIcon}>
              <Text style={styles.tuttoMiniIconText}>T</Text>
            </View>
            <Text style={styles.appsListTitle}>Tutto</Text>
            <View style={styles.dragHandle}>
              {[1, 2, 3].map((line) => (
                <View key={line} style={styles.dragHandleLine} />
              ))}
            </View>
          </View>
        </PulseHighlight>
      </View>
      <Text style={styles.pinHint}>Tutto will now appear first in your share tray ✨</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  visualCard: {
    width: "100%",
    borderRadius: 24,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  instagramCard: {
    aspectRatio: 3 / 4,
    backgroundColor: "#130D08",
    padding: 14,
  },
  tiktokCard: {
    aspectRatio: 3 / 4,
    backgroundColor: "#0D0906",
    padding: 14,
  },
  youtubeCard: {
    backgroundColor: "#0F0F0F",
    paddingBottom: 14,
  },
  verticalVideoCard: {
    justifyContent: "space-between",
  },
  verticalVideoGlowPrimary: {
    position: "absolute",
    top: 40,
    left: 48,
    width: 170,
    height: 170,
    borderRadius: 999,
    backgroundColor: "rgba(210, 105, 30, 0.26)",
  },
  verticalVideoGlowSecondary: {
    position: "absolute",
    bottom: 90,
    left: 20,
    width: 140,
    height: 140,
    borderRadius: 999,
    backgroundColor: "rgba(139, 69, 19, 0.24)",
  },
  verticalVideoTopTabs: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 14,
  },
  verticalVideoTabMuted: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    lineHeight: 14,
    color: "rgba(255,255,255,0.55)",
  },
  verticalVideoTabActive: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    lineHeight: 14,
    color: colors.background,
  },
  verticalVideoSideRail: {
    position: "absolute",
    right: 14,
    bottom: 84,
    gap: 18,
    alignItems: "center",
  },
  verticalVideoAction: {
    alignItems: "center",
    gap: 4,
  },
  verticalVideoActionText: {
    fontFamily: fonts.sansMedium,
    fontSize: 10,
    lineHeight: 12,
    color: colors.background,
  },
  verticalVideoHighlightWrap: {
    position: "relative",
    borderRadius: 14,
    borderCurve: "continuous",
  },
  verticalVideoHighlightRing: {
    borderColor: colors.background,
  },
  verticalVideoFooter: {
    paddingRight: 72,
    gap: 6,
  },
  verticalVideoHandle: {
    fontFamily: fonts.sansBold,
    fontSize: 12,
    lineHeight: 16,
    color: colors.background,
  },
  verticalVideoCaption: {
    fontFamily: fonts.sans,
    fontSize: 11,
    lineHeight: 15,
    color: colors.background,
  },
  youtubePlayer: {
    aspectRatio: 16 / 9,
    backgroundColor: "#242424",
    alignItems: "center",
    justifyContent: "center",
  },
  youtubePlayButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  youtubeProgressTrack: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 3,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  youtubeProgressBar: {
    width: "35%",
    height: "100%",
    backgroundColor: "#E53935",
  },
  youtubeMeta: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
  },
  youtubeTitle: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    lineHeight: 16,
    color: colors.background,
    marginBottom: 4,
  },
  youtubeSubtitle: {
    fontFamily: fonts.sans,
    fontSize: 10,
    lineHeight: 14,
    color: "rgba(255,255,255,0.55)",
  },
  youtubeActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
  },
  youtubeActionChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  youtubeActionChipHighlighted: {
    backgroundColor: "rgba(255,255,255,0.14)",
  },
  youtubeActionText: {
    fontFamily: fonts.sansMedium,
    fontSize: 9,
    lineHeight: 12,
    color: colors.background,
  },
  youtubeActionHighlight: {
    borderRadius: 999,
  },
  youtubeActionRing: {
    borderColor: colors.background,
    borderRadius: 999,
  },
  inlineCallout: {
    position: "absolute",
    bottom: 12,
    left: "50%",
    marginLeft: -44,
    backgroundColor: colors.background,
    borderRadius: 10,
    borderCurve: "continuous",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  inlineCalloutFloating: {
    position: "absolute",
    right: 52,
    bottom: 104,
    backgroundColor: colors.background,
    borderRadius: 10,
    borderCurve: "continuous",
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  inlineCalloutText: {
    fontFamily: fonts.sansBold,
    fontSize: 10,
    lineHeight: 12,
    color: colors.text,
  },
  sheetOuter: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    paddingBottom: 10,
  },
  sheetHandle: {
    alignSelf: "center",
    width: 36,
    height: 4,
    borderRadius: 999,
    backgroundColor: `${colors.muted}33`,
    marginTop: 10,
    marginBottom: 10,
  },
  linkPreviewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 12,
    marginBottom: 12,
    padding: 12,
    borderRadius: 16,
    borderCurve: "continuous",
    backgroundColor: colors.secondary,
  },
  linkPreviewThumb: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#DDD3C8",
  },
  linkPreviewText: {
    flex: 1,
  },
  linkPreviewTitle: {
    fontFamily: fonts.sansBold,
    fontSize: 10,
    lineHeight: 14,
    color: colors.text,
    marginBottom: 2,
  },
  linkPreviewSubtitle: {
    fontFamily: fonts.sans,
    fontSize: 9,
    lineHeight: 12,
    color: colors.muted,
  },
  shareRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  sheetIconColumn: {
    alignItems: "center",
    gap: 6,
  },
  sheetIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.secondary,
  },
  sheetIconMore: {
    alignItems: "center",
    justifyContent: "center",
  },
  sheetIconLabel: {
    width: 28,
    height: 6,
    borderRadius: 999,
    backgroundColor: colors.secondary,
  },
  sheetIconRing: {
    borderColor: colors.brand,
    borderRadius: 16,
  },
  sheetDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 6,
  },
  sheetActionList: {
    gap: 2,
  },
  sheetActionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  sheetActionIcon: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: colors.secondary,
  },
  sheetActionBar: {
    width: 78,
    height: 10,
    borderRadius: 999,
    backgroundColor: colors.secondary,
  },
  appsHeader: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  appsHeaderBubble: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.brand,
    alignItems: "center",
    justifyContent: "center",
  },
  appsHeaderSpacer: {
    width: 28,
    height: 28,
  },
  appsHeaderTitle: {
    fontFamily: fonts.sansBold,
    fontSize: 14,
    lineHeight: 18,
    color: colors.text,
  },
  appsHeaderEdit: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  appsHeaderEditText: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    lineHeight: 14,
    color: colors.muted,
  },
  appsSectionLabel: {
    fontFamily: fonts.sansBold,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 1.1,
    textTransform: "uppercase",
    color: colors.muted,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  appsListCard: {
    marginHorizontal: 12,
    borderRadius: 16,
    borderCurve: "continuous",
    backgroundColor: `${colors.secondary}B3`,
    overflow: "hidden",
  },
  appsListRow: {
    paddingHorizontal: 12,
    paddingVertical: 11,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: `${colors.border}88`,
  },
  appsListRowActive: {
    paddingHorizontal: 12,
    paddingVertical: 11,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: `${colors.brand}12`,
  },
  appsListIcon: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: colors.background,
  },
  appsListBar: {
    width: 70,
    height: 10,
    borderRadius: 999,
    backgroundColor: colors.background,
  },
  appsListRing: {
    borderColor: colors.brand,
    borderRadius: 16,
  },
  tuttoMiniIcon: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: `${colors.brand}22`,
    alignItems: "center",
    justifyContent: "center",
  },
  tuttoMiniIconText: {
    fontFamily: fonts.sansBold,
    fontSize: 12,
    lineHeight: 14,
    color: colors.brand,
  },
  appsListTitle: {
    flex: 1,
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    lineHeight: 18,
    color: colors.text,
  },
  editRow: {
    borderBottomWidth: 1,
    borderBottomColor: `${colors.border}88`,
  },
  editRowActive: {
    paddingHorizontal: 12,
    paddingVertical: 11,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: `${colors.brand}12`,
  },
  removeBubble: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#FDE8E6",
    alignItems: "center",
    justifyContent: "center",
  },
  removeBubbleText: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    lineHeight: 12,
    color: colors.danger,
    marginTop: -2,
  },
  dragHandle: {
    width: 16,
    gap: 2,
  },
  dragHandleLine: {
    width: "100%",
    height: 2,
    borderRadius: 999,
    backgroundColor: `${colors.muted}55`,
  },
  pinHint: {
    paddingHorizontal: 18,
    paddingTop: 12,
    textAlign: "center",
    fontFamily: fonts.sans,
    fontSize: 10,
    lineHeight: 14,
    color: colors.muted,
  },
  pulseRing: {
    ...StyleSheet.absoluteFillObject,
    top: -4,
    right: -4,
    bottom: -4,
    left: -4,
    borderWidth: 2,
    borderRadius: 14,
  },
});
