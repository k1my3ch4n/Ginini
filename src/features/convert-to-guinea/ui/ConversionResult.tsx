"use client";

import { useEffect, useRef, useState } from "react";
import { useImageSessionStore } from "@entities/image-session";
import { Button, IconButton } from "@shared/ui";
import { shareToKakao } from "@shared/lib/kakao";
import { useToast } from "@shared/model";

async function downloadImage(url: string, filename: string): Promise<void> {
  const response = await fetch(url);
  if (!response.ok) throw new Error("fetch failed");
  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(blobUrl);
}

export function ConversionResult() {
  const { uploadedImage, resultImage, animalTrait, reset } =
    useImageSessionStore();
  const [isLightboxOpen, setIsLightboxOpen] = useState(true);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { success, error: showError } = useToast();

  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsLightboxOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen]);

  useEffect(() => {
    if (isLightboxOpen) closeButtonRef.current?.focus();
  }, [isLightboxOpen]);

  const title = animalTrait ? `${animalTrait} 기니피그` : "기니피그";

  const handleDownload = async () => {
    if (!resultImage) return;
    try {
      await downloadImage(resultImage, "guinea-pig-me.png");
      success("이미지를 저장했어요!");
    } catch {
      showError("저장에 실패했어요. 다시 시도해 주세요.");
    }
  };

  const handleKakaoShare = () => {
    if (!resultImage) return;
    shareToKakao(resultImage);
    success("카카오톡 공유를 시작했어요!");
  };

  const handleTwitterShare = () => {
    const text = "나도 기니피그가 됐다! 🐹 Ginini에서 내 사진을 변환해봐!";
    const url = window.location.href;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer",
    );
    success("트위터 공유 창을 열었어요!");
  };

  /* ── 전체화면 라이트박스 ── */
  if (isLightboxOpen && resultImage) {
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="lightbox-title"
        className="fixed inset-0 z-50 flex flex-col bg-[#FBF7F1] md:left-1/2 md:right-auto md:-translate-x-1/2 md:max-w-sm md:w-full md:top-8 md:bottom-8 md:rounded-3xl md:overflow-hidden"
      >
        {/* 닫기 버튼 */}
        <div className="flex justify-end px-3 pt-10">
          <IconButton
            ref={closeButtonRef}
            onClick={() => setIsLightboxOpen(false)}
            aria-label="라이트박스 닫기"
          >
            <span aria-hidden="true" className="text-xl font-bold leading-none">✕</span>
          </IconButton>
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
          <p id="lightbox-title" className="text-[#4B3A2F] font-bold text-lg">{title}</p>
          <div className="flex gap-3 w-full max-w-xs">
            <button
              onClick={handleDownload}
              className="flex-1 py-4 rounded-2xl border border-gray-200 text-[#4B3A2F] text-sm font-medium hover:bg-gray-100 active:scale-95 transition-all cursor-pointer"
            >
              저장
            </button>
            <button
              onClick={handleKakaoShare}
              className="flex-[2] py-4 rounded-2xl bg-[#E6A57E] text-white text-sm font-semibold hover:bg-[#d4956e] active:scale-95 transition-all cursor-pointer"
            >
              공유
            </button>
            <button
              onClick={reset}
              className="flex-1 py-4 rounded-2xl border border-gray-200 text-[#4B3A2F] text-sm font-medium hover:bg-gray-100 active:scale-95 transition-all cursor-pointer"
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
        <h2 className="text-xl font-bold text-[#4B3A2F]">{title} 완성!</h2>
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
          <span className="text-xs font-semibold text-[#E6A57E] uppercase tracking-wide">
            After 🐹
          </span>
          {resultImage ? (
            <button
              onClick={() => setIsLightboxOpen(true)}
              aria-label="결과 이미지 크게 보기"
              className="w-full aspect-square overflow-hidden rounded-2xl border-2 border-[#E6A57E] shadow-md cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E6A57E]"
            >
              <img
                src={resultImage}
                alt="기니피그 변환 결과"
                className="w-full h-full object-cover"
              />
            </button>
          ) : (
            <div className="w-full aspect-square rounded-2xl bg-[#fdf0e6]" />
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
