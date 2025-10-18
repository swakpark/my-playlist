import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "주인장 플레이리스트 🎧",
  description: "노래를 장르별, 감성별로 추천해주는 웹사이트",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "주인장 플레이리스트 🎧",
    description: "당신의 감성에 맞는 노래를 찾아주는 플레이리스트",
    url: "https://playlist.soosum.kr",
    siteName: "주인장 플레이리스트",
    images: [
      {
        url: "/og-image.png", // ✅ 아래에서 추가할 미리보기 이미지
        width: 1200,
        height: 630,
        alt: "주인장 플레이리스트 대표 이미지",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "주인장 플레이리스트 🎧",
    description: "노래를 장르별, 감성별로 추천해주는 웹사이트",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
