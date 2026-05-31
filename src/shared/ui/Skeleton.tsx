import { mergeClasses } from "@shared/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={mergeClasses("animate-pulse rounded-lg bg-gray-200", className)} />
  );
}
