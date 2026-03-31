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
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MicVisualizer from "./voice/MicVisualizer";
import PermissionView from "./voice/PermissionView";
import RecordingControls from "./voice/RecordingControls";
import Waveform from "./voice/Waveform";

type Props = {
  storageName: string;
  onDone: () => void;
  onBack: () => void;
};

type PermissionStatus = "loading" | "granted" | "denied";

const NUM_BARS = 24;
const RECORDING_OPTIONS = { ...RecordingPresets.HIGH_QUALITY, isMeteringEnabled: true };
const SILENT_BARS = Array(NUM_BARS).fill(4);

export default function VoiceView({ storageName, onDone, onBack }: Props) {
  const { t } = useI18n();
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>("loading");
  const recorder = useAudioRecorder(RECORDING_OPTIONS);
  const recorderState = useAudioRecorderState(recorder, 100);
  // Track active recording state in a ref to avoid touching the native object during cleanup
  const isActiveRef = useRef(false);
  const isMountedRef = useRef(true);
  const [barHeights, setBarHeights] = useState<number[]>(SILENT_BARS);
  const historyRef = useRef<number[]>([...SILENT_BARS]);
  const [isPaused, setIsPaused] = useState(false);

  const isRecording = recorderState.isRecording;
  const elapsedSeconds = Math.floor((recorderState.durationMillis ?? 0) / 1000);

  // Drive waveform from metering data (freeze when paused)
  useEffect(() => {
    if (!isRecording || isPaused || recorderState.metering === undefined) return;
    const normalized = Math.max(0, Math.min(1, (recorderState.metering + 60) / 60));
    const height = 4 + normalized * 44;
    historyRef.current = [...historyRef.current.slice(1), height];
    setBarHeights([...historyRef.current]);
  }, [recorderState.metering, isRecording, isPaused]);

  // Reset bars and pause state when recording stops
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
      if (isMountedRef.current) setPermissionStatus(granted ? "granted" : "denied");
    });
    return () => {
      isMountedRef.current = false;
      // Only stop if we know a recording is active — never access recorder.isRecording here
      if (isActiveRef.current) {
        isActiveRef.current = false;
        try { recorder.stop(); } catch {}
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    } catch (e) {
      console.warn("Failed to start recording:", e);
    }
  };

  const handlePause = () => {
    try {
      recorder.pause();
      setIsPaused(true);
    } catch (e) {
      console.warn("Failed to pause recording:", e);
    }
  };

  const handleResume = () => {
    try {
      recorder.record();
      setIsPaused(false);
    } catch (e) {
      console.warn("Failed to resume recording:", e);
    }
  };

  const handleStop = async () => {
    if (!isActiveRef.current) return;
    isActiveRef.current = false;
    try {
      await recorder.stop();
      await setAudioModeAsync({ allowsRecording: false });
    } catch (e) {
      console.warn("Failed to stop recording:", e);
    }
    onDone();
  };

  const handleBack = async () => {
    if (isActiveRef.current) {
      isActiveRef.current = false;
      try { await recorder.stop(); } catch {}
    }
    onBack();
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const getHintText = () => {
    if (isPaused) return t("addItems.voice.hint.paused");
    if (isRecording) return t("addItems.voice.hint.recording", { storageName: storageName.toLowerCase() });
    return t("addItems.voice.hint.idle");
  };

  if (permissionStatus === "loading") {
    return <View style={styles.container} />;
  }

  if (permissionStatus === "denied") {
    return <PermissionView onBack={onBack} onRequestPermission={handleRequestPermission} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={handleBack}>
          <Feather name="arrow-left" size={16} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <MicVisualizer isRecording={isRecording} isPaused={isPaused} />

        <View style={styles.textBlock}>
          <Text style={styles.timer}>{formatTime(elapsedSeconds)}</Text>
          <Text style={styles.hint}>{getHintText()}</Text>
        </View>

        {isRecording && <Waveform barHeights={barHeights} isPaused={isPaused} />}

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

const styles = StyleSheet.create({
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
});
