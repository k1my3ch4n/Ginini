import { create } from "zustand";

export type ConversionStep =
  | "idle"
  | "cropping"
  | "style-select"
  | "converting"
  | "done"
  | "error";

export type ConversionMode = "cartoon" | "realistic";

interface ImageSessionState {
  step: ConversionStep;
  uploadedImage: string | null;
  croppedImage: Blob | null;
  resultImage: string | null;
  conversionMode: ConversionMode;

  setStep: (step: ConversionStep) => void;
  setUploadedImage: (dataURL: string) => void;
  setCroppedImage: (blob: Blob) => void;
  setResultImage: (url: string) => void;
  setConversionMode: (mode: ConversionMode) => void;
  reset: () => void;
}

const initialState = {
  step: "idle" as ConversionStep,
  uploadedImage: null,
  croppedImage: null,
  resultImage: null,
  conversionMode: "cartoon" as ConversionMode,
};

export const useImageSessionStore = create<ImageSessionState>((set) => ({
  ...initialState,

  setStep: (step) => set({ step }),
  setUploadedImage: (dataURL) => set({ uploadedImage: dataURL }),
  setCroppedImage: (blob) => set({ croppedImage: blob }),
  setResultImage: (url) => set({ resultImage: url }),
  setConversionMode: (mode) => set({ conversionMode: mode }),
  reset: () => set(initialState),
}));
