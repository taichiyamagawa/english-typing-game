"use client";

import { useState } from "react";
import { getSoundEnabled, setSoundEnabled } from "@/lib/soundPreference";

export default function SoundToggle() {
  // 初期値はlocalStorageから読み込む
  const [isEnabled, setIsEnabled] = useState(() => getSoundEnabled());
  const [isDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("theme") === "dark";
  });

  const toggle = () => {
    const next = !isEnabled;
    setIsEnabled(next);
    setSoundEnabled(next);
  };

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
