"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Question } from "@/data/index";
import { getBookmarks, toggleBookmark } from "@/lib/bookmarks";
import { speak, stopSpeaking } from "@/lib/speech";
import { getSoundEnabled } from "@/lib/soundPreference";

export default function PlayedPage() {
  const router = useRouter();

  // localStorageから出題リストを読み込む（id・categoryも含む完全なデータ）
  const [questions] = useState<Question[]>(() => {
    try {
      const raw = localStorage.getItem("bitfun_played");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // ブックマーク状態
  const [bookmarks, setBookmarks] = useState<Set<string>>(() => getBookmarks());
  // 読み上げ中の問題ID
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const handleToggleBookmark = (id: string) => {
    const next = toggleBookmark(id);
    setBookmarks(new Set(next));
  };

  // 練習ボタン：replaceで遷移することでplayed画面を履歴に残さない
  const handlePractice = () => {
    router.replace(`/game?mode=free&source=played`);
  };

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

        {/* 練習ボタン */}
        {questions.length > 0 && (
          <button
            onClick={handlePractice}
            className="w-full py-3 mb-4 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold rounded-2xl shadow-md transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            この問題で練習する →
          </button>
        )}

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
                key={q.id ?? i}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm px-4 py-3"
              >
                <div className="flex items-start gap-3">
                  {/* 連番 */}
                  <span className="text-xs font-bold text-gray-400 dark:text-gray-500 w-6 shrink-0 pt-0.5">
                    {i + 1}
                  </span>
                  {/* 問題文 */}
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-sm text-gray-700 dark:text-gray-200 leading-relaxed mb-1">
                      {q.en}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {q.ja}
                    </p>
                  </div>
                  {/* ボタン群 */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* 読み上げボタン */}
                    <button
                      onClick={() => {
                        if (!getSoundEnabled()) return;
                        if (speakingId === q.id) {
                          stopSpeaking();
                          setSpeakingId(null);
                        } else {
                          stopSpeaking();
                          setSpeakingId(q.id);
                          speak(q.en, () => setSpeakingId(null));
                        }
                      }}
                      className={`text-base transition-all ${
                        speakingId === q.id
                          ? "text-orange-400"
                          : "text-gray-300 hover:text-orange-400"
                      }`}
                      title="英文を読み上げる"
                    >
                      🔊
                    </button>
                    {/* ブックマークボタン */}
                    <button
                      onClick={() => handleToggleBookmark(q.id)}
                      className={`text-lg font-bold transition-all ${
                        bookmarks.has(q.id)
                          ? "text-yellow-400"
                          : "text-gray-300 hover:text-yellow-300"
                      }`}
                    >
                      {bookmarks.has(q.id) ? "★" : "☆"}
                    </button>
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
