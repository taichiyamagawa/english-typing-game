import { triviaShortQuestions } from "./trivia_short";
import { triviaLongQuestions } from "./trivia_long";
import { phraseDailyQuestions } from "./phrases/daily";
import { presentSimpleQuestions } from "./phrases/present_simple";
import { presentContinuousQuestions } from "./phrases/present_continuous";
import { presentPerfectQuestions } from "./phrases/present_perfect";
import { presentPerfectContinuousQuestions } from "./phrases/present_perfect_continuous";
import { pastSimpleQuestions } from "./phrases/past_simple";
import { pastContinuousQuestions } from "./phrases/past_continuous";
import { pastPerfectQuestions } from "./phrases/past_perfect";
import { pastPerfectContinuousQuestions } from "./phrases/past_perfect_continuous";
import { futureSimpleQuestions } from "./phrases/future_simple";
import { futureContinuousQuestions } from "./phrases/future_continuous";
import { futurePerfectQuestions } from "./phrases/future_perfect";
import { futurePerfectContinuousQuestions } from "./phrases/future_perfect_continuous";
import { tagQuestionQuestions } from "./phrases/tag_question";
import { passiveQuestions } from "./phrases/passive";
import { subjunctiveQuestions } from "./phrases/subjunctive";
import { imperativeQuestions } from "./phrases/imperative";
import { infinitiveQuestions } from "./phrases/infinitive";
import { gerundQuestions } from "./phrases/gerund";
import { biologyQuestions } from "./words/biology";
import { natureQuestions } from "./words/nature";
import { weatherSpaceQuestions } from "./words/weather_space";
import { foodQuestions } from "./words/food";
import { lifestyleQuestions } from "./words/lifestyle";
import { healthQuestions } from "./words/health";
import { emotionQuestions } from "./words/emotion";
import { workQuestions } from "./words/work";
import { technologyQuestions } from "./words/technology";
import { travelQuestions } from "./words/travel";
import { cultureQuestions } from "./words/culture";
import { educationQuestions } from "./words/education";
import { societyQuestions } from "./words/society";
import { otherQuestions } from "./words/other";
import { propertyQuestions } from "./words/property";

// 問題データの型定義
export type Question = {
  id: string;
  category:
    | "trivia_short"
    | "trivia_long"
    // 英文：日常フレーズ
    | "phrase_daily"
    // 英文：時制
    | "phrase_present_simple"
    | "phrase_present_continuous"
    | "phrase_present_perfect"
    | "phrase_present_perfect_continuous"
    | "phrase_past_simple"
    | "phrase_past_continuous"
    | "phrase_past_perfect"
    | "phrase_past_perfect_continuous"
    | "phrase_future_simple"
    | "phrase_future_continuous"
    | "phrase_future_perfect"
    | "phrase_future_perfect_continuous"
    // 英文：文法特集
    | "phrase_tag"
    | "phrase_passive"
    | "phrase_subjunctive"
    | "phrase_imperative"
    | "phrase_infinitive"
    | "phrase_gerund"
    // 単語
    | "word_biology"
    | "word_nature"
    | "word_weather_space"
    | "word_food"
    | "word_lifestyle"
    | "word_health"
    | "word_emotion"
    | "word_work"
    | "word_technology"
    | "word_travel"
    | "word_culture"
    | "word_education"
    | "word_society"
    | "word_other"
    | "word_property";
  en: string;  // タイプ対象の英文・英単語
  ja: string;  // 補助表示する日本語訳
};

// 英文サブカテゴリの一覧（phrase_allで全結合するために使用）
export const PHRASE_CATEGORIES = [
  "phrase_daily",
  "phrase_present_simple",
  "phrase_present_continuous",
  "phrase_present_perfect",
  "phrase_present_perfect_continuous",
  "phrase_past_simple",
  "phrase_past_continuous",
  "phrase_past_perfect",
  "phrase_past_perfect_continuous",
  "phrase_future_simple",
  "phrase_future_continuous",
  "phrase_future_perfect",
  "phrase_future_perfect_continuous",
  "phrase_tag",
  "phrase_passive",
  "phrase_subjunctive",
  "phrase_imperative",
  "phrase_infinitive",
  "phrase_gerund",
] as const;

