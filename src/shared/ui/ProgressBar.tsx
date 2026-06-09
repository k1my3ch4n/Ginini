import { mergeClasses } from "@shared/lib/utils";

interface ProgressBarProps {
  value: number;
  className?: string;
  label?: string;
  showPercentage?: boolean;
}

export function ProgressBar({
  value,
  className,
  label,
  showPercentage = true,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className={mergeClasses("w-full", className)}>
      {(label || showPercentage) && (
        <div className="mb-1.5 flex items-center justify-between">
          {label && <span className="text-sm text-gray-600">{label}</span>}
          {showPercentage && (
            <span className="text-sm font-semibold text-[#E6A57E]">
              {clamped}%
            </span>
          )}
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-[#E6A57E] transition-all duration-500 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
