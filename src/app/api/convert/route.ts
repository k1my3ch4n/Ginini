import { NextRequest, NextResponse } from "next/server";
import { ANIMAL_TRAIT_MAP } from "@shared/lib/animal-traits";
import { checkRateLimit, getClientIP } from "@shared/lib/rate-limit";
import { sanitizeCustomTrait } from "@shared/lib/sanitize";
import { analyzeFace } from "@features/convert-to-guinea/server/analyzeFace";
import { buildPrompt } from "@features/convert-to-guinea/server/buildPrompt";
import { generateImage } from "@features/convert-to-guinea/server/generateImage";

// AI 추론이 최대 120초 걸릴 수 있어서 Next.js route 타임아웃을 연장
export const maxDuration = 120;

const DEFAULT_GENERATION_SEED = 20250407;

function getTraitDescription(rawTrait: string): string {
  const trait = rawTrait.trim();

  if (!trait) {
    return "";
  }

  const mappedTrait = ANIMAL_TRAIT_MAP[trait];

  if (mappedTrait) {
    return mappedTrait;
  }

  const sanitizedTrait = sanitizeCustomTrait(trait);

  return sanitizedTrait
    ? `custom visual impression keywords: ${sanitizedTrait}`
    : "";
}

function getStableGenerationSeed(): number {
  const seed = Number.parseInt(
    process.env.IMAGE_GENERATION_SEED ?? String(DEFAULT_GENERATION_SEED),
    10,
  );

  return Number.isFinite(seed) && seed > 0 ? seed : DEFAULT_GENERATION_SEED;
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
    const animalTrait = (formData.get("animalTrait") as string | null) ?? "";

    if (!image) {
      return NextResponse.json(
        { message: "이미지가 없습니다." },
        { status: 400 },
      );
    }

    const traitDescription = getTraitDescription(animalTrait);

    const arrayBuffer = await image.arrayBuffer();
    const seed = getStableGenerationSeed();

    const faceFeatures = await analyzeFace(arrayBuffer, image.type);
    console.log("[convert] Gemini face analysis:", faceFeatures);

    const prompt = buildPrompt(faceFeatures, traitDescription);

    const resultUrl = await generateImage(prompt, seed);

    return NextResponse.json(
      { resultUrl },
      { headers: { "X-RateLimit-Remaining": String(remaining) } },
    );
  } catch (err) {
    console.error("[convert] error:", err);

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
