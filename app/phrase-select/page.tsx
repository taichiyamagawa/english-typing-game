"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SoundToggle from "@/components/SoundToggle";
import { useLanguage } from "@/components/LanguageContext";

function PhraseSelectContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useLanguage();

  const mode = searchParams.get("mode") ?? "time";
  const modeLabel = mode === "time" ? `⏱ ${t.mode_time_label}` : `📖 ${t.mode_free_label}`;

  // 言語に応じたサブカテゴリ選択肢を生成する
  const PHRASE_SUB_CATEGORIES = [
    { value: "phrase_all",                        label: t.phrase_all,                        icon: "📝" },
    { value: "phrase_daily",                      label: t.phrase_daily,                      icon: "💬" },
    { value: "phrase_present_simple",             label: t.phrase_present_simple,             icon: "📌" },
    { value: "phrase_present_continuous",         label: t.phrase_present_continuous,         icon: "🏃" },
    { value: "phrase_present_perfect",            label: t.phrase_present_perfect,            icon: "✅" },
    { value: "phrase_present_perfect_continuous", label: t.phrase_present_perfect_continuous, icon: "🔄" },
    { value: "phrase_past_simple",                label: t.phrase_past_simple,                icon: "📅" },
    { value: "phrase_past_continuous",            label: t.phrase_past_continuous,            icon: "🕰️" },
    { value: "phrase_past_perfect",               label: t.phrase_past_perfect,               icon: "📜" },
    { value: "phrase_past_perfect_continuous",    label: t.phrase_past_perfect_continuous,    icon: "⌛" },
    { value: "phrase_future_simple",              label: t.phrase_future_simple,              icon: "🔮" },
    { value: "phrase_future_continuous",          label: t.phrase_future_continuous,          icon: "🚀" },
    { value: "phrase_future_perfect",             label: t.phrase_future_perfect,             icon: "🏁" },
    { value: "phrase_future_perfect_continuous",  label: t.phrase_future_perfect_continuous,  icon: "⏳" },
    { value: "phrase_tag",                        label: t.phrase_tag,                        icon: "❓" },
    { value: "phrase_passive",                    label: t.phrase_passive,                    icon: "🎯" },
    { value: "phrase_subjunctive",                label: t.phrase_subjunctive,                icon: "💭" },
    { value: "phrase_imperative",                 label: t.phrase_imperative,                 icon: "👉" },
    { value: "phrase_infinitive",                 label: t.phrase_infinitive,                 icon: "🔗" },
    { value: "phrase_gerund",                     label: t.phrase_gerund,                     icon: "🏷️" },
  ];

  // 選択中のサブカテゴリ（初期値：全カテゴリ）
  const [selectedSub, setSelectedSub] = useState("phrase_all");

  const handleStart = () => {
    router.push(`/game?mode=${mode}&category=${selectedSub}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-950 dark:to-gray-900 px-4 py-8 sm:p-8 pb-24">
      <SoundToggle />
      <div className="max-w-lg mx-auto flex flex-col gap-6">

        {/* ヘッダー */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push("/typing-game")}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors flex items-center gap-1"
          >
            {t.back}
          </button>
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full shadow-sm">
            {modeLabel}
          </span>
        </div>

        {/* サブカテゴリ選択グリッド（5列×4行） */}
        <div className="grid grid-cols-5 gap-2">
          {PHRASE_SUB_CATEGORIES.map((sub) => {
            const isSelected = selectedSub === sub.value;
            return (
              <button
                key={sub.value}
                onClick={() => setSelectedSub(sub.value)}
                className={`relative flex flex-col items-center justify-center gap-1 p-2 rounded-xl border-2 text-center transition-all duration-200 aspect-square ${
                  isSelected
                    ? "border-orange-400 bg-white dark:bg-gray-800 shadow-md scale-[1.05]"
                    : "border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-orange-200"
                }`}
              >
                <span className="text-xl">{sub.icon}</span>
                <p className={`text-[10px] font-medium leading-tight whitespace-pre-line ${
                  isSelected ? "text-orange-500" : "text-gray-600 dark:text-gray-300"
                }`}>
                  {sub.label}
                </p>
                {isSelected && (
                  <span className="absolute top-1 right-1 w-3 h-3 bg-orange-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* スタートボタン */}
        <button
          onClick={handleStart}
          className="w-full py-4 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold text-lg rounded-2xl shadow-md shadow-orange-200 dark:shadow-orange-900/30 hover:shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99]"
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
