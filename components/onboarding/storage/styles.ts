import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboard: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
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
  captureMethods: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  captureCard: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  captureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.brand + "14",
    marginBottom: 12,
  },
  captureTitle: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.text,
    marginBottom: 4,
  },
  captureSubtitle: {
    fontFamily: fonts.sans,
    fontSize: 11,
    lineHeight: 16,
    color: colors.muted,
    textAlign: "center",
  },
  manualInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  manualInputContainer: {
    flex: 1,
  },
  inlineAddButton: {
    minWidth: 68,
    minHeight: 52,
    paddingHorizontal: 16,
    marginTop: 0,
  },
  itemsSection: {
    marginBottom: 20,
  },
  itemsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  itemsLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    letterSpacing: 1,
    color: colors.muted,
    textTransform: "uppercase",
  },
  addMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  addMoreButtonText: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.brand,
  },
  itemsList: {
    gap: 8,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  itemCheckBubble: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.brand + "14",
  },
  itemName: {
    flex: 1,
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.text,
  },
  removeButton: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  shellNote: {
    paddingVertical: 24,
  },
  shellNoteText: {
    maxWidth: 260,
    alignSelf: "center",
    textAlign: "center",
    fontFamily: fonts.sans,
    fontSize: 13,
    lineHeight: 20,
    color: colors.muted,
  },
  flexSpacer: {
    flex: 1,
  },
  secondaryActions: {
    gap: 12,
    marginBottom: 12,
  },
  secondaryActionButton: {
    minHeight: 48,
    marginTop: 0,
  },
  saveButton: {
    marginTop: 8,
  },
  list: {
    gap: 10,
    marginBottom: 24,
  },
  customInput: {
    marginBottom: 24,
  },
  suggestionsLabel: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.muted,
    marginBottom: 10,
  },
  suggestions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 24,
  },
  suggestionChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.secondary,
  },
  suggestionChipActive: {
    backgroundColor: colors.text,
  },
  suggestionText: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.muted,
  },
  suggestionTextActive: {
    color: colors.background,
  },
  infoCard: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.border,
    backgroundColor: colors.secondary + "66",
    marginBottom: 8,
  },
  infoCopy: {
    flex: 1,
  },
  infoTitle: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.text,
    marginBottom: 4,
  },
  infoBody: {
    fontFamily: fonts.sans,
    fontSize: 12,
    lineHeight: 18,
    color: colors.muted,
  },
  newLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.border,
  },
  newLocationText: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.muted,
  },
  loadingState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    paddingBottom: 40,
    gap: 12,
  },
  loadingText: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.muted,
  },
  errorState: {
    paddingTop: 32,
    paddingBottom: 24,
  },
  retryButton: {
    marginTop: 16,
  },
  button: {
    marginTop: 8,
  },
});
