import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "이용약관 및 개인정보처리방침",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-dvh bg-[#FBF7F1] px-5 py-8 text-[#4B3A2F]">
      <Link
        href="/"
        className="inline-block mb-6 text-sm text-gray-400 hover:text-gray-600 transition-colors"
      >
        ← 홈으로
      </Link>

      <h1 className="text-lg font-semibold mb-1">이용약관 및 개인정보처리방침</h1>
      <p className="text-xs text-gray-400 mb-8">최종 업데이트: 2026-06-11</p>

      <section className="mb-6">
        <h2 className="text-base font-semibold mb-2">수집하는 정보</h2>
        <p className="text-sm leading-relaxed text-gray-600">
          서비스 이용을 위해 다음 정보를 처리합니다.
        </p>
        <ul className="mt-2 list-disc list-inside text-sm leading-relaxed text-gray-600 space-y-1">
          <li>업로드한 사진 (캐릭터 변환 처리 목적, 일시적으로만 사용)</li>
          <li>요청 IP 주소 (악용 방지 및 요청 횟수 제한 목적)</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-base font-semibold mb-2">이용 목적</h2>
        <p className="text-sm leading-relaxed text-gray-600">
          업로드한 사진의 인상적인 특징을 반영하여 닮은꼴 기니피그 캐릭터
          이미지를 생성하는 데에만 사용됩니다.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-base font-semibold mb-2">외부 처리 위탁</h2>
        <p className="text-sm leading-relaxed text-gray-600">
          캐릭터 이미지 생성을 위해 업로드한 사진이 아래 외부 AI 서비스로
          전송되어 처리됩니다.
        </p>
        <ul className="mt-2 list-disc list-inside text-sm leading-relaxed text-gray-600 space-y-1">
          <li>Google Gemini — 얼굴 특징 분석</li>
          <li>Replicate (flux-2-pro) — 캐릭터 이미지 생성</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-base font-semibold mb-2">보관 기간</h2>
        <p className="text-sm leading-relaxed text-gray-600">
          업로드한 원본 사진은 자체 서버에 저장되지 않으며, 변환 처리가 끝나면
          즉시 폐기됩니다. 다만 결과 공유 기능을 위해 생성된 기니피그 캐릭터
          이미지는 자체 스토리지에 최대 30일간 보관된 뒤 자동 삭제됩니다.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-base font-semibold mb-2">이용약관</h2>
        <ul className="list-disc list-inside text-sm leading-relaxed text-gray-600 space-y-1">
          <li>본 서비스는 재미를 위한 엔터테인먼트 목적으로 제공되며, 생성 결과의 정확성을 보장하지 않습니다.</li>
          <li>본인 동의 없이 타인의 사진을 업로드하지 않아야 합니다.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-base font-semibold mb-2">문의</h2>
        <p className="text-sm leading-relaxed text-gray-600">
          서비스 이용 중 궁금한 점이 있다면 앱 내 공유 기능을 통해 문의해
          주세요.
        </p>
      </section>
    </div>
  );
}
