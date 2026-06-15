import Link from "next/link";
import { GuineaPigMascotIcon } from "@/shared/ui";

interface IdleScreenProps {
  onStart: () => void;
}

export function IdleScreen({ onStart }: IdleScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh bg-[#FBF7F1] px-6 py-12">
      {/* 마스코트 */}
      <GuineaPigMascotIcon className="w-28 h-28 mb-4" />

      {/* 말풍선 */}
      <div className="relative bg-white rounded-2xl px-6 py-4 shadow-sm mb-8 max-w-xs text-center">
        <p className="text-[#4B3A2F] font-semibold text-base leading-snug">
          내 닮은꼴 기니피그,
          <br />
          만들어볼래?
        </p>
        {/* 말풍선 꼬리 */}
        <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 rounded-sm" />
      </div>

      {/* 주 CTA */}
      <button
        onClick={onStart}
        className="w-full max-w-xs py-4 rounded-2xl bg-[#E6A57E] text-white font-semibold text-base hover:bg-[#d4956e] active:scale-95 transition-all shadow-sm mb-3 cursor-pointer"
      >
        좋아, 시작!
      </button>

      {/* 약관/개인정보처리방침 링크 */}
      <Link
        href="/privacy"
        className="mt-8 text-xs text-gray-300 hover:text-gray-500 transition-colors"
      >
        이용약관 및 개인정보처리방침
      </Link>
    </div>
  );
}
