// ゲーム記録のデータ型
export type GameRecord = {
  id: string;
  date: string;                    // ISO形式の日時文字列
  mode: "time" | "free";
  category: string;
  result: "cleared" | "gameover" | "quit";
  time: number;                    // タイムモード：残り時間 / フリーモード：経過時間（秒）
  mistakes: number;
  typed: number;                   // 正解した文字数
  accuracy: number;                // 正確率（0〜100）
};

// localStorageのキー名
const STORAGE_KEY = "bitfun_typing_records";

// 保存する最大件数（古い記録は自動的に削除）
const MAX_RECORDS = 10;

// 記録を全件取得する
export const getRecords = (): GameRecord[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

// 新しい記録を保存する
export const saveRecord = (record: Omit<GameRecord, "id" | "date">): void => {
  const records = getRecords();
  const newRecord: GameRecord = {
    ...record,
    id:   crypto.randomUUID(),
    date: new Date().toISOString(),
  };
  // 先頭に追加して最大件数を超えた分は末尾から削除
  const updated = [newRecord, ...records].slice(0, MAX_RECORDS);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

// 全体自己ベスト記録の型（詳細情報を含む）
export type OverallBest = {
  score: number;      // 正解文字数
  category: string;
  accuracy: number;
  mistakes: number;
  date: string;       // ISO形式の日時文字列
};

// 全体自己ベストの localStorage キー名
const OVERALL_BEST_KEY = "bitfun_overall_best";

// 全体自己ベストを取得する。記録がなければ null を返す
export const getOverallBest = (): OverallBest | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(OVERALL_BEST_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// 全体自己ベストを更新する。新記録なら保存して true を返す
export const updateOverallBest = (record: OverallBest): boolean => {
  if (typeof window === "undefined") return false;
  try {
    const prev = getOverallBest();
    if (prev === null || record.score > prev.score) {
      localStorage.setItem(OVERALL_BEST_KEY, JSON.stringify(record));
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

// カテゴリの表示名
export const categoryLabel: Record<string, string> = {
  trivia_short:                        "💡 雑学（短文）",
  trivia_long:                         "📚 雑学（長文）",
  // 英文カテゴリ（後方互換のため"phrase"も残す）
  phrase:                              "💬 英文（全）",
  phrase_all:                          "💬 英文（全）",
  phrase_daily:                        "💬 日常フレーズ",
  phrase_present_simple:               "💬 現在形",
  phrase_present_continuous:           "💬 現在進行形",
  phrase_present_perfect:              "💬 現在完了形",
  phrase_present_perfect_continuous:   "💬 現在完了進行形",
  phrase_past_simple:                  "💬 過去形",
  phrase_past_continuous:              "💬 過去進行形",
  phrase_past_perfect:                 "💬 過去完了形",
  phrase_past_perfect_continuous:      "💬 過去完了進行形",
  phrase_future_simple:                "💬 未来形",
  phrase_future_continuous:            "💬 未来進行形",
  phrase_future_perfect:               "💬 未来完了形",
  phrase_future_perfect_continuous:    "💬 未来完了進行形",
  phrase_tag:                          "💬 付加疑問文",
  phrase_passive:                      "💬 受動態",
  phrase_subjunctive:                  "💬 仮定法",
  phrase_imperative:                   "💬 命令文",
  phrase_infinitive:                   "💬 不定詞",
  phrase_gerund:                       "💬 動名詞",
  word_all:                            "✏️ 単語（全）",
  word_biology:       "🦋 生物",
  word_nature:        "🌿 自然",
  word_weather_space: "🌌 天気・宇宙",
  word_food:          "🍎 食べ物",
  word_lifestyle:     "🏡 暮らし・生活",
  word_health:        "💪 体・健康",
  word_emotion:       "😊 感情・性格",
  word_work:          "💼 仕事・職業",
  word_technology:    "📱 テクノロジー",
  word_travel:        "✈️ 旅行・交通・地理",
  word_culture:       "🎨 趣味・文化",
  word_education:     "🏫 学校・学習",
  word_society:       "🌐 社会・政治",
  word_property:      "🔷 色・形・素材",
  word_other:         "📦 その他",
};
