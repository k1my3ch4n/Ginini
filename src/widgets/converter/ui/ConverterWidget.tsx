"use client";

import { useImageSessionStore } from "@entities/image-session";
import { UploadScreen, ImageCropModal } from "@features/image-upload";
import {
  ConvertingLoader,
  ConversionResult,
  AnimalSelectModal,
} from "@features/convert-to-guinea";
import { IdleScreen } from "./IdleScreen";
import { ErrorScreen } from "./ErrorScreen";

export function ConverterWidget() {
  const { step, setStep, reset } = useImageSessionStore();

  if (step === "upload") {
    return <UploadScreen />;
  }

  if (step === "cropping") {
    return <ImageCropModal />;
  }

  if (step === "animal-select") {
    return <AnimalSelectModal />;
  }

  if (step === "converting") {
    return <ConvertingLoader />;
  }

  if (step === "done") {
    return <ConversionResult />;
  }

  if (step === "error") {
    return <ErrorScreen onRetry={reset} />;
  }

  /* step === 'idle' — 랜딩 화면 (마스코트 대화형) */
  return <IdleScreen onStart={() => setStep("upload")} />;
}
