import { Ref } from "react";
import { FullscreenSheet, IconButton } from "@shared/ui";

interface ResultLightboxProps {
  resultImage: string;
  title: string;
  closeButtonRef: Ref<HTMLButtonElement>;
  onClose: () => void;
  onDownload: () => void;
  onKakaoShare: () => void;
  onReset: () => void;
}

export function ResultLightbox({
  resultImage,
  title,
  closeButtonRef,
  onClose,
  onDownload,
  onKakaoShare,
  onReset,
}: ResultLightboxProps) {
  return (
    <FullscreenSheet titleId="lightbox-title">
      {/* 닫기 버튼 */}
      <div className="flex justify-end px-3 pt-10">
        <IconButton ref={closeButtonRef} onClick={onClose} aria-label="라이트박스 닫기">
          <span aria-hidden="true" className="text-xl font-bold leading-none">
            ✕
          </span>
        </IconButton>
      </div>

      {/* 이미지 */}
      <div className="flex-1 flex items-center justify-center px-6 py-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={resultImage}
          alt={`${title} 변환 결과`}
          className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain"
        />
      </div>

      {/* 타이틀 + 액션 */}
      <div className="px-5 pb-10 flex flex-col items-center gap-4">
        <p id="lightbox-title" className="text-[#4B3A2F] font-bold text-lg">
          {title}
        </p>
        <div className="flex gap-3 w-full max-w-xs">
          <button
            onClick={onDownload}
            className="flex-1 py-4 rounded-2xl border border-gray-200 text-[#4B3A2F] text-sm font-medium hover:bg-gray-100 active:scale-95 transition-all cursor-pointer"
          >
            저장
          </button>
          <button
            onClick={onKakaoShare}
            className="flex-[2] py-4 rounded-2xl bg-[#E6A57E] text-white text-sm font-semibold hover:bg-[#d4956e] active:scale-95 transition-all cursor-pointer"
          >
            공유
          </button>
          <button
            onClick={onReset}
            className="flex-1 py-4 rounded-2xl border border-gray-200 text-[#4B3A2F] text-sm font-medium hover:bg-gray-100 active:scale-95 transition-all cursor-pointer"
          >
            다시
          </button>
        </div>
      </div>
    </FullscreenSheet>
  );
}
