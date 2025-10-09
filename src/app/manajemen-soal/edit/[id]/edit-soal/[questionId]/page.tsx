// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, ChevronDown, Image as ImageIcon, X } from 'lucide-react';
import Sidebar from '@/components/dashboard-admin/Sidebar';
import RichTextInput from '@/components/RichTextInput';
import AlertModal, { AlertType } from '@/components/ui/alert-modal';
import { adminService, type Soal } from '@/services/admin.service';
import { useAdminGuard } from '@/hooks/useAuthGuard';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function EditSoalPage() {
  // Auth guard - redirect if not admin
  const { isLoading: authLoading, isAuthenticated } = useAdminGuard();
  
  const router = useRouter();
  const params = useParams();
  const examId = params.id as string;
  const questionId = params.questionId as string;
  const [examName, setExamName] = useState('');
  
  // Form States
  const [tipeSoal, setTipeSoal] = useState('Gambar');
  const [soal, setSoal] = useState('');
  const [soalGambar, setSoalGambar] = useState<File | null>(null);
  const [soalGambarPreview, setSoalGambarPreview] = useState<string | null>(null);
  const [jawabanA, setJawabanA] = useState('');
  const [gambarA, setGambarA] = useState<File | null>(null);
  const [gambarAPreview, setGambarAPreview] = useState<string | null>(null);
  const [jawabanB, setJawabanB] = useState('');
  const [gambarB, setGambarB] = useState<File | null>(null);
  const [gambarBPreview, setGambarBPreview] = useState<string | null>(null);
  const [jawabanC, setJawabanC] = useState('');
  const [gambarC, setGambarC] = useState<File | null>(null);
  const [gambarCPreview, setGambarCPreview] = useState<string | null>(null);
  const [jawabanD, setJawabanD] = useState('');
  const [gambarD, setGambarD] = useState<File | null>(null);
  const [gambarDPreview, setGambarDPreview] = useState<string | null>(null);
  const [jawabanE, setJawabanE] = useState('');
  const [gambarE, setGambarE] = useState<File | null>(null);
  const [gambarEPreview, setGambarEPreview] = useState<string | null>(null);
  const [jawabanBenar, setJawabanBenar] = useState('A');
  const [isLoading, setIsLoading] = useState(true);
  
  // Alert modal states
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    type: 'info' as AlertType,
    title: '',
    message: '',
  });

  // Helper function to insert formatting tags into textarea
  const insertFormatting = (currentValue: string, setValue: (val: string) => void, before: string, after: string) => {
    const textarea = document.getElementById('soal-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = currentValue.substring(start, end);
    
    // If text is selected, wrap it with formatting tags
    if (selectedText) {
      const newValue = currentValue.substring(0, start) + before + selectedText + after + currentValue.substring(end);
      setValue(newValue);
      
      // Set cursor position after the formatted text
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + before.length, end + before.length);
      }, 0);
    } else {
      // If no selection, insert formatting tags at cursor position
      const newValue = currentValue.substring(0, start) + before + after + currentValue.substring(end);
      setValue(newValue);
      
      // Set cursor between the tags
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + before.length, start + before.length);
      }, 0);
    }
  };

  // Helper function for contentEditable divs with real-time formatting
  const applyFormatting = (command: string) => {
    document.execCommand(command, false);
  };

  // Helper function for custom formatting (alignment, indent, etc)
  const applyCustomFormatting = (elementId: string, htmlTag: string, style?: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    element.focus();
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();

    if (selectedText) {
      const wrapper = document.createElement(htmlTag);
      if (style) wrapper.setAttribute('style', style);
      
      try {
        range.surroundContents(wrapper);
      } catch (e) {
        // Fallback if surroundContents fails
        const span = document.createElement(htmlTag);
        if (style) span.setAttribute('style', style);
        span.textContent = selectedText;
        range.deleteContents();
        range.insertNode(span);
      }

      // Trigger input event to update state
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }
  };

  // Helper function for input fields (not textarea) - LEGACY
  const insertFormattingForInput = (inputId: string, currentValue: string, setValue: (val: string) => void, before: string, after: string) => {
    const input = document.getElementById(inputId) as HTMLInputElement;
    if (!input) return;

    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    const selectedText = currentValue.substring(start, end);
    
    // If text is selected, wrap it with formatting tags
    if (selectedText) {
      const newValue = currentValue.substring(0, start) + before + selectedText + after + currentValue.substring(end);
      setValue(newValue);
      
      // Set cursor position after the formatted text
      setTimeout(() => {
        input.focus();
        input.setSelectionRange(start + before.length, end + before.length);
      }, 0);
    } else {
      // If no selection, insert formatting tags at cursor position
      const newValue = currentValue.substring(0, start) + before + after + currentValue.substring(end);
      setValue(newValue);
      
      // Set cursor between the tags
      setTimeout(() => {
        input.focus();
        input.setSelectionRange(start + before.length, start + before.length);
      }, 0);
    }
  };

  // Load existing question data from backend
  useEffect(() => {
    const loadQuestionData = async () => {
      try {
        // Load ujian data
        const ujianList = await adminService.getUjian();
        const ujian = ujianList.find(u => u.id === parseInt(examId));
        
        if (ujian) {
          setExamName(ujian.nama_ujian);
          
          // Load all soal for this ujian
          const soalList = await adminService.getSoalByUjian(parseInt(examId));
          const soal = soalList.find(s => s.id === parseInt(questionId));
          
          if (soal) {
            // Populate form with existing data from backend
            const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
            
            setTipeSoal(soal.tipe_soal === 'gambar' ? 'Gambar' : 'Teks');
            setSoal(soal.pertanyaan);
            
            // Load existing images as previews
            if (soal.media_soal) {
              setSoalGambarPreview(`${API_BASE_URL}/${soal.media_soal}`);
            }
            
            setJawabanA(soal.opsi_a);
            if (soal.opsi_a_media) {
              setGambarAPreview(`${API_BASE_URL}/${soal.opsi_a_media}`);
            }
            
            setJawabanB(soal.opsi_b);
            if (soal.opsi_b_media) {
              setGambarBPreview(`${API_BASE_URL}/${soal.opsi_b_media}`);
            }
            
            setJawabanC(soal.opsi_c);
            if (soal.opsi_c_media) {
              setGambarCPreview(`${API_BASE_URL}/${soal.opsi_c_media}`);
            }
            
            setJawabanD(soal.opsi_d);
            if (soal.opsi_d_media) {
              setGambarDPreview(`${API_BASE_URL}/${soal.opsi_d_media}`);
            }
            
            setJawabanE(soal.opsi_e);
            if (soal.opsi_e_media) {
              setGambarEPreview(`${API_BASE_URL}/${soal.opsi_e_media}`);
            }
            
            setJawabanBenar(soal.jawaban_benar.toUpperCase());
          } else {
            alert('Soal tidak ditemukan');
            router.push(`/manajemen-soal/edit/${examId}?tab=soal`);
          }
        } else {
          alert('Ujian tidak ditemukan');
          router.push('/manajemen-soal');
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error loading question data:', error);
        setIsLoading(false);
      }
    };

    loadQuestionData();
  }, [questionId, examId, router]);

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
      // Get existing soal data to preserve nomor_soal
      const soalList = await adminService.getSoalByUjian(parseInt(examId));
      const existingSoal = soalList.find(s => s.id === parseInt(questionId));
      
      if (!existingSoal) {
        alert('Soal tidak ditemukan');
        return;
      }

      // Update soal via backend API with file upload support
      await adminService.updateSoal(parseInt(questionId), {
        ujian_id: parseInt(examId),
        nomor_soal: existingSoal.nomor_soal,
        tipe_soal: tipeSoal === 'Gambar' ? 'gambar' : 'text',
        pertanyaan: soal,
        media_soal: soalGambar || existingSoal.media_soal || undefined,  // Keep existing if no new upload
        opsi_a: jawabanA,
        opsi_a_media: gambarA || existingSoal.opsi_a_media || undefined,
        opsi_b: jawabanB,
        opsi_b_media: gambarB || existingSoal.opsi_b_media || undefined,
        opsi_c: jawabanC,
        opsi_c_media: gambarC || existingSoal.opsi_c_media || undefined,
        opsi_d: jawabanD,
        opsi_d_media: gambarD || existingSoal.opsi_d_media || undefined,
        opsi_e: jawabanE,
        opsi_e_media: gambarE || existingSoal.opsi_e_media || undefined,
        jawaban_benar: jawabanBenar.toUpperCase(), // Backend expects uppercase
      });

      setAlertConfig({
        type: 'success',
        title: 'Berhasil!',
        message: 'Soal berhasil diupdate!'
      });
      setShowAlert(true);
    } catch (error) {
      console.error('Error updating soal:', error);
      setAlertConfig({
        type: 'error',
        title: 'Error!',
        message: 'Gagal mengupdate soal. Silakan coba lagi.'
      });
      setShowAlert(true);
    }
  };

  const handleBack = () => {
    router.push(`/manajemen-soal/edit/${examId}?tab=soal`);
  };

  const closeAlert = () => {
    setShowAlert(false);
    // If it's a success alert, navigate back
    if (alertConfig.type === 'success') {
      router.push(`/manajemen-soal/edit/${examId}?tab=soal`);
    }
  };

  const handleFileChange = (
    file: File | null,
    setFile: (file: File | null) => void,
    setPreview: (preview: string | null) => void
  ) => {
    setFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="flex h-screen items-center justify-center">
            <div className="text-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-[#41366E] mx-auto mb-4"></div>
              <p className="font-inter text-gray-600">Memuat data soal...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-6 py-8">
          {/* Header */}
          <div className="mb-8 flex items-center gap-4">
            <button
              onClick={handleBack}
              className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-[#41366E] bg-white text-[#41366E] transition-all hover:bg-[#41366E] hover:text-white shadow-sm"
              aria-label="Kembali"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="font-heading text-3xl font-bold text-[#41366E]">
                Edit Soal {examName}
              </h1>
              <p className="mt-1 font-inter text-sm text-gray-600">
                Edit soal yang sudah ada dengan mengubah form di bawah
              </p>
            </div>
          </div>

          {/* Form Card */}
          <form onSubmit={handleSubmit} className="rounded-xl bg-white p-8 shadow-md border border-gray-200">
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
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Soal - Rich Text Editor with Formatting */}
              <div>
                <label className="mb-3 block font-inter text-base font-semibold text-gray-900">
                  Soal
                </label>
                <div className="rounded-lg border-2 border-gray-300 overflow-hidden focus-within:border-[#41366E] focus-within:ring-2 focus-within:ring-[#41366E]/20 transition-all bg-white">
                  {/* Toolbar at Top - Small Height */}
                  <div className="flex items-center justify-center gap-0.5 border-b border-gray-200 bg-gray-50 px-2 py-1">
                    <button type="button" onClick={() => { document.getElementById('soal-input-edit')?.focus(); document.execCommand('insertUnorderedList'); }} className="rounded p-1 hover:bg-gray-200 transition-colors" title="Bullet List">
                      <span className="text-xs text-gray-700">⚏</span>
                    </button>
                    <button type="button" onClick={() => { document.getElementById('soal-input-edit')?.focus(); document.execCommand('justifyLeft'); }} className="rounded p-1 hover:bg-gray-200 transition-colors" title="Align Left">
                      <span className="text-xs text-gray-700">≡</span>
                    </button>
                    <button type="button" onClick={() => { document.getElementById('soal-input-edit')?.focus(); document.execCommand('justifyCenter'); }} className="rounded p-1 hover:bg-gray-200 transition-colors" title="Align Center">
                      <span className="text-xs text-gray-700">≣</span>
                    </button>
                    <button type="button" onClick={() => { document.getElementById('soal-input-edit')?.focus(); document.execCommand('justifyRight'); }} className="rounded p-1 hover:bg-gray-200 transition-colors" title="Align Right">
                      <span className="text-xs text-gray-700">☰</span>
                    </button>
                    <button type="button" onClick={() => { document.getElementById('soal-input-edit')?.focus(); document.execCommand('justifyFull'); }} className="rounded p-1 hover:bg-gray-200 transition-colors" title="Justify">
                      <span className="text-xs text-gray-700">⊞</span>
                    </button>
                    <button type="button" onClick={() => { document.getElementById('soal-input-edit')?.focus(); document.execCommand('indent'); }} className="rounded p-1 hover:bg-gray-200 transition-colors" title="Indent">
                      <span className="text-xs text-gray-700">→</span>
                    </button>
                    <button type="button" onClick={() => { document.getElementById('soal-input-edit')?.focus(); document.execCommand('outdent'); }} className="rounded p-1 hover:bg-gray-200 transition-colors" title="Outdent">
                      <span className="text-xs text-gray-700">←</span>
                    </button>
                    <div className="mx-0.5 h-4 w-px bg-gray-300"></div>
                    <button type="button" onClick={() => { document.getElementById('soal-input-edit')?.focus(); document.execCommand('insertParagraph'); }} className="rounded p-1 hover:bg-gray-200 transition-colors" title="Paragraph">
                      <span className="text-xs text-gray-700">P</span>
                    </button>
                    <button type="button" onClick={() => { document.getElementById('soal-input-edit')?.focus(); document.execCommand('bold'); }} className="rounded p-1 hover:bg-gray-200 transition-colors" title="Bold">
                      <span className="text-xs font-bold text-gray-700">B</span>
                    </button>
                    <button type="button" onClick={() => applyCustomFormatting('soal-input-edit', 'h3', 'font-size: 1.125rem; font-weight: 600;')} className="rounded p-1 hover:bg-gray-200 transition-colors" title="Heading">
                      <span className="text-xs text-gray-700">H</span>
                    </button>
                    <button type="button" onClick={() => { document.getElementById('soal-input-edit')?.focus(); document.execCommand('italic'); }} className="rounded p-1 hover:bg-gray-200 transition-colors" title="Italic">
                      <span className="text-xs italic text-gray-700">I</span>
                    </button>
                  </div>
                  {/* Rich Text Input - Larger */}
                  <RichTextInput
                    id="soal-input-edit"
                    value={soal}
                    onChange={setSoal}
                    placeholder="Seorang siswa melakukan percobaan hukum Newton dengan cara menarik sebuah troli bermassa 4 kg menggunakan dinamometer di atas bidang datar licin."
                    className="min-h-[150px]"
                  />
                </div>
              </div>

              {/* Soal Gambar (Optional) - Hide when Teks */}
              <div style={{ display: tipeSoal === 'Teks' ? 'none' : 'block' }}>
                <label className="mb-3 block font-inter text-base font-semibold text-gray-900">
                  Soal Gambar (Opsional)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(
                      e.target.files?.[0] || null,
                      setSoalGambar,
                      setSoalGambarPreview
                    )}
                    className="hidden"
                    id="soal-gambar"
                  />
                  <label
                    htmlFor="soal-gambar"
                    className="flex w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-10 transition-all hover:border-[#41366E] hover:bg-purple-50"
                  >
                    <div className="text-center">
                      {soalGambarPreview ? (
                        <div className="relative">
                          <img 
                            src={soalGambarPreview} 
                            alt="Preview" 
                            className="mx-auto max-h-48 rounded-lg object-contain"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setSoalGambar(null);
                              setSoalGambarPreview('');
                            }}
                            className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 shadow-lg"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          <div className="mt-2 space-y-1">
                            <p className="font-inter text-sm font-medium text-gray-700">
                              {soalGambar ? soalGambar.name : 'Gambar saat ini'}
                            </p>
                            <p className="font-inter text-xs text-gray-500">
                              Klik untuk mengganti gambar
                            </p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-200">
                            <ImageIcon className="h-7 w-7 text-gray-500" />
                          </div>
                          <p className="font-inter text-sm font-medium text-gray-700 mb-1">
                            {soalGambar ? soalGambar.name : 'Klik untuk upload gambar'}
                          </p>
                          <p className="font-inter text-xs text-gray-500">
                            PNG, JPG hingga 5MB
                          </p>
                        </>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {/* Answer Options A-E */}
              <div className="space-y-8">
                {[
                  { label: 'A', value: jawabanA, setValue: setJawabanA, gambar: gambarA, setGambar: setGambarA, preview: gambarAPreview, setPreview: setGambarAPreview },
                  { label: 'B', value: jawabanB, setValue: setJawabanB, gambar: gambarB, setGambar: setGambarB, preview: gambarBPreview, setPreview: setGambarBPreview },
                  { label: 'C', value: jawabanC, setValue: setJawabanC, gambar: gambarC, setGambar: setGambarC, preview: gambarCPreview, setPreview: setGambarCPreview },
                  { label: 'D', value: jawabanD, setValue: setJawabanD, gambar: gambarD, setGambar: setGambarD, preview: gambarDPreview, setPreview: setGambarDPreview },
                  { label: 'E', value: jawabanE, setValue: setJawabanE, gambar: gambarE, setGambar: setGambarE, preview: gambarEPreview, setPreview: setGambarEPreview },
                ].map((option) => (
                  <div key={option.label} className="rounded-xl border-2 border-gray-200 bg-gray-50 p-6">
                    {/* Jawaban Text */}
                    <div className="mb-4">
                      <label className="mb-3 block font-inter text-base font-semibold text-gray-900">
                        Jawaban {option.label}
                      </label>
                      <div className="rounded-lg border-2 border-gray-300 overflow-hidden focus-within:border-[#41366E] focus-within:ring-2 focus-within:ring-[#41366E]/20 transition-all bg-white">
                        {/* Toolbar at Top - Small Height */}
                        <div className="flex items-center justify-center gap-0.5 border-b border-gray-200 bg-gray-50 px-2 py-1">
                          <button type="button" onClick={() => { document.getElementById(`jawaban-${option.label}`)?.focus(); document.execCommand('insertUnorderedList'); }} className="rounded p-1 hover:bg-gray-200 transition-colors" title="Bullet List">
                            <span className="text-xs text-gray-700">⚏</span>
                          </button>
                          <button type="button" onClick={() => { document.getElementById(`jawaban-${option.label}`)?.focus(); document.execCommand('justifyLeft'); }} className="rounded p-1 hover:bg-gray-200 transition-colors" title="Align Left">
                            <span className="text-xs text-gray-700">≡</span>
                          </button>
                          <button type="button" onClick={() => { document.getElementById(`jawaban-${option.label}`)?.focus(); document.execCommand('justifyCenter'); }} className="rounded p-1 hover:bg-gray-200 transition-colors" title="Align Center">
                            <span className="text-xs text-gray-700">≣</span>
                          </button>
                          <button type="button" onClick={() => { document.getElementById(`jawaban-${option.label}`)?.focus(); document.execCommand('justifyRight'); }} className="rounded p-1 hover:bg-gray-200 transition-colors" title="Align Right">
                            <span className="text-xs text-gray-700">☰</span>
                          </button>
                          <button type="button" onClick={() => { document.getElementById(`jawaban-${option.label}`)?.focus(); document.execCommand('justifyFull'); }} className="rounded p-1 hover:bg-gray-200 transition-colors" title="Justify">
                            <span className="text-xs text-gray-700">⊞</span>
                          </button>
                          <button type="button" onClick={() => { document.getElementById(`jawaban-${option.label}`)?.focus(); document.execCommand('indent'); }} className="rounded p-1 hover:bg-gray-200 transition-colors" title="Indent">
                            <span className="text-xs text-gray-700">→</span>
                          </button>
                          <button type="button" onClick={() => { document.getElementById(`jawaban-${option.label}`)?.focus(); document.execCommand('outdent'); }} className="rounded p-1 hover:bg-gray-200 transition-colors" title="Outdent">
                            <span className="text-xs text-gray-700">←</span>
                          </button>
                          <div className="mx-0.5 h-4 w-px bg-gray-300"></div>
                          <button type="button" onClick={() => { document.getElementById(`jawaban-${option.label}`)?.focus(); document.execCommand('insertParagraph'); }} className="rounded p-1 hover:bg-gray-200 transition-colors" title="Paragraph">
                            <span className="text-xs text-gray-700">P</span>
                          </button>
                          <button type="button" onClick={() => { document.getElementById(`jawaban-${option.label}`)?.focus(); document.execCommand('bold'); }} className="rounded p-1 hover:bg-gray-200 transition-colors" title="Bold">
                            <span className="text-xs font-bold text-gray-700">B</span>
                          </button>
                          <button type="button" onClick={() => applyCustomFormatting(`jawaban-${option.label}`, 'h3', 'font-size: 1.125rem; font-weight: 600;')} className="rounded p-1 hover:bg-gray-200 transition-colors" title="Heading">
                            <span className="text-xs text-gray-700">H</span>
                          </button>
                          <button type="button" onClick={() => { document.getElementById(`jawaban-${option.label}`)?.focus(); document.execCommand('italic'); }} className="rounded p-1 hover:bg-gray-200 transition-colors" title="Italic">
                            <span className="text-xs italic text-gray-700">I</span>
                          </button>
                        </div>
                        {/* Rich Text Input - Larger */}
                        <RichTextInput
                          id={`jawaban-${option.label}`}
                          value={option.value}
                          onChange={option.setValue}
                          placeholder="Masukkan jawaban..."
                        />
                      </div>
                    </div>

                    {/* Gambar (Optional) - Hide when Teks */}
                    <div style={{ display: tipeSoal === 'Teks' ? 'none' : 'block' }}>
                      <label className="mb-3 block font-inter text-base font-semibold text-gray-900">
                        Gambar {option.label} (Opsional)
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(
                            e.target.files?.[0] || null,
                            option.setGambar,
                            option.setPreview
                          )}
                          className="hidden"
                          id={`gambar-${option.label}`}
                        />
                        <label
                          htmlFor={`gambar-${option.label}`}
                          className="flex w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white px-4 py-8 transition-all hover:border-[#41366E] hover:bg-purple-50"
                        >
                          <div className="text-center">
                            {option.preview ? (
                              <div className="relative">
                                <img 
                                  src={option.preview} 
                                  alt={`Preview ${option.label}`} 
                                  className="mx-auto max-h-32 rounded-lg object-contain"
                                />
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    option.setGambar(null);
                                    option.setPreview('');
                                  }}
                                  className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 shadow-lg"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                                <div className="mt-2 space-y-1">
                                  <p className="font-inter text-sm font-medium text-gray-700">
                                    {option.gambar ? option.gambar.name : 'Gambar saat ini'}
                                  </p>
                                  <p className="font-inter text-xs text-gray-500">
                                    Klik untuk mengganti
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                                  <ImageIcon className="h-5 w-5 text-gray-500" />
                                </div>
                                <p className="font-inter text-sm font-medium text-gray-700">
                                  {option.gambar ? option.gambar.name : 'No file chosen'}
                                </p>
                              </>
                            )}
                          </div>
                        </label>
                      </div>
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
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="mt-8 flex justify-end gap-4 border-t border-gray-200 pt-6">
              <button
                type="button"
                onClick={handleBack}
                className="rounded-lg bg-gray-600 px-8 py-3 font-heading text-base font-semibold text-white shadow-md transition-all hover:bg-gray-700 active:scale-95"
              >
                Kembali
              </button>
              <button
                type="submit"
                className="rounded-lg bg-[#41366E] px-8 py-3 font-heading text-base font-semibold text-white shadow-md transition-all hover:bg-[#2f2752] hover:shadow-lg active:scale-95"
              >
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Alert Modal */}
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
