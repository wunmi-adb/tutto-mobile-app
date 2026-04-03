import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import HapticPressable from "@/components/ui/HapticPressable";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  value: number;
  onChange: (n: number) => void;
};

export default function QtyStepper({ value, onChange }: Props) {
  return (
    <View style={styles.row}>
      <HapticPressable
        style={styles.btn}
        pressedOpacity={0.7}
        onPress={() => onChange(Math.max(1, value - 1))}
      >
        <Text style={styles.btnText}>−</Text>
      </HapticPressable>
      <Text style={styles.count}>{value}</Text>
      <HapticPressable
        style={styles.btn}
        pressedOpacity={0.7}
        onPress={() => onChange(value + 1)}
      >
        <Text style={styles.btnText}>+</Text>
      </HapticPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  btn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    fontFamily: fonts.sans,
    fontSize: 20,
    color: colors.text,
    lineHeight: 24,
  },
  count: {
    fontFamily: fonts.sansBold,
    fontSize: 24,
    color: colors.text,
    width: 32,
    textAlign: "center",
  },
});
