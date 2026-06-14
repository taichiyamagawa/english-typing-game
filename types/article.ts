// 記事のセクションの種類
export type SectionType = "paragraph" | "heading" | "subheading" | "quote";

// 記事の1セクション（英語と日本語のセット）
export type ArticleSection = {
  type: SectionType;
  en: string;
  ja: string;
};

// 記事データの型
export type Article = {
  id: string;         // 内部管理用の連番ID（例: article_001）
  slug: string;       // URLに使うID（例: tittle）
  title: string;      // 英語タイトル
  titleJa: string;    // 日本語タイトル
  description: string;    // 英語の概要（SEO用）
  descriptionJa: string;  // 日本語の概要
  date: string;       // 公開日（YYYY-MM-DD）
  category: string;   // カテゴリID（例: language）
  categoryJa: string; // カテゴリ表示名（例: 言語）
  emoji: string;      // カテゴリアイコン
  bgPattern?: "space"; // 背景パターン（未指定の場合はデフォルトのオレンジグラデーション）
  sections: ArticleSection[];
};
