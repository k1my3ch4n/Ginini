"use client";

import { forwardRef } from "react";
import { mergeClasses } from "@shared/lib/utils";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

/**
 * 모바일 터치 기준(44×44px)을 만족하는 아이콘 전용 버튼.
 * 실제 아이콘 크기와 무관하게 탭 영역을 항상 확보한다.
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ children, className, ...props }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        className={mergeClasses(
          "inline-flex items-center justify-center",
          "min-w-[44px] min-h-[44px]",
          "rounded-full transition-colors cursor-pointer select-none",
          "text-gray-400 hover:text-[#4B3A2F] hover:bg-gray-100 active:bg-gray-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E6A57E] focus-visible:ring-offset-1",
          "disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);
