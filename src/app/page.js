"use client";
import { Suspense } from "react";
import dynamic from "next/dynamic";

// ✅ HomeContent를 동적으로 불러오고 SSR 비활성화
const HomeContent = dynamic(() => import("./HomeContent"), { ssr: false });

// ✅ Suspense로 감싸서 Vercel 빌드 충돌 방지
export default function Home() {
  return (
    <Suspense fallback={<div className="text-white text-center mt-20">로딩 중...</div>}>
      <HomeContent />
    </Suspense>
  );
}
