import { mergeClasses } from "@shared/lib/utils";

interface ScreenLayoutProps
  extends Omit<React.ComponentPropsWithoutRef<"div"> & React.ComponentPropsWithoutRef<"form">, "className"> {
  as?: "div" | "form";
  variant?: "page" | "sheet";
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  footerClassName?: string;
}

/**
 * 헤더(고정) / 콘텐츠(스크롤) / 푸터(고정) 3단 구조의 화면 레이아웃.
 * variant="page": 화면 전체(h-dvh)를 채우는 독립 화면에 사용.
 * variant="sheet": FullscreenSheet 등 부모가 높이를 잡아주는 컨테이너 내부에서 사용.
 */
export function ScreenLayout({
  as = "div",
  variant = "page",
  header,
  footer,
  className,
  contentClassName,
  footerClassName,
  children,
  ...props
}: ScreenLayoutProps) {
  const Component = as as React.ElementType;

  return (
    <Component
      className={mergeClasses(
        "flex flex-col",
        variant === "page" ? "h-dvh bg-page" : "flex-1 min-h-0",
        className,
      )}
      {...props}
    >
      {/* pl-7: ScreenHeader의 뒤로가기 버튼에 적용된 -ml-2 만큼 보정하여 본문/하단 버튼과 좌측 정렬을 맞춤 */}
      {header && <div className="shrink-0 pl-7 pr-5 pt-6">{header}</div>}
      <div className={mergeClasses("flex-1 overflow-y-auto px-5", contentClassName)}>
        {children}
      </div>
      {footer && (
        <div className={mergeClasses("shrink-0 px-5 pt-4 pb-8 flex flex-col gap-3", footerClassName)}>
          {footer}
        </div>
      )}
    </Component>
  );
}
