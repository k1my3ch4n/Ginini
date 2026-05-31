import { create } from "zustand";

export type ConversionStep =
  | "idle"
  | "cropping"
  | "converting"
  | "done"
  | "error";

interface ImageSessionState {
  step: ConversionStep;
  uploadedImage: string | null;
  croppedImage: Blob | null;
  resultImage: string | null;

  setStep: (step: ConversionStep) => void;
  setUploadedImage: (dataURL: string) => void;
  setCroppedImage: (blob: Blob) => void;
  setResultImage: (url: string) => void;
  reset: () => void;
}

const initialState = {
  step: "idle" as ConversionStep,
  uploadedImage: null,
  croppedImage: null,
  resultImage: null,
};

export const useImageSessionStore = create<ImageSessionState>((set) => ({
  ...initialState,

  setStep: (step) => set({ step }),
  setUploadedImage: (dataURL) => set({ uploadedImage: dataURL }),
  setCroppedImage: (blob) => set({ croppedImage: blob }),
  setResultImage: (url) => set({ resultImage: url }),
  reset: () => set(initialState),
}));
