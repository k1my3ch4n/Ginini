import { mergeClasses } from "@shared/lib/utils";
import { IconButton } from "./IconButton";
import { ChevronLeftIcon } from "./icons";

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
