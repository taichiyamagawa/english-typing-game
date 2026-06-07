// ブックマークのlocalStorageキー
const STORAGE_KEY = "bitfun_bookmarks";

// ブックマーク済みIDのセットを取得する
export const getBookmarks = (): Set<string> => {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
};

// ブックマークをlocalStorageに保存する
export const saveBookmarks = (bookmarks: Set<string>): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...bookmarks]));
};

// 1件トグルして保存する
export const toggleBookmark = (id: string): Set<string> => {
  const next = getBookmarks();
  if (next.has(id)) {
    next.delete(id);
  } else {
    next.add(id);
  }
  saveBookmarks(next);
  return next;
};
