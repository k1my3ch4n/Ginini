import { Button } from "@shared/ui";

interface ErrorScreenProps {
  onRetry: () => void;
}

export function ErrorScreen({ onRetry }: ErrorScreenProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-4 py-12 px-4 min-h-dvh bg-[#FBF7F1] justify-center"
    >
      <div className="text-5xl">😢</div>
      <p className="text-lg font-semibold text-[#4B3A2F]">
        변환 중 오류가 발생했어요
      </p>
      <p className="text-sm text-gray-500">잠시 후 다시 시도해 주세요.</p>
      <Button onClick={onRetry}>다시 시도하기</Button>
    </div>
  );
}
