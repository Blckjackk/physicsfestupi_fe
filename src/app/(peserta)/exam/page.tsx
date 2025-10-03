// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ExamHeader from '@/components/exam/ExamHeader';
import QuestionCard from '@/components/exam/QuestionCard';
import QuestionNavigation from '@/components/exam/QuestionNavigation';
import AlertModal from '@/components/ui/alert-modal';

// Mock data untuk soal-soal
const mockQuestions = [
  {
    id: 1,
    text: 'Seorang siswa melakukan percobaan hukum Newton dengan cara menarik sebuah troli bermassa 4 kg menggunakan sebuah dinamometer di atas bidang datar licin. Ternyata gaya yang dibaca pada dinamometer adalah 12 N dan troli bergerak dipercepat.\n\nSetelah beberapa saat, siswa tersebut menambahkan beban 2 kg di atas troli dan menariknya kembali dengan gaya yang sama, yaitu 12 N.\n\nBerapakah perbandingan percepatan troli sebelum dan sesudah ditambahkan beban?',
    answers: [
      { label: 'A', text: 'Rp8.250' },
      { label: 'B', text: 'Rp8.250' },
      { label: 'C', text: 'Rp8.250' },
      { label: 'D', text: 'Rp8.250' },
      { label: 'E', text: 'Rp8.250' },
    ],
  },
];

// Generate 10 soal (soal 2-10 menggunakan template)
for (let i = 2; i <= 10; i++) {
  mockQuestions.push({
    id: i,
    text: `Ini adalah soal nomor ${i}. [Konten soal akan dimuat dari backend API]\n\nSoal ini hanya placeholder untuk testing navigasi dan fungsionalitas halaman ujian.`,
    answers: [
      { label: 'A', text: `Opsi A untuk soal ${i}` },
      { label: 'B', text: `Opsi B untuk soal ${i}` },
      { label: 'C', text: `Opsi C untuk soal ${i}` },
      { label: 'D', text: `Opsi D untuk soal ${i}` },
      { label: 'E', text: `Opsi E untuk soal ${i}` },
    ],
  });
}

