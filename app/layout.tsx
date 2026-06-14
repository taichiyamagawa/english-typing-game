import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import BitFunLogo from "@/components/BitFunLogo";
import { LanguageProvider } from "@/components/LanguageContext";

export const metadata: Metadata = {
  metadataBase: new URL("https://bitfun.jp"),
  title: "English Typing Game | BitFun",
  description: "ちょっと楽しく、ちょっと賢く。雑学・英文・英単語でタイピング練習",
  openGraph: {
    title: "English Typing Game | BitFun",
    description: "ちょっと楽しく、ちょっと賢く。",
    type: "website",
    siteName: "BitFun",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "English Typing Game | BitFun",
    description: "ちょっと楽しく、ちょっと賢く。",
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
