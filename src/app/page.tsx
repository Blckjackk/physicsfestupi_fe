"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect ke login page
    router.push("/login");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#7a5cb3] to-[#381f61]">
      <div className="text-center text-white">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent mx-auto"></div>
        <p className="font-body text-[16px]">Loading...</p>
      </div>
    </div>
  );
}
