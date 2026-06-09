import { mergeClasses } from "@shared/lib/utils";
import type { ToastItem as ToastItemType } from "@shared/model/toast-store";
import { IconButton } from "./IconButton";

const typeStyles = {
  success: "bg-emerald-500",
  error: "bg-red-500",
  info: "bg-blue-500",
} as const;

const typeIcons = {
  success: "✓",
  error: "✕",
  info: "ℹ",
} as const;

interface ToastProps {
  toast: ToastItemType;
  onRemove: (id: string) => void;
}

export function Toast({ toast, onRemove }: ToastProps) {
  return (
    <div
      role={toast.type === "error" ? "alert" : "status"}
      aria-live={toast.type === "error" ? "assertive" : "polite"}
      aria-atomic="true"
      className={mergeClasses(
        "pointer-events-auto flex min-w-[280px] max-w-sm items-center gap-3 rounded-xl px-4 py-3 text-white shadow-lg",
        typeStyles[toast.type],
      )}
    >
      <span className="shrink-0 text-base font-bold">{typeIcons[toast.type]}</span>
      <p className="flex-1 text-sm font-medium leading-snug">{toast.message}</p>
      <IconButton
        onClick={() => onRemove(toast.id)}
        aria-label="알림 닫기"
        className="shrink-0 text-white hover:text-white hover:bg-white/25 active:bg-white/40"
      >
        <span aria-hidden="true" className="text-sm font-bold leading-none">✕</span>
      </IconButton>
    </div>
  );
}
