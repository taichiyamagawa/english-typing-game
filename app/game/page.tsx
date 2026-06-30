"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getQuestions, shuffleQuestions, Question, isWordCategory } from "@/data/index";
import { getBookmarks, toggleBookmark } from "@/lib/bookmarks";
import { speak, stopSpeaking } from "@/lib/speech";
import { getSoundEnabled } from "@/lib/soundPreference";
import SoundToggle from "@/components/SoundToggle";
import { useLanguage } from "@/components/LanguageContext";


// 各段階ごとのボーナス定義：段階が上がるごとに0からカウントし直す
const BONUS_STAGES = [
  { target: 10, seconds: 1 },  // 第1段階：0→10文字で+1秒
  { target: 20, seconds: 3 },  // 第2段階：0→20文字で+3秒
  { target: 30, seconds: 5 },  // 第3段階：0→30文字で+5秒
];

// カテゴリごとの文法ヒント（英文カテゴリのみ・日常フレーズは除く）
const GRAMMAR_HINTS: Record<string, string> = {
  phrase_present_simple:             "主語 + 動詞（三単現はs付き）／「〜する」習慣・事実（疑問文：Do/Does + 主語 + 動詞）",
  phrase_present_continuous:         "主語 + be動詞 + 動詞ing ／「〜している」進行中（疑問文：be動詞 + 主語 + 動詞ing）",
  phrase_present_perfect:            "主語 + have/has + 過去分詞 ／「〜したことがある」経験・完了（疑問文：Have/Has + 主語 + 過去分詞）",
  phrase_present_perfect_continuous: "主語 + have/has been + 動詞ing ／「ずっと〜し続けている」（疑問文：Have/Has + 主語 + been + 動詞ing）",
  phrase_past_simple:                "主語 + 動詞の過去形 ／「〜した」過去の動作・状態（疑問文：Did + 主語 + 動詞の原形）",
  phrase_past_continuous:            "主語 + was/were + 動詞ing ／「〜していた」過去の進行（疑問文：Was/Were + 主語 + 動詞ing）",
  phrase_past_perfect:               "主語 + had + 過去分詞 ／「〜より前に〜していた」（疑問文：Had + 主語 + 過去分詞）",
  phrase_past_perfect_continuous:    "主語 + had been + 動詞ing ／「ずっと〜し続けていた」（疑問文：Had + 主語 + been + 動詞ing）",
  phrase_future_simple:              "主語 + will + 動詞 または be going to ／「〜するだろう」（疑問文：Will + 主語 + 動詞）",
  phrase_future_continuous:          "主語 + will be + 動詞ing ／「〜しているだろう」（疑問文：Will + 主語 + be + 動詞ing）",
  phrase_future_perfect:             "主語 + will have + 過去分詞 ／「〜し終えているだろう」（疑問文：Will + 主語 + have + 過去分詞）",
  phrase_future_perfect_continuous:  "主語 + will have been + 動詞ing ／「ずっと〜し続けているだろう」（疑問文：Will + 主語 + have been + 動詞ing）",
  phrase_tag:                        "文末に短い疑問句を付けて「〜ですよね？」確認・同意を求める\n肯定文の時は文末が否定タグ（isn't? / didn't? / can't? など）、否定文の時は肯定タグ（is? / did? など）になる",
  phrase_passive:                    "主語 + be動詞 + 過去分詞 ／「〜される」「〜された」（疑問文：be動詞 + 主語 + 過去分詞）",
  phrase_subjunctive:                "If + 主語 + 過去形/過去完了形 ／「〜だったら」現実と違う仮定・願望",
  phrase_imperative:                 "動詞の原形で文を始める（主語なし）／「〜して」「〜するな」指示・禁止",
  phrase_infinitive:                 "to + 動詞の原形 ／「〜すること」「〜するための」準動詞",
  phrase_gerund:                     "動詞ing形を名詞として使う ／「〜すること」が主語・目的語になる",
};

// 秒数を「M:SS」形式の文字列に変換する
const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

