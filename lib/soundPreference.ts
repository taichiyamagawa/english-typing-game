// サウンド設定のlocalStorageキー
const STORAGE_KEY = "bitgaku_sound";

// サウンドが有効かどうかを取得する（デフォルト：有効）
export const getSoundEnabled = (): boolean => {
  if (typeof window === "undefined") return true;
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved !== "false";
};

// サウンド設定を保存する
export const setSoundEnabled = (enabled: boolean): void => {
  localStorage.setItem(STORAGE_KEY, String(enabled));
};
