"use client";

import { useEffect, useState } from "react";
import { useImageSessionStore } from "@entities/image-session";
import { Button } from "@shared/ui";
import { shareToKakao } from "@shared/lib/kakao";

async function downloadImage(url: string, filename: string) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(blobUrl);
  } catch {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.target = "_blank";
    link.click();
  }
}

export function ConversionResult() {
  const { uploadedImage, resultImage, animalTrait, reset } =
    useImageSessionStore();
  const [isLightboxOpen, setIsLightboxOpen] = useState(true);

  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsLightboxOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen]);

  const title = animalTrait ? `${animalTrait} 기니피그` : "기니피그";

  const handleDownload = () => {
    if (!resultImage) return;
    downloadImage(resultImage, "guinea-pig-me.png");
  };

  const handleKakaoShare = () => {
    if (!resultImage) return;
    shareToKakao(resultImage);
  };

  const handleTwitterShare = () => {
    const text = "나도 기니피그가 됐다! 🐹 Ginini에서 내 사진을 변환해봐!";
    const url = window.location.href;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  /* ── 전체화면 라이트박스 ── */
  if (isLightboxOpen && resultImage) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-black/90">
        {/* 닫기 버튼 */}
        <div className="flex justify-end px-5 pt-12">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="text-white/60 hover:text-white text-2xl leading-none transition-colors"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        {/* 이미지 */}
        <div className="flex-1 flex items-center justify-center px-6 py-4">
          <img
            src={resultImage}
            alt={`${title} 변환 결과`}
            className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain"
          />
        </div>

        {/* 타이틀 + 액션 */}
        <div className="px-5 pb-10 flex flex-col items-center gap-4">
          <p className="text-white font-bold text-lg">{title}</p>
          <div className="flex gap-3 w-full max-w-xs">
            <button
              onClick={handleDownload}
              className="flex-1 py-3 rounded-2xl border border-white/20 text-white text-sm font-medium hover:bg-white/10 active:scale-95 transition-all"
            >
              저장
            </button>
            <button
              onClick={handleKakaoShare}
              className="flex-[2] py-3 rounded-2xl bg-amber-400 text-white text-sm font-semibold hover:bg-amber-500 active:scale-95 transition-all"
            >
              공유
            </button>
            <button
              onClick={reset}
              className="flex-1 py-3 rounded-2xl border border-white/20 text-white text-sm font-medium hover:bg-white/10 active:scale-95 transition-all"
            >
              다시
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── 라이트박스 닫은 후 — Before/After 카드 뷰 ── */
  return (
    <div className="flex flex-col items-center gap-8 py-8 px-4 w-full">
      <div className="text-center">
        <div className="text-4xl mb-2">🎉</div>
        <h2 className="text-xl font-bold text-gray-800">{title} 완성!</h2>
        <p className="text-sm text-gray-500 mt-1">
          저장하고 공유해보세요
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Before
          </span>
          {uploadedImage ? (
            <img
              src={uploadedImage}
              alt="원본 이미지"
              className="w-full aspect-square object-cover rounded-2xl border border-gray-200 shadow-sm"
            />
          ) : (
            <div className="w-full aspect-square rounded-2xl bg-gray-100" />
          )}
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-semibold text-amber-500 uppercase tracking-wide">
            After 🐹
          </span>
          {resultImage ? (
            <img
              src={resultImage}
              alt="기니피그 변환 결과"
              onClick={() => setIsLightboxOpen(true)}
              className="w-full aspect-square object-cover rounded-2xl border-2 border-amber-300 shadow-md cursor-zoom-in"
            />
          ) : (
            <div className="w-full aspect-square rounded-2xl bg-amber-50" />
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Button onClick={handleDownload} size="md" className="w-full gap-2">
          ⬇️ 이미지 저장
        </Button>
        <Button
          variant="ghost"
          size="md"
          onClick={handleKakaoShare}
          className="w-full gap-2 bg-yellow-400 text-gray-900 hover:bg-yellow-500 rounded-xl"
        >
          💬 카카오톡 공유
        </Button>
        <Button
          variant="ghost"
          size="md"
          onClick={handleTwitterShare}
          className="w-full gap-2 bg-black text-white hover:bg-gray-800 rounded-xl"
        >
          𝕏 트위터 공유
        </Button>
        <Button
          variant="ghost"
          size="md"
          onClick={reset}
          className="w-full text-gray-500"
        >
          다시 변환하기
        </Button>
      </div>
    </div>
  );
}
