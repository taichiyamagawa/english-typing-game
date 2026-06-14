"use client";

import { useLanguage } from "@/components/LanguageContext";

// 言語切り替えボタン（右上に固定表示）
export default function LanguageToggle() {
  const { lang, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="fixed top-5 right-5 z-50 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-md hover:scale-105 transition-all bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
      title={lang === "ja" ? "Switch to English" : "日本語に切り替える"}
    >
      <span className={lang === "en" ? "text-orange-500" : "text-gray-400"}>🇬🇧 English</span>
      <span className="text-gray-300 dark:text-gray-600">|</span>
      <span className={lang === "ja" ? "text-orange-500" : "text-gray-400"}>🇯🇵 日本語</span>
    </button>
  );
}
