"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SoundToggle from "@/components/SoundToggle";
import { GameRecord, OverallBest, getRecords, getOverallBest, getBestForDuration, updateBestForDuration, categoryLabel, categoryLabelEn } from "@/lib/records";
import { useLanguage } from "@/components/LanguageContext";

// 日時を「MM/DD HH:mm」形式に変換する
const formatDate = (iso: string): string => {
  const d = new Date(iso);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${mm}/${dd} ${hh}:${min}`;
};

export default function HistoryPage() {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const durLabel: Record<number, string> = { 30: t.dur30, 60: t.dur60, 120: t.dur120 };
  const catLabel = lang === "en" ? categoryLabelEn : categoryLabel;
  // 初期値としてlocalStorageから読み込み、フリーモードの古い記録を除去して保存し直す
  const [records] = useState<GameRecord[]>(() => {
    const all = getRecords();
    const timeOnly = all.filter((r) => r.mode === "time");
    if (timeOnly.length !== all.length) {
      localStorage.setItem("bitgaku_typing_records", JSON.stringify(timeOnly));
    }
    return timeOnly;
  });
  // 時間別自己ベストを取得する（旧データは2分モードとしてマイグレーション）
  const [bests] = useState<Record<number, OverallBest | null>>(() => {
    const old = getOverallBest();
    if (old && !getBestForDuration(120)) {
      updateBestForDuration(120, old);
    }
    return {
      30:  getBestForDuration(30),
      60:  getBestForDuration(60),
      120: getBestForDuration(120),
    };
  });

  // 新しい順に最大10件表示
  const history = [...records].slice(0, 10);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-950 dark:to-gray-900 p-4 sm:p-8 pb-24">
      <SoundToggle />
      <div className="max-w-2xl mx-auto">

        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push("/")}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors flex items-center gap-1"
          >
            {t.back}
          </button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            🏆 {t.scoreHistory}
          </h1>
          <div className="w-12" />
        </div>

        {/* 自己ベスト（時間別3枠） */}
        <div className="mb-8">
          <h2 className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-orange-400 rounded-full inline-block" />
            {t.personalBest}
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {([30, 60, 120] as const).map((dur) => {
              const best = bests[dur];
              return (
                <div key={dur} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm px-4 py-4">
                  <p className="text-xs text-gray-400 mb-1">{durLabel[dur]}</p>
                  {best ? (
                    <>
                      <p className="text-2xl font-bold text-orange-500 tabular-nums">
                        {best.score}<span className="text-sm font-normal text-gray-500"> {t.charUnit}</span>
                      </p>
                      <div className="text-xs text-gray-400 mt-2 space-y-0.5">
                        <p className="truncate">{catLabel[best.category] ?? best.category}</p>
                        <p>{t.totalChars} <strong className="text-gray-600 dark:text-gray-300">{best.score + best.mistakes}</strong></p>
                        <p>{t.mistakes} <strong className="text-gray-600 dark:text-gray-300">{best.mistakes}</strong></p>
                        <p>{t.accuracy} <strong className="text-gray-600 dark:text-gray-300">{best.accuracy}%</strong></p>
                        <p>{formatDate(best.date)}</p>
                      </div>
                    </>
                  ) : (
                    <p className="text-xl font-bold text-gray-300">ー</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 直近の記録 */}
        <h2 className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-3 flex items-center gap-2">
          <span className="w-1.5 h-4 bg-orange-400 rounded-full inline-block" />
          {t.recentRecords}
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          {t.recentRecordsDesc}
        </p>

        {/* 履歴リスト */}
        {history.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🎮</p>
            <p style={{ whiteSpace: "pre-line" }}>{t.noRecords}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {history.map((record) => (
              <div
                key={record.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm px-4 py-3 flex items-center gap-3"
              >
                <span className="text-lg shrink-0">
                  {record.result === "cleared" ? "✅" : "⏰"}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
                      {catLabel[record.category] ?? record.category}
                    </span>
                    {record.duration && (
                      <span className="text-xs bg-orange-50 dark:bg-orange-900/20 text-orange-400 px-1.5 py-0.5 rounded-full">
                        {durLabel[record.duration] ?? `${record.duration}秒`}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                    <span>{t.correctChars} <strong className="text-gray-600 dark:text-gray-300">{record.typed}</strong></span>
                    <span>{t.totalChars} <strong className="text-gray-600 dark:text-gray-300">{record.typed + record.mistakes}</strong></span>
                    <span>{t.accuracy} <strong className="text-gray-600 dark:text-gray-300">{record.accuracy}%</strong></span>
                    <span>{t.mistakes} <strong className="text-gray-600 dark:text-gray-300">{record.mistakes}</strong></span>
                  </div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">
                  {formatDate(record.date)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
