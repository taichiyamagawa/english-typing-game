"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { saveRecord, getBestScore, updateBestScore, updateOverallBest, categoryLabel } from "@/lib/records";

// 秒数を「M:SS」形式の文字列に変換する
const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

// useSearchParamsはSuspenseで囲む必要があるため内部コンポーネントとして分離
function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URLパラメータからゲーム結果を受け取る
  const result   = searchParams.get("result") as "cleared" | "gameover" | "quit";
  const mode     = searchParams.get("mode") as "time" | "free";
  const category = searchParams.get("category") ?? "";
  const time     = Number(searchParams.get("time") ?? 0);
  const mistakes = Number(searchParams.get("mistakes") ?? 0);
  const typed    = Number(searchParams.get("typed") ?? 0);

  // 正確率：全キー入力（正解＋ミス）のうち正解した割合
  const totalKeystrokes = typed + mistakes;
  const accuracy = totalKeystrokes > 0
    ? Math.round((typed / totalKeystrokes) * 100)
    : 100;

  const isCleared = result === "cleared";
  const isQuit    = result === "quit";

  // ゲーム画面から渡された出題問題リスト
  const [playedQuestions, setPlayedQuestions] = useState<{ en: string; ja: string }[]>([]);

  // タイムモードの自己ベスト（文字数）と新記録かどうか
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [isNewRecord, setIsNewRecord] = useState(false);

  // 画面表示時に1回だけlocalStorageから出題リストを読み込み・記録を保存する
  useEffect(() => {
    // タイムモードのみ履歴に保存・自己ベストを更新する
    if (mode === "time") {
      saveRecord({ mode, category, result, time, mistakes, typed, accuracy });
      const prev = getBestScore(category);
      const updated = updateBestScore(category, typed);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBestScore(updated ? typed : prev);
      setIsNewRecord(updated);
      // 全体自己ベストも更新する
      updateOverallBest({ score: typed, category, accuracy, mistakes, date: new Date().toISOString() });
    }
    try {
      const raw = localStorage.getItem("bitfun_played");
      if (raw) setPlayedQuestions(JSON.parse(raw));
    } catch {
      // パースエラーは無視する
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRetry = () => {
    router.push(`/game?mode=${mode}&category=${category}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 sm:gap-8 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-950 dark:to-gray-900 p-4 sm:p-8 pb-24">

      {/* 結果タイトル */}
      <div className="text-center animate-celebrate">
        <p className="text-5xl mb-3">
          {isCleared ? "🎉" : isQuit ? "👋" : "⏰"}
        </p>
        <h1 className={`text-3xl font-bold mb-1 ${
          isCleared ? "text-orange-500" :
          isQuit    ? "text-blue-400 dark:text-blue-300" :
                      "text-gray-600 dark:text-gray-300"
        }`}>
          {isCleared ? "クリア！" : isQuit ? "お疲れさま！" : "タイムアップ！"}
        </h1>
        <p className="text-sm text-gray-400">
          {categoryLabel[category] ?? category} ／ {mode === "time" ? "タイムモード" : "フリーモード"}
        </p>
      </div>

      {/* スコアカード */}
      <div className="w-full max-w-sm flex flex-col gap-3">

        {/* タイム */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 mb-1">
              {mode === "time"
                ? isCleared ? "残り時間" : "打ち切れた時間"
                : "かかった時間"}
            </p>
            <p className="text-2xl font-bold text-gray-700 dark:text-gray-100 tabular-nums">
              {formatTime(time)}
            </p>
          </div>
          <span className="text-3xl">⏱</span>
        </div>

        {/* 正確率・ミス数を横並び */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5">
            <p className="text-xs text-gray-400 mb-1">正確率</p>
            <p className={`text-2xl font-bold tabular-nums ${
              accuracy >= 90 ? "text-green-500" :
              accuracy >= 70 ? "text-orange-400" :
              "text-red-400"
            }`}>
              {accuracy}<span className="text-base font-normal text-gray-400">%</span>
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5">
            <p className="text-xs text-gray-400 mb-1">ミス数</p>
            <p className={`text-2xl font-bold tabular-nums ${mistakes > 0 ? "text-red-400" : "text-gray-300"}`}>
              {mistakes}<span className="text-base font-normal text-gray-400"> 回</span>
            </p>
          </div>
        </div>

        {/* 正解した文字数・総入力数を横並び */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5">
            <p className="text-xs text-gray-400 mb-1">正解した文字数</p>
            <p className="text-2xl font-bold text-gray-700 dark:text-gray-100 tabular-nums">
              {typed}<span className="text-base font-normal text-gray-400"> 文字</span>
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5">
            <p className="text-xs text-gray-400 mb-1">総入力数</p>
            <p className="text-2xl font-bold text-gray-700 dark:text-gray-100 tabular-nums">
              {totalKeystrokes}<span className="text-base font-normal text-gray-400"> 回</span>
            </p>
          </div>
        </div>

        {/* 自己ベスト：タイムモードのみ表示 */}
        {mode === "time" && bestScore !== null && (
          <div className={`rounded-2xl shadow-sm p-5 flex items-center justify-between ${
            isNewRecord
              ? "bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700"
              : "bg-white dark:bg-gray-800"
          }`}>
            <div>
              <p className="text-xs text-gray-400 mb-1">自己ベスト</p>
              <p className={`text-2xl font-bold tabular-nums ${isNewRecord ? "text-orange-500" : "text-gray-700 dark:text-gray-100"}`}>
                {bestScore}<span className="text-base font-normal text-gray-400"> 文字</span>
              </p>
            </div>
            {isNewRecord
              ? <span className="text-2xl animate-celebrate">🎉</span>
              : <span className="text-2xl">🏆</span>
            }
          </div>
        )}
      </div>

      {/* アクションボタン */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={handleRetry}
          className="px-8 py-3 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold rounded-2xl shadow-md shadow-orange-200 dark:shadow-orange-900/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          もう一度
        </button>
        <button
          onClick={() => router.push("/history")}
          className="px-8 py-3 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold rounded-2xl shadow-sm hover:shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          🏆 スコア記録
        </button>
        <button
          onClick={() => router.push("/")}
          className="px-8 py-3 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold rounded-2xl shadow-sm hover:shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          トップへ
        </button>
      </div>

      {/* 出題された問題一覧ボタン（問題がある場合のみ表示） */}
      {playedQuestions.length > 0 && (
        <button
          onClick={() => router.push("/played")}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 font-medium transition-colors underline underline-offset-4"
        >
          📋 出題された問題一覧（{playedQuestions.length}問）を見る
        </button>
      )}
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense>
      <ResultContent />
    </Suspense>
  );
}
