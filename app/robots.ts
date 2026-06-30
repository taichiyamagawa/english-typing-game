import { MetadataRoute } from "next";

// クローラーへのアクセスルールを定義する
// ゲーム中・結果・出題履歴などの動的画面はインデックス不要なので除外する
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/game", "/result", "/played"],
    },
    sitemap: "https://bitgaku.com/sitemap.xml",
  };
}
