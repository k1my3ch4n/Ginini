declare global {
  interface Window {
    Kakao: {
      init: (key: string) => void;
      isInitialized: () => boolean;
      Share: {
        sendDefault: (config: KakaoShareConfig) => void;
      };
    };
  }
}

interface KakaoLink {
  mobileWebUrl: string;
  webUrl: string;
}

interface KakaoShareConfig {
  objectType: "feed";
  content: {
    title: string;
    description: string;
    imageUrl: string;
    link: KakaoLink;
  };
  buttons?: Array<{
    title: string;
    link: KakaoLink;
  }>;
}

export function shareToKakao(imageUrl: string) {
  if (typeof window === "undefined" || !window.Kakao) return;

  const appKey = process.env.NEXT_PUBLIC_KAKAO_APP_KEY;
  if (!appKey) return;

  if (!window.Kakao.isInitialized()) {
    window.Kakao.init(appKey);
  }

  const pageUrl = window.location.href;

  window.Kakao.Share.sendDefault({
    objectType: "feed",
    content: {
      title: "Ginini",
      description: "나도 기니피그가 됐어! 너도 해봐 🐹",
      imageUrl,
      link: { mobileWebUrl: pageUrl, webUrl: pageUrl },
    },
    buttons: [
      {
        title: "나도 변환하기",
        link: { mobileWebUrl: pageUrl, webUrl: pageUrl },
      },
    ],
  });
}
