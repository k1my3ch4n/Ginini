import { Ref } from "react";
import { IconButton, ScreenLayout } from "@shared/ui";

interface ResultLightboxProps {
  resultImage: string;
  title: string;
  closeButtonRef: Ref<HTMLButtonElement>;
  onClose: () => void;
  onDownload: () => void;
  onKakaoShare: () => void;
}

export function ResultLightbox({
  resultImage,
  title,
  closeButtonRef,
  onClose,
  onDownload,
  onKakaoShare,
}: ResultLightboxProps) {
  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6 py-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xs max-h-[90vh] rounded-3xl bg-page p-4 shadow-2xl flex flex-col"
      >
        <ScreenLayout
          variant="sheet"
          contentClassName="flex flex-col gap-4 px-0"
          footerClassName="px-0 pt-4 pb-0 flex-row"
          footer={
            <>
              <button
                onClick={onDownload}
                className="flex-1 py-4 rounded-2xl bg-brand text-white text-sm font-semibold hover:bg-brand-hover active:scale-95 transition-all cursor-pointer"
              >
                저장
              </button>
              <button
                onClick={onKakaoShare}
                className="flex-1 py-4 rounded-2xl bg-kakao text-kakao-ink text-sm font-semibold hover:bg-kakao-hover active:scale-95 transition-all cursor-pointer"
              >
                카카오톡 공유
              </button>
            </>
          }
        >
          {/* 닫기 버튼 */}
          <div className="flex justify-end">
            <IconButton ref={closeButtonRef} onClick={onClose} aria-label="라이트박스 닫기">
              <span aria-hidden="true" className="text-xl font-bold leading-none">
                ✕
              </span>
            </IconButton>
          </div>

          {/* 이미지 */}
          <div className="flex items-center justify-center px-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={resultImage}
              alt={`${title} 변환 결과`}
              className="max-w-full max-h-[60vh] rounded-2xl shadow-md object-contain"
            />
          </div>
        </ScreenLayout>
      </div>
    </div>
  );
}
