import Button from "@/components/ui/Button";
import ChipInput from "@/components/ui/ChipInput";
import KeyboardAvoidingContainer from "@/components/ui/KeyboardAvoidingContainer";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Item = { name: string };

type Props = {
  onComplete: (items: Item[]) => void;
  onBack: () => void;
};

export default function ManualEntryView({ onComplete, onBack }: Props) {
  const [items, setItems] = useState<string[]>([]);

  const addItem = (value: string) => {
    const trimmed = value.trim();
    if (trimmed && !items.some((i) => i.toLowerCase() === trimmed.toLowerCase())) {
      setItems((prev) => [...prev, trimmed]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={onBack}>
          <Feather name="arrow-left" size={16} color={colors.text} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingContainer style={styles.keyboard}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
        <View style={styles.headingBlock}>
          <Text style={styles.title}>{"Add items manually"}</Text>
          <Text style={styles.subtitle}>Type each item and press Return to add</Text>
        </View>

        <ChipInput
          label="Items"
          chips={items}
          onAdd={addItem}
          onRemove={(chip) => setItems((prev) => prev.filter((i) => i !== chip))}
          placeholder="e.g. Milk, Eggs, Bread…"
          multiline
          minHeight={120}
        />

        <Button
          title={
            items.length > 0
              ? `Review ${items.length} item${items.length === 1 ? "" : "s"}`
              : "Review items"
          }
          disabled={items.length === 0}
          onPress={() => onComplete(items.map((name) => ({ name })))}
          style={styles.button}
        />
        </ScrollView>
      </KeyboardAvoidingContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboard: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 32,
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 32,
    paddingTop: 16,
    paddingBottom: 40,
  },
  headingBlock: {
    marginBottom: 32,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 36,
    lineHeight: 40,
    color: colors.text,
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: fonts.sans,
    fontSize: 14,
    letterSpacing: 0.3,
    color: colors.muted,
    lineHeight: 21,
  },
  button: {
    marginTop: 24,
  },
});
