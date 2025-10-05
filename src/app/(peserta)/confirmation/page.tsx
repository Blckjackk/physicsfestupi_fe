// @ts-nocheck
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'next/navigation';
import Image from 'next/image';

export default function ConfirmationPage() {
  const router = useRouter();

  const handleFinish = () => {
    // Set flag for fresh login requirement
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('force_logout', 'true');
    }
    // Redirect ke halaman login dengan logout flag
    router.push('/login?logout=true');
  };

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-gradient-to-b from-[#7A5CB3] to-[#381F61]">
      {/* Header */}
      <header className="flex flex-shrink-0 items-center gap-3 px-6 py-3">
        <div className="relative h-10 w-10 flex-shrink-0">
          <Image
            src="/images/logo.png"
            alt="Physics Fest Logo"
            fill
            className="object-contain"
          />
        </div>
        <h1 className="font-heading text-lg font-bold text-white">
          Physics Fest UPI 2025
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center justify-center px-4">
        {/* Title */}
        <h2 className="mb-2 text-center font-heading text-2xl font-bold text-white md:text-3xl">
          Terima Kasih Telah Mengerjakan Soal
        </h2>

        {/* Subtitle */}
        <p className="mb-6 text-center font-body text-base text-gray-200">
          Semoga kamu memperoleh hasil yang terbaik!
        </p>

        {/* Mascot Image */}
        <div className="mb-5 flex justify-center">
          <div className="relative h-[280px] w-[280px]">
            <Image
              src="/images/mascot.png"
              alt="Physics Fest Mascot"
              fill
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </div>

        {/* Selesai Button */}
        <button
          onClick={handleFinish}
          className="h-[50px] w-[352px] max-w-[90vw] rounded-lg bg-[#6A9E3C] font-heading text-[16px] font-bold text-white shadow-lg transition-all hover:bg-[#55822F] hover:shadow-xl active:scale-95"
        >
          Selesai
        </button>
      </main>

      {/* Footer (Optional) */}
      <footer className="flex-shrink-0 pb-3 text-center">
        <p className="font-body text-xs text-gray-300">
          © 2025 Physics Fest UPI. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
