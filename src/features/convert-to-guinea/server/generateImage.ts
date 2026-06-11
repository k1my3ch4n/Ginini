import Replicate, { type FileOutput } from "replicate";

const MODEL = "black-forest-labs/flux-2-pro" as const;

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

function isUnsupportedSeedError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  return /seed|unknown|unrecognized|unexpected|validation/i.test(
    error.message,
  );
}

export async function generateImage(
  prompt: string,
  seed: number,
): Promise<string> {
  const input = {
    prompt,
    aspect_ratio: "1:1",
    output_format: "jpg",
    safety_tolerance: 2,
    seed,
  };

  let output: FileOutput;

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

  return output.url().href;
}
