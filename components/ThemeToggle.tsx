"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/components/LanguageContext";

export default function ThemeToggle() {
  const { lang } = useLanguage();
  // サーバーとクライアントで初期値を一致させるため false で初期化し、
  // マウント後に localStorage から実際の値を読み込む（hydration エラー対策）
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setIsDark(localStorage.getItem("theme") === "dark");
    setMounted(true);
  }, []);

  // テーマを切り替える：classとlocalStorageを同時に更新する
  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  // マウント前はサーバーと同じ状態（非表示）にしてhydrationエラーを防ぐ
  if (!mounted) return null;

  return (
    <button
      onClick={toggle}
      className={`fixed bottom-5 right-5 z-50 flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-md hover:scale-105 transition-all text-xs font-medium ${
        isDark
          ? "bg-white text-gray-700 border border-gray-200"
          : "bg-gray-900 text-gray-100 border border-gray-700"
      }`}
      title={lang === "en" ? (isDark ? "Light mode" : "Dark mode") : (isDark ? "ライトモードに切り替え" : "ダークモードに切り替え")}
    >
      <span className="text-sm">{isDark ? "☀️" : "🌙"}</span>
      <span>{lang === "en" ? (isDark ? "Light" : "Dark") : (isDark ? "ライト" : "ダーク")}</span>
    </button>
  );
}
