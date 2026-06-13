import { NextRequest } from "next/server";
import { Ratelimit, type Duration } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const RATE_LIMIT_MAX = Number.parseInt(process.env.RATE_LIMIT_MAX ?? "3", 10);
const RATE_LIMIT_WINDOW_SEC = Number.parseInt(
  process.env.RATE_LIMIT_WINDOW_SEC ?? "60",
  10,
);
const DAILY_TOTAL_CAP = Number.parseInt(
  process.env.DAILY_TOTAL_CAP ?? "500",
  10,
);

const RATE_LIMIT_WINDOW_MS = RATE_LIMIT_WINDOW_SEC * 1000;

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  // 차단 사유 — 사용자 안내 메시지를 분기하기 위해 사용
  reason?: "ip" | "daily";
}

export function getClientIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

// Upstash 자격증명 해석.
// `UPSTASH_*`(직접 설정·.env.example 문서화)를 우선하고,
// 없으면 Vercel-Upstash 연동이 자동 주입하는 `KV_*`로 폴백한다.
function getUpstashCredentials(): { url: string; token: string } | null {
  const url =
    process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    return null;
  }

  return { url, token };
}

const upstashCredentials = getUpstashCredentials();
const isUpstashConfigured = upstashCredentials !== null;

// Upstash 클라이언트/리미터는 환경변수가 있을 때만 lazy 초기화
let limiters: { ip: Ratelimit; daily: Ratelimit } | null = null;

function getLimiters(): { ip: Ratelimit; daily: Ratelimit } {
  if (!limiters) {
    // isUpstashConfigured로 진입 전 가드되므로 여기서는 항상 non-null
    const redis = new Redis(upstashCredentials!);

    limiters = {
      ip: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(
          RATE_LIMIT_MAX,
          `${RATE_LIMIT_WINDOW_SEC} s` as Duration,
        ),
        prefix: "ginini:ip",
      }),
      daily: new Ratelimit({
        redis,
        limiter: Ratelimit.fixedWindow(DAILY_TOTAL_CAP, "1 d"),
        prefix: "ginini:daily",
      }),
    };
  }

  return limiters;
}

// 로컬 개발용 in-memory 폴백. 서버리스에서는 인스턴스마다 분리되어 신뢰할 수 없으므로
// 프로덕션에서는 반드시 Upstash 환경변수를 설정해야 한다.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimitInMemory(ip: string): RateLimitResult {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0, reason: "ip" };
  }

  record.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX - record.count };
}

export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  if (!isUpstashConfigured) {
    if (process.env.NODE_ENV === "production") {
      console.warn(
        "[rate-limit] Upstash 환경변수가 없어 in-memory 폴백을 사용합니다. 서버리스 환경에서는 비용 방어가 되지 않습니다.",
      );
    }

    return checkRateLimitInMemory(ip);
  }

  const { ip: ipLimiter, daily: dailyLimiter } = getLimiters();

  // IP 제한을 먼저 확인해 남용 IP를 일일 총량 카운터를 건드리기 전에 차단
  const ipResult = await ipLimiter.limit(ip);

  if (!ipResult.success) {
    return { allowed: false, remaining: 0, reason: "ip" };
  }

  const dailyResult = await dailyLimiter.limit("global");

  if (!dailyResult.success) {
    return { allowed: false, remaining: 0, reason: "daily" };
  }

  return { allowed: true, remaining: ipResult.remaining };
}
