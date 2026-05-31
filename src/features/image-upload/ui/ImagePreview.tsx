"use client";

import { useEffect, useMemo } from "react";
import { useImageSessionStore } from "@entities/image-session";
import { Button } from "@shared/ui";

export function ImagePreview() {
  const { croppedImage, uploadedImage, reset, setStep } =
    useImageSessionStore();

  const previewURL = useMemo(
    () => (croppedImage ? URL.createObjectURL(croppedImage) : null),
    [croppedImage],
  );

  useEffect(() => {
    return () => {
      if (previewURL) URL.revokeObjectURL(previewURL);
    };
  }, [previewURL]);

  if (!previewURL) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-md border border-zinc-200">
        {/* eslint-disable-next-line @next/next/no-img-element -- blob: URLs are not supported by next/image */}
        <img
          src={previewURL}
          alt="선택된 이미지 미리보기"
          className="w-full object-cover"
        />
      </div>
      <div className="flex gap-3">
        {uploadedImage && (
          <Button variant="ghost" size="sm" onClick={() => setStep("cropping")}>
            크롭 수정
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={reset}>
          다시 선택
        </Button>
      </div>
    </div>
  );
}
