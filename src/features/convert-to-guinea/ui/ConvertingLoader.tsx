"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "닮은꼴 특징을 녹이고 있어요",
  "털 색깔 맞추는 중...",
  "귀여운 눈 장착 중...",
  "볼살 통통하게 만드는 중...",
  "기니피그 완성 중...",
];

export function ConvertingLoader() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          return 90;
        }
        return Math.min(90, prev + Math.random() * 12 + 3);
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const messageIndex = Math.min(Math.floor(progress / 20), MESSAGES.length - 1);

  return (
    <div
      role="status"
      aria-label="기니피그 변환 중"
      className="flex flex-col items-center justify-center gap-6 min-h-dvh bg-page px-8"
    >
      {/* Ring spinner */}
      <div
        aria-hidden="true"
        className="w-16 h-16 rounded-full border-4 border-gray-200 border-t-brand animate-spin"
      />

      {/* 메시지 */}
      <div className="text-center">
        <p className="text-lg font-semibold text-ink mb-1">
          기니피그 굽는 중...
        </p>
        <p
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="변환 진행률"
          className="text-3xl font-bold text-brand my-2"
        >
          {Math.round(progress)}%
        </p>
        <p aria-live="polite" className="text-sm text-gray-400">
          {MESSAGES[messageIndex]}
        </p>
      </div>
    </div>
  );
}
