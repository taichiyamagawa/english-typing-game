import { MetadataRoute } from "next";

// Googleに送るページ一覧。検索結果に表示させたいページだけ記載する
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://bitgaku.com",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://bitgaku.com/typing-game",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://bitgaku.com/questions",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://bitgaku.com/phrase-select",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: "https://bitgaku.com/word-select",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: "https://bitgaku.com/history",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
