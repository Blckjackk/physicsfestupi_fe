// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ExamHeader from '@/components/exam/ExamHeader';
import QuestionCard from '@/components/exam/QuestionCard';
import QuestionNavigation from '@/components/exam/QuestionNavigation';
import AlertModal from '@/components/ui/alert-modal';
import { AuthService, ExamService, initializeLocalStorage, Ujian, JawabanPeserta } from '@/lib/mockData';

export default function ExamPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [ujianData, setUjianData] = useState<Ujian | null>(null);
  const [userId, setUserId] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(0);
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

  // Initialize and load data
  useEffect(() => {
    initializeLocalStorage();
    
    // Check authentication
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'peserta') {
      router.push('/login');
      return;
    }

    setUserId(currentUser.id);

    // Load ujian data
    if (currentUser.ujianId) {
      const ujian = ExamService.getUjian(currentUser.ujianId);
      if (ujian) {
        setUjianData(ujian);
        
        // Check if already completed
        const existingJawaban = ExamService.getJawaban(currentUser.id, ujian.id);
        if (existingJawaban && existingJawaban.waktuSelesai) {
          // Already completed
          setAlertConfig({
            type: 'info',
            title: 'Info',
            message: 'Anda sudah menyelesaikan ujian ini.',
          });
          setShowAlert(true);
          setTimeout(() => {
            AuthService.logout();
            router.push('/login');
          }, 3000);
          return;
        }

        // Load existing answers if any
        if (existingJawaban) {
          setAnswers(existingJawaban.jawaban);
          setDoubtfulQuestions(existingJawaban.raguRagu);
          
          // Calculate remaining time
          const waktuMulai = new Date(existingJawaban.waktuMulai);
          const sekarang = new Date();
          const elapsedSeconds = Math.floor((sekarang.getTime() - waktuMulai.getTime()) / 1000);
          const remainingSeconds = (ujian.durasi * 60) - elapsedSeconds;
          setTimeLeft(Math.max(0, remainingSeconds));
        } else {
          // Initialize new exam session
          const newJawaban: JawabanPeserta = {
            userId: currentUser.id,
            ujianId: ujian.id,
            jawaban: {},
            raguRagu: [],
            waktuMulai: new Date(),
          };
          ExamService.saveJawaban(newJawaban);
          setTimeLeft(ujian.durasi * 60);
        }
      } else {
        setAlertConfig({
          type: 'error',
          title: 'Error',
          message: 'Data ujian tidak ditemukan.',
        });
        setShowAlert(true);
        setTimeout(() => {
          router.push('/login');
        }, 2000);
        return;
      }
    }

    setIsLoading(false);
  }, [router]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          handleTimeOut();
          return 0;
        }
        
        // Auto-save every 10 seconds
        if (prev % 10 === 0) {
          saveProgress();
        }
        
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const saveProgress = () => {
    if (!ujianData || !userId) return;

    const jawabanPeserta: JawabanPeserta = {
      userId,
      ujianId: ujianData.id,
      jawaban: answers,
      raguRagu: doubtfulQuestions,
      waktuMulai: new Date(Date.now() - ((ujianData.durasi * 60 - timeLeft) * 1000)),
    };

    ExamService.saveJawaban(jawabanPeserta);
  };

  const handleTimeOut = () => {
    setAlertConfig({
      type: 'warning',
      title: 'Waktu Habis',
      message: 'Waktu ujian telah habis. Jawaban Anda akan otomatis tersimpan.',
    });
    setShowAlert(true);
    
    // Auto submit after timeout
    setTimeout(() => {
      handleSubmitExam();
    }, 2000);
  };

  const handleSelectAnswer = (label: string) => {
    const newAnswers = { ...answers, [currentQuestion]: label };
    setAnswers(newAnswers);
    
    // Remove from doubtful if answered
    if (doubtfulQuestions.includes(currentQuestion)) {
      setDoubtfulQuestions(doubtfulQuestions.filter((q) => q !== currentQuestion));
    }
    
    // Auto-save
    saveProgress();
  };

  const handleMarkDoubtful = () => {
    if (!doubtfulQuestions.includes(currentQuestion)) {
      setDoubtfulQuestions([...doubtfulQuestions, currentQuestion]);
      setAlertConfig({
        type: 'info',
        title: 'Soal Ditandai',
        message: 'Soal ini ditandai ragu-ragu. Anda dapat kembali mengerjakan nanti.',
      });
      setShowAlert(true);
      saveProgress();
    }
  };

  const handleNext = () => {
    if (!ujianData) return;

    if (currentQuestion < ujianData.soal.length) {
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
    if (!ujianData) return;

    const unansweredCount = ujianData.soal.length - Object.keys(answers).length;
    
    if (unansweredCount > 0) {
      setAlertConfig({
        type: 'warning',
        title: 'Peringatan',
        message: `Anda masih memiliki ${unansweredCount} soal yang belum dijawab. Yakin ingin mengumpulkan?`,
      });
    } else {
      setAlertConfig({
        type: 'info',
        title: 'Konfirmasi',
        message: 'Apakah Anda yakin ingin mengumpulkan ujian? Pastikan semua jawaban sudah benar.',
      });
    }
    setShowAlert(true);
  };

  const handleSubmitExam = () => {
    if (!ujianData || !userId) return;

    // Calculate score
    const skor = ExamService.hitungSkor(ujianData, answers);

    // Save final jawaban with score
    const jawabanPeserta: JawabanPeserta = {
      userId,
      ujianId: ujianData.id,
      jawaban: answers,
      raguRagu: doubtfulQuestions,
      waktuMulai: new Date(Date.now() - ((ujianData.durasi * 60 - timeLeft) * 1000)),
      waktuSelesai: new Date(),
      skor,
    };

    ExamService.saveJawaban(jawabanPeserta);

    setAlertConfig({
      type: 'success',
      title: 'Berhasil',
      message: `Ujian berhasil dikumpulkan! Skor Anda: ${skor.toFixed(2)}`,
    });
    setShowAlert(true);
    
    // Redirect to confirmation page after 3 seconds
    setTimeout(() => {
      AuthService.logout();
      router.push('/confirmation');
    }, 3000);
  };

  const handleLogout = () => {
    setAlertConfig({
      type: 'warning',
      title: 'Konfirmasi Keluar',
      message: 'Apakah Anda yakin ingin keluar? Progres ujian Anda akan tersimpan.',
    });
    setShowAlert(true);
  };

  const closeAlert = () => {
    setShowAlert(false);
  };

  // Show loading state
  if (isLoading || !ujianData) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F9F9F9]">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"></div>
          <p className="font-heading text-lg text-gray-700">Memuat ujian...</p>
        </div>
      </div>
    );
  }

  const currentQuestionData = ujianData.soal[currentQuestion - 1];
  const answeredQuestions = Object.keys(answers).map(Number);

  return (
    <div className="flex h-screen flex-col bg-[#F9F9F9]">
      {/* Header */}
      <ExamHeader timeRemaining={formatTime(timeLeft)} onLogout={handleLogout} />

      {/* Main Content */}
      <div className="mx-auto flex w-full max-w-[1400px] flex-1 overflow-auto px-4 py-4">
        <div className="flex w-full gap-4">
          {/* Left Column - Question Card (70%) */}
          <div className="flex flex-1 flex-col" style={{ flexBasis: '70%' }}>
            <div className="flex-1">
              <QuestionCard
                questionNumber={currentQuestion}
                questionText={currentQuestionData.pertanyaan}
                answers={currentQuestionData.opsi.map(o => ({ label: o.label, text: o.teks }))}
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
                {currentQuestion === ujianData.soal.length ? 'Selesai' : 'Lanjut'}
                {currentQuestion !== ujianData.soal.length && <ChevronRight className="h-5 w-5" strokeWidth={2.5} />}
              </button>
            </div>
          </div>

          {/* Right Column - Navigation (30%) */}
          <div className="flex-shrink-0" style={{ flexBasis: '30%' }}>
            <QuestionNavigation
              totalQuestions={ujianData.soal.length}
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
        onClose={closeAlert}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        primaryButtonText={alertConfig.title === 'Konfirmasi' ? 'Ya, Kumpulkan' : 'Tutup'}
        onPrimaryClick={() => {
          if (alertConfig.title === 'Konfirmasi') {
            handleSubmitExam();
          }
          closeAlert();
        }}
      />
    </div>
  );
}
