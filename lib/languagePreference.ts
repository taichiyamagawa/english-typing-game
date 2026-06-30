// 言語設定をlocalStorageで管理する（テーマ設定と同じパターン）
export type Language = "ja" | "en";

const KEY = "bitgaku_language";

export function getLanguage(): Language {
  if (typeof window === "undefined") return "ja";
  return (localStorage.getItem(KEY) as Language) ?? "ja";
}

export function setLanguage(lang: Language): void {
  localStorage.setItem(KEY, lang);
}
