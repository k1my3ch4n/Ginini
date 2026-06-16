"use client";

import {
  useImageSessionStore,
  type ConversionStep,
} from "@entities/image-session";
import { UploadScreen, ImageCropModal } from "@features/image-upload";
import {
  ConvertingLoader,
  ConversionResult,
  AnimalSelectModal,
} from "@features/convert-to-guinea";
import { useNavigationGuard } from "@shared/lib";
import { IdleScreen } from "./IdleScreen";
import { ErrorScreen } from "./ErrorScreen";

const GUARD_STEPS = new Set<ConversionStep>([
  "upload",
  "cropping",
  "animal-select",
  "converting",
]);

export function ConverterWidget() {
  const { step, setStep, reset, faceError, setFaceError } =
    useImageSessionStore();

  useNavigationGuard(GUARD_STEPS.has(step));

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
    return (
      <ErrorScreen
        onRetry={reset}
        isFaceError={faceError}
        onReupload={() => {
          setFaceError(false);
          setStep("upload");
        }}
      />
    );
  }

  /* step === 'idle' — 랜딩 화면 (마스코트 대화형) */
  return <IdleScreen onStart={() => setStep("upload")} />;
}
