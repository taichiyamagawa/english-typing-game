import { Article } from "@/types/article";
import { tittleArticle } from "./tittle";
import { olympusMonsArticle } from "./olympus-mons";
import { honeyArticle } from "./honey";
import { octopusHeartsArticle } from "./octopus-hearts";
import { cleopatraPyramidArticle } from "./cleopatra-pyramid";
import { bananaBerryArticle } from "./banana-berry";

// 全記事のリスト。新しい記事を追加したらここに追記する（新しい順）
export const allArticles: Article[] = [
  bananaBerryArticle,
  cleopatraPyramidArticle,
  octopusHeartsArticle,
  honeyArticle,
  olympusMonsArticle,
  tittleArticle,
];

// スラッグから記事を取得する
export const getArticleBySlug = (slug: string): Article | undefined => {
  return allArticles.find((a) => a.slug === slug);
};
