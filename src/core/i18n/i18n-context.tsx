import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { TLocale, TTranslationKey, getLocale, setLocale, translateWithLocale } from './i18n';

type TI18nContextValue = {
  locale: TLocale;
  setLocale: (locale: TLocale) => void;
  t: (key: TTranslationKey, params?: Record<string, string | number>) => string;
};

const I18nContext = createContext<TI18nContextValue | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<TLocale>(getLocale());

  const handleSetLocale = useCallback((nextLocale: TLocale) => {
    setLocale(nextLocale);
    setLocaleState(nextLocale);
  }, []);

  const t = useCallback(
    (key: TTranslationKey, params?: Record<string, string | number>) =>
      translateWithLocale(locale, key, params),
    [locale]
  );

  const value = useMemo(
    () => ({
      locale,
      setLocale: handleSetLocale,
      t,
    }),
    [locale, handleSetLocale, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
};
