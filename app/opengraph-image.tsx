import { ImageResponse } from "next/og";

// OG画像のサイズ（SNS推奨サイズ）
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #fff7ed 0%, #fef3c7 100%)",
          fontFamily: "sans-serif",
          padding: "60px",
        }}
      >
        {/* ロゴエリア */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #fb923c, #f97316)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
            }}
          >
            ⌨️
          </div>
          <span
            style={{
              fontSize: "42px",
              fontWeight: "bold",
              color: "#1f2937",
            }}
          >
            Bit<span style={{ color: "#f97316" }}>Fun</span>
          </span>
        </div>

        {/* タイトル */}
        <div
          style={{
            fontSize: "72px",
            fontWeight: "bold",
            color: "#1f2937",
            marginBottom: "24px",
            letterSpacing: "-2px",
          }}
        >
          English Typing Game
        </div>

        {/* サブタイトル */}
        <div
          style={{
            fontSize: "32px",
            color: "#6b7280",
            fontWeight: "500",
          }}
        >
          ちょっと楽しく、ちょっと学ぶ。
        </div>

        {/* オレンジのアクセントライン */}
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            height: "8px",
            background: "linear-gradient(90deg, #fb923c, #fbbf24)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
