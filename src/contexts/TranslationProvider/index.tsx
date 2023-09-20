import { Dispatch, SetStateAction, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AllLanguage, i18n } from './i18n';

export const TranslationContext = createContext<{
  lang: AllLanguage;
  setLang: Dispatch<SetStateAction<AllLanguage>>;
  t: (key: string) => string;
}>({
  lang: 'en',
  setLang: () => {},
  t: (key: string) => key,
});

export const TranslationProvider = ({
  lang: forceLang,
  children,
}: {
  lang?: AllLanguage;
  children: React.ReactNode;
}) => {
  const [lang, setLang] = useState<AllLanguage>('en');

  useEffect(() => {
    if (forceLang) {
      setLang(forceLang);
    }
  }, [forceLang]);

  const t = useCallback(
    (key: string) => {
      if (lang === 'en') {
        return key;
      }

      const found = i18n[key] && i18n[key][lang];
      return found ? found : 'not found';
    },
    [lang],
  );

  return (
    <TranslationContext.Provider
      value={{
        lang,
        setLang,
        t,
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const props = useContext(TranslationContext);
  return props;
};
