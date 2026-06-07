"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Space_Grotesk } from "next/font/google";

// タイトル用フォント（モジュールレベルで初期化する）
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["700"] });

// ゲームモードの型定義
type Mode = "time" | "free";

// メインカテゴリの型定義
type MainCategory = "trivia_short" | "trivia_long" | "phrase" | "word";

// モード選択肢
const MODES: { value: Mode; label: string; description: string; icon: string }[] = [
  { value: "time", label: "タイムモード", description: "120秒からスタート。連続ノーミスで時間を稼ごう！", icon: "⏱" },
  { value: "free", label: "フリーモード", description: "時間制限なし。じっくり正確に打って英語を覚えよう。", icon: "📖" },
];

// メインカテゴリ選択肢
const MAIN_CATEGORIES: { value: MainCategory; label: string; description: string; icon: string }[] = [
  { value: "trivia_short", label: "雑学（短文）",  description: "1文の面白い雑学ネタ",      icon: "💡" },
  { value: "trivia_long",  label: "雑学（長文）",  description: "読み応えのある雑学ネタ",    icon: "📚" },
  { value: "phrase",       label: "英文",          description: "日常フレーズから文法まで幅広く", icon: "💬" },
  { value: "word",         label: "単語",          description: "テーマ別の英単語スペル練習", icon: "✏️" },
];

export default function TopPage() {
  const [selectedMode, setSelectedMode] = useState<Mode>("time");
  const [selectedMain, setSelectedMain] = useState<MainCategory>("trivia_short");
  const router = useRouter();

  const handleStart = () => {
    router.push(`/game?mode=${selectedMode}&category=${selectedMain}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-950 dark:to-gray-900 px-4 py-8 sm:p-8 pb-24">

      {/* 右上のナビゲーションリンク */}
      <div className="absolute top-6 right-4 sm:right-6 flex items-center gap-2">
        <button
          onClick={() => router.push("/questions")}
          className="text-sm text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 font-medium transition-colors flex items-center gap-1 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <span>🗂️</span>
          <span className="hidden sm:inline">問題一覧</span>
        </button>
        <button
          onClick={() => router.push("/history")}
          className="text-sm text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 font-medium transition-colors flex items-center gap-1 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <span>🏆</span>
          <span className="hidden sm:inline">スコア記録</span>
        </button>
      </div>

      {/* 左上のロゴ */}
      <div className="absolute top-6 left-4 sm:left-6 flex items-center gap-2">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 shadow-md shadow-orange-200 dark:shadow-orange-900/30">
          <span className="text-lg">⌨️</span>
        </div>
        <span className="text-xl font-bold tracking-tight">
          <span className="text-gray-800 dark:text-gray-100">Bit</span><span className="text-orange-500">Fun</span>
        </span>
      </div>

      {/* タイトルエリア */}
      <div className="text-center mb-8">
        <h1 className={`${spaceGrotesk.className} text-4xl font-bold text-gray-800 dark:text-gray-100 tracking-tight mb-3`}>
          English Typing Game
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-base font-medium">
          ちょっと楽しく、学習を習慣に！
        </p>
      </div>

      <div className="w-full max-w-lg flex flex-col gap-6">

        {/* モード選択 */}
        <section>
          <h2 className="text-base font-bold text-gray-700 dark:text-gray-200 mb-3 pl-1 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-orange-400 rounded-full inline-block" />
            Mode
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
            Category
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {MAIN_CATEGORIES.map((cat) => {
              const isSelected = selectedMain === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => {
                    if (cat.value === "word") {
                      // 単語は押した瞬間にテーマ選択ページへ遷移する
                      router.push(`/word-select?mode=${selectedMode}`);
                    } else if (cat.value === "phrase") {
                      // 英文は押した瞬間にカテゴリ選択ページへ遷移する
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
