import BackButton from "@/components/ui/BackButton";
import Button from "@/components/ui/Button";
import HapticPressable from "@/components/ui/HapticPressable";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { useI18n } from "@/i18n";
import { Feather } from "@expo/vector-icons";
import {
  getRecordingPermissionsAsync,
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import { useEffect, useRef, useState } from "react";
import { Animated, Platform, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  storageName: string;
  onDone: (recordingUri: string) => void;
  onBack: () => void;
};

type PermissionStatus = "loading" | "granted" | "denied";

const NUM_BARS = 24;
const RECORDING_OPTIONS = { ...RecordingPresets.HIGH_QUALITY, isMeteringEnabled: true };
const SILENT_BARS = Array(NUM_BARS).fill(4);

function MicVisualizer({ isRecording, isPaused }: { isRecording: boolean; isPaused: boolean }) {
  const pingAnim = useRef(new Animated.Value(0)).current;
  const isActive = isRecording && !isPaused;

  useEffect(() => {
    if (!isActive) {
      pingAnim.stopAnimation();
      pingAnim.setValue(0);
      return;
    }

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pingAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(pingAnim, { toValue: 0, duration: 0, useNativeDriver: true }),
      ]),
    );

    loop.start();

    return () => {
      loop.stop();
      pingAnim.stopAnimation();
    };
  }, [isActive, pingAnim]);

  const pingScale = pingAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.75] });
  const pingOpacity = pingAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 0] });

  return (
    <View style={voiceStyles.visualizerContainer}>
      {isActive ? <View style={voiceStyles.ringOuter} /> : null}
      {isActive ? <View style={voiceStyles.ringInner} /> : null}
      <View
        style={[
          voiceStyles.micWrap,
          isActive && voiceStyles.micWrapActive,
          isPaused && voiceStyles.micWrapPaused,
        ]}
      >
        <Feather
          name={isPaused ? "pause" : "mic"}
          size={40}
          color={isActive ? colors.brand : colors.muted}
        />
      </View>
      {isActive ? (
        <Animated.View
          style={[
            voiceStyles.pingRing,
            { transform: [{ scale: pingScale }], opacity: pingOpacity },
          ]}
        />
      ) : null}
    </View>
  );
}

function Waveform({ barHeights, isPaused }: { barHeights: number[]; isPaused: boolean }) {
  return (
    <View style={voiceStyles.waveformContainer}>
      {barHeights.map((height, index) => (
        <View
          key={index}
          style={[voiceStyles.waveformBar, { height }, isPaused && voiceStyles.waveformBarPaused]}
        />
      ))}
    </View>
  );
}

function PermissionView({
  onBack,
  onRequestPermission,
}: {
  onBack: () => void;
  onRequestPermission: () => void;
}) {
  const { t } = useI18n();

  return (
    <SafeAreaView style={voiceStyles.container}>
      <View style={voiceStyles.header}>
        <BackButton style={voiceStyles.backBtn} onPress={onBack} />
      </View>
      <View style={voiceStyles.permissionContent}>
        <View style={voiceStyles.permissionIcon}>
          <Feather name="mic" size={32} color={colors.muted} />
        </View>
        <Text style={voiceStyles.permissionTitle}>
          {t("storage.onboarding.voice.permissionTitle")}
        </Text>
        <Text style={voiceStyles.permissionSubtitle}>
          {t("storage.onboarding.voice.permissionSubtitle")}
        </Text>
        <Button
          title={t("storage.onboarding.voice.permissionCta")}
          onPress={onRequestPermission}
          style={voiceStyles.permissionButton}
        />
      </View>
    </SafeAreaView>
  );
}

function RecordingControls({
  isRecording,
  isPaused,
  onStart,
  onStop,
  onPause,
  onResume,
}: {
  isRecording: boolean;
  isPaused: boolean;
  onStart: () => void;
  onStop: () => void;
  onPause: () => void;
  onResume: () => void;
}) {
  const { t } = useI18n();

  if (!isRecording) {
    return (
      <Button
        title={t("storage.onboarding.voice.start")}
        onPress={onStart}
        style={voiceStyles.recordButton}
      />
    );
  }

  return (
    <View style={voiceStyles.controlsRow}>
      <HapticPressable
        style={voiceStyles.pauseBtn}
        pressedOpacity={0.7}
        hapticType="selection"
        onPress={isPaused ? onResume : onPause}
      >
        <Feather name={isPaused ? "play" : "pause"} size={20} color={colors.text} />
      </HapticPressable>
      <Button
        title={t("storage.onboarding.voice.done")}
        onPress={onStop}
        style={voiceStyles.doneBtn}
      />
    </View>
  );
}

