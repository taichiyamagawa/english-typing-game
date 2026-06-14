"use client";

import { useRouter } from "next/navigation";
import { Space_Grotesk, Lora } from "next/font/google";
import { allArticles } from "@/content/articles/index";
import { useLanguage } from "@/components/LanguageContext";

// ゲームタイトル用フォント
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["700"] });
// 記事タイトル用セリフ体フォント
const lora = Lora({ subsets: ["latin"], weight: ["600"] });

export default function PortalPage() {
  const router = useRouter();
  const { t, lang } = useLanguage();

  // 最新記事を取得し、メイン1枚とサブ2枚に分ける
  const latestArticles = allArticles.slice(0, 3);
  const mainArticle = latestArticles[0];
  const subArticles = latestArticles.slice(1, 3);

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
        </div>

        {/* ゲームヒーローカード */}
        <button
          onClick={() => router.push("/typing-game")}
          className="w-full text-left bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl p-7 sm:p-8 mb-10 shadow-lg shadow-orange-200 dark:shadow-orange-900/40 hover:shadow-xl hover:scale-[1.01] transition-all group"
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

        {/* 記事セクション */}
        <section>
          <h2 className="text-sm font-bold text-orange-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-1.5 h-3.5 bg-orange-400 rounded-full inline-block" />
            {t.latestArticles}
          </h2>

          {/* B案グリッド：左にメイン1枚（大）、右にサブ2枚（縦積み） */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">

            {/* メイン記事（最新・左・大） */}
            {mainArticle && (
              <button
                onClick={() => router.push(`/articles/${mainArticle.slug}`)}
                className="sm:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all text-left group overflow-hidden flex flex-col"
              >
                <div className="p-5 flex-1 flex flex-col">
                  <span className="inline-block text-xs font-bold text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded-full mb-2 w-fit">
                    {lang === "ja" ? "最新" : "New"}
                  </span>
                  <p className={`${lora.className} text-lg font-semibold text-gray-800 dark:text-gray-100 leading-snug mb-1.5`}>
                    {mainArticle.title}
                  </p>
                  {/* 英語モードでは日本語タイトルを非表示 */}
                  {lang === "ja" && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      {mainArticle.titleJa}
                    </p>
                  )}
                  <div className="relative h-28 overflow-hidden">
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-2 line-clamp-2">
                      {mainArticle.sections.find((s) => s.type === "paragraph")?.en}
                    </p>
                    {/* 英語モードでは日本語訳を非表示 */}
                    {lang === "ja" && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
                        {mainArticle.sections.find((s) => s.type === "paragraph")?.ja}
                      </p>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-gray-800 to-transparent" />
                  </div>
                </div>
              </button>
            )}

            {/* サブ記事2枚（右・縦積み） */}
            <div className="flex flex-col gap-3">
              {subArticles.map((article) => (
                <button
                  key={article.slug}
                  onClick={() => router.push(`/articles/${article.slug}`)}
                  className="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all text-left group overflow-hidden flex flex-col"
                >
                  <div className="p-4 flex-1">
                    <p className={`${lora.className} text-base font-semibold text-gray-800 dark:text-gray-100 leading-snug mb-1`}>
                      {article.title}
                    </p>
                    {lang === "ja" && (
                      <p className="text-sm text-gray-400 dark:text-gray-500 leading-snug">
                        {article.titleJa}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 記事一覧ボタン */}
          <button
            onClick={() => router.push("/articles")}
            className="w-full py-3 rounded-2xl border-2 border-orange-300 dark:border-orange-700 text-orange-500 dark:text-orange-400 text-sm font-medium bg-white dark:bg-gray-800 hover:bg-orange-50 dark:hover:bg-orange-900/20 shadow-sm transition-all"
          >
            {t.viewAllArticles}
          </button>
        </section>

      </div>
    </div>
  );
}
