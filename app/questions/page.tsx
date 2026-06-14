"use client";

import { useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import SoundToggle from "@/components/SoundToggle";
import { getQuestions, Question } from "@/data/index";
import { getBookmarks, toggleBookmark } from "@/lib/bookmarks";
import { speak, stopSpeaking } from "@/lib/speech";
import { getSoundEnabled } from "@/lib/soundPreference";
import { useLanguage } from "@/components/LanguageContext";

export default function QuestionsPage() {
  const router = useRouter();
  const { t, lang } = useLanguage();

  const [activeCategory, setActiveCategory] = useState<string>("trivia_short");
  const [searchWord, setSearchWord] = useState("");
  const [bookmarks, setBookmarks] = useState<Set<string>>(() => getBookmarks());
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [openGroup, setOpenGroup] = useState<"phrase" | "word" | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 英文サブカテゴリ（言語に応じてラベルを切り替え）
  const PHRASE_TABS = [
    { value: "phrase_daily",                      label: `💬 ${t.phrase_daily.replace(/\n/g, " ")}` },
    { value: "phrase_present_simple",             label: `📌 ${t.phrase_present_simple.replace(/\n/g, " ")}` },
    { value: "phrase_present_continuous",         label: `🏃 ${t.phrase_present_continuous.replace(/\n/g, " ")}` },
    { value: "phrase_present_perfect",            label: `✅ ${t.phrase_present_perfect.replace(/\n/g, " ")}` },
    { value: "phrase_present_perfect_continuous", label: `🔄 ${t.phrase_present_perfect_continuous.replace(/\n/g, " ")}` },
    { value: "phrase_past_simple",                label: `📅 ${t.phrase_past_simple.replace(/\n/g, " ")}` },
    { value: "phrase_past_continuous",            label: `🕰️ ${t.phrase_past_continuous.replace(/\n/g, " ")}` },
    { value: "phrase_past_perfect",               label: `📜 ${t.phrase_past_perfect.replace(/\n/g, " ")}` },
    { value: "phrase_past_perfect_continuous",    label: `⌛ ${t.phrase_past_perfect_continuous.replace(/\n/g, " ")}` },
    { value: "phrase_future_simple",              label: `🔮 ${t.phrase_future_simple.replace(/\n/g, " ")}` },
    { value: "phrase_future_continuous",          label: `🚀 ${t.phrase_future_continuous.replace(/\n/g, " ")}` },
    { value: "phrase_future_perfect",             label: `🏁 ${t.phrase_future_perfect.replace(/\n/g, " ")}` },
    { value: "phrase_future_perfect_continuous",  label: `⏳ ${t.phrase_future_perfect_continuous.replace(/\n/g, " ")}` },
    { value: "phrase_tag",                        label: `❓ ${t.phrase_tag.replace(/\n/g, " ")}` },
    { value: "phrase_passive",                    label: `🎯 ${t.phrase_passive.replace(/\n/g, " ")}` },
    { value: "phrase_subjunctive",                label: `💭 ${t.phrase_subjunctive.replace(/\n/g, " ")}` },
    { value: "phrase_imperative",                 label: `👉 ${t.phrase_imperative.replace(/\n/g, " ")}` },
    { value: "phrase_infinitive",                 label: `🔗 ${t.phrase_infinitive.replace(/\n/g, " ")}` },
    { value: "phrase_gerund",                     label: `🏷️ ${t.phrase_gerund.replace(/\n/g, " ")}` },
  ];

  const WORD_TABS = [
    { value: "word_biology",       label: `🦋 ${t.word_biology}` },
    { value: "word_nature",        label: `🌿 ${t.word_nature}` },
    { value: "word_weather_space", label: `🌌 ${t.word_weather_space.replace(/\n/g, " ")}` },
    { value: "word_food",          label: `🍎 ${t.word_food}` },
    { value: "word_lifestyle",     label: `🏡 ${t.word_lifestyle}` },
    { value: "word_health",        label: `💪 ${t.word_health}` },
    { value: "word_emotion",       label: `😊 ${t.word_emotion}` },
    { value: "word_work",          label: `💼 ${t.word_work}` },
    { value: "word_technology",    label: `📱 ${t.word_technology}` },
    { value: "word_travel",        label: `✈️ ${t.word_travel.replace(/\n/g, " ")}` },
    { value: "word_culture",       label: `🎨 ${t.word_culture}` },
    { value: "word_education",     label: `🏫 ${t.word_education}` },
    { value: "word_society",       label: `🌐 ${t.word_society}` },
    { value: "word_property",      label: `🔷 ${t.word_property.replace(/\n/g, " ")}` },
    { value: "word_other",         label: `📦 ${t.word_other}` },
  ];

  const handleMouseEnter = (group: "phrase" | "word") => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenGroup(group);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setOpenGroup(null), 150);
  };

  const handleSelectCategory = (value: string) => {
    setActiveCategory(value);
    setSearchWord("");
    setOpenGroup(null);
  };

  const currentTabQuestions = useMemo(() => {
    if (activeCategory === "bookmark") return [];
    return getQuestions(activeCategory);
  }, [activeCategory]);

  const allBookmarkableQuestions = useMemo(() => [
    ...getQuestions("trivia_short"),
    ...getQuestions("trivia_long"),
    ...getQuestions("phrase_all"),
    ...getQuestions("word_all"),
  ], []);

  const displayQuestions = useMemo(() => {
    const base = activeCategory === "bookmark"
      ? allBookmarkableQuestions.filter((q) => bookmarks.has(q.id))
      : currentTabQuestions;

    if (!searchWord.trim()) return base;

    const word = searchWord.trim().toLowerCase();
    return base.filter((q, i) => {
      const num = String(i + 1);
      return (
        num.includes(word) ||
        q.en.toLowerCase().includes(word) ||
        q.ja.includes(searchWord.trim())
      );
    });
  }, [activeCategory, searchWord, bookmarks, currentTabQuestions, allBookmarkableQuestions]);

  const handleToggleBookmark = (id: string) => {
    const next = toggleBookmark(id);
    setBookmarks(new Set(next));
  };

  const handlePractice = (question: Question) => {
    if (activeCategory === "bookmark") {
      router.replace(`/game?mode=free&category=${question.category}&startId=${question.id}&source=bookmark`);
    } else {
      router.replace(`/game?mode=free&category=${question.category}&startId=${question.id}`);
    }
  };

  const getNumber = (question: Question): number => {
    if (activeCategory === "bookmark") return 0;
    return currentTabQuestions.findIndex((q) => q.id === question.id) + 1;
  };

  const tabClass = (isActive: boolean) =>
    `px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
      isActive
        ? "bg-orange-500 text-white"
        : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
    }`;

  const subTabClass = (isActive: boolean) =>
    `px-2 py-1.5 rounded-xl text-xs font-bold text-left transition-all ${
      isActive
        ? "bg-orange-500 text-white"
        : "text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-500"
    }`;

  const isPhraseActive = activeCategory.startsWith("phrase_");
  const isWordActive   = activeCategory.startsWith("word_");

  const noResultMsg = activeCategory === "bookmark"
    ? (lang === "en" ? "No bookmarked questions." : "ブックマークした問題がありません")
    : (lang === "en" ? "No questions found." : "該当する問題が見つかりませんでした");

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-950 dark:to-gray-900 pb-24">
      <SoundToggle />

      {/* ヘッダー */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.push("/")}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors flex items-center gap-1"
            >
              {t.back}
            </button>
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              🗂️ {t.questions}
            </h1>
            <div className="w-12" />
          </div>

          {/* 検索欄 */}
          <input
            type="text"
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
            placeholder={lang === "en" ? "Search by number or text..." : "番号・英語・日本語で検索..."}
            className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-300 dark:focus:ring-orange-700 transition-all mb-4"
          />

          {/* メインカテゴリタブ */}
          <div className="flex gap-2 pb-1">

            {/* ブックマーク */}
            <button onClick={() => handleSelectCategory("bookmark")} className={tabClass(activeCategory === "bookmark")}>
              ⭐ {lang === "en" ? "Saved" : "ブックマーク"}
            </button>

            {/* 雑学（短文） */}
            <button onClick={() => handleSelectCategory("trivia_short")} className={tabClass(activeCategory === "trivia_short")}>
              💡 {t.cat_trivia_short_label}
            </button>

            {/* 雑学（長文） */}
            <button onClick={() => handleSelectCategory("trivia_long")} className={tabClass(activeCategory === "trivia_long")}>
              📚 {t.cat_trivia_long_label}
            </button>

            {/* 英文▾ プルダウン */}
            <div className="relative" onMouseEnter={() => handleMouseEnter("phrase")} onMouseLeave={handleMouseLeave}>
              <button onClick={() => setOpenGroup(openGroup === "phrase" ? null : "phrase")} className={tabClass(isPhraseActive)}>
                💬 {t.cat_phrase_label} ▾
              </button>
              {openGroup === "phrase" && (
                <div className="absolute top-full left-0 z-30 mt-1 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-2 grid grid-cols-2 gap-1 w-64">
                  {PHRASE_TABS.map((tab) => (
                    <button key={tab.value} onClick={() => handleSelectCategory(tab.value)} className={subTabClass(activeCategory === tab.value)}>
                      {tab.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 単語▾ プルダウン */}
            <div className="relative" onMouseEnter={() => handleMouseEnter("word")} onMouseLeave={handleMouseLeave}>
              <button onClick={() => setOpenGroup(openGroup === "word" ? null : "word")} className={tabClass(isWordActive)}>
                ✏️ {t.cat_word_label} ▾
              </button>
              {openGroup === "word" && (
                <div className="absolute top-full left-0 z-30 mt-1 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-2 grid grid-cols-2 gap-1 w-60">
                  {WORD_TABS.map((tab) => (
                    <button key={tab.value} onClick={() => handleSelectCategory(tab.value)} className={subTabClass(activeCategory === tab.value)}>
                      {tab.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* 問題リスト */}
      <div className="max-w-2xl mx-auto px-6 pt-4">

        {/* 件数表示 */}
        <p className="text-xs text-gray-400 mb-3">
          {displayQuestions.length}{lang === "en" ? " questions" : "件"}
          {searchWord && (lang === "en" ? ` — "${searchWord}"` : ` (「${searchWord}」で絞り込み中)`)}
        </p>

        {displayQuestions.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🔍</p>
            <p>{noResultMsg}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {displayQuestions.map((question) => {
              const num = getNumber(question);
              const isBookmarked = bookmarks.has(question.id);
              return (
                <div key={question.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4">
                  <div className="flex items-start gap-3">
                    {activeCategory !== "bookmark" && (
                      <span className="text-xs font-bold text-gray-400 dark:text-gray-500 w-6 shrink-0 pt-0.5">
                        {num}
                      </span>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-sm text-gray-700 dark:text-gray-200 leading-relaxed mb-1">
                        {question.en}
                      </p>
                      {/* 英語モードでは日本語訳を非表示 */}
                      {lang === "ja" && (
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {question.ja}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          if (!getSoundEnabled()) return;
                          if (speakingId === question.id) {
                            stopSpeaking();
                            setSpeakingId(null);
                          } else {
                            stopSpeaking();
                            setSpeakingId(question.id);
                            speak(question.en, () => setSpeakingId(null));
                          }
                        }}
                        className={`text-base transition-all ${
                          speakingId === question.id ? "text-orange-400" : "text-gray-300 hover:text-orange-400"
                        }`}
                        title={t.readAloud}
                      >
                        🔊
                      </button>
                      <button
                        onClick={() => handleToggleBookmark(question.id)}
                        className={`text-lg font-bold transition-all ${
                          isBookmarked ? "text-yellow-400" : "text-gray-300 hover:text-yellow-300"
                        }`}
                      >
                        {isBookmarked ? "★" : "☆"}
                      </button>
                      <button
                        onClick={() => handlePractice(question)}
                        className="text-xs font-bold px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-all"
                      >
                        {lang === "en" ? "Practice" : "練習"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
