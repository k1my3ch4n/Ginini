import { useEffect } from "react";

const CONFIRM_MESSAGE = "지금 나가면 진행 중인 작업이 사라져요. 나가시겠어요?";

export function useNavigationGuard(isActive: boolean): void {
  useEffect(() => {
    if (!isActive) {
      return;
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };

    // 더미 히스토리 항목을 추가해 뒤로가기를 가로챔
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      const confirmed = window.confirm(CONFIRM_MESSAGE);
      if (confirmed) {
        window.removeEventListener("popstate", handlePopState);
        window.removeEventListener("beforeunload", handleBeforeUnload);
        window.history.back();
      } else {
        window.history.pushState(null, "", window.location.href);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isActive]);
}
