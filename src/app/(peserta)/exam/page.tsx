// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ExamHeader from '@/components/exam/ExamHeader';
import QuestionCard from '@/components/exam/QuestionCard';
import QuestionNavigation from '@/components/exam/QuestionNavigation';
import AlertModal from '@/components/ui/alert-modal';
import { authService } from '@/services/auth.service';
import { examService } from '@/services/exam.service';
import type { Soal, ExamSessionResponse } from '@/types/api';

export default function ExamPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [examSession, setExamSession] = useState<ExamSessionResponse | null>(null);
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
    const loadExamSession = async () => {
      // Check authentication
      if (!authService.isAuthenticated()) {
        router.push('/login');
        return;
      }

      const currentUser = authService.getAuthUser();
      if (!currentUser || currentUser.role !== 'peserta') {
        router.push('/login');
        return;
      }

      try {
        // For testing: use ujian_id = 1 (Fisika Dasar A)
        // In production, this should come from the login response or user data
        const ujianId = 1;
        
        // Load questions from Laravel API
        const data = await examService.getExamSession(ujianId);
        
        // Laravel returns { ujian, total_soal, soal }
        // Transform to our expected format
        const transformedSession = {
          ujian: data.ujian,
          soal: data.soal,
          aktivitas: { status: 'sedang_mengerjakan' }, // Simplified for now
          waktu_tersisa_detik: 7200, // 2 hours default
        };
        
        setExamSession(transformedSession);
        
        // Load existing answers from soal data
        const savedAnswers: Record<number, string> = {};
        data.soal.forEach((soal: any) => {
          if (soal.jawaban_peserta) {
            savedAnswers[soal.nomor_soal] = soal.jawaban_peserta.toUpperCase();
          }
        });
        setAnswers(savedAnswers);
        
        // Set default time (should be calculated from ujian waktu_akhir)
        setTimeLeft(7200); // 2 hours
        
        setIsLoading(false);
      } catch (error: any) {
        console.error('Failed to load exam session:', error);
        setIsLoading(false);
        
        // Check if exam already submitted
        const errorMessage = error?.message || error?.toString() || '';
        if (errorMessage.toLowerCase().includes('sudah') || errorMessage.toLowerCase().includes('submit')) {
          setAlertConfig({
            type: 'info',
            title: 'Info!',
            message: 'Anda Sudah Mengerjakan Soal!',
          });
          setShowAlert(true);
          
          // Prevent further interaction - stay on empty page with modal
          // User will be redirected after closing modal
        } else {
          setAlertConfig({
            type: 'error',
            title: 'Error',
            message: 'Gagal memuat data ujian. Pastikan backend sedang berjalan.',
          });
          setShowAlert(true);
        }
      }
    };

    loadExamSession();
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

  const saveProgress = async () => {
    // Progress is auto-saved when selecting answers via handleSelectAnswer
    // This function is kept for compatibility with timer auto-save
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

  const handleSelectAnswer = async (label: string) => {
    if (!examSession) return;
    
    const newAnswers = { ...answers, [currentQuestion]: label };
    setAnswers(newAnswers);
    
    // Remove from doubtful if answered
    if (doubtfulQuestions.includes(currentQuestion)) {
      setDoubtfulQuestions(doubtfulQuestions.filter((q) => q !== currentQuestion));
    }
    
    // Auto-save to Laravel API
    try {
      const currentSoal = examSession.soal[currentQuestion - 1];
      await examService.submitAnswer({
        soal_id: currentSoal.id,
        jawaban_user: label,
        ujian_id: examSession.ujian.id,
      });
    } catch (error) {
      console.error('Failed to save answer:', error);
      // Don't show error to user, just log it
    }
  };

  const handleMarkDoubtful = () => {
    // Toggle doubtful status
    if (doubtfulQuestions.includes(currentQuestion)) {
      // Remove from doubtful
      setDoubtfulQuestions(doubtfulQuestions.filter((q) => q !== currentQuestion));
    } else {
      // Add to doubtful
      setDoubtfulQuestions([...doubtfulQuestions, currentQuestion]);
    }
    saveProgress();
  };

  const handleNext = () => {
    if (!examSession) return;

    if (currentQuestion < examSession.soal.length) {
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
    setAlertConfig({
      type: 'warning',
      title: 'Peringatan!',
      message: 'Pastikan semua jawaban sudah diisi. Apakah Anda yakin ingin menyelesaikan ujian ini sekarang?',
    });
    setShowAlert(true);
  };

  const handleSubmitExam = async () => {
    if (!examSession) return;

    try {
      // Close the warning modal first
      setShowAlert(false);
      
      // Submit exam to Laravel API
      const result = await examService.submitExam(examSession.ujian.id);

      // Laravel returns { peserta_id, ujian_id, nilai_total, total_soal, total_jawaban, total_benar, total_salah }
      setAlertConfig({
        type: 'success',
        title: 'Berhasil',
        message: 'Berhasil Submit!',
      });
      setShowAlert(true);
      
      // Clear authentication and redirect to confirmation page after 2 seconds
      setTimeout(() => {
        authService.logout(); // Clear token and user data
        router.push('/confirmation');
      }, 2000);
    } catch (error) {
      console.error('Failed to submit exam:', error);
      setAlertConfig({
        type: 'error',
        title: 'Gagal',
        message: 'Gagal mengumpulkan ujian. Silakan coba lagi.',
      });
      setShowAlert(true);
    }
  };

  const handleLogout = () => {
    authService.logout();
    router.push('/login');
  };

  const closeAlert = () => {
    setShowAlert(false);
    
    // If showing "Anda Sudah Mengerjakan Soal" message, logout and redirect
    if (alertConfig.title === 'Info!' && alertConfig.message === 'Anda Sudah Mengerjakan Soal!') {
      authService.logout();
      // Set flag to force clean login
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('force_logout', 'true');
      }
      router.push('/login?logout=true');
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F9F9F9]">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"></div>
          <p className="font-heading text-lg text-gray-700">Memuat ujian...</p>
        </div>
      </div>
    );
  }

  // If exam session failed to load, show alert modal on blank page
  if (!examSession) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F9F9F9]">
        <AlertModal
          isOpen={showAlert}
          onClose={closeAlert}
          type={alertConfig.type}
          title={alertConfig.title}
          message={alertConfig.message}
          primaryButtonText="Tutup"
          onPrimaryClick={closeAlert}
        />
      </div>
    );
  }

  const currentQuestionData = examSession.soal[currentQuestion - 1];
  const answeredQuestions = Object.keys(answers).map(Number);
  
  // Convert question data to expected format for QuestionCard
  const questionOptions = [
    { label: 'A', text: currentQuestionData.opsi_a || '' },
    { label: 'B', text: currentQuestionData.opsi_b || '' },
    { label: 'C', text: currentQuestionData.opsi_c || '' },
    { label: 'D', text: currentQuestionData.opsi_d || '' },
    { label: 'E', text: currentQuestionData.opsi_e || '' },
  ].filter(opt => opt.text); // Filter out empty options

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
                answers={questionOptions}
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
                  className="flex h-[50px] w-[240px] items-center justify-center gap-2 rounded-xl border-2 border-gray-300 bg-white font-heading text-[16px] font-bold text-gray-700 shadow-md transition-all hover:border-gray-400 hover:bg-gray-50 hover:shadow-lg active:scale-95"
                >
                  <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
                  Kembali
                </button>
              ) : (
                <div></div>
              )}

              {/* Center: Ragu-Ragu Button - Toggle: White (not marked) → Yellow (marked) */}
              <button
                onClick={handleMarkDoubtful}
                className={`absolute left-1/2 h-[50px] w-[240px] -translate-x-1/2 rounded-xl font-heading text-[16px] font-bold shadow-md transition-all hover:shadow-lg active:scale-95 ${
                  doubtfulQuestions.includes(currentQuestion)
                    ? 'bg-[#ffac27] text-white hover:bg-[#f09d15]'
                    : 'border-2 border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                Ragu-Ragu
              </button>

              {/* Right: Next/Submit Button */}
              <button
                onClick={handleNext}
                className={`flex h-[50px] w-[240px] items-center justify-center gap-2 rounded-xl font-heading text-[16px] font-bold text-white shadow-md transition-all hover:shadow-lg active:scale-95 ${
                  currentQuestion === examSession.soal.length
                    ? 'bg-[#6b9e4d] hover:bg-[#5a8a3e]'
                    : 'bg-[#7a5cb3] hover:bg-[#6b4d9e]'
                }`}
              >
                {currentQuestion === examSession.soal.length ? 'Submit Jawaban' : 'Lanjut'}
                {currentQuestion !== examSession.soal.length && <ChevronRight className="h-5 w-5" strokeWidth={2.5} />}
              </button>
            </div>
          </div>

          {/* Right Column - Navigation (30%) */}
          <div className="flex-shrink-0" style={{ flexBasis: '30%' }}>
            <QuestionNavigation
              totalQuestions={examSession.soal.length}
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
        primaryButtonText={alertConfig.title === 'Peringatan!' ? 'Submit' : alertConfig.type === 'success' ? 'Ok' : 'Tutup'}
        secondaryButtonText={alertConfig.title === 'Peringatan!' ? 'Kembali' : undefined}
        answeredCount={examSession ? Object.keys(answers).length : undefined}
        totalQuestions={examSession ? examSession.soal.length : undefined}
        timeRemaining={formatTime(timeLeft)}
        onPrimaryClick={() => {
          if (alertConfig.title === 'Peringatan!') {
            handleSubmitExam();
          }
          closeAlert();
        }}
        onSecondaryClick={() => {
          closeAlert();
        }}
      />
    </div>
  );
}
