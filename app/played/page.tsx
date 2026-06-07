"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type PlayedQuestion = {
  en: string;
  ja: string;
};

export default function PlayedPage() {
  const router = useRouter();
  // 初期値としてlocalStorageから出題リストを読み込む
  const [questions] = useState<PlayedQuestion[]>(() => {
    try {
      const raw = localStorage.getItem("bitfun_played");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-950 dark:to-gray-900 px-4 py-8 sm:p-8 pb-24">
      <div className="max-w-lg mx-auto">

        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors flex items-center gap-1"
          >
            ← 戻る
          </button>
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            📋 出題された問題一覧（{questions.length}問）
          </h1>
          <div className="w-12" />
        </div>

        {/* 問題リスト */}
        {questions.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">📭</p>
            <p>データがありません</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {questions.map((q, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm px-4 py-3"
              >
                <div className="flex items-start gap-3">
                  {/* 連番 */}
                  <span className="text-xs font-bold text-gray-400 dark:text-gray-500 w-6 shrink-0 pt-0.5">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-mono text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                      {q.en}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      {q.ja}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
