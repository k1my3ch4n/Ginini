import { ImageResponse } from "next/og";
import { getResultMetadata } from "@features/convert-to-guinea/server/resultMetadata";

export const runtime = "edge";
export const alt = "Ginini — 기니피그 캐릭터 변환 결과";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface ImageProps {
  params: Promise<{ id: string }>;
}

export default async function OgImage({ params }: ImageProps) {
  const { id } = await params;
  const metadata = await getResultMetadata(id);

  if (!metadata) {
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
            background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
            fontFamily: "sans-serif",
          }}
        >
          <div style={{ fontSize: 120, marginBottom: 24 }}>🐹</div>
          <div style={{ fontSize: 64, fontWeight: 800, color: "#111827" }}>
            Ginini
          </div>
        </div>
      ),
      { ...size },
    );
  }

  const title = metadata.animalTrait
    ? `${metadata.animalTrait} 기니피그`
    : "기니피그";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 64,
          background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={metadata.resultUrl}
          alt={title}
          width={480}
          height={480}
          style={{
            borderRadius: 32,
            border: "6px solid #E6A57E",
            objectFit: "cover",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 56,
              fontWeight: 800,
              color: "#111827",
              letterSpacing: "-2px",
              marginBottom: 16,
            }}
          >
            {title}
          </div>
          <div style={{ fontSize: 28, color: "#6b7280" }}>
            나도 기니피그가 됐어! 너도 해봐 🐹
          </div>
          <div
            style={{
              marginTop: 32,
              padding: "12px 32px",
              background: "#f59e0b",
              borderRadius: 48,
              fontSize: 24,
              fontWeight: 700,
              color: "#fff",
              width: "fit-content",
            }}
          >
            Ginini에서 만들기 →
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
