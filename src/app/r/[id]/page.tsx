import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getResultMetadata } from "@features/convert-to-guinea/server/resultMetadata";

interface PageProps {
  params: Promise<{ id: string }>;
}

function getTitle(animalTrait: string): string {
  return animalTrait ? `${animalTrait} 기니피그` : "기니피그";
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const metadata = await getResultMetadata(id);

  if (!metadata) {
    return { title: "결과를 찾을 수 없어요" };
  }

  const title = `${getTitle(metadata.animalTrait)} | Ginini`;
  const description = "나도 기니피그가 됐어! 너도 해봐 🐹";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: `/r/${id}/opengraph-image`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/r/${id}/opengraph-image`],
    },
    // 추측 불가능한 id이지만, 얼굴 기반 결과물이라 검색 노출은 막는다.
    robots: { index: false, follow: false },
  };
}

export default async function ResultPage({ params }: PageProps) {
  const { id } = await params;
  const metadata = await getResultMetadata(id);

  if (!metadata) {
    notFound();
  }

  const title = getTitle(metadata.animalTrait);

  return (
    <div className="flex flex-col items-center gap-8 py-8 px-4 w-full">
      <div className="text-center">
        <div className="text-4xl mb-2">🐹</div>
        <h1 className="text-xl font-bold text-ink">{title}</h1>
        <p className="text-sm text-gray-500 mt-1">
          누군가 Ginini로 변환한 기니피그예요
        </p>
      </div>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={metadata.resultUrl}
        alt={`${title} 변환 결과`}
        className="w-full max-w-sm aspect-square object-cover rounded-2xl border-2 border-brand shadow-md"
      />

      <Link
        href="/"
        className="w-full max-w-xs text-center rounded-2xl bg-brand py-4 text-sm font-semibold text-white hover:bg-brand-hover active:scale-95 transition-all"
      >
        나도 만들기
      </Link>
    </div>
  );
}
