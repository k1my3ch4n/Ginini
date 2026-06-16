import { create } from "zustand";

export type ConversionStep =
  | "idle"
  | "upload"
  | "cropping"
  | "animal-select"
  | "converting"
  | "done"
  | "error";

export type Gender = "masculine" | "feminine";

interface ImageSessionState {
  step: ConversionStep;
  uploadedImage: string | null;
  croppedImage: Blob | null;
  resultImage: string | null;
  resultId: string | null;
  animalTrait: string;
  faceError: boolean;

  setStep: (step: ConversionStep) => void;
  setUploadedImage: (dataURL: string) => void;
  setCroppedImage: (blob: Blob) => void;
  setResult: (url: string, id: string | null) => void;
  setAnimalTrait: (trait: string) => void;
  setFaceError: (val: boolean) => void;
  reset: () => void;
}

const initialState = {
  step: "idle" as ConversionStep,
  uploadedImage: null,
  croppedImage: null,
  resultImage: null,
  resultId: null,
  animalTrait: "",
  faceError: false,
};

export const useImageSessionStore = create<ImageSessionState>((set) => ({
  ...initialState,

  setStep: (step) => set({ step }),
  setUploadedImage: (dataURL) => set({ uploadedImage: dataURL }),
  setCroppedImage: (blob) => set({ croppedImage: blob }),
  setResult: (url, id) => set({ resultImage: url, resultId: id }),
  setAnimalTrait: (trait) => set({ animalTrait: trait }),
  setFaceError: (val) => set({ faceError: val }),
  reset: () => set(initialState),
}));
