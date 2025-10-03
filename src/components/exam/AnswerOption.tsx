// @ts-nocheck
'use client';

import { Check } from 'lucide-react';

interface AnswerOptionProps {
  label: string;
  text: string;
  isSelected: boolean;
  onClick: () => void;
}

export default function AnswerOption({
  label,
  text,
  isSelected,
  onClick,
}: AnswerOptionProps) {
  return (
    <button
      onClick={onClick}
      className={`
        group relative flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all
        ${
          isSelected
            ? 'border-[#6A9E3C] bg-[#6A9E3C] shadow-md'
            : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-sm'
        }
      `}
    >
      {/* Label (A, B, C, D, E) */}
      <div
        className={`
          flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full font-heading text-[16px] font-bold
          ${
            isSelected
              ? 'bg-white text-[#6A9E3C]'
              : 'bg-[#7a5cb3] text-white group-hover:bg-[#6b4d9e]'
          }
        `}
      >
        {label}
      </div>

      {/* Answer Text */}
      <span
        className={`
          flex-1 font-body text-[14px] leading-relaxed
          ${isSelected ? 'font-semibold text-white' : 'text-gray-800'}
        `}
      >
        {text}
      </span>

      {/* Check Icon (only when selected) */}
      {isSelected && (
        <Check className="h-5 w-5 flex-shrink-0 text-white" strokeWidth={3} />
      )}
    </button>
  );
}
