import { mergeClasses } from "@shared/lib/utils";

interface FullscreenSheetProps {
  titleId?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * 모바일 풀스크린, 데스크톱에서는 중앙 정렬된 카드 형태로 표시되는 시트.
 * 크롭 모달, 결과 라이트박스 등 화면 전체를 덮는 오버레이에 사용한다.
 */
export function FullscreenSheet({ titleId, className, children }: FullscreenSheetProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className={mergeClasses(
        "fixed inset-0 z-50 flex flex-col bg-page md:left-1/2 md:right-auto md:-translate-x-1/2 md:max-w-sm md:w-full md:top-8 md:bottom-8 md:rounded-3xl md:overflow-hidden",
        className,
      )}
    >
      {children}
    </div>
  );
}
