import { colors } from "@/constants/colors";
import { StyleSheet, View } from "react-native";

type Props = {
  barHeights: number[];
  isPaused: boolean;
};

export default function Waveform({ barHeights, isPaused }: Props) {
  return (
    <View style={styles.container}>
      {barHeights.map((height, i) => (
        <View key={i} style={[styles.bar, { height }, isPaused && styles.barPaused]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    gap: 3,
  },
  bar: {
    width: 3,
    borderRadius: 2,
    backgroundColor: colors.brand + "99",
  },
  barPaused: {
    backgroundColor: colors.muted + "66",
  },
});
