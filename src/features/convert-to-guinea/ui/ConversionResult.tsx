"use client";

import { useEffect, useRef, useState } from "react";
import { useImageSessionStore } from "@entities/image-session";
import { downloadImage } from "@shared/lib";
import { shareToKakao } from "@shared/lib/kakao";
import { useToast } from "@shared/model";
import { ResultLightbox } from "./ResultLightbox";
import { ResultCardView } from "./ResultCardView";

export function ConversionResult() {
  const { uploadedImage, resultImage, resultId, animalTrait, reset } =
    useImageSessionStore();
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { success, error: showError } = useToast();

  useEffect(() => {
    if (!isLightboxOpen) {
      return;
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsLightboxOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen]);

  useEffect(() => {
    if (isLightboxOpen) {
      closeButtonRef.current?.focus();
    }
  }, [isLightboxOpen]);

  const title = animalTrait ? `${animalTrait} 기니피그` : "기니피그";

  const getShareUrl = () =>
    resultId ? `${window.location.origin}/r/${resultId}` : window.location.href;

  const handleDownload = async () => {
    if (!resultImage) {
      return;
    }
    try {
      await downloadImage(resultImage, "guinea-pig-me.png");
      success("이미지를 저장했어요!");
    } catch {
      showError("저장에 실패했어요. 다시 시도해 주세요.");
    }
  };

  const handleKakaoShare = () => {
    if (!resultImage) {
      return;
    }
    if (shareToKakao(resultImage, getShareUrl())) {
      success("카카오톡 공유를 시작했어요!");
    } else {
      showError(
        "카카오톡 공유를 사용할 수 없어요. 잠시 후 다시 시도해 주세요.",
      );
    }
  };

  const handleTwitterShare = () => {
    const text = "나도 기니피그가 됐다! 🐹 Ginini에서 내 사진을 변환해봐!";
    const url = getShareUrl();
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer",
    );
    success("트위터 공유 창을 열었어요!");
  };

  return (
    <>
      <ResultCardView
        uploadedImage={uploadedImage}
        resultImage={resultImage}
        title={title}
        onOpenLightbox={() => setIsLightboxOpen(true)}
        onDownload={handleDownload}
        onKakaoShare={handleKakaoShare}
        onTwitterShare={handleTwitterShare}
        onReset={reset}
      />
      {isLightboxOpen && resultImage && (
        <ResultLightbox
          resultImage={resultImage}
          title={title}
          closeButtonRef={closeButtonRef}
          onClose={() => setIsLightboxOpen(false)}
          onDownload={handleDownload}
          onKakaoShare={handleKakaoShare}
        />
      )}
    </>
  );
}
