import { NextRequest, NextResponse } from "next/server";
import Replicate, { type FileOutput } from "replicate";

// AI 추론이 최대 120초 걸릴 수 있어서 Next.js route 타임아웃을 연장
export const maxDuration = 120;

// ✏️ 모델 변경 시 이 ID를 교체하세요 (replicate.com/explore 에서 검색)
const MODEL = "black-forest-labs/flux-dev" as const;

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const PROMPT =
  "Transform this person into a cute guinea pig character. " +
  "Preserve the hairstyle, glasses, and facial expression of the original person. " +
  "Cartoon style, soft warm colors, fluffy fur, round chubby face.";

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

    if (!image) {
      return NextResponse.json(
        { message: "이미지가 없습니다." },
        { status: 400 },
      );
    }

    const arrayBuffer = await image.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: image.type });

    const output = await replicate.run(MODEL, {
      input: {
        image: blob,
        prompt: PROMPT,
        prompt_strength: 0.8, // ✏️ 0~1, 높을수록 원본에서 더 많이 변형
        num_inference_steps: 28,
        guidance: 3.5,        // flux-dev 파라미터명 (guidance_scale 아님)
      },
    }) as FileOutput[];

    // SDK 1.x는 FileOutput 객체를 반환 — .url().href 로 문자열 추출
    const resultUrl = output[0].url().href;

    return NextResponse.json(
      { resultUrl },
      { headers: { "X-RateLimit-Remaining": String(remaining) } },
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";

    if (message.includes("402") || message.includes("insufficient")) {
      return NextResponse.json(
        { message: "API 크레딧이 부족합니다." },
        { status: 402 },
      );
    }

    return NextResponse.json(
      { message: "변환 중 오류가 발생했습니다. 다시 시도해 주세요." },
      { status: 500 },
    );
  }
}