export default function ExamPage() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(3540); // 59 menit (sesuai gambar: 0:59:00)
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [doubtfulQuestions, setDoubtfulQuestions] = useState<number[]>([]);
  
  // Alert modal states
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    type: 'info' as 'error' | 'success' | 'warning' | 'info',
    title: '',
    message: '',
  });

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimeOut = () => {
    setAlertConfig({
      type: 'warning',
      title: 'Waktu ujian telah habis',
      message: 'Jawaban Anda akan otomatis tersimpan dan ujian akan berakhir.',
    });
    setShowAlert(true);
    // Auto submit after timeout
    setTimeout(() => {
      handleSubmitExam();
    }, 3000);
  };

  const handleSelectAnswer = (label: string) => {
    setAnswers({ ...answers, [currentQuestion]: label });
    // Remove from doubtful if answered
    if (doubtfulQuestions.includes(currentQuestion)) {
      setDoubtfulQuestions(doubtfulQuestions.filter((q) => q !== currentQuestion));
    }
  };

  const handleMarkDoubtful = () => {
    if (!doubtfulQuestions.includes(currentQuestion)) {
      setDoubtfulQuestions([...doubtfulQuestions, currentQuestion]);
      setAlertConfig({
        type: 'info',
        title: 'Soal ditandai ragu-ragu',
        message: 'Anda dapat kembali ke soal ini nanti melalui navigasi soal.',
      });
      setShowAlert(true);
    }
  };

  const handleNext = () => {
    if (currentQuestion < mockQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Last question - show confirmation to submit
      handleConfirmSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleNavigate = (questionNumber: number) => {
    setCurrentQuestion(questionNumber);
  };

  const handleConfirmSubmit = () => {
    const unansweredCount = mockQuestions.length - Object.keys(answers).length;
    
    if (unansweredCount > 0) {
      setAlertConfig({
        type: 'warning',
        title: 'Ada soal yang belum dijawab',
        message: `Anda masih memiliki ${unansweredCount} soal yang belum dijawab. Apakah Anda yakin ingin menyelesaikan ujian?`,
      });
    } else {
      setAlertConfig({
        type: 'info',
        title: 'Konfirmasi pengumpulan',
        message: 'Apakah Anda yakin ingin mengumpulkan ujian? Pastikan semua jawaban sudah benar.',
      });
    }
    setShowAlert(true);
  };

  const handleSubmitExam = () => {
    setAlertConfig({
      type: 'success',
      title: 'Ujian berhasil dikumpulkan',
      message: 'Terima kasih telah mengikuti ujian Physics Fest UPI 2025. Hasil akan diumumkan kemudian.',
    });
    setShowAlert(true);
    
    // Redirect to confirmation page after 2 seconds
    setTimeout(() => {
      router.push('/confirmation');
    }, 2000);
  };

  const handleLogout = () => {
    setAlertConfig({
      type: 'warning',
      title: 'Konfirmasi keluar',
      message: 'Apakah Anda yakin ingin keluar? Progres ujian Anda akan tersimpan.',
    });
    setShowAlert(true);
  };

  const currentQuestionData = mockQuestions[currentQuestion - 1];
  const answeredQuestions = Object.keys(answers).map(Number);

  return (
    <div className="flex h-screen flex-col bg-[#F9F9F9]">
      {/* Header */}
      <ExamHeader timeRemaining={formatTime(timeLeft)} onLogout={handleLogout} />

      {/* Main Content */}
      <div className="mx-auto flex w-full max-w-[1400px] flex-1 overflow-hidden px-4 py-4">
        <div className="flex w-full gap-4">
          {/* Left Column - Question Card (70%) */}
          <div className="flex flex-1 flex-col" style={{ flexBasis: '70%' }}>
            <div className="flex-1 overflow-hidden">
              <QuestionCard
                questionNumber={currentQuestion}
                questionText={currentQuestionData.text}
                answers={currentQuestionData.answers}
                selectedAnswer={answers[currentQuestion] || null}
                onSelectAnswer={handleSelectAnswer}
              />
            </div>

            {/* Action Buttons - Outside Card */}
            <div className="relative mt-3 flex flex-shrink-0 items-center justify-between gap-3">
              {/* Left: Back Button (only if not first question) */}
              {currentQuestion > 1 ? (
                <button
                  onClick={handlePrevious}
                  className="flex items-center justify-center gap-2 rounded-xl border-2 border-gray-300 bg-white px-8 py-3 font-heading text-[16px] font-bold text-gray-700 shadow-md transition-all hover:border-gray-400 hover:bg-gray-50 hover:shadow-lg active:scale-95"
                >
                  <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
                  Kembali
                </button>
              ) : (
                <div></div>
              )}

              {/* Center: Ragu-Ragu Button */}
              <button
                onClick={handleMarkDoubtful}
                className="absolute left-1/2 -translate-x-1/2 rounded-xl bg-[#ffac27] px-10 py-3 font-heading text-[16px] font-bold text-white shadow-md transition-all hover:bg-[#f09d15] hover:shadow-lg active:scale-95"
              >
                Ragu-Ragu
              </button>

              {/* Right: Next/Submit Button */}
              <button
                onClick={handleNext}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#7a5cb3] px-8 py-3 font-heading text-[16px] font-bold text-white shadow-md transition-all hover:bg-[#6b4d9e] hover:shadow-lg active:scale-95"
              >
                {currentQuestion === mockQuestions.length ? 'Selesai' : 'Lanjut'}
                {currentQuestion !== mockQuestions.length && <ChevronRight className="h-5 w-5" strokeWidth={2.5} />}
              </button>
            </div>
          </div>

          {/* Right Column - Navigation (30%) */}
          <div className="flex-shrink-0" style={{ flexBasis: '30%' }}>
            <QuestionNavigation
              totalQuestions={mockQuestions.length}
              currentQuestion={currentQuestion}
              answeredQuestions={answeredQuestions}
              doubtfulQuestions={doubtfulQuestions}
              onNavigate={handleNavigate}
            />
          </div>
        </div>
      </div>

      {/* Alert Modal */}
      <AlertModal
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
      />
    </div>
  );
}
