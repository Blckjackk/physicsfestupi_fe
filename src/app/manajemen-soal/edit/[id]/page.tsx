// @ts-nocheck
'use client';

/**
 * EditExamPage Component
 * 
 * FULLY INTEGRATED WITH BACKEND API
 * Halaman untuk mengedit ujian yang sudah ada
 * Diakses melalui route: /manajemen-soal/edit/[id]
 */

import React, { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Sidebar from '@/components/dashboard-admin/Sidebar';
import FormattedText from '@/components/FormattedText';
import AlertModal, { AlertType } from '@/components/ui/alert-modal';
import { adminService, type Ujian, type Soal } from '@/services/admin.service';
import { ArrowLeft, Pencil, Trash, Plus } from 'lucide-react';
import { useAdminGuard } from '@/hooks/useAuthGuard';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

type ExamForm = {
  nama: string;
  deskripsi: string;
  durasi: number;
};

export default function EditExamPage() {
  // Auth guard - redirect if not admin
  const { isLoading: authLoading, isAuthenticated } = useAdminGuard();
  
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const examId = params.id as string;

  const [ujian, setUjian] = useState<Ujian | null>(null);
  const [jumlahSoal, setJumlahSoal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<ExamForm>({
    nama: '',
    deskripsi: '',
    durasi: 0
  });

  // Check for tab parameter from URL
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<'info' | 'soal'>(tabParam === 'soal' ? 'soal' : 'info');
  
  // Alert modal states
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    type: 'info' as AlertType,
    title: '',
    message: '',
    confirmAction: null as (() => void) | null,
  });

  // Load ujian data on mount
  useEffect(() => {
    loadUjian();
  }, [examId]);

  const loadUjian = async () => {
    try {
      // Fetch ujian data from backend API
      const ujianList = await adminService.getUjian();
      const ujianData = ujianList.find(u => u.id === parseInt(examId));
      
      if (ujianData) {
        setUjian(ujianData);
        setFormData({
          nama: ujianData.nama_ujian,
          deskripsi: ujianData.deskripsi || '',
          durasi: ujianData.durasi
        });

        // Fetch real-time jumlah soal from backend
        // Note: jumlah_soal already included in ujianData from getUjian()
        setJumlahSoal(ujianData.jumlah_soal || 0);
      } else {
        setUjian(null);
      }
    } catch (error) {
      console.error('Failed to load ujian:', error);
      setUjian(null);
    } finally {
      setIsLoading(false);
    }
  };  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nama.trim()) {
      alert('Nama ujian harus diisi');
      return;
    }

    try {
      // Get current ujian data to preserve waktu fields
      const ujianList = await adminService.getUjian();
      const currentUjian = ujianList.find(u => u.id === parseInt(examId));
      
      if (!currentUjian) {
        alert('Ujian tidak ditemukan');
        return;
      }

      // Calculate new waktu_akhir based on durasi
      const waktuMulai = new Date(currentUjian.waktu_mulai_pengerjaan);
      const waktuAkhir = new Date(waktuMulai.getTime() + formData.durasi * 60 * 1000);

      // Update via backend API
      await adminService.updateUjian(parseInt(examId), {
        nama_ujian: formData.nama,
        deskripsi: formData.deskripsi,
        waktu_mulai_pengerjaan: currentUjian.waktu_mulai_pengerjaan,
        waktu_akhir_pengerjaan: waktuAkhir.toISOString(),
        durasi: formData.durasi
      });

      setAlertConfig({
        type: 'success',
        title: 'Berhasil!',
        message: 'Ujian berhasil diupdate!',
        confirmAction: null,
      });
      setShowAlert(true);
    } catch (error) {
      console.error('Failed to update ujian:', error);
      setAlertConfig({
        type: 'error',
        title: 'Error!',
        message: 'Gagal mengupdate ujian. Silakan coba lagi.',
        confirmAction: null,
      });
      setShowAlert(true);
    }
  };

  const closeAlert = () => {
    setShowAlert(false);
    // If it's a success alert for ujian update, navigate back
    if (alertConfig.type === 'success' && alertConfig.title === 'Berhasil!' && alertConfig.message.includes('Ujian berhasil diupdate')) {
      router.push('/manajemen-soal');
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="flex h-screen items-center justify-center">
            <div className="text-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-[#41366E] mx-auto mb-4"></div>
              <p className="font-inter text-gray-600">Memuat data ujian...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!ujian) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="flex h-screen items-center justify-center">
            <div className="text-center">
              <h2 className="font-heading text-2xl font-bold text-gray-900 mb-2">Ujian tidak ditemukan</h2>
              <p className="font-inter text-gray-600 mb-6">Ujian dengan ID tersebut tidak ditemukan</p>
              <button
                onClick={() => router.push('/manajemen-soal')}
                className="rounded-lg bg-[#41366E] px-6 py-3 font-heading text-base font-semibold text-white transition-all hover:bg-[#2f2752]"
              >
                Kembali ke Manajemen Soal
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Show loading spinner while checking authentication
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // This component will only render if user is authenticated as admin
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl px-8 py-8">
          {/* Header with Back Button */}
          <div className="mb-8 flex items-center gap-4">
            <button
              onClick={() => router.push('/manajemen-soal')}
              className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-[#41366E] bg-white text-[#41366E] transition-all hover:bg-[#41366E] hover:text-white"
              aria-label="Kembali ke Manajemen Soal"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="font-heading text-4xl font-bold text-[#41366e]">
              Edit {formData.nama}
            </h1>
          </div>

          {/* Main Card */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden">
            {/* Tabs - Horizontal Navigation */}
            <div className="flex border-b border-gray-200 bg-white">
              <button
                onClick={() => setActiveTab('info')}
                className={`relative px-8 py-4 font-inter text-base font-semibold transition-all ${
                  activeTab === 'info'
                    ? 'bg-[#41366e] text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-[#41366e]'
                }`}
              >
                Info Ujian
              </button>
              <button
                onClick={() => setActiveTab('soal')}
                className={`relative px-8 py-4 font-inter text-base font-semibold transition-all ${
                  activeTab === 'soal'
                    ? 'bg-[#41366e] text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-[#41366e]'
                }`}
              >
                Soal Ujian
              </button>
            </div>

            {/* Form Content */}
            {activeTab === 'info' && (
              <div className="p-8">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                      {/* Nama Ujian */}
                      <div>
                        <label className="mb-2 block font-inter text-sm font-semibold text-gray-900">
                          Nama Ujian
                        </label>
                        <input
                          type="text"
                          value={formData.nama}
                          onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-inter text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:border-[#41366E] focus:outline-none focus:ring-2 focus:ring-[#41366E]/20"
                          placeholder="Ujian A"
                          required
                        />
                      </div>

                      {/* Deskripsi */}
                      <div>
                        <label className="mb-2 block font-inter text-sm font-semibold text-gray-900">
                          Deskripsi
                        </label>
                        <textarea
                          value={formData.deskripsi}
                          onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                          rows={5}
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-inter text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:border-[#41366E] focus:outline-none focus:ring-2 focus:ring-[#41366E]/20 resize-none"
                          placeholder="Ini adalah ujian chunnin"
                        />
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      {/* Durasi */}
                      <div>
                        <label className="mb-2 block font-inter text-sm font-semibold text-gray-900">
                          Durasi (menit)
                        </label>
                        <input
                          type="number"
                          value={formData.durasi}
                          onChange={(e) => setFormData({ ...formData, durasi: parseInt(e.target.value) || 60 })}
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-inter text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:border-[#41366E] focus:outline-none focus:ring-2 focus:ring-[#41366E]/20"
                          placeholder="60"
                          min="1"
                          required
                        />
                      </div>

                      {/* Jumlah Soal - Read Only */}
                      <div>
                        <label className="mb-2 block font-inter text-sm font-semibold text-gray-900">
                          Jumlah Soal
                        </label>
                        <div className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 font-inter text-sm text-gray-600">
                          {jumlahSoal}
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Tambah atau hapus soal di tab "Soal Ujian"</p>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* Soal Ujian Tab */}
            {activeTab === 'soal' && (
              <SoalUjianTab 
                examId={examId as string} 
                examName={formData.nama}
                onShowAlert={setAlertConfig}
                onSetShowAlert={setShowAlert}
              />
            )}
          </div>

          {/* Update Button - Outside the box, below it */}
          {activeTab === 'info' && (
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSubmit}
                className="rounded-lg bg-[#41366E] px-10 py-3 font-heading text-base font-semibold text-white shadow-md transition-all hover:bg-[#2f2752] hover:shadow-lg active:scale-95"
              >
                Update Ujian
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Alert Modal */}
      <AlertModal
        isOpen={showAlert}
        onClose={closeAlert}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        primaryButtonText={alertConfig.type === 'warning' && alertConfig.confirmAction ? 'Hapus' : 'Tutup'}
        secondaryButtonText={alertConfig.type === 'warning' && alertConfig.confirmAction ? 'Batal' : undefined}
        onPrimaryClick={() => {
          if (alertConfig.type === 'warning' && alertConfig.confirmAction) {
            alertConfig.confirmAction();
          }
          closeAlert();
        }}
        onSecondaryClick={closeAlert}
      />
    </div>
  );
}

// ============ SOAL UJIAN TAB COMPONENT ============
function SoalUjianTab({ 
  examId, 
  examName,
  onShowAlert,
  onSetShowAlert
}: { 
  examId: string; 
  examName: string;
  onShowAlert: (config: any) => void;
  onSetShowAlert: (show: boolean) => void;
}) {
  const router = useRouter();
  const [questions, setQuestions] = useState<Soal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadQuestions();
  }, [examId]);

  const loadQuestions = async () => {
    setIsLoading(true);
    try {
      // Fetch real soal from backend API
      const soalResponse = await adminService.getSoalByUjian(parseInt(examId));
      setQuestions(soalResponse);
    } catch (error) {
      console.error('Failed to fetch soal:', error);
      setQuestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteQuestion = (id: number) => {
    onShowAlert({
      type: 'warning' as AlertType,
      title: 'Konfirmasi Hapus',
      message: 'Apakah Anda yakin ingin menghapus soal ini? Tindakan ini tidak dapat dibatalkan.',
      confirmAction: () => confirmDeleteQuestion(id),
    });
    onSetShowAlert(true);
  };

  const confirmDeleteQuestion = async (id: number) => {
    try {
      await adminService.deleteSoal(id);
      onShowAlert({
        type: 'success' as AlertType,
        title: 'Berhasil!',
        message: 'Soal berhasil dihapus!',
        confirmAction: null,
      });
      onSetShowAlert(true);
      loadQuestions(); // Refresh list
    } catch (error) {
      console.error('Failed to delete soal:', error);
      onShowAlert({
        type: 'error' as AlertType,
        title: 'Error!',
        message: 'Gagal menghapus soal. Silakan coba lagi.',
        confirmAction: null,
      });
      onSetShowAlert(true);
    }
  };

  const handleEditQuestion = (questionId: number) => {
    router.push(`/manajemen-soal/edit/${examId}/edit-soal/${questionId}`);
  };

  const handleTambahSoal = () => {
    router.push(`/manajemen-soal/edit/${examId}/tambah-soal`);
  };

  if (isLoading) {
    return (
      <div className="p-8 bg-gray-50">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-[#41366E] mx-auto mb-4"></div>
            <p className="font-inter text-sm text-gray-600">Memuat soal...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50">
      {/* Header with Tambah Soal Button */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-gray-900">Daftar Soal</h2>
          <p className="mt-1 font-inter text-sm text-gray-600">
            {questions.length} soal tersedia
          </p>
        </div>
        <button
          onClick={handleTambahSoal}
          className="flex items-center gap-2 rounded-lg bg-[#41366E] px-6 py-3 font-heading text-base font-semibold text-white shadow-md transition-all hover:bg-[#2f2752] hover:shadow-lg active:scale-95"
        >
          <Plus className="h-5 w-5" />
          Tambah Soal
        </button>
      </div>

      {/* Questions List */}
      {questions.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-white p-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Plus className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="font-heading text-lg font-semibold text-gray-900 mb-2">Belum Ada Soal</h3>
          <p className="font-inter text-sm text-gray-600 mb-6">Mulai menambahkan soal untuk ujian ini</p>
          <button
            onClick={handleTambahSoal}
            className="rounded-lg bg-[#41366E] px-6 py-2.5 font-heading text-sm font-semibold text-white transition-all hover:bg-[#2f2752]"
          >
            Tambah Soal Pertama
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {questions.map((question, index) => (
            <QuestionCard
              key={question.id}
              question={question}
              number={index + 1}
              onEdit={() => handleEditQuestion(question.id)}
              onDelete={() => handleDeleteQuestion(question.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ============ QUESTION CARD COMPONENT ============
function QuestionCard({ 
  question, 
  number, 
  onEdit,
  onDelete 
}: { 
  question: Soal; 
  number: number; 
  onEdit: () => void;
  onDelete: () => void;
}) {
  // Get base URL for images
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
  
  // Convert backend soal format to display format with images
  const opsiList = [
    { label: 'A', teks: question.opsi_a, gambar: question.opsi_a_media },
    { label: 'B', teks: question.opsi_b, gambar: question.opsi_b_media },
    { label: 'C', teks: question.opsi_c, gambar: question.opsi_c_media },
    { label: 'D', teks: question.opsi_d, gambar: question.opsi_d_media },
    { label: 'E', teks: question.opsi_e, gambar: question.opsi_e_media }
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-md transition-all hover:shadow-lg">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#41366E] text-white font-heading text-sm font-bold">
            {number}
          </div>
          <h3 className="font-heading text-lg font-bold text-gray-900">Soal {number}</h3>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={onEdit}
            className="rounded-lg p-2 transition-all hover:bg-gray-100 active:scale-95"
            aria-label="Edit soal"
          >
            <Pencil size={20} className="text-gray-600" />
          </button>
          <button 
            onClick={onDelete} 
            className="rounded-lg p-2 transition-all hover:bg-red-50 active:scale-95"
            aria-label="Hapus soal"
          >
            <Trash size={20} className="text-red-600" />
          </button>
        </div>
      </div>

      {/* Question Text */}
      <div className="mb-6">
        <FormattedText 
          text={question.pertanyaan} 
          className="font-inter text-base leading-relaxed text-gray-800"
        />
        {/* Question Image */}
        {question.media_soal && (
          <img 
            src={`${API_BASE_URL}/${question.media_soal}`} 
            alt="Gambar soal"
            className="mx-auto my-4 block max-h-[250px] max-w-[400px] rounded-lg object-contain border border-gray-200"
          />
        )}
      </div>

      {/* Answer Options */}
      <div className="space-y-4 mb-6">
        {opsiList.map((opsi) => (
          <div 
            key={opsi.label} 
            className={`flex items-start gap-4 rounded-xl border-2 p-4 transition-all ${
              question.jawaban_benar.toUpperCase() === opsi.label
                ? 'border-[#41366E] bg-[#41366E]/5'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex-shrink-0">
              <span className={`flex h-10 w-10 items-center justify-center rounded-lg text-base font-bold ${
                question.jawaban_benar.toUpperCase() === opsi.label 
                  ? 'bg-[#41366E] text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {opsi.label}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <FormattedText 
                text={opsi.teks} 
                className="font-inter text-sm text-gray-800"
              />
              {/* Option Image */}
              {opsi.gambar && (
                <img 
                  src={`${API_BASE_URL}/${opsi.gambar}`} 
                  alt={`Gambar opsi ${opsi.label}`}
                  className="mt-3 block max-h-[150px] max-w-[250px] rounded-lg object-contain border border-gray-200"
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Correct Answer Label */}
      <div className="rounded-xl bg-[#41366E] px-6 py-3 text-center shadow-md">
        <span className="font-heading text-base font-semibold text-white">
          Jawaban Benar: {question.jawaban_benar.toUpperCase()}
        </span>
      </div>
    </div>
  );
}

