// @ts-nocheck
'use client';

/**
 * EditExamPage Component
 * 
 * Halaman untuk mengedit ujian yang sudah ada
 * Diakses melalui route: /manajemen-soal/edit/[id]
 * 
 * Production-ready dengan struktur modular dan styling lengkap
 */

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Sidebar from '@/components/dashboard-admin/Sidebar';
import { ArrowLeft, Calendar, Pencil, Trash, Plus, X, ChevronDown, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

type ExamForm = {
  nama: string;
  deskripsi: string;
  mulai: string;
  akhir: string;
  jumlahSoal: number;
};

// Mock data for questions
const sampleQuestions = [
  {
    id: 1,
    soal: 'Seorang siswa melakukan percobaan hukum Newton dengan cara menarik sebuah troli bermassa 4 kg menggunakan dinamometer di atas bidang datar licin.',
    jawaban: ['Gaya yang ditunjukkan dinamometer adalah 12 N, troli bergerak dengan percepatan.', 'Setelah beberapa saat, siswa memanbankan beban 2 kg di atas troli dan menariknya kembali dengan gaya yang sama (12 N).'],
    opsiBenar: 'A. Rp8.250',
    gambar: '/images/example-chart.png',
    opsi: [
      { label: 'A', text: 'Rp8.250', gambar: '/images/graph-a.png' },
      { label: 'B', text: 'Rp8.250', gambar: '/images/graph-b.png' },
      { label: 'C', text: 'Rp8.250', gambar: '/images/graph-c.png' },
      { label: 'D', text: 'Rp8.250', gambar: null },
      { label: 'E', text: 'Rp8.250', gambar: null },
    ]
  },
  {
    id: 2,
    soal: 'Seorang siswa melakukan percobaan hukum Newton dengan cara menarik sebuah troli bermassa 4 kg menggunakan dinamometer di atas bidang datar licin.',
    jawaban: ['Gaya yang ditunjukkan dinamometer adalah 12 N, troli bergerak dengan percepatan.', 'Setelah beberapa saat, siswa memanbankan beban 2 kg di atas troli dan menariknya kembali dengan gaya yang sama (12 N).'],
    opsiBenar: 'D',
    gambar: null,
    opsi: [
      { label: 'A', text: 'Rp8.250', gambar: null },
      { label: 'B', text: 'Rp8.250', gambar: null },
      { label: 'C', text: 'Rp8.250', gambar: null },
      { label: 'D', text: 'Rp8.250', gambar: null },
      { label: 'E', text: 'Rp8.250', gambar: null },
    ]
  },
];

export default function EditExamPage() {
  const router = useRouter();
  const params = useParams();
  const examId = params.id;

  // Mock data - in production, fetch from API based on examId
  const [formData, setFormData] = useState<ExamForm>({
    nama: 'Ujian A',
    deskripsi: 'Ini adalah ujian chunnin',
    mulai: 'dd/mm/yy --:--',
    akhir: 'dd/mm/yy --:--',
    jumlahSoal: 100
  });

  const [activeTab, setActiveTab] = useState<'info' | 'soal'>('info');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nama.trim()) {
      alert('Nama ujian harus diisi');
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Success - redirect back to manajemen soal
      alert('Ujian berhasil diupdate');
      router.push('/manajemen-soal');
    } catch (error) {
      alert('Gagal mengupdate ujian');
    }
  };

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
                      {/* Waktu Mulai */}
                      <div>
                        <label className="mb-2 block font-inter text-sm font-semibold text-gray-900">
                          Waktu Mulai
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={formData.mulai}
                            onChange={(e) => setFormData({ ...formData, mulai: e.target.value })}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-10 font-inter text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:border-[#41366E] focus:outline-none focus:ring-2 focus:ring-[#41366E]/20"
                            placeholder="dd/mm/yy --:--"
                          />
                          <Calendar className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* Waktu Akhir */}
                      <div>
                        <label className="mb-2 block font-inter text-sm font-semibold text-gray-900">
                          Waktu Akhir
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={formData.akhir}
                            onChange={(e) => setFormData({ ...formData, akhir: e.target.value })}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-10 font-inter text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:border-[#41366E] focus:outline-none focus:ring-2 focus:ring-[#41366E]/20"
                            placeholder="dd/mm/yy --:--"
                          />
                          <Calendar className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* Jumlah Soal */}
                      <div>
                        <label className="mb-2 block font-inter text-sm font-semibold text-gray-900">
                          Jumlah Soal
                        </label>
                        <input
                          type="number"
                          value={formData.jumlahSoal}
                          onChange={(e) => setFormData({ ...formData, jumlahSoal: parseInt(e.target.value) || 0 })}
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-inter text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:border-[#41366E] focus:outline-none focus:ring-2 focus:ring-[#41366E]/20"
                          placeholder="100"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* Soal Ujian Tab */}
            {activeTab === 'soal' && (
              <SoalUjianTab examId={examId as string} examName={formData.nama} />
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
    </div>
  );
}

// ============ SOAL UJIAN TAB COMPONENT ============
function SoalUjianTab({ examId, examName }: { examId: string; examName: string }) {
  const router = useRouter();
  const [questions, setQuestions] = useState(sampleQuestions);

  const handleDeleteQuestion = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus soal ini?')) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  const handleEditQuestion = (questionId: number) => {
    router.push(`/manajemen-soal/edit/${examId}/edit-soal/${questionId}`);
  };

  const handleTambahSoal = () => {
    router.push(`/manajemen-soal/edit/${examId}/tambah-soal`);
  };

  return (
    <div className="p-8 bg-gray-50">
      {/* Header with Tambah Soal Button */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-gray-900">Daftar Soal</h2>
          <p className="mt-1 font-inter text-sm text-gray-600">{questions.length} soal tersedia</p>
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
  question: any; 
  number: number; 
  onEdit: () => void;
  onDelete: () => void;
}) {
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
        <p className="font-inter text-base leading-relaxed text-gray-800">{question.soal}</p>
        {question.jawaban && question.jawaban.length > 0 && (
          <ul className="mt-4 space-y-2 pl-5">
            {question.jawaban.map((item: string, idx: number) => (
              <li key={idx} className="font-inter text-sm text-gray-700 list-disc">{item}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Question Image */}
      {question.gambar && (
        <div className="mb-6 flex justify-center">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm">
            <Image 
              src={question.gambar} 
              alt="Ilustrasi soal"
              width={400}
              height={300}
              className="rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Answer Options */}
      <div className="space-y-4 mb-6">
        {question.opsi.map((opsi: any) => (
          <div 
            key={opsi.label} 
            className={`flex items-start gap-4 rounded-xl border-2 p-4 transition-all ${
              question.opsiBenar.includes(opsi.label)
                ? 'border-[#41366E] bg-[#41366E]/5'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex-shrink-0">
              <span className={`flex h-10 w-10 items-center justify-center rounded-lg text-base font-bold ${
                question.opsiBenar.includes(opsi.label) 
                  ? 'bg-[#41366E] text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {opsi.label}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-inter text-sm text-gray-800">{opsi.text}</p>
              {opsi.gambar && (
                <div className="mt-3">
                  <Image 
                    src={opsi.gambar} 
                    alt={`Jawaban ${opsi.label}`}
                    width={250}
                    height={180}
                    className="rounded-lg border border-gray-200 shadow-sm"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Correct Answer Label */}
      <div className="rounded-xl bg-[#41366E] px-6 py-3 text-center shadow-md">
        <span className="font-heading text-base font-semibold text-white">
          Jawaban : {question.opsiBenar}
        </span>
      </div>
    </div>
  );
}

