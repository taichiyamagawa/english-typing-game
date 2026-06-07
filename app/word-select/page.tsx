"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

// 単語サブカテゴリの定義（全カテゴリ＋15テーマ＝16アイテム・4×4グリッド）
const WORD_SUB_CATEGORIES = [
  { value: "word_all",           label: "全カテゴリ",      icon: "🌍" },
  { value: "word_biology",       label: "生物",            icon: "🦋" },
  { value: "word_nature",        label: "自然",            icon: "🌿" },
  { value: "word_weather_space", label: "天気・宇宙",       icon: "🌌" },
  { value: "word_food",          label: "食べ物",           icon: "🍎" },
  { value: "word_lifestyle",     label: "暮らし・生活",     icon: "🏡" },
  { value: "word_health",        label: "体・健康",         icon: "💪" },
  { value: "word_emotion",       label: "感情・性格",       icon: "😊" },
  { value: "word_work",          label: "仕事・職業",       icon: "💼" },
  { value: "word_technology",    label: "テクノロジー",     icon: "📱" },
  { value: "word_travel",        label: "旅行・交通\n地理",  icon: "✈️" },
  { value: "word_culture",       label: "趣味・文化",       icon: "🎨" },
  { value: "word_education",     label: "学校・学習",       icon: "🏫" },
  { value: "word_society",       label: "社会・政治",       icon: "🌐" },
  { value: "word_property",      label: "色・形・素材",        icon: "🔷" },
  { value: "word_other",         label: "その他",           icon: "📦" },
];

function WordSelectContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const mode = searchParams.get("mode") ?? "time";
  const modeLabel = mode === "time" ? "⏱ タイムモード" : "📖 フリーモード";

  // 選択中のテーマ（初期値：全カテゴリ）
  const [selectedSub, setSelectedSub] = useState("word_all");

  const handleStart = () => {
    router.push(`/game?mode=${mode}&category=${selectedSub}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-950 dark:to-gray-900 px-4 py-8 sm:p-8 pb-24">
      <div className="max-w-lg mx-auto flex flex-col gap-6">

        {/* ヘッダー */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors flex items-center gap-1"
          >
            ← 戻る
          </button>
          <span className="text-xs text-gray-400 bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow-sm">
            {modeLabel}
          </span>
        </div>

        {/* タイトル */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">
            ✏️ 単語
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            テーマを選んでください
          </p>
        </div>

        {/* 4×4グリッド（スマホは2列・PC以上は4列） */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {WORD_SUB_CATEGORIES.map((sub) => {
            const isSelected = selectedSub === sub.value;
            return (
              <button
                key={sub.value}
                onClick={() => setSelectedSub(sub.value)}
                className={`relative flex flex-col items-center gap-2 p-3 rounded-2xl border-2 text-center transition-all duration-200 overflow-hidden ${
                  isSelected
                    ? "border-orange-400 bg-white dark:bg-gray-800 shadow-md shadow-orange-100 dark:shadow-orange-900/20 scale-[1.02]"
                    : "border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-orange-200 hover:shadow-sm"
                }`}
              >
                {isSelected && (
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-amber-400 opacity-5 dark:opacity-10" />
                )}
                <span className={`flex items-center justify-center w-10 h-10 rounded-xl text-xl ${
                  isSelected ? "bg-orange-100 dark:bg-orange-900/30" : "bg-gray-100 dark:bg-gray-700"
                }`}>
                  {sub.icon}
                </span>
                <p className={`font-bold text-xs leading-snug whitespace-pre-line ${
                  isSelected ? "text-orange-500 dark:text-orange-400" : "text-gray-700 dark:text-gray-200"
                }`}>
                  {sub.label}
                </p>
                {isSelected && (
                  <span className="absolute top-2 right-2 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white" style={{ fontSize: "9px" }}>✓</span>
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* STARTボタン */}
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

export default function WordSelectPage() {
  return (
    <Suspense>
      <WordSelectContent />
    </Suspense>
  );
}
