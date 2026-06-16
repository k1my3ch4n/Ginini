import Link from "next/link";
import { GuineaPigMascotIcon, ScreenLayout } from "@/shared/ui";

interface IdleScreenProps {
  onStart: () => void;
}

export function IdleScreen({ onStart }: IdleScreenProps) {
  return (
    <ScreenLayout
      contentClassName="flex flex-col items-center justify-center px-6"
      footerClassName="px-6 pb-12 items-center"
      footer={
        <>
          {/* 주 CTA */}
          <button
            onClick={onStart}
            className="w-full max-w-xs py-4 rounded-2xl bg-brand text-white font-semibold text-base hover:bg-brand-hover active:scale-95 transition-all shadow-sm cursor-pointer"
          >
            좋아, 시작!
          </button>

          {/* 링크 */}
          <div className="flex items-center justify-center gap-4 text-xs text-gray-300">
            <a
              href="https://github.com/k1my3ch4n/Ginini"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-500 transition-colors"
            >
              GitHub
            </a>
            <span aria-hidden="true">·</span>
            <a
              href="https://github.com/k1my3ch4n/Ginini/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-500 transition-colors"
            >
              문의하기
            </a>
            <span aria-hidden="true">·</span>
            <Link
              href="/privacy"
              className="hover:text-gray-500 transition-colors"
            >
              개인정보처리방침
            </Link>
          </div>
        </>
      }
    >
      {/* 마스코트 */}
      <GuineaPigMascotIcon className="w-28 h-28 mb-4" />

      {/* 말풍선 */}
      <div className="relative bg-white rounded-2xl px-6 py-4 shadow-sm max-w-xs text-center">
        <p className="text-ink font-semibold text-base leading-snug">
          내 닮은꼴 기니피그,
          <br />
          만들어볼래?
        </p>
        {/* 말풍선 꼬리 */}
        <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 rounded-sm" />
      </div>
    </ScreenLayout>
  );
}
