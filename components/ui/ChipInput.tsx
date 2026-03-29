import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { Feather } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  label?: string;
  chips: string[];
  onAdd: (value: string) => void;
  onRemove: (chip: string) => void;
  placeholder?: string;
  multiline?: boolean;
  minHeight?: number;
};

export default function ChipInput({
  label,
  chips,
  onAdd,
  onRemove,
  placeholder = "Type and press return",
  multiline = false,
  minHeight,
}: Props) {
  const inputRef = useRef<TextInput>(null);
  const [value, setValue] = useState("");
  const focusAnim = useRef(new Animated.Value(0)).current;

  const borderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, colors.text],
  });

  const handleFocus = () => {
    focusAnim.stopAnimation();
    Animated.timing(focusAnim, { toValue: 1, duration: 150, useNativeDriver: false }).start();
  };

  const handleBlur = () => {
    focusAnim.stopAnimation();
    Animated.timing(focusAnim, { toValue: 0, duration: 150, useNativeDriver: false }).start();
    if (value.trim()) commit(value);
  };

  const commit = (raw: string) => {
    const trimmed = raw.trim();
    if (trimmed) onAdd(trimmed);
    setValue("");
  };

  const handleChangeText = (val: string) => {
    if (val.endsWith(",")) {
      commit(val.slice(0, -1));
    } else {
      setValue(val);
    }
  };

  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      <Animated.View style={[styles.box, { borderColor }, minHeight ? { minHeight } : undefined]}>
        <Pressable style={styles.inner} onPress={() => inputRef.current?.focus()}>
          {chips.map((chip) => (
            <View key={chip} style={styles.chip}>
              <Text style={styles.chipText}>{chip}</Text>
              <TouchableOpacity onPress={() => onRemove(chip)} hitSlop={8}>
                <Feather name="x" size={14} color={colors.background + "99"} />
              </TouchableOpacity>
            </View>
          ))}
          <TextInput
            ref={inputRef}
            value={value}
            onChangeText={handleChangeText}
            onSubmitEditing={() => commit(value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            placeholderTextColor={colors.muted + "80"}
            style={styles.input}
            returnKeyType="done"
            submitBehavior="submit"
            multiline={multiline}
            selectionColor={colors.text}
            cursorColor={colors.text}
          />
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    letterSpacing: 0.5,
    color: colors.muted,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  box: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inner: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.text,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  chipText: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.background,
  },
  input: {
    flex: 1,
    minWidth: 140,
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.text,
    padding: 0,
  },
});
