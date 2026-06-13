import { put } from "@vercel/blob";

export interface ResultMetadata {
  resultUrl: string;
  animalTrait: string;
  createdAt: string;
  // Phase 1(닮은꼴 분석 카드)에서 채워질 자리. 마이그레이션 없이 추가하기 위해 미리 예약.
  reportCard: null;
}

// Vercel Blob 토큰(`vercel_blob_rw_<storeId>_<secret>`)에서 public 호스트를 유도한다.
// 별도 env 없이 결과 메타데이터를 쓰고(persistResult) 읽을(/r/[id]) 때 동일한 base URL을 계산하기 위함.
export function getBlobPublicBaseUrl(): string | null {
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (!token) {
    return null;
  }

  const storeId = token.split("_")[3];

  if (!storeId) {
    return null;
  }

  return `https://${storeId.toLowerCase()}.public.blob.vercel-storage.com`;
}

export async function saveResultMetadata(
  resultId: string,
  metadata: ResultMetadata,
): Promise<void> {
  await put(`results/${resultId}.json`, JSON.stringify(metadata), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });
}

export async function getResultMetadata(
  resultId: string,
): Promise<ResultMetadata | null> {
  const baseUrl = getBlobPublicBaseUrl();

  if (!baseUrl) {
    return null;
  }

  try {
    const res = await fetch(`${baseUrl}/results/${resultId}.json`);

    if (!res.ok) {
      return null;
    }

    return (await res.json()) as ResultMetadata;
  } catch {
    return null;
  }
}
