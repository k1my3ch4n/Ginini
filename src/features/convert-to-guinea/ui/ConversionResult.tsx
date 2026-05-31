"use client";

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
  const { uploadedImage, resultImage, reset } = useImageSessionStore();

  const handleDownload = () => {
    if (!resultImage) return;
    downloadImage(resultImage, "guinea-pig-me.png");
  };

  const handleKakaoShare = () => {
    if (!resultImage) return;
    shareToKakao(resultImage);
  };

  const handleTwitterShare = () => {
    const text =
      "나도 기니피그가 됐다! 🐹 Ginini에서 내 사진을 변환해봐!";
    const url = window.location.href;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <div className="flex flex-col items-center gap-8 py-8 px-4 w-full">
      <div className="text-center">
        <div className="text-4xl mb-2">🎉</div>
        <h2 className="text-xl font-bold text-gray-800">변환 완료!</h2>
        <p className="text-sm text-gray-500 mt-1">
          기니피그가 되었어요. 저장하고 공유해보세요!
        </p>
      </div>

      {/* Before & After */}
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
              className="w-full aspect-square object-cover rounded-2xl border-2 border-amber-300 shadow-md"
            />
          ) : (
            <div className="w-full aspect-square rounded-2xl bg-amber-50" />
          )}
        </div>
      </div>

      {/* Actions */}
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
