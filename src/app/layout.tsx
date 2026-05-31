import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { ToastContainer } from "@shared/ui";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ginini",
  description: "내 사진을 귀여운 기니피그 캐릭터로 변환해 드립니다",
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
        {children}
        <ToastContainer />
        <Script
          src="https://t1.kakaocdn.net/kakaojs/2.7.4/kakao.min.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
