"use client";

import { useCallback, useRef } from "react";
import { validateImageFile, fileToDataURL } from "@shared/lib";
import { useImageSessionStore } from "@entities/image-session";
import { useToast } from "@shared/model";
import { ScreenHeader } from "@shared/ui";

export function UploadScreen() {
  const cameraRef = useRef<HTMLInputElement>(null);
  const albumRef = useRef<HTMLInputElement>(null);
  const { setUploadedImage, setStep } = useImageSessionStore();
  const { error: showError } = useToast();

  const processFile = useCallback(
    async (file: File) => {
      const result = validateImageFile(file);
      if (!result.valid) {
        showError(result.error!);
        return;
      }
      const dataURL = await fileToDataURL(file);
      setUploadedImage(dataURL);
      setStep("cropping");
    },
    [setUploadedImage, setStep, showError],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
      e.target.value = "";
    }
  };

  return (
    <div className="flex flex-col w-full min-h-dvh bg-[#FBF7F1] px-5 pt-6 pb-10">
      <ScreenHeader title="사진 올리기" onBack={() => setStep("idle")} className="mb-8" />

      {/* hidden inputs */}
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="user"
        className="hidden"
        onChange={handleChange}
      />
      <input
        ref={albumRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleChange}
      />

      {/* 카드 버튼 2개 */}
      <div className="flex flex-col gap-4 flex-1 justify-center">
        <button
          onClick={() => cameraRef.current?.click()}
          className="flex flex-col items-center justify-center gap-3 w-full py-12 rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-[#E6A57E] hover:bg-[#fdf0e6] active:scale-95 transition-all cursor-pointer"
        >
          <CameraIcon className="w-10 h-10 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">사진 촬영하기</span>
        </button>

        <button
          onClick={() => albumRef.current?.click()}
          className="flex flex-col items-center justify-center gap-3 w-full py-12 rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-[#E6A57E] hover:bg-[#fdf0e6] active:scale-95 transition-all cursor-pointer"
        >
          <AlbumIcon className="w-10 h-10 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">앨범에서 선택</span>
        </button>
      </div>
    </div>
  );
}

function CameraIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function AlbumIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}
