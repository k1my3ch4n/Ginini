"use client";

import { useImageSessionStore } from "@entities/image-session";
import {
  ImageDropZone,
  ImageCropModal,
  ImagePreview,
} from "@features/image-upload";
import {
  ConvertingLoader,
  ConversionResult,
  useConvertImage,
} from "@features/convert-to-guinea";
import { Button } from "@shared/ui";

export function ConverterWidget() {
  const { step, croppedImage, reset } = useImageSessionStore();
  const { mutate: convert } = useConvertImage();

  const handleConvert = () => {
    if (croppedImage) {
      convert(croppedImage);
    }
  };

  if (step === "converting") {
    return (
      <div className="animate-fade-in">
        <ConvertingLoader />
      </div>
    );
  }

  if (step === "done") {
    return (
      <div className="animate-fade-in">
        <ConversionResult />
      </div>
    );
  }

  if (step === "error") {
    return (
      <div className="animate-fade-in flex flex-col items-center gap-4 py-12 px-4">
        <div className="text-5xl">😢</div>
        <p className="text-lg font-semibold text-gray-800">
          변환 중 오류가 발생했어요
        </p>
        <p className="text-sm text-gray-500">잠시 후 다시 시도해 주세요.</p>
        <Button onClick={reset}>다시 시도하기</Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in w-full">
      {step === "cropping" && <ImageCropModal />}
      {croppedImage ? (
        <div className="flex flex-col items-center gap-5">
          <ImagePreview />
          <Button size="md" onClick={handleConvert} className="w-full max-w-xs">
            🐹 기니피그로 변환하기
          </Button>
        </div>
      ) : (
        <ImageDropZone />
      )}
    </div>
  );
}