export type PhraseCategory = typeof PHRASE_CATEGORIES[number];

// 単語カテゴリの一覧（word_allで全結合するために使用）
export const WORD_CATEGORIES = [
  "word_biology",
  "word_nature",
  "word_weather_space",
  "word_food",
  "word_lifestyle",
  "word_health",
  "word_emotion",
  "word_work",
  "word_technology",
  "word_travel",
  "word_culture",
  "word_education",
  "word_society",
  "word_property",
  "word_other",
] as const;

export type WordCategory = typeof WORD_CATEGORIES[number];

// カテゴリが単語カテゴリかどうかを判定する
export const isWordCategory = (category: string): boolean => {
  return category.startsWith("word_");
};

// カテゴリが英文カテゴリかどうかを判定する
export const isPhraseCategory = (category: string): boolean => {
  return category.startsWith("phrase_");
};

// カテゴリを指定して問題リストを取得する
export const getQuestions = (category: string): Question[] => {
  // 雑学カテゴリ
  if (category === "trivia_short") return triviaShortQuestions;
  if (category === "trivia_long")  return triviaLongQuestions;

  // 英文：全カテゴリをまとめて返す
  if (category === "phrase" || category === "phrase_all") {
    return PHRASE_CATEGORIES.flatMap((cat) => getQuestions(cat));
  }

  // 英文：個別カテゴリ
  if (category === "phrase_daily")                      return phraseDailyQuestions;
  if (category === "phrase_present_simple")             return presentSimpleQuestions;
  if (category === "phrase_present_continuous")         return presentContinuousQuestions;
  if (category === "phrase_present_perfect")            return presentPerfectQuestions;
  if (category === "phrase_present_perfect_continuous") return presentPerfectContinuousQuestions;
  if (category === "phrase_past_simple")                return pastSimpleQuestions;
  if (category === "phrase_past_continuous")            return pastContinuousQuestions;
  if (category === "phrase_past_perfect")               return pastPerfectQuestions;
  if (category === "phrase_past_perfect_continuous")    return pastPerfectContinuousQuestions;
  if (category === "phrase_future_simple")              return futureSimpleQuestions;
  if (category === "phrase_future_continuous")          return futureContinuousQuestions;
  if (category === "phrase_future_perfect")             return futurePerfectQuestions;
  if (category === "phrase_future_perfect_continuous")  return futurePerfectContinuousQuestions;
  if (category === "phrase_tag")                        return tagQuestionQuestions;
  if (category === "phrase_passive")                    return passiveQuestions;
  if (category === "phrase_subjunctive")                return subjunctiveQuestions;
  if (category === "phrase_imperative")                 return imperativeQuestions;
  if (category === "phrase_infinitive")                 return infinitiveQuestions;
  if (category === "phrase_gerund")                     return gerundQuestions;

  // 単語：全カテゴリをまとめて返す
  if (category === "word_all") {
    return WORD_CATEGORIES.flatMap((cat) => getQuestions(cat));
  }

  // 単語：個別カテゴリ
  if (category === "word_biology")       return biologyQuestions;
  if (category === "word_nature")        return natureQuestions;
  if (category === "word_weather_space") return weatherSpaceQuestions;
  if (category === "word_food")          return foodQuestions;
  if (category === "word_lifestyle")     return lifestyleQuestions;
  if (category === "word_health")        return healthQuestions;
  if (category === "word_emotion")       return emotionQuestions;
  if (category === "word_work")          return workQuestions;
  if (category === "word_technology")    return technologyQuestions;
  if (category === "word_travel")        return travelQuestions;
  if (category === "word_culture")       return cultureQuestions;
  if (category === "word_education")     return educationQuestions;
  if (category === "word_society")       return societyQuestions;
  if (category === "word_other")         return otherQuestions;
  if (category === "word_property")      return propertyQuestions;

  return [];
};

// 問題リストをランダムにシャッフルして返す（毎回違う順番で出題するため）
export const shuffleQuestions = (questions: Question[]): Question[] => {
  return [...questions].sort(() => Math.random() - 0.5);
};
