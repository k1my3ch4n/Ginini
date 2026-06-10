import { Button } from "@shared/ui";

interface ResultCardViewProps {
  uploadedImage: string | null;
  resultImage: string | null;
  title: string;
  onOpenLightbox: () => void;
  onDownload: () => void;
  onKakaoShare: () => void;
  onTwitterShare: () => void;
  onReset: () => void;
}

export function ResultCardView({
  uploadedImage,
  resultImage,
  title,
  onOpenLightbox,
  onDownload,
  onKakaoShare,
  onTwitterShare,
  onReset,
}: ResultCardViewProps) {
  return (
    <div className="flex flex-col items-center gap-8 py-8 px-4 w-full">
      <div className="text-center">
        <div className="text-4xl mb-2">🎉</div>
        <h2 className="text-xl font-bold text-[#4B3A2F]">{title} 완성!</h2>
        <p className="text-sm text-gray-500 mt-1">저장하고 공유해보세요</p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Before
          </span>
          {uploadedImage ? (
            // eslint-disable-next-line @next/next/no-img-element
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
              onClick={onOpenLightbox}
              aria-label="결과 이미지 크게 보기"
              className="w-full aspect-square overflow-hidden rounded-2xl border-2 border-[#E6A57E] shadow-md cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E6A57E]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
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
        <Button onClick={onDownload} size="md" className="w-full gap-2">
          ⬇️ 이미지 저장
        </Button>
        <Button
          variant="ghost"
          size="md"
          onClick={onKakaoShare}
          className="w-full gap-2 bg-yellow-400 text-gray-900 hover:bg-yellow-500 rounded-xl"
        >
          💬 카카오톡 공유
        </Button>
        <Button
          variant="ghost"
          size="md"
          onClick={onTwitterShare}
          className="w-full gap-2 bg-black text-white hover:bg-gray-800 rounded-xl"
        >
          𝕏 트위터 공유
        </Button>
        <Button variant="ghost" size="md" onClick={onReset} className="w-full text-gray-500">
          다시 변환하기
        </Button>
      </div>
    </div>
  );
}
