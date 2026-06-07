"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

// 英文サブカテゴリの定義（全カテゴリ＋12時制＋付加疑問文＋受動態＝16アイテム・4×4グリッド）
const PHRASE_SUB_CATEGORIES = [
  { value: "phrase_all",                        label: "全カテゴリ",       icon: "📝" },
  { value: "phrase_daily",                      label: "日常\nフレーズ",   icon: "💬" },
  { value: "phrase_present_simple",             label: "現在形",           icon: "📌" },
  { value: "phrase_present_continuous",         label: "現在進行形",       icon: "🏃" },
  { value: "phrase_present_perfect",            label: "現在完了形",       icon: "✅" },
  { value: "phrase_present_perfect_continuous", label: "現在完了\n進行形", icon: "🔄" },
  { value: "phrase_past_simple",                label: "過去形",           icon: "📅" },
  { value: "phrase_past_continuous",            label: "過去進行形",       icon: "🕰️" },
  { value: "phrase_past_perfect",               label: "過去完了形",       icon: "📜" },
  { value: "phrase_past_perfect_continuous",    label: "過去完了\n進行形", icon: "⌛" },
  { value: "phrase_future_simple",              label: "未来形",           icon: "🔮" },
  { value: "phrase_future_continuous",          label: "未来進行形",       icon: "🚀" },
  { value: "phrase_future_perfect",             label: "未来完了形",       icon: "🏁" },
  { value: "phrase_future_perfect_continuous",  label: "未来完了\n進行形", icon: "⏳" },
  { value: "phrase_tag",                        label: "付加疑問文",       icon: "❓" },
  { value: "phrase_passive",                    label: "受動態",           icon: "🎯" },
  { value: "phrase_subjunctive",                label: "仮定法",           icon: "💭" },
  { value: "phrase_imperative",                 label: "命令文",           icon: "👉" },
  { value: "phrase_infinitive",                 label: "不定詞",           icon: "🔗" },
  { value: "phrase_gerund",                     label: "動名詞",           icon: "🏷️" },
];

function PhraseSelectContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const mode = searchParams.get("mode") ?? "time";
  const modeLabel = mode === "time" ? "⏱ タイムモード" : "📖 フリーモード";

  // 選択中のサブカテゴリ（初期値：全カテゴリ）
  const [selectedSub, setSelectedSub] = useState("phrase_all");

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
            💬 英文
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            カテゴリを選んでください
          </p>
        </div>

        {/* 5×4グリッド（スマホは2列・PC以上は5列） */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {PHRASE_SUB_CATEGORIES.map((sub) => {
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

export default function PhraseSelectPage() {
  return (
    <Suspense>
      <PhraseSelectContent />
    </Suspense>
  );
}
