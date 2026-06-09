"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ReactCrop, { type Crop, type PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useImageSessionStore } from "@entities/image-session";
import { useToast } from "@shared/model";

async function getCroppedBlob(
  image: HTMLImageElement,
  pixelCrop: PixelCrop,
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = Math.round(pixelCrop.width * scaleX);
  canvas.height = Math.round(pixelCrop.height * scaleY);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context not available");
  ctx.drawImage(
    image,
    Math.round(pixelCrop.x * scaleX),
    Math.round(pixelCrop.y * scaleY),
    Math.round(pixelCrop.width * scaleX),
    Math.round(pixelCrop.height * scaleY),
    0,
    0,
    canvas.width,
    canvas.height,
  );
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Blob 변환 실패"))),
      "image/jpeg",
      0.92,
    );
  });
}

export function ImageCropModal() {
  const { uploadedImage, setCroppedImage, setStep } = useImageSessionStore();
  const imgRef = useRef<HTMLImageElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    x: 15,
    y: 15,
    width: 70,
    height: 70,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const { error: showError } = useToast();

  useEffect(() => {
    confirmRef.current?.focus();
  }, []);

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;
      const size = Math.min(width, height) * 0.7;
      const x = (width - size) / 2;
      const y = (height - size) / 2;
      setCompletedCrop({
        unit: "px",
        x: Math.round(x),
        y: Math.round(y),
        width: Math.round(size),
        height: Math.round(size),
      });
      setCrop({
        unit: "px",
        x: Math.round(x),
        y: Math.round(y),
        width: Math.round(size),
        height: Math.round(size),
      });
    },
    [],
  );

  const handleConfirm = useCallback(async () => {
    if (!imgRef.current || !completedCrop) {
      showError("크롭 영역을 선택해 주세요.");
      return;
    }
    try {
      const blob = await getCroppedBlob(imgRef.current, completedCrop);
      setCroppedImage(blob);
      setStep("animal-select");
    } catch {
      showError("크롭 처리 중 오류가 발생했습니다.");
    }
  }, [completedCrop, setCroppedImage, setStep, showError]);

  if (!uploadedImage) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="crop-dialog-title"
      className="fixed inset-0 z-50 flex flex-col bg-[#faf7f2] md:left-1/2 md:right-auto md:-translate-x-1/2 md:max-w-sm md:w-full md:top-8 md:bottom-8 md:rounded-3xl md:overflow-hidden"
    >
      {/* 상단 타이틀 */}
      <div className="flex items-center px-5 pt-12 pb-4">
        <button
          onClick={() => setStep("upload")}
          aria-label="뒤로 가기"
          className="text-gray-400 hover:text-gray-700 transition-colors text-xl leading-none mr-3 cursor-pointer"
        >
          &#8249;
        </button>
        <h2 id="crop-dialog-title" className="text-gray-800 text-base font-semibold">동그랗게 맞추기</h2>
      </div>

      {/* 크롭 영역 — 화면을 가득 채우고 원형 컷아웃 효과 */}
      <div className="flex-1 flex items-center justify-center overflow-hidden crop-fullscreen">
        <ReactCrop
          crop={crop}
          onChange={(c) => setCrop(c)}
          onComplete={(c) => setCompletedCrop(c)}
          circularCrop
          aspect={1}
          minWidth={80}
          minHeight={80}
          className="max-h-full"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={uploadedImage}
            alt="크롭할 이미지"
            className="max-w-full max-h-full object-contain block"
            onLoad={onImageLoad}
          />
        </ReactCrop>
      </div>

      {/* 하단 고정 바 */}
      <div className="px-5 pb-10 pt-4 flex flex-col gap-3">
        <p className="text-center text-gray-400 text-xs">
          드래그해서 얼굴을 맞춰요
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setStep("upload")}
            className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-100 transition-colors cursor-pointer"
          >
            다시 선택
          </button>
          <button
            ref={confirmRef}
            onClick={handleConfirm}
            className="flex-2 flex-[2] py-3 rounded-2xl bg-amber-400 text-white text-sm font-semibold hover:bg-amber-500 active:scale-95 transition-all cursor-pointer"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
