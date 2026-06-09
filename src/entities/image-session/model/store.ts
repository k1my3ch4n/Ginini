import { create } from "zustand";

export type ConversionStep =
  | "idle"
  | "upload"
  | "cropping"
  | "animal-select"
  | "converting"
  | "done"
  | "error";

interface ImageSessionState {
  step: ConversionStep;
  uploadedImage: string | null;
  croppedImage: Blob | null;
  resultImage: string | null;
  animalTrait: string;

  setStep: (step: ConversionStep) => void;
  setUploadedImage: (dataURL: string) => void;
  setCroppedImage: (blob: Blob) => void;
  setResultImage: (url: string) => void;
  setAnimalTrait: (trait: string) => void;
  reset: () => void;
}

const initialState = {
  step: "idle" as ConversionStep,
  uploadedImage: null,
  croppedImage: null,
  resultImage: null,
  animalTrait: "",
};

export const useImageSessionStore = create<ImageSessionState>((set) => ({
  ...initialState,

  setStep: (step) => set({ step }),
  setUploadedImage: (dataURL) => set({ uploadedImage: dataURL }),
  setCroppedImage: (blob) => set({ croppedImage: blob }),
  setResultImage: (url) => set({ resultImage: url }),
  setAnimalTrait: (trait) => set({ animalTrait: trait }),
  reset: () => set(initialState),
}));
