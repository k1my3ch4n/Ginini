import { mergeClasses } from "@shared/lib/utils";
import { IconButton } from "./IconButton";

interface ScreenHeaderProps {
  title: string;
  onBack: () => void;
  right?: React.ReactNode;
  className?: string;
  titleId?: string;
}

export function ScreenHeader({ title, onBack, right, className, titleId }: ScreenHeaderProps) {
  return (
    <div className={mergeClasses("flex items-center", className)}>
      <IconButton onClick={onBack} aria-label="뒤로 가기" className="-ml-2 mr-1">
        <ChevronLeftIcon />
      </IconButton>
      <h2 id={titleId} className="text-base font-semibold text-[#4B3A2F]">{title}</h2>
      {right && <div className="ml-auto">{right}</div>}
    </div>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      width="12"
      height="20"
      viewBox="0 0 9 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M8 1L1 8L8 15"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
