"use client";

import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@shared/api";
import { useImageSessionStore } from "@entities/image-session";
import { useToast } from "@shared/model";

interface ConvertPayload {
  blob: Blob;
  animalTrait: string;
}

export function useConvertImage() {
  const setStep = useImageSessionStore((s) => s.setStep);
  const setResultImage = useImageSessionStore((s) => s.setResultImage);
  const { error: toastError } = useToast();

  return useMutation({
    mutationFn: async ({ blob, animalTrait }: ConvertPayload) => {
      const formData = new FormData();
      formData.append("image", blob, "image.jpg");
      formData.append("animalTrait", animalTrait);

      const { data } = await apiClient.post<{ resultUrl: string }>(
        "/convert",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      return data.resultUrl;
    },
    onMutate: () => {
      setStep("converting");
    },
    onSuccess: (resultUrl) => {
      setResultImage(resultUrl);
      setStep("done");
    },
    onError: (error: Error) => {
      setStep("error");
      toastError(error.message);
    },
  });
}
