"use client";

import { useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { getQuestions, Question } from "@/data/index";
import { getBookmarks, toggleBookmark } from "@/lib/bookmarks";
import { speak, stopSpeaking } from "@/lib/speech";
import { getSoundEnabled } from "@/lib/soundPreference";

// 英文サブカテゴリ（プルダウン内に表示）
const PHRASE_TABS = [
  { value: "phrase_daily",                      label: "💬 日常フレーズ" },
  { value: "phrase_present_simple",             label: "📌 現在形" },
  { value: "phrase_present_continuous",         label: "🏃 現在進行形" },
  { value: "phrase_present_perfect",            label: "✅ 現在完了形" },
  { value: "phrase_present_perfect_continuous", label: "🔄 現在完了進行形" },
  { value: "phrase_past_simple",                label: "📅 過去形" },
  { value: "phrase_past_continuous",            label: "🕰️ 過去進行形" },
  { value: "phrase_past_perfect",               label: "📜 過去完了形" },
  { value: "phrase_past_perfect_continuous",    label: "⌛ 過去完了進行形" },
  { value: "phrase_future_simple",              label: "🔮 未来形" },
  { value: "phrase_future_continuous",          label: "🚀 未来進行形" },
  { value: "phrase_future_perfect",             label: "🏁 未来完了形" },
  { value: "phrase_future_perfect_continuous",  label: "⏳ 未来完了進行形" },
  { value: "phrase_tag",                        label: "❓ 付加疑問文" },
  { value: "phrase_passive",                    label: "🎯 受動態" },
  { value: "phrase_subjunctive",                label: "💭 仮定法" },
  { value: "phrase_imperative",                 label: "👉 命令文" },
  { value: "phrase_infinitive",                 label: "🔗 不定詞" },
  { value: "phrase_gerund",                     label: "🏷️ 動名詞" },
];

// 単語サブカテゴリ（プルダウン内に表示）
const WORD_TABS = [
  { value: "word_biology",       label: "🦋 生物" },
  { value: "word_nature",        label: "🌿 自然" },
  { value: "word_weather_space", label: "🌌 天気・宇宙" },
  { value: "word_food",          label: "🍎 食べ物" },
  { value: "word_lifestyle",     label: "🏡 暮らし・生活" },
  { value: "word_health",        label: "💪 体・健康" },
  { value: "word_emotion",       label: "😊 感情・性格" },
  { value: "word_work",          label: "💼 仕事・職業" },
  { value: "word_technology",    label: "📱 テクノロジー" },
  { value: "word_travel",        label: "✈️ 旅行・交通・地理" },
  { value: "word_culture",       label: "🎨 趣味・文化" },
  { value: "word_education",     label: "🏫 学校・学習" },
  { value: "word_society",       label: "🌐 社会・政治" },
  { value: "word_property",      label: "🔷 色・形・素材" },
  { value: "word_other",         label: "📦 その他" },
];

export default function QuestionsPage() {
  const router = useRouter();

  const [activeCategory, setActiveCategory] = useState<string>("trivia_short");
  const [searchWord, setSearchWord] = useState("");
  const [bookmarks, setBookmarks] = useState<Set<string>>(() => getBookmarks());
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  // どちらのプルダウンが開いているか（PCホバー・スマホクリック共用）
  const [openGroup, setOpenGroup] = useState<"phrase" | "word" | null>(null);
  // マウスが隙間を通過した瞬間に閉じないよう、閉じる処理を少し遅らせるタイマー
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = (group: "phrase" | "word") => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenGroup(group);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setOpenGroup(null), 150);
  };

  // カテゴリを選択してプルダウンを閉じる
  const handleSelectCategory = (value: string) => {
    setActiveCategory(value);
    setSearchWord("");
    setOpenGroup(null);
  };

  // 現在のタブの問題リスト
  const currentTabQuestions = useMemo(() => {
    if (activeCategory === "bookmark") return [];
    return getQuestions(activeCategory);
  }, [activeCategory]);

  // ブックマーク検索用：全カテゴリの問題をまとめる
  const allBookmarkableQuestions = useMemo(() => [
    ...getQuestions("trivia_short"),
    ...getQuestions("trivia_long"),
    ...getQuestions("phrase_all"),
    ...getQuestions("word_all"),
  ], []);

  // 表示する問題リストを計算する（カテゴリ・検索で絞り込み）
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

  // 「練習する」ボタン：フリーモードでその問題から開始
  // router.replace を使うことで、questions ページを履歴に残さず game に遷移する
  // （push だと「戻る→questions→戻る→game」という二重遷移が起きるため）
  const handlePractice = (question: Question) => {
    if (activeCategory === "bookmark") {
      router.replace(`/game?mode=free&category=${question.category}&startId=${question.id}&source=bookmark`);
    } else {
      router.replace(`/game?mode=free&category=${question.category}&startId=${question.id}`);
    }
  };

  // 問題番号を取得する（カテゴリ内での連番）
  const getNumber = (question: Question): number => {
    if (activeCategory === "bookmark") return 0;
    return currentTabQuestions.findIndex((q) => q.id === question.id) + 1;
  };

  // タブボタンのスタイル（アクティブかどうかで切り替え）
  const tabClass = (isActive: boolean) =>
    `px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
      isActive
        ? "bg-orange-500 text-white"
        : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
    }`;

  // プルダウン内のサブカテゴリボタンのスタイル
  const subTabClass = (isActive: boolean) =>
    `px-2 py-1.5 rounded-xl text-xs font-bold text-left transition-all ${
      isActive
        ? "bg-orange-500 text-white"
        : "text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-500"
    }`;

  const isPhraseActive = activeCategory.startsWith("phrase_");
  const isWordActive   = activeCategory.startsWith("word_");

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-950 dark:to-gray-900 pb-24">

      {/* ヘッダー */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.push("/")}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors flex items-center gap-1"
            >
              ← 戻る
            </button>
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              🗂️ 問題一覧
            </h1>
            <div className="w-12" />
          </div>

          {/* 検索欄 */}
          <input
            type="text"
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
            placeholder="番号・英語・日本語で検索..."
            className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-300 dark:focus:ring-orange-700 transition-all mb-4"
          />

          {/* メインカテゴリタブ（5項目 + 英文・単語はプルダウン） */}
          <div className="flex gap-2 pb-1">

            {/* ブックマーク */}
            <button
              onClick={() => handleSelectCategory("bookmark")}
              className={tabClass(activeCategory === "bookmark")}
            >
              ⭐ ブックマーク
            </button>

            {/* 雑学（短文） */}
            <button
              onClick={() => handleSelectCategory("trivia_short")}
              className={tabClass(activeCategory === "trivia_short")}
            >
              💡 雑学（短文）
            </button>

            {/* 雑学（長文） */}
            <button
              onClick={() => handleSelectCategory("trivia_long")}
              className={tabClass(activeCategory === "trivia_long")}
            >
              📚 雑学（長文）
            </button>

            {/* 英文▾ プルダウン */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("phrase")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => setOpenGroup(openGroup === "phrase" ? null : "phrase")}
                className={tabClass(isPhraseActive)}
              >
                💬 英文 ▾
              </button>

              {openGroup === "phrase" && (
                <div className="absolute top-full left-0 z-30 mt-1 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-2 grid grid-cols-2 gap-1 w-64">
                  {PHRASE_TABS.map((tab) => (
                    <button
                      key={tab.value}
                      onClick={() => handleSelectCategory(tab.value)}
                      className={subTabClass(activeCategory === tab.value)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 単語▾ プルダウン */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("word")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => setOpenGroup(openGroup === "word" ? null : "word")}
                className={tabClass(isWordActive)}
              >
                ✏️ 単語 ▾
              </button>

              {openGroup === "word" && (
                <div className="absolute top-full left-0 z-30 mt-1 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-2 grid grid-cols-2 gap-1 w-60">
                  {WORD_TABS.map((tab) => (
                    <button
                      key={tab.value}
                      onClick={() => handleSelectCategory(tab.value)}
                      className={subTabClass(activeCategory === tab.value)}
                    >
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
          {displayQuestions.length}件
          {searchWord && ` (「${searchWord}」で絞り込み中)`}
        </p>

        {displayQuestions.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🔍</p>
            <p>{activeCategory === "bookmark" ? "ブックマークした問題がありません" : "該当する問題が見つかりませんでした"}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {displayQuestions.map((question) => {
              const num = getNumber(question);
              const isBookmarked = bookmarks.has(question.id);
              return (
                <div
                  key={question.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4"
                >
                  <div className="flex items-start gap-3">
                    {/* 連番（ブックマークタブでは非表示） */}
                    {activeCategory !== "bookmark" && (
                      <span className="text-xs font-bold text-gray-400 dark:text-gray-500 w-6 shrink-0 pt-0.5">
                        {num}
                      </span>
                    )}
                    {/* 問題文 */}
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-sm text-gray-700 dark:text-gray-200 leading-relaxed mb-1">
                        {question.en}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {question.ja}
                      </p>
                    </div>
                    {/* ボタン */}
                    <div className="flex items-center gap-2 shrink-0">
                      {/* 🔊 読み上げボタン */}
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
                          speakingId === question.id
                            ? "text-orange-400"
                            : "text-gray-300 hover:text-orange-400"
                        }`}
                        title="英文を読み上げる"
                      >
                        🔊
                      </button>
                      {/* ブックマークボタン */}
                      <button
                        onClick={() => handleToggleBookmark(question.id)}
                        className={`text-lg font-bold transition-all ${
                          isBookmarked
                            ? "text-yellow-400"
                            : "text-gray-300 hover:text-yellow-300"
                        }`}
                      >
                        {isBookmarked ? "★" : "☆"}
                      </button>
                      {/* 練習するボタン */}
                      <button
                        onClick={() => handlePractice(question)}
                        className="text-xs font-bold px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-all"
                      >
                        練習
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
