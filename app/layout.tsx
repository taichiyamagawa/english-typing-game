import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import BitFunLogo from "@/components/BitFunLogo";
import { LanguageProvider } from "@/components/LanguageContext";

export const metadata: Metadata = {
  metadataBase: new URL("https://bitgaku.com"),
  title: "English Typing Game: 雑学英語タイピング＋雑学記事",
  description: "ちょっと楽しく、ちょっと学ぶ。雑学・英文・英単語でタイピング練習＋英語で読む雑学記事",
  openGraph: {
    title: "English Typing Game: 雑学英語タイピング＋雑学記事",
    description: "ちょっと楽しく、ちょっと学ぶ。",
    type: "website",
    siteName: "BitGaku",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "English Typing Game: 雑学英語タイピング＋雑学記事",
    description: "ちょっと楽しく、ちょっと学ぶ。",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        {/* ページ読み込み時にダークモードのちらつきを防ぐ。beforeInteractiveで最初に実行される */}
        <Script id="theme-init" strategy="beforeInteractive">{`(function(){var t=localStorage.getItem('theme')||'light';document.documentElement.classList.toggle('dark',t==='dark');})();`}</Script>
        {/* Google アナリティクス（GA4）でアクセス解析を行う。ページ表示を妨げないようafterInteractiveで読み込む */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-J3ZPLCLRPT" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-J3ZPLCLRPT');
        `}</Script>
        <BitFunLogo />
        <LanguageProvider>
          <LanguageToggle />
          {children}
          <ThemeToggle />
        </LanguageProvider>
      </body>
    </html>
  );
}
