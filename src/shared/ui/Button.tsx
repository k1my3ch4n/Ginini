"use client";

import { mergeClasses } from "@shared/lib/utils";

type Variant = "primary" | "ghost" | "icon";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: React.ReactNode;
}

const base =
  "inline-flex items-center justify-center font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-amber-500 text-white rounded-xl hover:bg-amber-600 active:scale-[0.98] focus-visible:ring-amber-500 shadow-sm",
  ghost:
    "bg-transparent text-gray-700 rounded-xl hover:bg-gray-100 active:bg-gray-200 focus-visible:ring-gray-400",
  icon: "bg-transparent text-gray-600 rounded-full hover:bg-gray-100 active:bg-gray-200 focus-visible:ring-gray-400",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

const iconSizes: Record<Size, string> = {
  sm: "p-1.5",
  md: "p-2",
  lg: "p-3",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const sizeClass = variant === "icon" ? iconSizes[size] : sizes[size];
  return (
    <button
      className={mergeClasses(base, variants[variant], sizeClass, className)}
      {...props}
    >
      {children}
    </button>
  );
}
