import { getLocales } from "expo-localization";

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

export function getDeviceLocaleTag() {
  const deviceLocale = getLocales()[0];
  const languageTag = deviceLocale?.languageTag?.replaceAll("_", "-");

  if (languageTag) {
    return languageTag;
  }

  if (deviceLocale?.languageCode) {
    const normalizedLanguage = normalizeLanguageTag(deviceLocale.languageCode);
    return APP_LANGUAGE_TO_LOCALE[normalizedLanguage];
  }

  return APP_LANGUAGE_TO_LOCALE[DEFAULT_LANGUAGE];
}

export function getDeviceRegionCode() {
  const deviceLocale = getLocales()[0];
  const directRegionCode = deviceLocale?.regionCode?.toUpperCase();

  if (directRegionCode) {
    return directRegionCode;
  }

  const localeTag = getDeviceLocaleTag();
  const tagRegionCode = localeTag.split("-")[1]?.toUpperCase();

  if (tagRegionCode) {
    return tagRegionCode;
  }

  return APP_LANGUAGE_TO_LOCALE[DEFAULT_LANGUAGE].split("-")[1] ?? "GB";
}