// useSearchParamsはSuspenseで囲む必要があるため内部コンポーネントとして分離
function GameContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t, lang } = useLanguage();

  // URLパラメータからモード・カテゴリ・開始問題ID・ソースを取得
  const mode     = searchParams.get("mode") as "time" | "free";
  const category = searchParams.get("category") ?? "";
  const startId  = searchParams.get("startId");
  const source   = searchParams.get("source");
  // タイムモードの制限時間（秒）。未指定時は120（後方互換）
  const duration = Number(searchParams.get("duration") ?? 120);

  // 問題リストを初期化する
  const [questions] = useState<Question[]>(() => {
    // 出題問題一覧からの練習の場合はその問題だけを使う
    if (source === "played") {
      try {
        const raw = localStorage.getItem("bitgaku_played");
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    }
    // ブックマーク一覧からの場合はブックマーク済み問題だけを使う
    if (source === "bookmark") {
      const bm = getBookmarks();
      const allCategories = ["trivia_short", "trivia_long", "phrase"];
      const bookmarked = allCategories
        .flatMap((cat) => getQuestions(cat))
        .filter((q) => bm.has(q.id));
      if (startId) {
        const targetIndex = bookmarked.findIndex((q) => q.id === startId);
        if (targetIndex >= 0) {
          return [...bookmarked.slice(targetIndex), ...bookmarked.slice(0, targetIndex)];
        }
      }
      return bookmarked;
    }
    // 通常：startIdがあればその問題を先頭に、なければシャッフル
    const all = getQuestions(category);
    if (startId) {
      const targetIndex = all.findIndex((q) => q.id === startId);
      if (targetIndex >= 0) {
        return [...all.slice(targetIndex), ...all.slice(0, targetIndex)];
      }
    }
    return shuffleQuestions(all);
  });
  // 現在表示している問題のインデックス
  const [questionIndex, setQuestionIndex] = useState(0);

  // ブックマーク状態（getBookmarksはサーバー側では空のSetを返す）
  const [bookmarks, setBookmarks] = useState<Set<string>>(() => getBookmarks());

  // 何文字目まで正解したか（現在の問題内）
  const [currentIndex, setCurrentIndex] = useState(0);
  // 現在の問題でのミス数
  const [mistakes, setMistakes] = useState(0);
  // ミス時の赤フラッシュフラグ
  const [isFlashing, setIsFlashing] = useState(false);
  // クリアしたか（フリーモードのみリザルト遷移に使用）
  const [isCleared, setIsCleared] = useState(false);
  // 読み上げ中フラグ
  const [isSpeaking, setIsSpeaking] = useState(false);
  // 非表示モード（単語カテゴリのみ有効：英文を隠してタイプさせる）
  const [isHidden, setIsHidden] = useState(false);
  // 文法ヒントの表示・非表示（英文カテゴリのみ有効）
  const [isHintHidden, setIsHintHidden] = useState(false);
  // 出題された問題リスト（リザルト画面で一覧表示するために記録する）
  const [playedQuestions, setPlayedQuestions] = useState<Question[]>([]);

  // 全問題を通じた累計の正解文字数
  const [totalTyped, setTotalTyped] = useState(0);

  // タイムモード：残り時間（秒）／フリーモード：経過時間（秒）
  const [time, setTime] = useState(mode === "time" ? duration : 0);
  // タイムモードで時間切れになったか
  const [isGameOver, setIsGameOver] = useState(false);

  // 連続ノーミス文字数（各段階ごとに0からカウントし直す）
  const [comboCount, setComboCount] = useState(0);
  // 現在のゲージ段階（0=第1段階, 1=第2段階, 2=第3段階）
  const [gaugeStage, setGaugeStage] = useState(0);
  // ボーナス獲得時に表示するメッセージ（例："+1秒"）
  const [bonusMessage, setBonusMessage] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const audioCtxRef  = useRef<AudioContext | null>(null);

  // 現在表示中の問題（問題リストがなければダミーを表示）
  const currentQuestion: Question = questions[questionIndex] ?? {
    id: "",
    category: "trivia_short",
    en: "Loading...",
    ja: "",
  };

  // 画面表示時にフォーカスを当てる
  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  // 問題が切り替わったら読み上げ中フラグをリセットする
  useEffect(() => {
    stopSpeaking();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsSpeaking(false);
  }, [questionIndex]);

  // タイマー処理：1秒ごとに時間を更新する
  useEffect(() => {
    if (isCleared || isGameOver) return;

    const interval = setInterval(() => {
      setTime((prev: number) => {
        if (mode === "time") {
          if (prev <= 1) {
            clearInterval(interval);
            setIsGameOver(true);
            return 0;
          }
          return prev - 1;
        } else {
          return prev + 1;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [mode, isCleared, isGameOver]);

  // ゲームオーバー時にリザルト画面へ遷移する（isGameOver変化時のみ実行で意図的）
  useEffect(() => {
    if (!isGameOver) return;
    const finalTyped = totalTyped + currentIndex;
    // 出題リストをlocalStorageに保存してからリザルト遷移する
    localStorage.setItem("bitgaku_played", JSON.stringify(playedQuestions));
    const params = new URLSearchParams({
      result:   "gameover",
      mode,
      category,
      time:     "0",
      mistakes: String(mistakes),
      typed:    String(finalTyped),
      total:    String(finalTyped + mistakes),
      duration: String(duration),
    });
    router.push(`/result?${params.toString()}`);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGameOver]);

  // Web Audio APIで効果音を生成・再生する（サウンドオフ時はスキップ）
  const playSound = (type: "correct" | "miss" | "clear" | "bonus") => {
    if (!getSoundEnabled()) return;
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    const ctx = audioCtxRef.current;

    if (type === "correct") {
      // 正解音：カチカチとした鋭いクリック音
      // ① 高域ノイズ：鋭い「カチッ」という立ち上がり
      const duration = 0.04;
      const bufferSize = Math.floor(ctx.sampleRate * duration);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 10);
      }
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;

      // バンドパスで中高域に絞り、鋭すぎない音にする
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = "bandpass";
      noiseFilter.frequency.value = 3500;
      noiseFilter.Q.value = 0.6;

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.25, ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noiseSource.start(ctx.currentTime);
      noiseSource.stop(ctx.currentTime + duration);

      // 芯の音：やや低めにして耳に刺さりにくくする
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.type = "square";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      oscGain.gain.setValueAtTime(0.04, ctx.currentTime);
      oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.02);

    } else if (type === "miss") {
      // ミス音：低めの短いブーという音
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "square";
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);

    } else if (type === "bonus") {
      // ボーナス音：明るい2音（タイム獲得を知らせる）
      [600, 900].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
        gain.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.15);
        osc.start(ctx.currentTime + i * 0.1);
        osc.stop(ctx.currentTime + i * 0.1 + 0.15);
      });

    } else if (type === "clear") {
      // クリア音：C・E・Gの3音が上昇するメロディ
      [523, 659, 784].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.13);
        gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.13);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.13 + 0.25);
        osc.start(ctx.currentTime + i * 0.13);
        osc.stop(ctx.currentTime + i * 0.13 + 0.25);
      });
    }
  };

  // ボーナスメッセージを一定時間表示する
  const showBonusMessage = (message: string) => {
    setBonusMessage(message);
    setTimeout(() => setBonusMessage(null), 1000);
  };

  // 1問クリア時の処理
  const handleQuestionClear = (next: number) => {
    playSound("clear");

    const newTotalTyped = totalTyped + next;
    const isLastQuestion = questionIndex === questions.length - 1;
    // クリアした問題を出題リストに追加する
    const newPlayed = [...playedQuestions, currentQuestion];
    setPlayedQuestions(newPlayed);

    if (mode === "free" && isLastQuestion) {
      // フリーモード：全問クリアでリザルト画面へ遷移
      setIsCleared(true);
      localStorage.setItem("bitgaku_played", JSON.stringify(newPlayed));
      const params = new URLSearchParams({
        result:   "cleared",
        mode,
        category,
        time:     String(time),
        mistakes: String(mistakes),
        typed:    String(newTotalTyped),
        total:    String(newTotalTyped + mistakes),
        ...(source ? { source } : {}),
      });
      router.push(`/result?${params.toString()}`);
    } else {
      // 次の問題へ進む（タイムモード・フリーモード共通）
      setTotalTyped(newTotalTyped);
      setCurrentIndex(0);
      setQuestionIndex((i) => (mode === "time" ? (i + 1) % questions.length : i + 1));
    }
  };

  // フリーモードの「やめる」ボタン処理：途中でリザルト画面へ遷移する
  const handleQuit = () => {
    const finalTyped = totalTyped + currentIndex;
    localStorage.setItem("bitgaku_played", JSON.stringify(playedQuestions));
    const params = new URLSearchParams({
      result:   "quit",
      mode,
      category,
      time:     String(time),
      mistakes: String(mistakes),
      typed:    String(finalTyped),
      total:    String(finalTyped + mistakes),
      ...(source ? { source } : {}),
    });
    router.push(`/result?${params.toString()}`);
  };

  // キー入力処理
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isCleared || isGameOver) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    const questionText = currentQuestion.en;

    if (e.key === questionText[currentIndex]) {
      // 正解：次の文字へ進む
      const next = currentIndex + 1;
      setCurrentIndex(next);

      // 全文字入力完了でクリア処理
      if (next === questionText.length) {
        handleQuestionClear(next);
        return;
      }

      playSound("correct");

      // タイムモードのみボーナスゲージを更新する
      if (mode === "time") {
        const newCombo = comboCount + 1;
        const currentStage = BONUS_STAGES[gaugeStage];
        if (currentStage && newCombo >= currentStage.target) {
          // 目標文字数に到達：ボーナス付与・コンボリセット・次の段階へ
          setTime((t: number) => t + currentStage.seconds);
          playSound("bonus");
          showBonusMessage(`+${currentStage.seconds}秒`);
          setComboCount(0);
          setGaugeStage((s) => (s + 1) % BONUS_STAGES.length);
        } else {
          setComboCount(newCombo);
        }
      }

    } else if (e.key.length === 1) {
      // ミス：カウントアップ・音・赤フラッシュ・コンボリセット
      setMistakes((m) => m + 1);
      playSound("miss");
      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 150);
      // ミス時はコンボと段階を両方リセット
      if (mode === "time") {
        setComboCount(0);
        setGaugeStage(0);
      }
    }
  };

  const questionText    = currentQuestion.en;
  const completed       = questionText.slice(0, currentIndex);
  const current         = questionText[currentIndex];
  const remaining       = questionText.slice(currentIndex + 1);

  // タイムモードの残り時間に応じてタイマーの色を変える
  const timerColor =
    mode === "free"    ? "text-gray-700 dark:text-gray-200" :
    time <= 10         ? "text-red-500"   :
    time <= 30         ? "text-orange-500":
                         "text-gray-700 dark:text-gray-200";

  // ゲージの進捗（現在の段階の目標文字数に対する割合）
  const gaugeTarget   = BONUS_STAGES[gaugeStage]?.target ?? 10;
  const gaugeProgress = comboCount / gaugeTarget;
  const gaugeColors   = ["bg-blue-400", "bg-green-400", "bg-orange-400"];



  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="outline-none min-h-screen flex flex-col items-center justify-center gap-4 sm:gap-6 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-950 dark:to-gray-900 p-4 sm:p-8 pb-24"
    >
      <SoundToggle />
      {/* ヘッダー：戻るボタン・カテゴリ・モード・ブックマーク */}
      <div className="w-full max-w-2xl flex justify-between items-center">
        <button
          onClick={() => {
            // replaceで遷移することでゲーム画面を履歴に残さない
            if (source === "played") {
              router.replace("/played");
            } else if (category.startsWith("phrase_")) {
              router.replace(`/phrase-select?mode=${mode}`);
            } else if (category.startsWith("word_")) {
              router.replace(`/word-select?mode=${mode}`);
            } else {
              router.replace("/typing-game");
            }
          }}
          className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors flex items-center gap-1"
        >
          {t.backInGame}
        </button>
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* ブックマークボタン：現在の問題をブックマーク登録・解除する */}
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              const next = toggleBookmark(currentQuestion.id);
              setBookmarks(new Set(next));
            }}
            className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full shadow-sm border transition-all ${
              bookmarks.has(currentQuestion.id)
                ? "bg-yellow-50 border-yellow-300 text-yellow-600 dark:bg-yellow-900/20 dark:border-yellow-600 dark:text-yellow-400"
                : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-yellow-500 hover:border-yellow-300"
            }`}
          >
            <span>{bookmarks.has(currentQuestion.id) ? "★" : "☆"}</span>
            {/* テキストはスマホでは非表示 */}
            <span className="hidden sm:inline">
              {bookmarks.has(currentQuestion.id) ? t.bookmarkSaved : t.bookmarkSave}
            </span>
          </button>
          {/* 問題一覧ボタン：スマホでは非表示 */}
          <button
            onClick={() => router.replace("/questions")}
            className="hidden sm:flex text-xs text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 font-medium transition-colors bg-white dark:bg-gray-800 px-2.5 py-1 rounded-full shadow-sm border border-gray-200 dark:border-gray-700"
          >
            🗂️ {t.questions}
          </button>
        </div>
      </div>

      {/* タイマー（中央）＋コンボゲージ（右に離して配置） */}
      <div className="w-full max-w-2xl relative flex items-center justify-center">
        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-5 py-2.5 rounded-full shadow-sm">
          <span className="text-sm text-gray-400">{mode === "time" ? t.timerRemaining : t.timerElapsed}</span>
          <p className={`text-2xl font-bold tabular-nums tracking-tight transition-colors ${timerColor}`}>
            {formatTime(time)}
          </p>
        </div>

        {/* コンボゲージ：右側に絶対配置（タイムモードのみ） */}
        {mode === "time" && (
          <div className="absolute right-0">
            <div className={`relative flex items-center gap-1.5 px-3 py-2.5 rounded-full shadow-sm border transition-colors duration-300 ${
              gaugeStage === 0 ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700" :
              gaugeStage === 1 ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700" :
                                 "bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-700"
            }`}>
              <span className={`text-xs font-semibold transition-colors duration-300 ${
                gaugeStage === 0 ? "text-blue-400" :
                gaugeStage === 1 ? "text-green-500" : "text-orange-400"
              }`}>COMBO</span>
              <div className="w-16 h-1.5 bg-white/70 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-75 ${gaugeColors[gaugeStage]}`}
                  style={{ width: `${gaugeProgress * 100}%` }}
                />
              </div>
              <span className={`text-xs font-bold transition-colors duration-300 ${
                gaugeStage === 0 ? "text-blue-500" :
                gaugeStage === 1 ? "text-green-500" : "text-orange-500"
              }`}>
                {gaugeStage === 0 && "+1秒"}
                {gaugeStage === 1 && "+3秒"}
                {gaugeStage === 2 && "+5秒"}
              </span>
              {bonusMessage && (
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md animate-celebrate whitespace-nowrap">
                  {bonusMessage} ゲット！
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 問題文カード（やめるボタンはカード右外側に絶対配置） */}
      <div className="w-full max-w-2xl relative">
      <div className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-orange-400 to-amber-400" />
        <div className="p-4 sm:p-8">
          {/* 文法ヒント：非表示でなければテキストを表示 */}
          {GRAMMAR_HINTS[category] && !isHintHidden && (
            <p className="text-xs text-gray-400 dark:text-gray-500 whitespace-pre-line mb-3">
              {GRAMMAR_HINTS[category]}
            </p>
          )}
          {/* 英文：3色でハイライト表示（非表示モード時は未入力部分をアンダースコアで隠す） */}
          <p className="font-mono text-base sm:text-xl tracking-wide leading-relaxed mb-4 sm:mb-5">
            {/* 正解済み文字：非表示モードでも緑で見える（自分が打った文字は確認できる） */}
            <span className="text-green-500">{completed}</span>
            {current && (
              <span className={`text-white rounded px-0.5 transition-colors duration-75 ${isFlashing ? "bg-red-500" : "bg-orange-400"}`}>
                {/* 非表示モード時は現在の文字もアンダースコアで表示 */}
                {isHidden ? "_" : current}
              </span>
            )}
            {/* 未入力文字：非表示モードでは文字数分のアンダースコアを表示 */}
            <span className="text-gray-400 dark:text-gray-500">
              {isHidden ? "_".repeat(remaining.length) : remaining}
            </span>
          </p>
          {/* 日本語訳とボタン群：訳文を上・ボタンを下の2段構成 */}
          <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
            {/* 英語モードでは日本語訳を非表示にする */}
            {lang === "ja" && (
              <p className="text-sm text-gray-400 dark:text-gray-500 mb-2">
                {currentQuestion.ja}
              </p>
            )}
            {/* ボタン群：右揃えで1行に収める */}
            <div className="flex justify-end gap-2">
              {/* 非表示ボタン：単語カテゴリのみ */}
              {isWordCategory(category) && (
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setIsHidden((h) => !h)}
                  className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-full transition-all ${
                    isHidden
                      ? "bg-orange-100 dark:bg-orange-900/30 text-orange-500"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                  }`}
                  title={isHidden ? "答えを表示する" : "答えを隠す"}
                >
                  <span>{isHidden ? "👀" : "🙈"}</span>
                  <span className="hidden sm:inline">{isHidden ? t.showWord : t.hideWord}</span>
                </button>
              )}
              {/* 説明トグルボタン：英文文法カテゴリのみ */}
              {GRAMMAR_HINTS[category] && (
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setIsHintHidden((h) => !h)}
                  className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-full transition-all ${
                    isHintHidden
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                      : "bg-orange-100 dark:bg-orange-900/30 text-orange-500"
                  }`}
                  title={isHintHidden ? "文法説明を表示" : "文法説明を隠す"}
                >
                  <span>💡</span>
                  <span className="hidden sm:inline">{isHintHidden ? t.showHint : t.hideHint}</span>
                </button>
              )}
              {/* 🔊 読み上げ・停止ボタン */}
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  if (isSpeaking) {
                    stopSpeaking();
                    setIsSpeaking(false);
                    return;
                  }
                  if (!getSoundEnabled()) return;
                  setIsSpeaking(true);
                  speak(currentQuestion.en, () => setIsSpeaking(false));
                }}
                className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-full transition-all ${
                  isSpeaking
                    ? "bg-orange-100 dark:bg-orange-900/30 text-orange-500"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                }`}
                title={isSpeaking ? t.stop : t.readAloud}
              >
                <span>{isSpeaking ? "⏹" : "🔊"}</span>
                <span className="hidden sm:inline">{isSpeaking ? t.stop : t.readAloud}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
        {/* やめるボタン：フリーモードのみ・source=playedのときは非表示 */}
        {mode === "free" && !isCleared && source !== "played" && (
          <button
            onClick={handleQuit}
            className="absolute top-1/2 -translate-y-1/2 -right-[76px] flex items-center justify-center w-16 h-16 rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-red-300 hover:text-red-400 shadow-sm transition-all text-sm font-medium"
          >
            やめる
          </button>
        )}
      </div>

      {/* ステータスバー：問題番号・ミス数・進捗率 */}
      <div className="w-full max-w-2xl flex justify-between items-center">
        {/* 問題番号 */}
        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2.5 rounded-xl shadow-sm">
          <span className="text-lg">📝</span>
          <p className="font-bold text-lg leading-none text-gray-700 dark:text-gray-200">
            {t.questionIndex(questionIndex + 1)}
          </p>
        </div>
        {/* ミス数 */}
        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2.5 rounded-xl shadow-sm">
          <span className="text-lg">❌</span>
          <div>
            <p className="text-xs text-gray-400 leading-none mb-0.5">{t.mistakes}</p>
            <p className={`font-bold text-lg leading-none ${mistakes > 0 ? "text-red-400" : "text-gray-300"}`}>
              {mistakes}
            </p>
          </div>
        </div>
        {/* 正解タイピング数 */}
        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2.5 rounded-xl shadow-sm">
          <span className="text-lg">⌨️</span>
          <div>
            <p className="text-xs text-gray-400 leading-none mb-0.5">{t.correctChars}</p>
            <p className="font-bold text-lg leading-none text-orange-400">
              {totalTyped + currentIndex}<span className="text-sm font-normal text-gray-400"> {t.charUnit}</span>
            </p>
          </div>
        </div>
      </div>

      {/* 操作ガイド */}
      {!isCleared && !isGameOver && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          画面をクリックしてからキーを押してください
        </p>
      )}
    </div>
  );
}

export default function GamePage() {
  return (
    <Suspense>
      <GameContent />
    </Suspense>
  );
}
