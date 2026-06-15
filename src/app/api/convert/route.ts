import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { ANIMAL_TRAIT_MAP } from "@shared/lib/animal-traits";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_SIZE_BYTES,
  MAX_IMAGE_SIZE_MB,
} from "@shared/lib/image";
import { checkRateLimit, getClientIP } from "@shared/lib/rate-limit";
import { sanitizeCustomTrait } from "@shared/lib/sanitize";
import { analyzeFace } from "@features/convert-to-guinea/server/analyzeFace";
import { buildPrompt } from "@features/convert-to-guinea/server/buildPrompt";
import { ConvertError } from "@features/convert-to-guinea/server/errors";
import { generateImage } from "@features/convert-to-guinea/server/generateImage";
import { persistResult } from "@features/convert-to-guinea/server/persistResult";

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

function getStableGenerationSeed(arrayBuffer: ArrayBuffer): number {
  const overrideSeed = process.env.IMAGE_GENERATION_SEED;

  if (overrideSeed) {
    const seed = Number.parseInt(overrideSeed, 10);

    return Number.isFinite(seed) && seed > 0 ? seed : DEFAULT_GENERATION_SEED;
  }

  const hash = createHash("sha256").update(Buffer.from(arrayBuffer)).digest();

  return (hash.readUInt32BE(0) % 2147483647) + 1;
}

export async function POST(req: NextRequest) {
  const ip = getClientIP(req);
  const { allowed, remaining, reason } = await checkRateLimit(ip);

  if (!allowed) {
    const message =
      reason === "daily"
        ? "오늘 준비된 기니피그가 모두 소진됐어요 🐹 내일 다시 와주세요."
        : "요청 횟수를 초과했습니다. 잠시 후 다시 시도해 주세요.";

    return NextResponse.json(
      { message },
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

    if (
      !ALLOWED_IMAGE_TYPES.includes(
        image.type as (typeof ALLOWED_IMAGE_TYPES)[number],
      )
    ) {
      return NextResponse.json(
        { message: "JPG, PNG, WebP 형식의 이미지만 업로드할 수 있습니다." },
        { status: 400 },
      );
    }

    if (image.size > MAX_IMAGE_SIZE_BYTES) {
      return NextResponse.json(
        { message: `파일 크기는 ${MAX_IMAGE_SIZE_MB}MB 이하여야 합니다.` },
        { status: 400 },
      );
    }

    const traitDescription = getTraitDescription(animalTrait);

    const arrayBuffer = await image.arrayBuffer();
    const seed = getStableGenerationSeed(arrayBuffer);

    const faceFeatures = await analyzeFace(arrayBuffer, image.type);

    const prompt = buildPrompt(faceFeatures, traitDescription);

    const generated = await generateImage(prompt, seed);

    const { resultUrl, resultId } = await persistResult(
      generated,
      animalTrait,
    );

    return NextResponse.json(
      { resultUrl, resultId },
      { headers: { "X-RateLimit-Remaining": String(remaining) } },
    );
  } catch (err) {
    console.error("[convert] error:", err);

    if (err instanceof ConvertError) {
      return NextResponse.json(
        { message: err.message },
        { status: err.status },
      );
    }

    const message =
      err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";

    return NextResponse.json(
      {
        message: "변환 중 오류가 발생했습니다. 다시 시도해 주세요.",
        ...(process.env.NODE_ENV === "development" && { detail: message }),
      },
      { status: 500 },
    );
  }
}
