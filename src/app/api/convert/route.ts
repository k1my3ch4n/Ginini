import { NextRequest, NextResponse } from "next/server";
import Replicate, { type FileOutput } from "replicate";

// AI 추론이 최대 120초 걸릴 수 있어서 Next.js route 타임아웃을 연장
export const maxDuration = 120;

const MODEL = "black-forest-labs/flux-kontext-pro" as const;

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const PROMPT_CARTOON =
  "Redraw the person in this photo as a cute kawaii anthropomorphic guinea pig character that is fully dressed in the same outfit as the person. " +
  "The character MUST be wearing clothes — this is required. The outfit must exactly match the clothing visible in the input photo: same garment type, same colors, same style. " +
  "ACCESSORIES: Reproduce every accessory visible in the photo (bags, glasses, hats, jewelry, etc.) on the character. If no accessories are visible in the photo, add none. " +
  "HAIR: Give the guinea pig the same hairstyle, hair length, and hair color as the person in the photo. " +
  "FACE: Reflect the person's unique facial features (eye shape, eyebrow style, face shape, expression) so the character is recognizable as this specific person. " +
  "GUINEA PIG FEATURES: small rounded ears (NOT pointy), tiny Y-shaped nose pointing downward (NOT upturned pig snout), round compact head, chubby cheeks, NO tail, short stubby legs, round chubby torso. Short brushstroke fur texture. Large round cute eyes with a single white highlight dot. Small rounded mitten paws, NO claws. " +
  "Art style: 2D cartoon illustration, clean black ink outlines, cel-shading, NOT 3D rendered. Clean white background.";

const PROMPT_REALISTIC =
  "Transform the person in this photo into a photorealistic guinea pig. " +
  "Match the guinea pig's fur color and pattern to the person's hair color and style. " +
  "Reflect the same emotional expression and mood from the original photo on the guinea pig's face. " +
  "GUINEA PIG FEATURES: real guinea pig anatomy — short rounded ears, small flat nose, compact round body, short legs, no tail, dense realistic fur. " +
  "The result must look like an actual photograph of a real guinea pig, NOT a cartoon, illustration, or 3D render. " +
  "Highly detailed realistic fur texture, natural photographic lighting, sharp focus, shallow depth of field. " +
  "Keep the same pose orientation and framing as the original photo. Soft neutral or matching background.";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX ?? "3", 10);
const RATE_LIMIT_WINDOW =
  parseInt(process.env.RATE_LIMIT_WINDOW_SEC ?? "60", 10) * 1000;

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX - record.count };
}

export async function POST(req: NextRequest) {
  const ip = getClientIP(req);
  const { allowed, remaining } = checkRateLimit(ip);

  if (!allowed) {
    return NextResponse.json(
      { message: "요청 횟수를 초과했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 429, headers: { "X-RateLimit-Remaining": "0" } },
    );
  }

  try {
    const formData = await req.formData();
    const image = formData.get("image") as File | null;
    const mode = (formData.get("mode") as string | null) ?? "cartoon";

    if (!image) {
      return NextResponse.json(
        { message: "이미지가 없습니다." },
        { status: 400 },
      );
    }

    const prompt = mode === "realistic" ? PROMPT_REALISTIC : PROMPT_CARTOON;

    const arrayBuffer = await image.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: image.type });

    const output = (await replicate.run(MODEL, {
      input: {
        input_image: blob,
        prompt,
        aspect_ratio: "match_input_image",
        output_format: "jpg",
        safety_tolerance: 2,
      },
    })) as FileOutput;

    const resultUrl = output.url().href;

    return NextResponse.json(
      { resultUrl },
      { headers: { "X-RateLimit-Remaining": String(remaining) } },
    );
  } catch (err) {
    console.error("[convert] Replicate error:", err);

    const message =
      err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";

    if (message.includes("402") || message.includes("insufficient")) {
      return NextResponse.json(
        { message: "API 크레딧이 부족합니다." },
        { status: 402 },
      );
    }

    return NextResponse.json(
      {
        message: "변환 중 오류가 발생했습니다. 다시 시도해 주세요.",
        ...(process.env.NODE_ENV === "development" && { detail: message }),
      },
      { status: 500 },
    );
  }
}
