import type { AppLanguage } from "../config";
import de from "./de";
import en from "./en";
import type { TranslationMessages } from "./en";
import es from "./es";
import fr from "./fr";
import ja from "./ja";
import tr from "./tr";

export type TranslationKey = keyof typeof en;
export type TranslationDictionary = TranslationMessages;

export function isTranslationKey(value: string): value is TranslationKey {
  return value in en;
}

export const translations: Record<AppLanguage, TranslationDictionary> = {
  en,
  de,
  es,
  fr,
  ja,
  tr,
};
