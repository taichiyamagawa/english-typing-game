"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Space_Grotesk } from "next/font/google";
import { useLanguage } from "@/components/LanguageContext";

// ゲームタイトル用フォント
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["700"] });

export default function PortalPage() {
  const router = useRouter();
  const { t } = useLanguage();
  // モーダルの開閉状態
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-950 dark:to-gray-900 px-4 py-16 sm:py-20 pb-24">
      <div className="max-w-2xl mx-auto">

        {/* キャッチコピー */}
        <div className="text-center mb-8">
          <p className={`${spaceGrotesk.className} text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1`}>
            {t.catchphrase}
          </p>
          <p className="text-base text-gray-400 dark:text-gray-500 tracking-wide">
            {t.tagline}
          </p>
          {/* このサイトについてボタン */}
          <button
            onClick={() => setIsAboutOpen(true)}
            className="mt-3 text-sm text-orange-400 hover:text-orange-500 underline underline-offset-2 transition-colors"
          >
            {t.aboutLabel}
          </button>
        </div>

        {/* ゲームヒーローカード */}
        <button
          onClick={() => router.push("/typing-game")}
          className="w-full text-left bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl p-7 sm:p-8 shadow-lg shadow-orange-200 dark:shadow-orange-900/40 hover:shadow-xl hover:scale-[1.01] transition-all group"
        >
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">⌨️</span>
                <h1 className={`${spaceGrotesk.className} text-4xl font-bold text-white tracking-tight`}>
                  English Typing Game
                </h1>
              </div>
              <p className="text-white/80 text-base pl-14">
                {t.gameDescription}
              </p>
            </div>
            <span className="inline-flex items-center gap-2 bg-white text-orange-500 font-bold text-base px-6 py-3 rounded-full shadow-sm group-hover:shadow-md transition-shadow shrink-0">
              START →
            </span>
          </div>
        </button>

      </div>

      {/* このサイトについてモーダル */}
      {isAboutOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setIsAboutOpen(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg max-h-[80vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* モーダルヘッダー */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-gray-800 dark:text-gray-100">
                {t.aboutTitle}
              </h2>
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setIsAboutOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors text-lg leading-none"
              >
                ✕
              </button>
            </div>
            {/* 本文：各段落を改行付きで表示 */}
            <div className="space-y-4">
              {t.aboutParagraphs.map((para, i) => (
                <p
                  key={i}
                  className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line"
                >
                  {para}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
