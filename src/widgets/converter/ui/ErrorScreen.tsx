import { Button, ScreenLayout } from "@shared/ui";

interface ErrorScreenProps {
  onRetry: () => void;
  isFaceError?: boolean;
  onReupload?: () => void;
}

export function ErrorScreen({
  onRetry,
  isFaceError,
  onReupload,
}: ErrorScreenProps) {
  if (isFaceError) {
    return (
      <ScreenLayout
        contentClassName="flex flex-col items-center justify-center gap-4 px-4"
        footerClassName="items-center"
        footer={
          <>
            <Button onClick={onReupload}>사진 다시 올리기</Button>
            <button
              onClick={onRetry}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              처음으로 돌아가기
            </button>
          </>
        }
      >
        <div role="alert" className="flex flex-col items-center gap-4">
          <div className="text-5xl">📸</div>
          <p className="text-lg font-semibold text-ink">얼굴을 찾지 못했어요</p>
          <p className="text-sm text-gray-500 text-center">
            얼굴이 잘 보이는 정면 사진으로
            <br />
            다시 시도해 주세요.
          </p>
        </div>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout
      contentClassName="flex flex-col items-center justify-center gap-4 px-4"
      footerClassName="items-center"
      footer={
        <>
          <Button onClick={onRetry}>다시 시도하기</Button>
          <a
            href="https://github.com/k1my3ch4n/Ginini/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            문제가 반복되나요? GitHub에 제보하기
          </a>
        </>
      }
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
