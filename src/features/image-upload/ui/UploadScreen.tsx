"use client";

import { useCallback, useRef } from "react";
import Link from "next/link";
import { validateImageFile, fileToDataURL } from "@shared/lib";
import { useImageSessionStore } from "@entities/image-session";
import { useToast } from "@shared/model";
import { AlbumIcon, CameraIcon, ScreenHeader, ScreenLayout, UploadOptionCard } from "@shared/ui";

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
    <ScreenLayout
      header={<ScreenHeader title="사진 올리기" onBack={() => setStep("idle")} className="mb-6" />}
      contentClassName="flex flex-col gap-4 justify-center"
      footer={
        <p className="text-center text-xs text-gray-400">
          업로드한 사진은 변환에만 사용되고 저장되지 않아요.{" "}
          <Link href="/privacy" className="underline hover:text-gray-600 transition-colors">
            자세히 보기
          </Link>
        </p>
      }
    >
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
      <UploadOptionCard
        icon={<CameraIcon className="w-10 h-10 text-gray-400" />}
        label="사진 촬영하기"
        onClick={() => cameraRef.current?.click()}
      />
      <UploadOptionCard
        icon={<AlbumIcon className="w-10 h-10 text-gray-400" />}
        label="앨범에서 선택"
        onClick={() => albumRef.current?.click()}
      />
    </ScreenLayout>
  );
}
