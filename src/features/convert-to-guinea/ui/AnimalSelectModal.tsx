"use client";

import { useEffect, useRef, useState } from "react";
import { useImageSessionStore } from "@entities/image-session";
import { useConvertImage } from "../api/useConvertImage";

const ANIMAL_CHIPS = [
  "고양이상",
  "강아지상",
  "토끼상",
  "곰상",
  "여우상",
  "사슴상",
  "햄찌상",
  "판다상",
];

export function AnimalSelectModal() {
  const { croppedImage, setAnimalTrait, setStep } = useImageSessionStore();
  const { mutate: convert, isPending } = useConvertImage();
  const [selected, setSelected] = useState<string | null>(null);
  const [customInput, setCustomInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!croppedImage) return;
    const url = URL.createObjectURL(croppedImage);
    setThumbnailUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [croppedImage]);

  const handleChipClick = (chip: string) => {
    setSelected((prev) => (prev === chip ? null : chip));
    setCustomInput("");
  };

  const handleCustomInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomInput(e.target.value);
    setSelected(null);
  };

  const handleConvert = (trait: string) => {
    if (!croppedImage || isPending) return;
    setAnimalTrait(trait);
    convert({ blob: croppedImage, animalTrait: trait });
  };

  const handleSubmit = () => {
    const trait = customInput.trim() || selected || "";
    handleConvert(trait);
  };

  const handleSkip = () => {
    handleConvert("");
  };

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
      className="flex flex-col w-full min-h-dvh bg-[#faf7f2] px-5 pt-6 pb-10"
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={() => setStep("cropping")}
          aria-label="뒤로 가기"
          className="text-gray-400 hover:text-gray-600 transition-colors text-sm flex items-center gap-1 cursor-pointer"
        >
          <span>&#8249;</span>
        </button>
        <h2 className="text-base font-semibold text-gray-800">닮은꼴 고르기</h2>
        <button
          type="button"
          onClick={handleSkip}
          disabled={isPending}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          건너뛰기
        </button>
      </div>

      {/* 내 사진 썸네일 */}
      {thumbnailUrl && (
        <div className="flex justify-center mb-5">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-amber-300 shadow-md">
            <img
              src={thumbnailUrl}
              alt="내 사진"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      <p className="text-sm text-center text-gray-500 mb-5">
        닮은꼴 하나만 골라요
      </p>

      {/* 동물상 칩 */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {ANIMAL_CHIPS.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => handleChipClick(chip)}
            aria-pressed={selected === chip}
            className={[
              "px-4 py-2 rounded-full text-sm font-medium border transition-all cursor-pointer",
              selected === chip
                ? "bg-amber-400 border-amber-400 text-white shadow-sm"
                : "bg-white border-gray-200 text-gray-700 hover:border-amber-300 hover:bg-amber-50",
            ].join(" ")}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* 직접 입력 */}
      <div className="mb-8">
        <label htmlFor="animal-custom-input" className="sr-only">
          닮은꼴 직접 입력
        </label>
        <input
          id="animal-custom-input"
          ref={inputRef}
          type="text"
          value={customInput}
          onChange={handleCustomInput}
          maxLength={50}
          placeholder="직접 입력 (선택사항) — 쿼카 느낌, 날카로운 눈매..."
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:border-amber-400 transition-colors"
        />
      </div>

      {/* 완성하기 버튼 */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full py-4 rounded-2xl bg-amber-400 text-white font-semibold text-base hover:bg-amber-500 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm"
      >
        {isPending ? "변환 중..." : "완성하기"}
      </button>
    </form>
  );
}
