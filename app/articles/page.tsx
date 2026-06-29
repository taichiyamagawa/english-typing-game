"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lora } from "next/font/google";
import { allArticles } from "@/content/articles/index";
import { useLanguage } from "@/components/LanguageContext";

// 記事詳細ページと同じフォントを使用する
const lora = Lora({ subsets: ["latin"], weight: ["400", "600", "700"] });

export default function ArticlesPage() {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // カテゴリフィルターの選択肢（翻訳対応）
  const CATEGORIES = [
    { value: "all",      label: t.cat_all },
    { value: "science",  label: t.cat_science },
    { value: "biology",  label: t.cat_biology },
    { value: "history",  label: t.cat_history },
    { value: "space",    label: t.cat_space },
    { value: "language", label: t.cat_language },
    { value: "nature",     label: t.cat_nature },
    { value: "food",       label: t.cat_food },
    { value: "game_sport",   label: t.cat_game_sport },
    { value: "architecture", label: t.cat_architecture },
  ];

  // カテゴリと検索ワードで記事を絞り込む
  const filtered = allArticles.filter((a) => {
    const matchesCategory = activeCategory === "all" || a.category === activeCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch = q === "" ||
      a.title.toLowerCase().includes(q) ||
      a.titleJa.includes(q) ||
      a.descriptionJa.includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-950 dark:to-gray-900 px-4 py-10 sm:px-8 sm:py-12 pb-24">
      <div className="max-w-7xl mx-auto">

        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={() => router.push("/")}
            className="text-sm font-medium text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-200 transition-colors flex items-center gap-1.5"
          >
            {t.back}
          </button>
          <h1 className={`${lora.className} text-2xl font-semibold text-gray-800 dark:text-gray-100`}>
            Articles
          </h1>
          <div className="w-12" />
        </div>

        {/* 検索欄 */}
        <div className="relative mb-4">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-orange-400 dark:focus:border-orange-500 transition-colors"
          />
        </div>

        {/* カテゴリフィルター */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat.value
                  ? "bg-orange-500 text-white shadow-sm shadow-orange-200 dark:shadow-orange-900/30"
                  : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 記事一覧 */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-sm">
              {searchQuery.trim() !== "" ? t.noSearchResults(searchQuery) : t.noArticles}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map((article) => {
              // 本文の最初のparagraphを取得する
              const firstParagraph = article.sections.find((s) => s.type === "paragraph");
              return (
                <button
                  key={article.slug}
                  onClick={() => router.push(`/articles/${article.slug}`)}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm text-left hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden flex flex-col p-4"
                >
                  {/* カテゴリラベル */}
                  <span className="text-xs font-semibold tracking-wide uppercase text-orange-500 mb-2">
                    {lang === "ja" ? article.categoryJa : article.category}
                  </span>

                  {/* 英語タイトル */}
                  <p className={`${lora.className} font-semibold text-gray-800 dark:text-gray-100 leading-snug text-sm line-clamp-2 mb-1`}>
                    {article.title}
                  </p>

                  {/* 日本語タイトル */}
                  {lang === "ja" && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug line-clamp-2 mb-2">
                      {article.titleJa}
                    </p>
                  )}

                  {/* 本文冒頭（英語） */}
                  {firstParagraph && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 mt-auto">
                      {firstParagraph.en}
                    </p>
                  )}

                  {/* 本文冒頭（日本語訳） */}
                  {lang === "ja" && firstParagraph && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed line-clamp-2 mt-1">
                      {firstParagraph.ja}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
