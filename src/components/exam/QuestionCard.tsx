// @ts-nocheck
'use client';

import AnswerOption from './AnswerOption';

interface Answer {
  label: string;
  text: string;
}

interface QuestionCardProps {
  questionNumber: number;
  questionText: string;
  answers: Answer[];
  selectedAnswer: string | null;
  onSelectAnswer: (label: string) => void;
}

export default function QuestionCard({
  questionNumber,
  questionText,
  answers,
  selectedAnswer,
  onSelectAnswer,
}: QuestionCardProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg">
      {/* Question Header with Gradient */}
      <div className="flex-shrink-0 rounded-t-3xl bg-gradient-to-r from-[#7a5cb3] via-[#6854a8] to-[#5844a0] px-6 py-3">
        <h2 className="font-heading text-[24px] font-bold text-white">
          Soal {questionNumber}
        </h2>
      </div>

      {/* Question Content - Scrollable */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Question Text */}
        <div className="mb-4 font-body text-[14px] leading-relaxed text-gray-800">
          {questionText.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className="mb-3 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Answer Options */}
        <div className="space-y-2.5">
          {answers.map((answer) => (
            <AnswerOption
              key={answer.label}
              label={answer.label}
              text={answer.text}
              isSelected={selectedAnswer === answer.label}
              onClick={() => onSelectAnswer(answer.label)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
