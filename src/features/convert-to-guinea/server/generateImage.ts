import Replicate, { type FileOutput } from "replicate";
import { getRequiredEnv } from "@shared/lib/env";
import { GenerationFailedError, GenerationQuotaError } from "./errors";

const MODEL = "black-forest-labs/flux-2-pro" as const;

const replicate = new Replicate({
  auth: getRequiredEnv("REPLICATE_API_TOKEN"),
});

function isUnsupportedSeedError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  return /seed|unknown|unrecognized|unexpected|validation/i.test(error.message);
}

function isQuotaError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  return /402|insufficient/i.test(error.message);
}

export interface GeneratedImage {
  // Replicate가 제공하는 임시 URL (약 1시간 후 만료)
  url: string;
  // 영속 스토리지에 올리기 위한 이미지 바이트 — 필요할 때만 받아오도록 지연 호출
  toBlob: () => Promise<Blob>;
}

export async function generateImage(
  prompt: string,
  seed: number,
): Promise<GeneratedImage> {
  const input = {
    prompt,
    aspect_ratio: "1:1",
    output_format: "jpg",
    safety_tolerance: 2,
    seed,
  };

  let output: FileOutput;

  try {
    try {
      output = (await replicate.run(MODEL, { input })) as FileOutput;
    } catch (error) {
      if (!isUnsupportedSeedError(error)) {
        throw error;
      }

      console.warn(
        "[convert] Replicate rejected the seed input; retrying without seed.",
        error instanceof Error ? error.message : error,
      );

      output = (await replicate.run(MODEL, {
        input: {
          prompt: input.prompt,
          aspect_ratio: input.aspect_ratio,
          output_format: input.output_format,
          safety_tolerance: input.safety_tolerance,
        },
      })) as FileOutput;
    }
  } catch (error) {
    if (isQuotaError(error)) {
      throw new GenerationQuotaError();
    }

    throw new GenerationFailedError(
      error instanceof Error ? error.message : undefined,
    );
  }

  return {
    url: output.url().href,
    toBlob: () => output.blob(),
  };
}
