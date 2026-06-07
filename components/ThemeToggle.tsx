"use client";

import { useState } from "react";

export default function ThemeToggle() {
  // 現在のテーマ状態（初期値はlocalStorageから読み込む）
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("theme") === "dark";
  });

  // テーマを切り替える：classとlocalStorageを同時に更新する
  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      className={`fixed bottom-5 right-5 z-50 flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-md hover:scale-105 transition-all text-xs font-medium ${
        isDark
          ? "bg-white text-gray-700 border border-gray-200"
          : "bg-gray-900 text-gray-100 border border-gray-700"
      }`}
      title={isDark ? "ライトモードに切り替え" : "ダークモードに切り替え"}
    >
      <span className="text-sm">{isDark ? "☀️" : "🌙"}</span>
      <span>{isDark ? "ライト" : "ダーク"}</span>
    </button>
  );
}
