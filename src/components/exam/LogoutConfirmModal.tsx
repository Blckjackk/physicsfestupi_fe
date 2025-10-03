// @ts-nocheck
'use client';

import { X, AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export default function LogoutConfirmModal({
  isOpen,
  onClose,
  onLogout,
}: LogoutConfirmModalProps) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-[400px] rounded-2xl bg-white p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 transition-colors hover:text-gray-600"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Warning Icon */}
        <div className="mb-4 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
            <AlertTriangle className="h-12 w-12 text-red-600" strokeWidth={2} />
          </div>
        </div>

        {/* Title */}
        <h2 className="mb-2 text-center font-heading text-[24px] font-bold text-gray-900">
          Peringatan!
        </h2>

        {/* Message */}
        <p className="mb-6 text-center font-body text-[15px] text-gray-600">
          Apakah anda yakin ingin Log Out?
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {/* Tidak Button */}
          <button
            onClick={onClose}
            className="flex-1 rounded-xl bg-gray-500 py-3 font-heading text-[16px] font-bold text-white shadow-md transition-all hover:bg-gray-600 hover:shadow-lg active:scale-95"
          >
            Tidak
          </button>

          {/* Log Out Button */}
          <button
            onClick={onLogout}
            className="flex-1 rounded-xl bg-red-600 py-3 font-heading text-[16px] font-bold text-white shadow-md transition-all hover:bg-red-700 hover:shadow-lg active:scale-95"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
