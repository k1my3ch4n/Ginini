"use client";

import { useCallback, useRef, useState } from "react";
import { validateImageFile, fileToDataURL } from "@shared/lib";
import { useImageSessionStore } from "@entities/image-session";
import { useToast } from "@shared/model";

export function ImageDropZone() {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { setUploadedImage, setStep } = useImageSessionStore();
  const { error: showError } = useToast();

  const processFile = useCallback(
    async (file: File) => {
      const result = validateImageFile(file);
      if (!result.valid) {
        showError(result.error!);
        return;
      }
      const dataURL = await fileToDataURL(file);
      setUploadedImage(dataURL);
      setStep("cropping");
    },
    [setUploadedImage, setStep, showError],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
      e.target.value = "";
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={[
        "relative flex flex-col items-center justify-center gap-4",
        "w-full min-h-64 rounded-2xl border-2 border-dashed",
        "cursor-pointer select-none transition-colors duration-200",
        isDragging
          ? "border-[#E6A57E] bg-[#fdf0e6]"
          : "border-zinc-300 bg-zinc-50 hover:border-[#E6A57E] hover:bg-[#fdf0e6]/40",
      ].join(" ")}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleChange}
      />
      <UploadIcon
        className={`w-12 h-12 transition-colors ${
          isDragging ? "text-[#E6A57E]" : "text-zinc-400"
        }`}
      />
      <div className="flex flex-col items-center gap-1.5 text-center px-6">
        <p className="text-base font-semibold text-zinc-700">
          {isDragging
            ? "여기에 놓으세요!"
            : "이미지를 드래그하거나 클릭하여 업로드"}
        </p>
        <p className="text-sm text-zinc-400">JPG, PNG, WebP · 최대 10MB</p>
      </div>
    </div>
  );
}

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}
