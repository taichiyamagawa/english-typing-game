import { Article } from "@/types/article";
import { tittleArticle } from "./tittle";
import { olympusMonsArticle } from "./olympus-mons";
import { honeyArticle } from "./honey";
import { octopusHeartsArticle } from "./octopus-hearts";
import { cleopatraPyramidArticle } from "./cleopatra-pyramid";
import { bananaBerryArticle } from "./banana-berry";
import { sharksOlderThanTreesArticle } from "./sharks-older-than-trees";
import { oxfordOlderThanAztecArticle } from "./oxford-older-than-aztec";
import { venusDayLongerThanYearArticle } from "./venus-day-longer-than-year";
import { crowsRememberFacesArticle } from "./crows-remember-faces";
import { brainNeverStopsArticle } from "./brain-never-stops";
import { woodWideWebArticle } from "./wood-wide-web";
import { antarcticaLargestDesertArticle } from "./antarctica-largest-desert";
import { eiffelTowerGrowsArticle } from "./eiffel-tower-grows";
import { chessMoreThanAtomsArticle } from "./chess-more-than-atoms";
import { blueWhaleArticle } from "./blue-whale";
import { shortestWar38MinutesArticle } from "./shortest-war-38-minutes";
import { seaOttersHoldHandsArticle } from "./sea-otters-hold-hands";

// 全記事のリスト。新しい記事を追加したらここに追記する（新しい順）
export const allArticles: Article[] = [
  seaOttersHoldHandsArticle,
  shortestWar38MinutesArticle,
  blueWhaleArticle,
  chessMoreThanAtomsArticle,
  eiffelTowerGrowsArticle,
  antarcticaLargestDesertArticle,
  woodWideWebArticle,
  brainNeverStopsArticle,
  crowsRememberFacesArticle,
  venusDayLongerThanYearArticle,
  oxfordOlderThanAztecArticle,
  sharksOlderThanTreesArticle,
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
