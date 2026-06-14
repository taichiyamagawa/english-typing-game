import { MetadataRoute } from "next";
import { allArticles } from "@/content/articles/index";

// Googleに送るページ一覧。検索結果に表示させたいページだけ記載する
export default function sitemap(): MetadataRoute.Sitemap {
  // 記事ページを動的に生成する
  const articleUrls: MetadataRoute.Sitemap = allArticles.map((article) => ({
    url: `https://bitfun.jp/articles/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    {
      url: "https://bitfun.jp",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://bitfun.jp/typing-game",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://bitfun.jp/articles",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
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
    ...articleUrls,
  ];
}
