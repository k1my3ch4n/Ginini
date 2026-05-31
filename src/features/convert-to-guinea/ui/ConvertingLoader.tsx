"use client";

import { useEffect, useState } from "react";
import { ProgressBar } from "@shared/ui";

const MESSAGES = [
  "기니피그 DNA 분석 중...",
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
        if (prev >= 90) return 90;
        return Math.min(90, prev + Math.random() * 12 + 3);
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const messageIndex = Math.min(Math.floor(progress / 20), MESSAGES.length - 1);

  return (
    <div className="flex flex-col items-center gap-6 py-12 px-4">
      <div className="text-6xl animate-bounce">🐹</div>
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-800 mb-1">
          기니피그로 변환 중...
        </p>
        <p className="text-sm text-gray-500">{MESSAGES[messageIndex]}</p>
      </div>
      <ProgressBar
        value={Math.round(progress)}
        label="기니피그화 진행률"
        className="w-full max-w-xs"
      />
      <p className="text-xs text-gray-400">잠깐만요, 거의 다 됐어요!</p>
    </div>
  );
}
