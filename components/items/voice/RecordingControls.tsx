import Button from "@/components/ui/Button";
import { colors } from "@/constants/colors";
import { useI18n } from "@/i18n";
import { Feather } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type Props = {
  isRecording: boolean;
  isPaused: boolean;
  onStart: () => void;
  onStop: () => void;
  onPause: () => void;
  onResume: () => void;
};

export default function RecordingControls({
  isRecording,
  isPaused,
  onStart,
  onStop,
  onPause,
  onResume,
}: Props) {
  const { t } = useI18n();

  if (!isRecording) {
    return <Button title={t("addItems.voice.controls.start")} onPress={onStart} style={styles.btn} />;
  }

  return (
    <View style={styles.row}>
      <TouchableOpacity
        style={styles.pauseBtn}
        activeOpacity={0.7}
        onPress={isPaused ? onResume : onPause}
      >
        <Feather name={isPaused ? "play" : "pause"} size={20} color={colors.text} />
      </TouchableOpacity>
      <Button title={t("addItems.voice.controls.done")} onPress={onStop} style={styles.doneBtn} />
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    alignSelf: "stretch",
  },
  row: {
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
