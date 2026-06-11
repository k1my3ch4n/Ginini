"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useImageSessionStore } from "@entities/image-session";
import { useConvertImage } from "../api/useConvertImage";
import { Avatar, Chip, ScreenHeader } from "@shared/ui";
import { ANIMAL_TRAIT_KEYS, sanitizeCustomTrait } from "@shared/lib";
import { useToast } from "@shared/model";

export function AnimalSelectModal() {
  const { croppedImage, setAnimalTrait, setStep } = useImageSessionStore();
  const { mutate: convert, isPending } = useConvertImage();
  const [selected, setSelected] = useState<string | null>(null);
  const [customInput, setCustomInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { error: showError } = useToast();

  const thumbnailUrl = useMemo(
    () => (croppedImage ? URL.createObjectURL(croppedImage) : null),
    [croppedImage],
  );

  useEffect(() => {
    return () => {
      if (thumbnailUrl) {
        URL.revokeObjectURL(thumbnailUrl);
      }
    };
  }, [thumbnailUrl]);

  const handleChipClick = (chip: string) => {
    setSelected((prev) => (prev === chip ? null : chip));
    setCustomInput("");
  };

  const handleCustomInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomInput(e.target.value);
    setSelected(null);
  };

  const handleConvert = (trait: string) => {
    if (!croppedImage || isPending) {
      return;
    }
    setAnimalTrait(trait);
    convert({ blob: croppedImage, animalTrait: trait });
  };

  const handleSubmit = () => {
    const trimmedInput = customInput.trim();
    if (trimmedInput) {
      const sanitized = sanitizeCustomTrait(trimmedInput);
      if (!sanitized) {
        showError(
          "입력하신 내용은 사용할 수 없어요. 다른 표현으로 적어주세요.",
        );
        return;
      }
      handleConvert(sanitized);
      return;
    }
    handleConvert(selected || "");
  };

  const handleSkip = () => {
    handleConvert("");
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="flex flex-col w-full min-h-dvh bg-[#FBF7F1] px-5 pt-6 pb-10"
    >
      <ScreenHeader
        title="닮은꼴 고르기"
        onBack={() => setStep("cropping")}
        className="mb-6"
        right={
          <button
            type="button"
            onClick={handleSkip}
            disabled={isPending}
            className="text-sm text-gray-400 hover:text-[#4B3A2F] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            건너뛰기
          </button>
        }
      />

      {/* 내 사진 썸네일 */}
      {thumbnailUrl && (
        <div className="flex justify-center mb-5">
          <Avatar src={thumbnailUrl} alt="내 사진" />
        </div>
      )}

      <p className="text-sm text-center text-gray-500 mb-5">
        닮은꼴 하나만 골라요
      </p>

      {/* 동물상 칩 */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {ANIMAL_TRAIT_KEYS.map((chip) => (
          <Chip
            key={chip}
            selected={selected === chip}
            onClick={() => handleChipClick(chip)}
          >
            {chip}
          </Chip>
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
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-[#4B3A2F] placeholder:text-gray-300 focus:outline-none focus:border-[#E6A57E] transition-colors"
        />
      </div>

      {/* 완성하기 버튼 */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full py-4 rounded-2xl bg-[#E6A57E] text-white font-semibold text-base hover:bg-[#d4956e] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm"
      >
        {isPending ? "변환 중..." : "완성하기"}
      </button>
    </form>
  );
}
