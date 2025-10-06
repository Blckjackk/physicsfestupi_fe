// @ts-nocheck
'use client';

import { Check } from 'lucide-react';
import FormattedText from '../FormattedText';

interface AnswerOptionProps {
  label: string;
  text: string;
  image?: string;
  isSelected: boolean;
  onClick: () => void;
}

export default function AnswerOption({
  label,
  text,
  image,
  isSelected,
  onClick,
}: AnswerOptionProps) {
  // If answer has image
  if (image) {
    return (
      <button
        onClick={onClick}
        className={`
          group relative flex w-full flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all
          ${
            isSelected
              ? 'border-[#6A9E3C] bg-[#6A9E3C] shadow-md'
              : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-sm'
          }
        `}
      >
        {/* Label at top */}
        <div
          className={`
            flex h-8 w-8 items-center justify-center rounded-lg font-heading text-[15px] font-bold
            ${
              isSelected
                ? 'bg-white text-[#6A9E3C]'
                : 'bg-[#7a5cb3] text-white group-hover:bg-[#6b4d9e]'
            }
          `}
        >
          {label}
        </div>

        {/* Answer Image - Fixed size & proportional */}
        <img 
          src={image} 
          alt={`Opsi ${label}`}
          className="mx-auto my-2 block max-h-[200px] max-w-[300px] rounded-lg object-contain"
        />

        {/* Check Icon (only when selected) */}
        {isSelected && (
          <div className="absolute right-3 top-3">
            <Check className="h-5 w-5 text-white" strokeWidth={3} />
          </div>
        )}
      </button>
    );
  }

  // Default text answer
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
          flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg font-heading text-[16px] font-bold
          ${
            isSelected
              ? 'bg-white text-[#6A9E3C]'
              : 'bg-[#7a5cb3] text-white group-hover:bg-[#6b4d9e]'
          }
        `}
      >
        {label}
      </div>

      {/* Answer Text with Formatting Support */}
      <div
        className={`
          flex-1 font-body text-[14px] leading-relaxed
          ${isSelected ? 'font-semibold text-white' : 'text-gray-800'}
        `}
      >
        <FormattedText text={text} />
      </div>

      {/* Check Icon (only when selected) */}
      {isSelected && (
        <Check className="h-5 w-5 flex-shrink-0 text-white" strokeWidth={3} />
      )}
    </button>
  );
}
