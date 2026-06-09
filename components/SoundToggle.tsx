"use client";

import { useState, useEffect } from "react";
import { getSoundEnabled, setSoundEnabled } from "@/lib/soundPreference";

export default function SoundToggle() {
  // サーバーとクライアントで初期値を一致させるため定数で初期化し、
  // マウント後に localStorage から実際の値を読み込む（hydration エラー対策）
  const [isEnabled, setIsEnabled] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setIsEnabled(getSoundEnabled());
    setIsDark(localStorage.getItem("theme") === "dark");
    setMounted(true);
  }, []);

  const toggle = () => {
    const next = !isEnabled;
    setIsEnabled(next);
    setSoundEnabled(next);
  };

  // マウント前はサーバーと同じ状態（非表示）にしてhydrationエラーを防ぐ
  if (!mounted) return null;

  return (
    <button
      onClick={toggle}
      className={`fixed bottom-14 right-5 z-50 flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-md hover:scale-105 transition-all text-xs font-medium ${
        isDark
          ? "bg-white text-gray-700 border border-gray-200"
          : "bg-gray-900 text-gray-100 border border-gray-700"
      } ${!isEnabled ? "opacity-60" : ""}`}
      title={isEnabled ? "サウンドをオフにする" : "サウンドをオンにする"}
    >
      <span className="text-sm">{isEnabled ? "🔊" : "🔇"}</span>
      <span>{isEnabled ? "音あり" : "音なし"}</span>
    </button>
  );
}
