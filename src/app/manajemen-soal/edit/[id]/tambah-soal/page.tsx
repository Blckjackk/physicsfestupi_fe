// @ts-nocheck
'use client';

/**
 * TambahSoalPage Component
 * 
 * Halaman untuk menambahkan soal baru ke ujian
 * Route: /manajemen-soal/edit/[id]/tambah-soal
 * 
 * Production-ready dengan Google Form style interface
 */

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Sidebar from '@/components/dashboard-admin/Sidebar';
import { adminService } from '@/services/admin.service';
import { ArrowLeft, ChevronDown, Image as ImageIcon } from 'lucide-react';

export default function TambahSoalPage() {
  const router = useRouter();
  const params = useParams();
  const examId = params.id;

  // Load exam name from backend
  const [examName, setExamName] = useState('');
  const [nextNomorSoal, setNextNomorSoal] = useState(1);
  
  useEffect(() => {
    loadExamData();
  }, [examId]);

  const loadExamData = async () => {
    try {
      const ujianList = await adminService.getUjian();
      const ujian = ujianList.find(u => u.id === parseInt(examId as string));
      if (ujian) {
        setExamName(ujian.nama_ujian);
      }

      // Get existing soal to determine next nomor_soal
      const soalList = await adminService.getSoalByUjian(parseInt(examId as string));
      setNextNomorSoal(soalList.length + 1);
    } catch (error) {
      console.error('Failed to load exam data:', error);
    }
  };

  // Form state - Using URL strings for images
  const [tipeSoal, setTipeSoal] = useState('Gambar');
  const [soal, setSoal] = useState('');
  const [soalGambar, setSoalGambar] = useState<string>('');
  const [jawabanA, setJawabanA] = useState('');
  const [gambarA, setGambarA] = useState<string>('');
  const [jawabanB, setJawabanB] = useState('');
  const [gambarB, setGambarB] = useState<string>('');
  const [jawabanC, setJawabanC] = useState('');
  const [gambarC, setGambarC] = useState<string>('');
  const [jawabanD, setJawabanD] = useState('');
  const [gambarD, setGambarD] = useState<string>('');
  const [jawabanE, setJawabanE] = useState('');
  const [gambarE, setGambarE] = useState<string>('');
  const [jawabanBenar, setJawabanBenar] = useState('D');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!soal.trim()) {
      alert('Soal harus diisi');
      return;
    }

    if (!jawabanA || !jawabanB || !jawabanC || !jawabanD || !jawabanE) {
      alert('Semua jawaban (A-E) harus diisi');
      return;
    }

    try {
      // Create new soal via backend API with image URLs
      await adminService.createSoal({
        ujian_id: parseInt(examId as string),
        nomor_soal: nextNomorSoal,
        tipe_soal: tipeSoal === 'Gambar' ? 'gambar' : 'text',
        pertanyaan: soal,
        media_soal: soalGambar || undefined,
        opsi_a: jawabanA,
        opsi_a_media: gambarA || undefined,
        opsi_b: jawabanB,
        opsi_b_media: gambarB || undefined,
        opsi_c: jawabanC,
        opsi_c_media: gambarC || undefined,
        opsi_d: jawabanD,
        opsi_d_media: gambarD || undefined,
        opsi_e: jawabanE,
        opsi_e_media: gambarE || undefined,
        jawaban_benar: jawabanBenar.toUpperCase(), // Backend expects uppercase
      });

      alert('Soal berhasil ditambahkan');
      router.push(`/manajemen-soal/edit/${examId}?tab=soal`);
    } catch (error) {
      console.error('Error adding soal:', error);
      alert('Gagal menambahkan soal');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-8 py-8">
          {/* Header */}
          <div className="mb-8 flex items-center gap-4">
            <button
              onClick={() => router.push(`/manajemen-soal/edit/${examId}?tab=soal`)}
              className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-[#41366E] bg-white text-[#41366E] transition-all hover:bg-[#41366E] hover:text-white"
              aria-label="Kembali ke Edit Ujian"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="font-heading text-4xl font-bold text-[#41366e]">
                Tambah Soal {examName}
              </h1>
              <p className="mt-1 font-inter text-base text-gray-600">
                Isi form di bawah untuk menambahkan soal baru
              </p>
            </div>
          </div>

          {/* Form Card */}
          <form onSubmit={handleSubmit}>
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
              <div className="space-y-8">
                {/* Tipe Soal Dropdown */}
                <div>
                  <label className="mb-3 block font-inter text-base font-semibold text-gray-900">
                    Tipe Soal
                  </label>
                  <div className="relative">
                    <select
                      value={tipeSoal}
                      onChange={(e) => setTipeSoal(e.target.value)}
                      className="w-full appearance-none rounded-lg border-2 border-gray-300 bg-white px-4 py-3 pr-10 font-inter text-sm text-gray-900 transition-all focus:border-[#41366E] focus:outline-none focus:ring-2 focus:ring-[#41366E]/20"
                    >
                      <option value="Gambar">Gambar</option>
                      <option value="Teks">Teks</option>
                      <option value="Video">Video</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Soal - Rich Text Editor Placeholder */}
                <div>
                  <label className="mb-3 block font-inter text-base font-semibold text-gray-900">
                    Soal
                  </label>
                  <div className="rounded-lg border-2 border-gray-300 overflow-hidden focus-within:border-[#41366E] focus-within:ring-2 focus-within:ring-[#41366E]/20 transition-all">
                    {/* Toolbar */}
                    <div className="flex items-center gap-1 border-b border-gray-200 bg-gray-50 px-3 py-2">
                      <button type="button" className="rounded p-1.5 hover:bg-gray-200 transition-colors" title="Align Left">
                        <span className="text-sm font-semibold text-gray-700">≡</span>
                      </button>
                      <button type="button" className="rounded p-1.5 hover:bg-gray-200 transition-colors" title="Align Center">
                        <span className="text-sm font-semibold text-gray-700">≣</span>
                      </button>
                      <button type="button" className="rounded p-1.5 hover:bg-gray-200 transition-colors" title="Align Right">
                        <span className="text-sm font-semibold text-gray-700">☰</span>
                      </button>
                      <div className="mx-1 h-6 w-px bg-gray-300"></div>
                      <button type="button" className="rounded p-1.5 hover:bg-gray-200 transition-colors" title="Bullet List">
                        <span className="text-sm font-semibold text-gray-700">⚏</span>
                      </button>
                      <button type="button" className="rounded p-1.5 hover:bg-gray-200 transition-colors" title="Bold">
                        <span className="text-sm font-bold text-gray-700">B</span>
                      </button>
                      <button type="button" className="rounded p-1.5 hover:bg-gray-200 transition-colors" title="Underline">
                        <span className="text-sm font-semibold text-gray-700">U</span>
                      </button>
                      <button type="button" className="rounded p-1.5 hover:bg-gray-200 transition-colors" title="Text Color">
                        <span className="text-sm text-gray-700">A</span>
                      </button>
                      <button type="button" className="rounded p-1.5 hover:bg-gray-200 transition-colors" title="Paragraph">
                        <span className="text-sm text-gray-700">P</span>
                      </button>
                      <button type="button" className="rounded p-1.5 hover:bg-gray-200 transition-colors" title="Script">
                        <span className="text-sm text-gray-700">ℬ</span>
                      </button>
                      <button type="button" className="rounded p-1.5 hover:bg-gray-200 transition-colors" title="Heading">
                        <span className="text-sm text-gray-700">H</span>
                      </button>
                      <button type="button" className="rounded p-1.5 hover:bg-gray-200 transition-colors" title="Italic">
                        <span className="text-sm italic text-gray-700">I</span>
                      </button>
                    </div>
                    {/* Text Area */}
                    <textarea
                      value={soal}
                      onChange={(e) => setSoal(e.target.value)}
                      rows={6}
                      className="w-full bg-white px-4 py-3 font-inter text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none resize-none"
                      placeholder="Seorang siswa melakukan percobaan hukum Newton dengan cara menarik sebuah troli bermassa 4 kg menggunakan dinamometer di atas bidang datar licin."
                      required
                    />
                  </div>
                </div>

                {/* Soal Gambar (Optional) - URL Input */}
                <div>
                  <label className="mb-3 block font-inter text-base font-semibold text-gray-900">
                    URL Gambar Soal (Opsional)
                  </label>
                  <input
                    type="url"
                    value={soalGambar || ''}
                    onChange={(e) => setSoalGambar(e.target.value)}
                    className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 font-inter text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:border-[#41366E] focus:outline-none focus:ring-2 focus:ring-[#41366E]/20"
                    placeholder="https://example.com/image.png"
                  />
                  <p className="mt-2 font-inter text-xs text-gray-500">
                    💡 Masukkan URL gambar dari internet atau upload ke hosting terlebih dahulu
                  </p>
                </div>

                {/* Answer Options A-E */}
                <div className="space-y-8">
                  {[
                    { label: 'A', value: jawabanA, setValue: setJawabanA, gambar: gambarA, setGambar: setGambarA },
                    { label: 'B', value: jawabanB, setValue: setJawabanB, gambar: gambarB, setGambar: setGambarB },
                    { label: 'C', value: jawabanC, setValue: setJawabanC, gambar: gambarC, setGambar: setGambarC },
                    { label: 'D', value: jawabanD, setValue: setJawabanD, gambar: gambarD, setGambar: setGambarD },
                    { label: 'E', value: jawabanE, setValue: setJawabanE, gambar: gambarE, setGambar: setGambarE },
                  ].map((option) => (
                    <div key={option.label} className="rounded-xl border-2 border-gray-200 bg-gray-50 p-6">
                      {/* Jawaban Text */}
                      <div className="mb-4">
                        <label className="mb-3 block font-inter text-base font-semibold text-gray-900">
                          Jawaban {option.label}
                        </label>
                        <div className="rounded-lg border-2 border-gray-300 overflow-hidden focus-within:border-[#41366E] focus-within:ring-2 focus-within:ring-[#41366E]/20 transition-all bg-white">
                          {/* Toolbar */}
                          <div className="flex items-center gap-1 border-b border-gray-200 bg-gray-50 px-3 py-2">
                            <button type="button" className="rounded p-1.5 hover:bg-gray-200 transition-colors">
                              <span className="text-sm font-semibold text-gray-700">≡</span>
                            </button>
                            <button type="button" className="rounded p-1.5 hover:bg-gray-200 transition-colors">
                              <span className="text-sm font-semibold text-gray-700">≣</span>
                            </button>
                            <button type="button" className="rounded p-1.5 hover:bg-gray-200 transition-colors">
                              <span className="text-sm font-semibold text-gray-700">☰</span>
                            </button>
                            <div className="mx-1 h-6 w-px bg-gray-300"></div>
                            <button type="button" className="rounded p-1.5 hover:bg-gray-200 transition-colors">
                              <span className="text-sm font-semibold text-gray-700">⚏</span>
                            </button>
                            <button type="button" className="rounded p-1.5 hover:bg-gray-200 transition-colors">
                              <span className="text-sm font-bold text-gray-700">B</span>
                            </button>
                            <button type="button" className="rounded p-1.5 hover:bg-gray-200 transition-colors">
                              <span className="text-sm font-semibold text-gray-700">U</span>
                            </button>
                            <button type="button" className="rounded p-1.5 hover:bg-gray-200 transition-colors">
                              <span className="text-sm text-gray-700">A</span>
                            </button>
                            <button type="button" className="rounded p-1.5 hover:bg-gray-200 transition-colors">
                              <span className="text-sm text-gray-700">P</span>
                            </button>
                            <button type="button" className="rounded p-1.5 hover:bg-gray-200 transition-colors">
                              <span className="text-sm text-gray-700">ℬ</span>
                            </button>
                            <button type="button" className="rounded p-1.5 hover:bg-gray-200 transition-colors">
                              <span className="text-sm text-gray-700">H</span>
                            </button>
                            <button type="button" className="rounded p-1.5 hover:bg-gray-200 transition-colors">
                              <span className="text-sm italic text-gray-700">I</span>
                            </button>
                          </div>
                          {/* Input */}
                          <input
                            type="text"
                            value={option.value}
                            onChange={(e) => option.setValue(e.target.value)}
                            className="w-full bg-white px-4 py-3 font-inter text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                            placeholder="#1231"
                            required
                          />
                        </div>
                      </div>

                      {/* Gambar (Optional) - URL Input */}
                      <div>
                        <label className="mb-3 block font-inter text-base font-semibold text-gray-900">
                          URL Gambar {option.label} (Opsional)
                        </label>
                        <input
                          type="url"
                          value={option.gambar}
                          onChange={(e) => option.setGambar(e.target.value)}
                          className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 font-inter text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:border-[#41366E] focus:outline-none focus:ring-2 focus:ring-[#41366E]/20"
                          placeholder="https://example.com/image.png"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Jawaban Benar Dropdown */}
                <div>
                  <label className="mb-3 block font-inter text-base font-semibold text-gray-900">
                    Jawaban Benar
                  </label>
                  <div className="relative">
                    <select
                      value={jawabanBenar}
                      onChange={(e) => setJawabanBenar(e.target.value)}
                      className="w-full appearance-none rounded-lg border-2 border-gray-300 bg-white px-4 py-3 pr-10 font-inter text-sm text-gray-900 transition-all focus:border-[#41366E] focus:outline-none focus:ring-2 focus:ring-[#41366E]/20"
                      required
                    >
                      <option value="D">D</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="E">E</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="mt-8 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => router.push(`/manajemen-soal/edit/${examId}?tab=soal`)}
                className="rounded-lg bg-gray-600 px-8 py-3 font-heading text-base font-semibold text-white shadow-md transition-all hover:bg-gray-700 active:scale-95"
              >
                Kembali
              </button>
              <button
                type="submit"
                className="rounded-lg bg-[#41366E] px-8 py-3 font-heading text-base font-semibold text-white shadow-md transition-all hover:bg-[#2f2752] hover:shadow-lg active:scale-95"
              >
                Tambah
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
