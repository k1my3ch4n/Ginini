import Replicate, { type FileOutput } from "replicate";

const MODEL = "black-forest-labs/flux-2-pro" as const;

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function generateImage(prompt: string): Promise<string> {
  const output = (await replicate.run(MODEL, {
    input: {
      prompt,
      aspect_ratio: "1:1",
      output_format: "jpg",
      safety_tolerance: 2,
    },
  })) as FileOutput;

  return output.url().href;
}
