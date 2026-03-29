import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Feather } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  Animated,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  label: string;
  value: string; // "YYYY-MM-DD" or ""
  onChange: (val: string) => void;
};

function toDate(value: string): Date {
  if (!value) return new Date();
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatDisplay(value: string): string {
  if (!value) return "";
  const [y, m, d] = value.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${parseInt(d)} ${months[parseInt(m, 10) - 1]} ${y}`;
}

function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function DatePickerField({ label, value, onChange }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [androidOpen, setAndroidOpen] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(() => toDate(value));

  const sheetAnim = useRef(new Animated.Value(300)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  const backdropOpacity = backdropAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.4],
  });

  const openSheet = () => {
    setTempDate(toDate(value));
    setModalVisible(true);
    Animated.parallel([
      Animated.timing(backdropAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.spring(sheetAnim, { toValue: 0, bounciness: 0, speed: 14, useNativeDriver: true }),
    ]).start();
  };

  const closeSheet = (result: "done" | "clear" | "dismiss") => {
    Animated.parallel([
      Animated.timing(backdropAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(sheetAnim, { toValue: 300, duration: 220, useNativeDriver: true }),
    ]).start(() => setModalVisible(false));

    if (result === "done") onChange(toISODate(tempDate));
    if (result === "clear") onChange("");
  };

  const handleAndroidChange = (_: DateTimePickerEvent, date?: Date) => {
    setAndroidOpen(false);
    if (date) onChange(toISODate(date));
  };

  return (
    <>
      <View>
        <Text style={styles.label}>{label}</Text>
        <TouchableOpacity
          style={styles.row}
          activeOpacity={0.7}
          onPress={Platform.OS === "ios" ? openSheet : () => setAndroidOpen(true)}
        >
          <Feather name="calendar" size={15} color={colors.muted} />
          <Text style={[styles.value, !value && styles.placeholder]}>
            {value ? formatDisplay(value) : `Select ${label.toLowerCase()}`}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Android native dialog */}
      {Platform.OS === "android" && androidOpen && (
        <DateTimePicker
          value={tempDate}
          mode="date"
          display="default"
          onChange={handleAndroidChange}
        />
      )}

      {/* iOS: backdrop fades, sheet slides up independently */}
      {Platform.OS === "ios" && (
        <Modal
          visible={modalVisible}
          transparent
          animationType="none"
          onRequestClose={() => closeSheet("dismiss")}
        >
          <View style={styles.overlay}>
            {/* Backdrop — fades in, never slides */}
            <Animated.View
              style={[styles.backdrop, { opacity: backdropOpacity }]}
            />
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              activeOpacity={1}
              onPress={() => closeSheet("done")}
            />
            {/* Sheet — slides up */}
            <Animated.View style={[styles.sheet, { transform: [{ translateY: sheetAnim }] }]}>
              <View style={styles.sheetHeader}>
                <TouchableOpacity onPress={() => closeSheet("clear")}>
                  <Text style={styles.sheetAction}>Clear</Text>
                </TouchableOpacity>
                <Text style={styles.sheetTitle}>{label}</Text>
                <TouchableOpacity onPress={() => closeSheet("done")}>
                  <Text style={[styles.sheetAction, styles.sheetDone]}>Done</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.pickerWrapper}>
                <DateTimePicker
                  value={tempDate}
                  mode="date"
                  display="spinner"
                  onChange={(_, date) => { if (date) setTempDate(date); }}
                />
              </View>
            </Animated.View>
          </View>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.muted,
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  value: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.text,
  },
  placeholder: {
    color: colors.muted,
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sheetTitle: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.text,
  },
  sheetAction: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.muted,
  },
  sheetDone: {
    fontFamily: fonts.sansMedium,
    color: colors.brand,
  },
  pickerWrapper: {
    alignItems: "center",
    paddingVertical: 8,
  },
});
