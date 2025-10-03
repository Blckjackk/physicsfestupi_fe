// @ts-nocheck
'use client';

interface QuestionNavigationProps {
  totalQuestions: number;
  currentQuestion: number;
  answeredQuestions: number[];
  doubtfulQuestions: number[];
  onNavigate: (questionNumber: number) => void;
}

export default function QuestionNavigation({
  totalQuestions,
  currentQuestion,
  answeredQuestions,
  doubtfulQuestions,
  onNavigate,
}: QuestionNavigationProps) {
  const getQuestionStatus = (questionNum: number) => {
    // Prioritas: ragu-ragu > sudah dijawab > belum dijawab
    if (doubtfulQuestions.includes(questionNum)) return 'doubtful';
    if (answeredQuestions.includes(questionNum)) return 'answered';
    return 'unanswered';
  };

  const getButtonClass = (questionNum: number) => {
    const status = getQuestionStatus(questionNum);
    const isActive = questionNum === currentQuestion;

    const baseClass = 'h-11 w-11 rounded-lg font-heading text-[15px] font-bold transition-all';

    if (isActive) {
      // Active question - show border sesuai status
      switch (status) {
        case 'answered':
          return `${baseClass} bg-[#6A9E3C] text-white border-3 border-[#c447e6] shadow-sm`;
        case 'doubtful':
          return `${baseClass} bg-[#ffac27] text-white border-3 border-[#c447e6] shadow-sm`;
        default:
          return `${baseClass} border-3 border-[#c447e6] bg-white text-gray-700`;
      }
    }

    switch (status) {
      case 'answered':
        return `${baseClass} bg-[#6A9E3C] text-white hover:bg-[#5d8935] shadow-sm`;
      case 'doubtful':
        return `${baseClass} bg-[#ffac27] text-white hover:bg-[#f09d15] shadow-sm`;
      default:
        return `${baseClass} border-2 border-gray-300 bg-white text-gray-700 hover:border-purple-400 hover:bg-purple-50`;
    }
  };

  return (
    <div className="flex h-full flex-col rounded-3xl border border-gray-200 bg-white p-5 shadow-lg">
      {/* Title */}
      <h3 className="mb-4 font-heading text-[20px] font-bold text-gray-900">
        Navigasi Soal
      </h3>

      {/* Question Grid */}
      <div className="mb-4 grid grid-cols-5 gap-2.5">
        {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => onNavigate(num)}
            className={getButtonClass(num)}
          >
            {num}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="space-y-2.5 border-t border-gray-200 pt-3">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-md bg-[#6A9E3C]"></div>
          <span className="font-body text-[13px] text-gray-700">
            Sudah Dijawab
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-md bg-[#ffac27]"></div>
          <span className="font-body text-[13px] text-gray-700">
            Ragu-Ragu
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-md border-2 border-gray-300 bg-white"></div>
          <span className="font-body text-[13px] text-gray-700">
            Belum Dijawab
          </span>
        </div>
      </div>
    </div>
  );
}
