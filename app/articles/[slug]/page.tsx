"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Lora, Noto_Serif_JP } from "next/font/google";
import { getArticleBySlug } from "@/content/articles/index";
import { ArticleSection } from "@/types/article";
import WordTooltip from "@/components/WordTooltip";
import { speak, stopSpeaking } from "@/lib/speech";
import { useLanguage } from "@/components/LanguageContext";

// 記事の見出し・タイトル用セリフ体フォント（英文の読み物らしさを出す）
const lora = Lora({ subsets: ["latin"], weight: ["400", "600", "700"] });
const notoSerifJP = Noto_Serif_JP({ weight: ["400", "600"], preload: false });

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t, lang } = useLanguage();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const article = getArticleBySlug(slug);

  // 日本語訳の表示状態（hydrationエラー対策でfalse固定スタート、useEffectで確定させる）
  const [showJa, setShowJa] = useState(false);
  // 読み上げ中かどうかを管理する
  const [isSpeaking, setIsSpeaking] = useState(false);

  // langが確定したタイミングで、日本語モードなら翻訳を表示する
  useEffect(() => {
    setShowJa(lang === "ja");
  }, [lang]);

  // ページを離れるときに読み上げを停止する
  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  // 記事の英語テキストを全て連結して読み上げる
  const handleSpeak = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }
    if (!article) return;
    // タイトルと全セクションを読む。各テキストの末尾にピリオドがなければ付けて自然な間を作る
    const allTexts = [article.title, ...article.sections.map((s) => s.en)];
    const fullText = allTexts
      .map((t) => /[.?!]$/.test(t.trim()) ? t.trim() : t.trim() + ".")
      .join(" ");
    setIsSpeaking(true);
    speak(fullText, () => setIsSpeaking(false));
  };

  // 記事が見つからない場合
  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-950 dark:to-gray-900">
        <div className="text-center text-gray-400">
          <p className="text-4xl mb-3">📭</p>
          <p>記事が見つかりませんでした。</p>
          <button onClick={() => router.push("/articles")} className="mt-4 text-orange-500 underline text-sm">
            記事一覧へ戻る
          </button>
        </div>
      </div>
    );
  }

  // bgPatternに応じてスタイルを切り替える（space = 宇宙テーマの暗い背景）
  const isSpace = article.bgPattern === "space";
  const bgClass = isSpace
    ? "min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-indigo-950 px-4 py-10 sm:px-8 sm:py-12 pb-24"
    : "min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-950 dark:to-gray-900 px-4 py-10 sm:px-8 sm:py-12 pb-24";

  return (
    <div className={bgClass}>
      <div className="max-w-2xl mx-auto">

        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={() => router.push("/articles")}
            className={`text-sm transition-colors flex items-center gap-1.5 font-medium ${
              isSpace
                ? "text-gray-400 hover:text-gray-200"
                : "text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-200"
            }`}
          >
            {t.articleList}
          </button>
          {/* 読み上げボタン・日本語訳トグル */}
          <div className="flex items-center gap-3">
            {/* 読み上げ開始・停止ボタン */}
            <button
              onClick={handleSpeak}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
                isSpeaking
                  ? "bg-orange-500 text-white border-orange-500"
                  : isSpace
                    ? "bg-gray-800/60 text-gray-300 border-gray-600 hover:border-orange-400"
                    : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-orange-300"
              }`}
            >
              <span>{isSpeaking ? "⏹" : "🔊"}</span>
              <span>{isSpeaking ? t.stop : t.readAloud}</span>
            </button>

            {/* 英語モードでは日本語訳トグルを非表示 */}
            {lang === "ja" && (
            <div className="flex items-center gap-2">
              <span className={`text-xs ${isSpace ? "text-gray-400" : "text-gray-400 dark:text-gray-500"}`}>{t.jaToggle}</span>
              <button
                onClick={() => setShowJa(!showJa)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                  showJa ? "bg-orange-500" : isSpace ? "bg-gray-600" : "bg-gray-200 dark:bg-gray-600"
                }`}
                aria-label="日本語訳を切り替える"
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                  showJa ? "translate-x-6" : "translate-x-1"
                }`} />
              </button>
            </div>
            )}
          </div>
        </div>

        {/* 記事本文 */}
        <article className={`rounded-2xl shadow-md px-7 py-10 sm:px-10 sm:py-12 mb-6 ${
          isSpace ? "bg-gray-900/70 backdrop-blur-sm border border-gray-700/50" : "bg-white dark:bg-gray-800"
        }`}>

          {/* カテゴリタグ + 日付 */}
          <div className="flex items-center gap-2.5 mb-6">
            <span className="text-2xl">{article.emoji}</span>
            <span className={`text-xs font-semibold tracking-wide uppercase text-orange-500 px-2.5 py-1 rounded-full ${
              isSpace ? "bg-orange-900/30" : "bg-orange-50 dark:bg-orange-900/20"
            }`}>
              {lang === "en" ? (t[`cat_${article.category}` as keyof typeof t] as string ?? article.category) : article.categoryJa}
            </span>
            <span className={`text-xs ml-auto ${isSpace ? "text-gray-500" : "text-gray-400"}`}>{article.date}</span>
          </div>

          {/* タイトル（Loraセリフ体） */}
          <h1 className={`${lora.className} text-2xl sm:text-3xl font-bold leading-snug mb-2 ${
            isSpace ? "text-gray-100" : "text-gray-800 dark:text-gray-100"
          }`}>
            {article.title}
          </h1>
          {showJa && (
            <p className={`${notoSerifJP.className} text-base mb-8 ${isSpace ? "text-gray-400" : "text-gray-500 dark:text-gray-400"}`}>
              {article.titleJa}
            </p>
          )}

          {/* タイトル下の区切り線 */}
          <div className={`h-px mb-8 ${showJa ? "" : "mt-6"} ${
            isSpace ? "bg-gray-700" : "bg-gray-100 dark:bg-gray-700"
          }`} />

          {/* 本文セクション */}
          <div className="space-y-5">
            {article.sections.map((section: ArticleSection, i: number) => (
              <SectionBlock key={i} section={section} showJa={showJa} isSpace={isSpace} lora={lora.className} notoSerifJP={notoSerifJP.className} />
            ))}
          </div>
        </article>

      </div>
    </div>
  );
}

// セクションの種類に応じてレンダリングを切り替えるコンポーネント
function SectionBlock({
  section,
  showJa,
  isSpace,
  lora,
  notoSerifJP,
}: {
  section: ArticleSection;
  showJa: boolean;
  isSpace: boolean;
  lora: string;
  notoSerifJP: string;
}) {
  switch (section.type) {
    case "heading":
      return (
        <div className="pt-4">
          <h2 className={`${lora} text-xl font-semibold leading-snug ${
            isSpace ? "text-gray-100" : "text-gray-800 dark:text-gray-100"
          }`}>
            <WordTooltip text={section.en} />
          </h2>
          {showJa && (
            <p className={`${notoSerifJP} text-sm mt-1 ${isSpace ? "text-gray-400" : "text-gray-500 dark:text-gray-400"}`}>
              {section.ja}
            </p>
          )}
        </div>
      );
    case "quote":
      return (
        <div className={`border-l-4 border-orange-400 pl-5 py-1 my-4 ${
          isSpace ? "bg-orange-900/10" : "bg-orange-50/60 dark:bg-orange-900/10"
        } rounded-r-lg`}>
          <p className={`${lora} text-lg italic leading-relaxed ${
            isSpace ? "text-gray-300" : "text-gray-700 dark:text-gray-300"
          }`}>
            <WordTooltip text={section.en} />
          </p>
          {showJa && (
            <p className={`${notoSerifJP} text-sm mt-2 ${isSpace ? "text-gray-400" : "text-gray-500 dark:text-gray-400"}`}>
              {section.ja}
            </p>
          )}
        </div>
      );
    default:
      return (
        <div>
          <p className={`text-lg leading-loose ${
            isSpace ? "text-gray-200" : "text-gray-700 dark:text-gray-200"
          }`}>
            <WordTooltip text={section.en} />
          </p>
          {showJa && (
            <p className={`${notoSerifJP} text-sm leading-relaxed mt-1.5 ${
              isSpace ? "text-gray-400" : "text-gray-500 dark:text-gray-400"
            }`}>
              {section.ja}
            </p>
          )}
        </div>
      );
  }
}
