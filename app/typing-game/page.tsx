"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SoundToggle from "@/components/SoundToggle";
import { Space_Grotesk } from "next/font/google";
import { useLanguage } from "@/components/LanguageContext";

// タイトル用フォント（モジュールレベルで初期化する）
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["700"] });

// ゲームモードの型定義
type Mode = "time" | "free";
type MainCategory = "trivia_short" | "trivia_long" | "phrase" | "word";

export default function TypingGamePage() {
  const [selectedMode, setSelectedMode] = useState<Mode>("time");
  const [selectedMain, setSelectedMain] = useState<MainCategory>("trivia_short");
  const router = useRouter();
  const { t } = useLanguage();

  // 言語に応じたモード・カテゴリ選択肢を生成する
  const MODES = [
    { value: "time" as Mode, label: t.mode_time_label, description: t.mode_time_desc, icon: "⏱" },
    { value: "free" as Mode, label: t.mode_free_label, description: t.mode_free_desc, icon: "📖" },
  ];
  const MAIN_CATEGORIES = [
    { value: "trivia_short" as MainCategory, label: t.cat_trivia_short_label, description: t.cat_trivia_short_desc, icon: "💡" },
    { value: "trivia_long"  as MainCategory, label: t.cat_trivia_long_label,  description: t.cat_trivia_long_desc,  icon: "📚" },
    { value: "phrase"       as MainCategory, label: t.cat_phrase_label,       description: t.cat_phrase_desc,       icon: "💬" },
    { value: "word"         as MainCategory, label: t.cat_word_label,         description: t.cat_word_desc,         icon: "✏️" },
  ];

  const handleStart = () => {
    router.push(`/game?mode=${selectedMode}&category=${selectedMain}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-950 dark:to-gray-900 px-4 py-8 sm:p-8 pb-24">
      <SoundToggle />

      {/* 右上のナビゲーションリンク */}
      <div className="absolute top-6 right-52 sm:right-56 flex items-center gap-2">
        <button
          onClick={() => router.push("/questions")}
          className="text-sm text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 font-medium transition-colors flex items-center gap-1 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <span>🗂️</span>
          <span className="hidden sm:inline">{t.questions}</span>
        </button>
        <button
          onClick={() => router.push("/history")}
          className="text-sm text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 font-medium transition-colors flex items-center gap-1 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <span>🏆</span>
          <span className="hidden sm:inline">{t.scores}</span>
        </button>
      </div>

      {/* タイトルエリア */}
      <div className="text-center mb-8">
        <h1 className={`${spaceGrotesk.className} text-4xl font-bold text-gray-800 dark:text-gray-100 tracking-tight mb-3`}>
          English Typing Game
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-base font-medium">
          {t.tagline}
        </p>
      </div>

      <div className="w-full max-w-lg flex flex-col gap-6">

        {/* モード選択 */}
        <section>
          <h2 className="text-base font-bold text-gray-700 dark:text-gray-200 mb-3 pl-1 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-orange-400 rounded-full inline-block" />
            {t.modeLabel}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {MODES.map((mode) => {
              const isSelected = selectedMode === mode.value;
              return (
                <button
                  key={mode.value}
                  onClick={() => setSelectedMode(mode.value)}
                  className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-200 overflow-hidden ${
                    isSelected
                      ? "border-orange-400 bg-white dark:bg-gray-800 shadow-md shadow-orange-100 dark:shadow-orange-900/20 scale-[1.02]"
                      : "border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-orange-200 hover:shadow-sm"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-amber-400 opacity-5 dark:opacity-10" />
                  )}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{mode.icon}</span>
                    <p className={`font-bold text-sm ${isSelected ? "text-orange-500 dark:text-orange-400" : "text-gray-700 dark:text-gray-200"}`}>
                      {mode.label}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 leading-snug">{mode.description}</p>
                  {isSelected && (
                    <span className="absolute top-3 right-3 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* カテゴリ選択：2列グリッド */}
        <section>
          <h2 className="text-base font-bold text-gray-700 dark:text-gray-200 mb-3 pl-1 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-orange-400 rounded-full inline-block" />
            {t.categoryLabel}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {MAIN_CATEGORIES.map((cat) => {
              const isSelected = selectedMain === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => {
                    if (cat.value === "word") {
                      router.push(`/word-select?mode=${selectedMode}`);
                    } else if (cat.value === "phrase") {
                      router.push(`/phrase-select?mode=${selectedMode}`);
                    } else {
                      setSelectedMain(cat.value);
                    }
                  }}
                  className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-200 overflow-hidden ${
                    isSelected
                      ? "border-orange-400 bg-white dark:bg-gray-800 shadow-md shadow-orange-100 dark:shadow-orange-900/20 scale-[1.02]"
                      : "border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-orange-200 hover:shadow-sm"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-amber-400 opacity-5 dark:opacity-10" />
                  )}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{cat.icon}</span>
                    <p className={`font-bold text-sm ${isSelected ? "text-orange-500 dark:text-orange-400" : "text-gray-700 dark:text-gray-200"}`}>
                      {cat.label}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 leading-snug">{cat.description}</p>
                  {isSelected && (
                    <span className="absolute top-3 right-3 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* スタートボタン */}
        <button
          onClick={handleStart}
          className="w-full py-4 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold text-lg rounded-2xl shadow-md shadow-orange-200 dark:shadow-orange-900/30 hover:shadow-lg transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
        >
          START →
        </button>
      </div>
    </div>
  );
}