export default function StorageVoiceView({ storageName, onDone, onBack }: Props) {
  const { t } = useI18n();
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>("loading");
  const recorder = useAudioRecorder(RECORDING_OPTIONS);
  const recorderState = useAudioRecorderState(recorder, 100);
  const isActiveRef = useRef(false);
  const isMountedRef = useRef(true);
  const [barHeights, setBarHeights] = useState<number[]>(SILENT_BARS);
  const historyRef = useRef<number[]>([...SILENT_BARS]);
  const [isPaused, setIsPaused] = useState(false);

  const isRecording = recorderState.isRecording;
  const elapsedSeconds = Math.floor((recorderState.durationMillis ?? 0) / 1000);

  useEffect(() => {
    if (!isRecording || isPaused || recorderState.metering === undefined) {
      return;
    }

    const normalized = Math.max(0, Math.min(1, (recorderState.metering + 60) / 60));
    const height = 4 + normalized * 44;
    historyRef.current = [...historyRef.current.slice(1), height];
    setBarHeights([...historyRef.current]);
  }, [recorderState.metering, isPaused, isRecording]);

  useEffect(() => {
    if (!isRecording) {
      historyRef.current = [...SILENT_BARS];
      setBarHeights(SILENT_BARS);
      setIsPaused(false);
    }
  }, [isRecording]);

  useEffect(() => {
    isMountedRef.current = true;

    getRecordingPermissionsAsync().then(({ granted }) => {
      if (isMountedRef.current) {
        setPermissionStatus(granted ? "granted" : "denied");
      }
    });

    return () => {
      isMountedRef.current = false;

      if (isActiveRef.current) {
        isActiveRef.current = false;

        try {
          recorder.stop();
        } catch {}
      }
    };
  }, [recorder]);

  const handleRequestPermission = async () => {
    const { granted } = await requestRecordingPermissionsAsync();
    setPermissionStatus(granted ? "granted" : "denied");
  };

  const handleStart = async () => {
    try {
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      await recorder.prepareToRecordAsync();
      recorder.record();
      isActiveRef.current = true;
    } catch (error) {
      console.warn("Failed to start recording:", error);
    }
  };

  const handlePause = () => {
    try {
      recorder.pause();
      setIsPaused(true);
    } catch (error) {
      console.warn("Failed to pause recording:", error);
    }
  };

  const handleResume = () => {
    try {
      recorder.record();
      setIsPaused(false);
    } catch (error) {
      console.warn("Failed to resume recording:", error);
    }
  };

  const handleStop = async () => {
    if (!isActiveRef.current) {
      return;
    }

    isActiveRef.current = false;

    try {
      await recorder.stop();
      await setAudioModeAsync({ allowsRecording: false });
    } catch (error) {
      console.warn("Failed to stop recording:", error);
    }

    if (recorder.uri) {
      onDone(recorder.uri);
    }
  };

  const handleBack = async () => {
    if (isActiveRef.current) {
      isActiveRef.current = false;

      try {
        await recorder.stop();
      } catch {}
    }

    onBack();
  };

  const hint = isPaused
    ? t("storage.onboarding.voice.paused")
    : isRecording
      ? t("storage.onboarding.voice.recording", {
          storageName: storageName.toLowerCase(),
        })
      : t("storage.onboarding.voice.idle");

  if (permissionStatus === "loading") {
    return <View style={voiceStyles.container} />;
  }

  if (permissionStatus === "denied") {
    return <PermissionView onBack={onBack} onRequestPermission={handleRequestPermission} />;
  }

  return (
    <SafeAreaView style={voiceStyles.container}>
      <View style={voiceStyles.header}>
        <BackButton style={voiceStyles.backBtn} onPress={handleBack} />
      </View>

      <View style={voiceStyles.content}>
        <MicVisualizer isRecording={isRecording} isPaused={isPaused} />

        <View style={voiceStyles.textBlock}>
          <Text style={voiceStyles.timer}>
            {Math.floor(elapsedSeconds / 60)}:{String(elapsedSeconds % 60).padStart(2, "0")}
          </Text>
          <Text style={voiceStyles.hint}>{hint}</Text>
        </View>

        {isRecording ? <Waveform barHeights={barHeights} isPaused={isPaused} /> : null}

        <RecordingControls
          isRecording={isRecording}
          isPaused={isPaused}
          onStart={handleStart}
          onStop={handleStop}
          onPause={handlePause}
          onResume={handleResume}
        />
      </View>
    </SafeAreaView>
  );
}

const voiceStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 8,
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
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 32,
    paddingHorizontal: 24,
  },
  permissionContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    gap: 16,
  },
  permissionIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  permissionTitle: {
    fontFamily: fonts.serif,
    fontSize: 28,
    color: colors.text,
    textAlign: "center",
  },
  permissionSubtitle: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.muted,
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 8,
  },
  permissionButton: {
    alignSelf: "stretch",
  },
  visualizerContainer: {
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
    backgroundColor: `${colors.brand}05`,
  },
  ringInner: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: `${colors.brand}0d`,
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
    backgroundColor: `${colors.brand}1a`,
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
    borderColor: `${colors.brand}4d`,
  },
  textBlock: {
    alignItems: "center",
    gap: 8,
  },
  timer: {
    fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }),
    fontSize: 30,
    color: colors.text,
  },
  hint: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.muted,
    textAlign: "center",
  },
  waveformContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    gap: 3,
  },
  waveformBar: {
    width: 3,
    borderRadius: 2,
    backgroundColor: `${colors.brand}99`,
  },
  waveformBarPaused: {
    backgroundColor: `${colors.muted}66`,
  },
  recordButton: {
    alignSelf: "stretch",
  },
  controlsRow: {
    flexDirection: "row",
    alignSelf: "stretch",
    alignItems: "center",
    gap: 12,
  },
  pauseBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  doneBtn: {
    flex: 1,
    marginTop: 0,
  },
});
