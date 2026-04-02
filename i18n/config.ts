export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "ja", label: "日本語" },
  { code: "tr", label: "Türkçe" },
] as const;

export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number]["code"];

export const DEFAULT_LANGUAGE: AppLanguage = "en";
export const LANGUAGE_STORAGE_KEY = "@tutto/preferences/language";

export const APP_LANGUAGE_TO_LOCALE: Record<AppLanguage, string> = {
  en: "en-GB",
  de: "de-DE",
  es: "es-ES",
  fr: "fr-FR",
  ja: "ja-JP",
  tr: "tr-TR",
};

export function isSupportedLanguage(value: string | null | undefined): value is AppLanguage {
  if (!value) return false;

  return SUPPORTED_LANGUAGES.some((language) => language.code === value);
}

export function normalizeLanguageTag(value: string | null | undefined): AppLanguage {
  const normalized = value?.toLowerCase().split(/[-_]/)[0];

  if (isSupportedLanguage(normalized)) {
    return normalized;
  }

  return DEFAULT_LANGUAGE;
}
