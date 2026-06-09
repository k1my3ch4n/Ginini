"use client";

import { useToastStore } from "@shared/model/toast-store";
import { Toast } from "./Toast";

export function ToastContainer() {
  const { toasts, remove } = useToastStore();

  return (
    <div
      aria-label="알림"
      className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col-reverse gap-2 md:right-auto md:left-1/2 md:-translate-x-1/2"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={remove} />
      ))}
    </div>
  );
}
