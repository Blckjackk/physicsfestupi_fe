// @ts-nocheck
'use client';

import Image from 'next/image';
import AnswerOption from './AnswerOption';

interface Answer {
  label: string;
  text: string;
  image?: string;
}

interface QuestionCardProps {
  questionNumber: number;
  questionText: string;
  image?: string;
  imageCaption?: string;
  answers: Answer[];
  selectedAnswer: string | null;
  onSelectAnswer: (label: string) => void;
}

export default function QuestionCard({
  questionNumber,
  questionText,
  image,
  imageCaption,
  answers,
  selectedAnswer,
  onSelectAnswer,
}: QuestionCardProps) {
  return (
    <div className="w-full rounded-[10px] border border-gray-200 bg-white shadow-lg">
      {/* Question Header with Gradient */}
      <div className="rounded-t-[10px] bg-gradient-to-r from-[#41366E] to-[#7a5cb3] px-6 py-3">
        <h2 className="font-heading text-[24px] font-bold text-white">
          Soal {questionNumber}
        </h2>
      </div>

      {/* Question Content - No Scroll */}
      <div className="p-6">
        {/* Question Text */}
        <div className="mb-4 font-body text-[14px] leading-relaxed text-gray-800">
          {questionText.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className="mb-3 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Question Image (if exists) */}
        {image && (
          <div className="my-4">
            <img 
              src={image} 
              alt={`Gambar soal ${questionNumber}`}
              className="mx-auto my-4 block max-h-[250px] max-w-[400px] rounded-lg object-contain"
            />
            {imageCaption && (
              <p className="mt-2 text-center font-body text-[13px] italic text-gray-600">
                {imageCaption}
              </p>
            )}
          </div>
        )}

        {/* Answer Options */}
        <div className="space-y-2.5">
          {answers.map((answer) => (
            <AnswerOption
              key={answer.label}
              label={answer.label}
              text={answer.text}
              image={answer.image}
              isSelected={selectedAnswer === answer.label}
              onClick={() => onSelectAnswer(answer.label)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
