import { put } from "@vercel/blob";
import { nanoid } from "nanoid";
import type { GeneratedImage } from "./generateImage";

export interface PersistedResult {
  // 영구 URL(Blob 설정 시) 또는 임시 URL(미설정 폴백)
  resultUrl: string;
  // 공유 페이지 /r/[id] 의 키가 되는 추측 불가능한 식별자
  resultId: string;
}

const isBlobConfigured = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

// 결과 이미지를 자체 스토리지로 복사해 영구 URL을 확보한다.
// Replicate 임시 URL은 약 1시간 후 만료되므로 공유/재접근의 전제 조건.
export async function persistResult(
  image: GeneratedImage,
): Promise<PersistedResult> {
  const resultId = nanoid(12);

  if (!isBlobConfigured) {
    if (process.env.NODE_ENV === "production") {
      console.warn(
        "[persist] BLOB_READ_WRITE_TOKEN이 없어 임시 URL을 반환합니다. 결과 이미지는 약 1시간 후 만료됩니다.",
      );
    }

    return { resultUrl: image.url, resultId };
  }

  const blob = await image.toBlob();

  const { url } = await put(`results/${resultId}.jpg`, blob, {
    access: "public",
    contentType: "image/jpeg",
    addRandomSuffix: false,
  });

  return { resultUrl: url, resultId };
}
