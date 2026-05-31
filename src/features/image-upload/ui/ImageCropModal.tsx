"use client";

import { useCallback, useRef, useState } from "react";
import ReactCrop, { type Crop, type PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useImageSessionStore } from "@entities/image-session";
import { Button } from "@shared/ui";
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
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    x: 10,
    y: 10,
    width: 80,
    height: 80,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const { error: showError } = useToast();

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;
      setCompletedCrop({
        unit: "px",
        x: Math.round(width * 0.1),
        y: Math.round(height * 0.1),
        width: Math.round(width * 0.8),
        height: Math.round(height * 0.8),
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
      setStep("idle");
    } catch {
      showError("크롭 처리 중 오류가 발생했습니다.");
    }
  }, [completedCrop, setCroppedImage, setStep, showError]);

  const handleCancel = useCallback(() => {
    setStep("idle");
  }, [setStep]);

  if (!uploadedImage) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="flex flex-col gap-5 w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl">
        <h2 className="text-lg font-semibold text-zinc-800">이미지 크롭</h2>
        <div className="flex items-center justify-center overflow-auto rounded-xl bg-zinc-100 max-h-[60vh]">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            minWidth={50}
            minHeight={50}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- react-image-crop requires a plain <img> ref for canvas coordinate calculation */}
            <img
              ref={imgRef}
              src={uploadedImage}
              alt="크롭할 이미지"
              className="max-w-full max-h-[55vh] object-contain block"
              onLoad={onImageLoad}
            />
          </ReactCrop>
        </div>
        <p className="text-sm text-zinc-500">
          원하는 영역을 선택하세요. 선택하지 않으면 전체 이미지가 사용됩니다.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={handleCancel}>
            취소
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            크롭 완료
          </Button>
        </div>
      </div>
    </div>
  );
}
