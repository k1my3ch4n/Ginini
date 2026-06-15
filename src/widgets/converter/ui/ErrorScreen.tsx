import { Button, ScreenLayout } from "@shared/ui";

interface ErrorScreenProps {
  onRetry: () => void;
}

export function ErrorScreen({ onRetry }: ErrorScreenProps) {
  return (
    <ScreenLayout
      contentClassName="flex flex-col items-center justify-center gap-4 px-4"
      footerClassName="items-center"
      footer={<Button onClick={onRetry}>다시 시도하기</Button>}
    >
      <div role="alert" className="flex flex-col items-center gap-4">
        <div className="text-5xl">😢</div>
        <p className="text-lg font-semibold text-ink">
          변환 중 오류가 발생했어요
        </p>
        <p className="text-sm text-gray-500">잠시 후 다시 시도해 주세요.</p>
      </div>
    </ScreenLayout>
  );
}
