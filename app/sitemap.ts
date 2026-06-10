import { MetadataRoute } from "next";

// Googleに送るページ一覧。検索結果に表示させたいページだけ記載する
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://bitfun.jp",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://bitfun.jp/questions",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://bitfun.jp/phrase-select",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: "https://bitfun.jp/word-select",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: "https://bitfun.jp/history",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
