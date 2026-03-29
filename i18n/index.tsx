import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from "expo-localization";
import {
  createContext,
  ReactNode,
  startTransition,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  AppLanguage,
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  SUPPORTED_LANGUAGES,
  isSupportedLanguage,
  normalizeLanguageTag,
} from "./config";
import { translations, TranslationKey } from "./messages";

type TranslationParams = Record<string, number | string>;

type I18nContextValue = {
  language: AppLanguage;
  languages: typeof SUPPORTED_LANGUAGES;
  setLanguage: (nextLanguage: AppLanguage) => Promise<void>;
  t: (key: TranslationKey, params?: TranslationParams) => string;
};

type I18nController = I18nContextValue & {
  ready: boolean;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function getDeviceLanguage() {
  const deviceLocale = getLocales()[0];

  return normalizeLanguageTag(deviceLocale?.languageCode ?? deviceLocale?.languageTag);
}

function interpolate(template: string, params?: TranslationParams) {
  if (!params) {
    return template;
  }

  return Object.entries(params).reduce((result, [key, value]) => {
    return result.replaceAll(`{{${key}}}`, String(value));
  }, template);
}

export function useI18nController(): I18nController {
  const [language, setLanguageState] = useState<AppLanguage>(DEFAULT_LANGUAGE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const hydrateLanguage = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        const nextLanguage = isSupportedLanguage(storedLanguage)
          ? storedLanguage
          : getDeviceLanguage();

        if (!cancelled) {
          setLanguageState(nextLanguage);
        }
      } catch (error) {
        console.warn("Failed to hydrate app language.", error);
      } finally {
        if (!cancelled) {
          setReady(true);
        }
      }
    };

    hydrateLanguage();

    return () => {
      cancelled = true;
    };
  }, []);

  const setLanguage = async (nextLanguage: AppLanguage) => {
    if (nextLanguage === language) {
      return;
    }

    startTransition(() => {
      setLanguageState(nextLanguage);
    });

    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    } catch (error) {
      console.warn("Failed to persist app language.", error);
    }
  };

  const t = (key: TranslationKey, params?: TranslationParams) => {
    const template = translations[language][key] ?? translations.en[key] ?? key;

    return interpolate(template, params);
  };

  return {
    ready,
    language,
    languages: SUPPORTED_LANGUAGES,
    setLanguage,
    t,
  };
}

export function I18nProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: I18nContextValue;
}) {
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider.");
  }

  return context;
}
