"use client";

import { useMutation } from "@tanstack/react-query";
import { apiClient, ApiError } from "@shared/api";
import { useImageSessionStore, type Gender } from "@entities/image-session";
import { useToast } from "@shared/model";

interface ConvertPayload {
  blob: Blob;
  animalTrait: string;
  gender: Gender;
}

export function useConvertImage() {
  const setStep = useImageSessionStore((s) => s.setStep);
  const setResult = useImageSessionStore((s) => s.setResult);
  const setFaceError = useImageSessionStore((s) => s.setFaceError);
  const { error: toastError } = useToast();

  return useMutation({
    mutationFn: async ({ blob, animalTrait, gender }: ConvertPayload) => {
      const formData = new FormData();
      formData.append("image", blob, "image.jpg");
      formData.append("animalTrait", animalTrait);
      formData.append("gender", gender);

      const { data } = await apiClient.post<{
        resultUrl: string;
        resultId?: string;
      }>("/convert", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return data;
    },
    onMutate: () => {
      setStep("converting");
    },
    onSuccess: ({ resultUrl, resultId }) => {
      setResult(resultUrl, resultId ?? null);
      setStep("done");
    },
    onError: (error: Error) => {
      if (error instanceof ApiError && error.status === 422) {
        setFaceError(true);
      }
      setStep("error");
      toastError(error.message);
    },
  });
}
