interface IdleScreenProps {
  onStart: () => void;
}

export function IdleScreen({ onStart }: IdleScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh bg-[#FBF7F1] px-6 py-12">
      {/* 마스코트 */}
      <div className="text-8xl mb-4 select-none">🐹</div>

      {/* 말풍선 */}
      <div className="relative bg-white rounded-2xl px-6 py-4 shadow-sm mb-8 max-w-xs text-center">
        <p className="text-[#4B3A2F] font-semibold text-base leading-snug">
          내 닮은꼴 기니피그,
          <br />
          만들어볼래?
        </p>
        {/* 말풍선 꼬리 */}
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-white text-xl leading-none drop-shadow-sm select-none">
          ▲
        </span>
      </div>

      {/* 주 CTA */}
      <button
        onClick={onStart}
        className="w-full max-w-xs py-4 rounded-2xl bg-[#E6A57E] text-white font-semibold text-base hover:bg-[#d4956e] active:scale-95 transition-all shadow-sm mb-3 cursor-pointer"
      >
        좋아, 시작!
      </button>

      {/* 보조 버튼 */}
      <button
        onClick={onStart}
        className="text-sm text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
      >
        예시 먼저 볼래
      </button>
    </div>
  );
}
