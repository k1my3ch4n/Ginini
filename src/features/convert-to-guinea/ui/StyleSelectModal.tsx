"use client";

import { useImageSessionStore } from "@entities/image-session";
import type { ConversionMode } from "@entities/image-session";
import { useConvertImage } from "../api/useConvertImage";

interface StyleOption {
  mode: ConversionMode;
  emoji: string;
  title: string;
  description: string;
  preview: string;
}

const STYLE_OPTIONS: StyleOption[] = [
  {
    mode: "cartoon",
    emoji: "🎨",
    title: "카와이 캐릭터",
    description: "귀여운 2D 일러스트 스타일의 기니피그 캐릭터로 변환",
    preview: "깔끔한 아웃라인, 셀 쉐이딩, 흰 배경",
  },
  {
    mode: "realistic",
    emoji: "📷",
    title: "실제 기니피그",
    description: "실사 사진처럼 진짜 기니피그로 변환",
    preview: "사실적인 털 질감, 자연스러운 조명, 포토리얼리스틱",
  },
];

export function StyleSelectModal() {
  const { croppedImage, setConversionMode, setStep } = useImageSessionStore();
  const { mutate: convert } = useConvertImage();

  const handleSelect = (mode: ConversionMode) => {
    if (!croppedImage) return;
    setConversionMode(mode);
    convert({ blob: croppedImage, mode });
  };

  const handleClose = () => {
    setStep("idle");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <div className="text-3xl mb-1">🐹</div>
          <h2 className="text-lg font-bold text-gray-800">변환 스타일 선택</h2>
          <p className="text-xs text-gray-500 mt-1">
            원하는 기니피그 스타일을 골라주세요
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {STYLE_OPTIONS.map((option) => (
            <button
              key={option.mode}
              onClick={() => handleSelect(option.mode)}
              className="flex items-start gap-4 p-4 rounded-2xl border-2 border-gray-100 hover:border-amber-300 hover:bg-amber-50 transition-all text-left group"
            >
              <span className="text-3xl mt-0.5">{option.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-800 text-sm group-hover:text-amber-700">
                  {option.title}
                </div>
                <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  {option.description}
                </div>
                <div className="text-xs text-gray-400 mt-1 italic">
                  {option.preview}
                </div>
              </div>
              <span className="text-gray-300 group-hover:text-amber-400 text-lg self-center">
                →
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={handleClose}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors mx-auto"
        >
          취소
        </button>
      </div>
    </div>
  );
}
