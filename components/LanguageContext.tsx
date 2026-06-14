"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Language, getLanguage, setLanguage } from "@/lib/languagePreference";
import { translations, Translations } from "@/lib/translations";

type LanguageContextType = {
  lang: Language;
  t: Translations;
  toggleLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "ja",
  t: translations.ja,
  toggleLanguage: () => {},
});

// 全ページで言語設定を共有するプロバイダー
export function LanguageProvider({ children }: { children: ReactNode }) {
  // hydrationエラー対策のため、初期値は"ja"固定にしてマウント後に読み込む
  const [lang, setLang] = useState<Language>("ja");

  useEffect(() => {
    setLang(getLanguage());
  }, []);

  const toggleLanguage = () => {
    const next: Language = lang === "ja" ? "en" : "ja";
    setLang(next);
    setLanguage(next);
  };

  return (
    <LanguageContext.Provider value={{ lang, t: translations[lang], toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

// 各コンポーネントで言語設定を使うためのフック
export function useLanguage() {
  return useContext(LanguageContext);
}
