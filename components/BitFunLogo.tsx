"use client";
import Link from "next/link";

// 全ページ左上に表示するBitFunロゴ。クリックでトップページへ遷移する
export default function BitFunLogo() {
  return (
    <Link
      href="/"
      className="fixed top-4 sm:top-6 left-4 sm:left-6 z-20 flex items-center gap-2 group"
    >
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 shadow-md shadow-orange-200 dark:shadow-orange-900/30 group-hover:scale-105 transition-transform">
        <span className="text-lg">⌨️</span>
      </div>
      <span className="text-xl font-bold tracking-tight">
        <span className="text-gray-800 dark:text-gray-100">Bit</span>
        <span className="text-orange-500">Fun</span>
      </span>
    </Link>
  );
}
