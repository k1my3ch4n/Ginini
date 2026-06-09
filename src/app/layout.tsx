import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { ToastContainer, Providers } from "@shared/ui";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://ginini.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "Ginini — 내 사진을 기니피그로 변환해 드려요",
    template: "%s | Ginini",
  },
  description:
    "AI 기술로 내 사진 속 표정·헤어스타일을 그대로 살려 귀여운 기니피그 캐릭터로 변환해 드립니다. 지금 바로 무료로 체험해 보세요!",
  keywords: ["기니피그", "AI 이미지 변환", "캐릭터화", "SNS 공유", "Ginini"],
  metadataBase: new URL(BASE_URL),
  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "Ginini",
    title: "Ginini — 내 사진을 기니피그로 변환해 드려요",
    description:
      "AI 기술로 내 사진 속 표정·헤어스타일을 그대로 살려 귀여운 기니피그 캐릭터로 변환해 드립니다.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Ginini — 기니피그 캐릭터 변환 서비스",
      },
    ],
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ginini — 내 사진을 기니피그로 변환해 드려요",
    description:
      "AI 기술로 내 사진 속 표정·헤어스타일을 그대로 살려 귀여운 기니피그 캐릭터로 변환해 드립니다.",
    images: ["/opengraph-image"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[9999] focus:rounded-lg focus:bg-amber-400 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
        >
          본문으로 바로가기
        </a>
        <Providers>
          <main id="main-content" className="flex flex-1 flex-col">
            <h1 className="sr-only">Ginini — 내 닮은꼴 기니피그 만들기</h1>
            {children}
          </main>
          <ToastContainer />
        </Providers>
        <Script
          src="https://t1.kakaocdn.net/kakaojs/2.7.4/kakao.min.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
