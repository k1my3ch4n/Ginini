import { del, list } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const TTL_MS = 30 * 24 * 60 * 60 * 1000;

// Vercel Blob에 저장된 results/* 중 30일이 지난 항목(이미지 + 메타데이터)을 정리한다.
// Vercel Cron이 매일 호출하며, Authorization: Bearer ${CRON_SECRET} 헤더로 인증한다.
export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret) {
    if (req.headers.get("authorization") !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  } else {
    console.warn(
      "[cron/cleanup] CRON_SECRET이 설정되지 않아 인증 없이 동작합니다.",
    );
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return new NextResponse(null, { status: 204 });
  }

  try {
    const cutoff = Date.now() - TTL_MS;
    const staleUrls: string[] = [];
    let cursor: string | undefined;

    do {
      const result = await list({ prefix: "results/", cursor, limit: 1000 });

      for (const blob of result.blobs) {
        if (blob.uploadedAt.getTime() < cutoff) {
          staleUrls.push(blob.url);
        }
      }

      cursor = result.hasMore ? result.cursor : undefined;
    } while (cursor);

    if (staleUrls.length > 0) {
      await del(staleUrls);
    }

    return NextResponse.json({ deleted: staleUrls.length });
  } catch (err) {
    console.error("[cron/cleanup] error:", err);

    return NextResponse.json(
      { message: "정리 작업 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
