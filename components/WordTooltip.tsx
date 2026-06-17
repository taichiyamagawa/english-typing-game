"use client";

import { useState, useEffect, useRef } from "react";
import { vocabulary } from "@/data/vocabulary";
import { useLanguage } from "@/components/LanguageContext";

// テキストを通常のテキストと単語帳の単語に分割する
type Segment =
  | { type: "text"; content: string }
  | { type: "word"; content: string; meaning: string };

function parseSegments(text: string): Segment[] {
  const words = Object.keys(vocabulary);
  if (words.length === 0) return [{ type: "text", content: text }];

  // 長い熟語が短い単語より先にマッチするよう降順ソートしてから正規表現を作る
  const sorted = [...words].sort((a, b) => b.length - a.length);
  const escaped = sorted.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const pattern = new RegExp(`\\b(${escaped.join("|")})\\b`, "gi");

  const segments: Segment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    // マッチ前のテキストを追加
    if (match.index > lastIndex) {
      segments.push({ type: "text", content: text.slice(lastIndex, match.index) });
    }
    // マッチした単語を追加（意味は小文字で検索）
    const meaning = vocabulary[match[0].toLowerCase()];
    segments.push({ type: "word", content: match[0], meaning });
    lastIndex = match.index + match[0].length;
  }

  // 残りのテキストを追加
  if (lastIndex < text.length) {
    segments.push({ type: "text", content: text.slice(lastIndex) });
  }

  return segments;
}

// 単語をクリックで意味を表示するコンポーネント
function VocabWord({ word, meaning }: { word: string; meaning: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  // 外側クリックで閉じる
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <span ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="text-inherit hover:text-orange-500 transition-colors"
      >
        {word}
      </button>
      {open && (
        <span className="absolute left-0 top-full mt-1 z-50 bg-white dark:bg-gray-800 border border-orange-200 dark:border-orange-700 rounded-xl shadow-lg px-3 py-2 min-w-max max-w-[200px]">
          <span className="block text-xs font-bold text-orange-500 mb-0.5">{word}</span>
          <span className="block text-xs text-gray-700 dark:text-gray-200">{meaning}</span>
        </span>
      )}
    </span>
  );
}

// テキストを受け取り、単語帳の単語をクリック可能にして返すコンポーネント
export default function WordTooltip({ text }: { text: string }) {
  const { lang } = useLanguage();

  // 英語モードではツールチップ機能を無効にしてプレーンテキストで返す
  if (lang === "en") return <>{text}</>;

  const segments = parseSegments(text);

  return (
    <>
      {segments.map((seg, i) =>
        seg.type === "word" ? (
          <VocabWord key={i} word={seg.content} meaning={seg.meaning} />
        ) : (
          <span key={i}>{seg.content}</span>
        )
      )}
    </>
  );
}
