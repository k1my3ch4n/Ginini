"use client";

import { mergeClasses } from "@shared/lib/utils";

interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  children: React.ReactNode;
}

/**
 * 모바일 터치 기준(44px 이상 높이)을 만족하는 선택형 칩 버튼.
 * aria-pressed로 선택 상태를 명시한다.
 */
export function Chip({ selected = false, children, className, ...props }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={mergeClasses(
        "px-4 py-3 rounded-full text-sm font-medium border transition-all cursor-pointer select-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E6A57E] focus-visible:ring-offset-1",
        "disabled:pointer-events-none disabled:opacity-50",
        selected
          ? "bg-[#E6A57E] border-[#E6A57E] text-white shadow-sm active:scale-95"
          : "bg-white border-gray-200 text-[#4B3A2F] hover:border-[#E6A57E] hover:bg-[#fdf0e6] active:scale-95 active:bg-[#fdf0e6]",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
