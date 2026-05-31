import { NextRequest, NextResponse } from "next/server";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX ?? "3", 10);
const RATE_LIMIT_WINDOW =
  parseInt(process.env.RATE_LIMIT_WINDOW ?? "60", 10) * 1000;

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

    // TODO: AI API 확정 후 실제 변환 로직으로 교체 (fal.ai / Replicate)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const resultUrl =
      "https://placehold.co/512x512/f59e0b/ffffff?text=Guinea+Pig!";

    return NextResponse.json(
      { resultUrl },
      { headers: { "X-RateLimit-Remaining": String(remaining) } },
    );
  } catch {
    return NextResponse.json(
      { message: "변환 중 오류가 발생했습니다. 다시 시도해 주세요." },
      { status: 500 },
    );
  }
}
