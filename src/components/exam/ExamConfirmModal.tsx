// @ts-nocheck
'use client';

import { X } from 'lucide-react';
import { useEffect } from 'react';

interface ExamConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  answeredCount: number;
  totalQuestions: number;
  timeRemaining: string;
}

export default function ExamConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  answeredCount,
  totalQuestions,
  timeRemaining,
}: ExamConfirmModalProps) {
  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 transition-colors hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-4 text-center">
          <h2 className="font-heading text-[24px] font-bold text-[#D32F2F]">
            Peringatan!
          </h2>
        </div>

        {/* Content */}
        <div className="mb-5">
          <p className="mb-4 text-center font-body text-[14px] leading-relaxed text-[#333333]">
            Pastikan semua jawaban sudah diisi. Apakah Anda yakin ingin
            menyelesaikan ujian ini sekarang?
          </p>

          {/* Info Boxes */}
          <div className="space-y-3">
            {/* Soal yang Sudah Diisi */}
            <div className="rounded-md border border-[#D9D9D9] bg-white px-4 py-3 shadow-sm">
              <p className="mb-1 text-center font-body text-[12px] text-gray-600">
                Soal yang Sudah Diisi
              </p>
              <p className="text-center font-heading text-[18px] font-bold text-[#333333]">
                {answeredCount} Dari {totalQuestions} Soal
              </p>
            </div>

            {/* Waktu Tersisa */}
            <div className="rounded-md border border-[#D9D9D9] bg-white px-4 py-3 shadow-sm">
              <p className="mb-1 text-center font-body text-[12px] text-gray-600">
                Waktu Tersisa
              </p>
              <p className="text-center font-heading text-[18px] font-bold text-[#333333]">
                {timeRemaining}
              </p>
            </div>
          </div>
        </div>

        {/* Footer - Submit Button */}
        <div className="flex justify-center">
          <button
            onClick={onConfirm}
            className="w-full rounded-xl bg-[#6A9E3C] px-8 py-3 font-heading text-[16px] font-bold text-white shadow-md transition-all hover:bg-[#55822F] hover:shadow-lg active:scale-95"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
