import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Ginini — 기니피그 캐릭터 변환 서비스";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ fontSize: 120, marginBottom: 24 }}>🐹</div>
      <div
        style={{
          fontSize: 64,
          fontWeight: 800,
          color: "#111827",
          letterSpacing: "-2px",
          marginBottom: 16,
        }}
      >
        Ginini
      </div>
      <div
        style={{
          fontSize: 32,
          color: "#6b7280",
          textAlign: "center",
          maxWidth: 720,
          lineHeight: 1.4,
        }}
      >
        내 사진을 귀여운 기니피그 캐릭터로 변환해 드려요
      </div>
      <div
        style={{
          marginTop: 48,
          padding: "14px 40px",
          background: "#f59e0b",
          borderRadius: 48,
          fontSize: 28,
          fontWeight: 700,
          color: "#fff",
        }}
      >
        지금 무료로 체험하기 →
      </div>
    </div>,
    { ...size },
  );
}
