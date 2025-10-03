// @ts-nocheck
"use client";

import { X, AlertCircle, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { useEffect } from "react";

export type AlertType = "error" | "success" | "warning" | "info";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: AlertType;
  title: string;
  message: string;
  showTimer?: boolean;
  timerText?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

const alertConfig = {
  error: {
    icon: AlertCircle,
    iconBgColor: "bg-red-50",
    iconColor: "text-[#cd1f1f]",
    buttonBgColor: "bg-[#cd1f1f] hover:bg-[#b01a1a]",
    borderColor: "border-red-100",
  },
  success: {
    icon: CheckCircle,
    iconBgColor: "bg-green-50",
    iconColor: "text-[#749221]",
    buttonBgColor: "bg-[#7a5cb3] hover:bg-[#6b4d9f]",
    secondaryButtonBgColor: "bg-gray-600 hover:bg-gray-700",
    borderColor: "border-green-100",
  },
  warning: {
    icon: AlertTriangle,
    iconBgColor: "bg-orange-50",
    iconColor: "text-[#ffac27]",
    buttonBgColor: "bg-[#ffac27] hover:bg-[#e69820]",
    borderColor: "border-orange-100",
  },
  info: {
    icon: Info,
    iconBgColor: "bg-purple-50",
    iconColor: "text-[#7a5cb3]",
    buttonBgColor: "bg-[#7a5cb3] hover:bg-[#6b4d9f]",
    borderColor: "border-purple-100",
  },
};

export default function AlertModal({
  isOpen,
  onClose,
  type,
  title,
  message,
  showTimer = false,
  timerText,
  primaryButtonText = "Tutup",
  secondaryButtonText,
  onPrimaryClick,
  onSecondaryClick,
}: AlertModalProps) {
  const config = alertConfig[type];
  const IconComponent = config.icon;

  // Close on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePrimaryClick = () => {
    if (onPrimaryClick) {
      onPrimaryClick();
    } else {
      onClose();
    }
  };

  const handleSecondaryClick = () => {
    if (onSecondaryClick) {
      onSecondaryClick();
    } else {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`relative w-full max-w-[543px] min-h-[260px] rounded-3xl bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-200 border ${config.borderColor}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="alert-title"
        aria-describedby="alert-message"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Icon */}
        <div className="mb-4 flex justify-center">
          <div className={`rounded-full p-3 ${config.iconBgColor}`}>
            <IconComponent className={`h-16 w-16 ${config.iconColor}`} strokeWidth={2.5} />
          </div>
        </div>

        {/* Alert Type Label */}
        <div className="mb-2 text-center font-heading text-[20px] font-bold uppercase tracking-wide text-gray-800">
          {type}
        </div>

        {/* Title */}
        <h2 id="alert-title" className="mb-2 text-center font-heading text-[22px] font-semibold text-gray-900">
          {title}
        </h2>

        {/* Message */}
        <p id="alert-message" className="mb-5 text-center font-body text-[15px] leading-relaxed text-gray-700">
          {message}
        </p>

        {/* Timer Display (untuk success alert) */}
        {showTimer && timerText && (
          <div className="mb-6 flex justify-center">
            <div className="rounded-lg border-2 border-gray-300 bg-white px-6 py-3">
              <p className="font-heading text-[18px] font-semibold text-gray-800">{timerText}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className={`flex gap-3 ${secondaryButtonText ? "flex-row" : "flex-col"}`}>
          {/* Secondary Button (Kembali) */}
          {secondaryButtonText && (
            <button
              onClick={handleSecondaryClick}
              className="flex-1 rounded-lg border-2 border-gray-300 bg-gray-100 px-6 py-3 font-heading text-[15px] font-semibold text-gray-700 transition-all hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-300"
            >
              {secondaryButtonText}
            </button>
          )}

          {/* Primary Button */}
          <button
            onClick={handlePrimaryClick}
            className={`flex-1 rounded-lg px-6 py-3 font-heading text-[15px] font-semibold text-white shadow-lg transition-all hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-offset-2 ${config.buttonBgColor}`}
          >
            {primaryButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}
