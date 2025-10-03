// @ts-nocheck
'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ExamHeaderProps {
  timeRemaining: string;
}

export default function ExamHeader({ timeRemaining }: ExamHeaderProps) {

  return (
    <header className="flex-shrink-0 bg-gradient-to-r from-[#41366E] to-[#7a5cb3] px-6 py-3 shadow-lg">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center gap-2.5">
          <div className="relative h-10 w-10">
            <Image
              src="/images/logo.png"
              alt="Physics Fest Logo"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="font-heading text-[18px] font-bold text-white">
            Physics Fest UPI 2025
          </h1>
        </div>

        {/* Timer */}
        <div className="flex items-center gap-3 rounded-lg bg-[#8b5cb8] px-5 py-2.5 shadow-md">
          <span className="font-heading text-[15px] font-bold text-white">
            Sisa Waktu
          </span>
          <div className="rounded-md bg-white px-4 py-1.5">
            <span className="font-heading text-[16px] font-bold text-gray-900">
              {timeRemaining}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
