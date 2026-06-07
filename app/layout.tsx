import type { Metadata } from "next";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";
import SoundToggle from "@/components/SoundToggle";

export const metadata: Metadata = {
  metadataBase: new URL("https://english-typing-game-delta.vercel.app"),
  title: "English Typing Game | BitFun",
  description: "ちょっと楽しく、学習を習慣に！雑学・英文・英単語でタイピング練習",
  openGraph: {
    title: "English Typing Game | BitFun",
    description: "ちょっと楽しく、学習を習慣に！",
    type: "website",
    siteName: "BitFun",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "English Typing Game | BitFun",
    description: "ちょっと楽しく、学習を習慣に！",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        {/* ページ読み込み時にダークモードのちらつきを防ぐ */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme')||'light';document.documentElement.classList.toggle('dark',t==='dark');})();`,
          }}
        />
      </head>
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        {children}
        <SoundToggle />
        <ThemeToggle />
      </body>
    </html>
  );
}
