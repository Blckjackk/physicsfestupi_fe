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
import RichTextInput from '@/components/RichTextInput';
import { adminService } from '@/services/admin.service';
import { ArrowLeft, ChevronDown, Image as ImageIcon, X } from 'lucide-react';
import { useAdminGuard } from '@/hooks/useAuthGuard';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import AlertModal, { AlertType } from '@/components/ui/alert-modal';

export default function TambahSoalPage() {
  // SEMUA HOOKS HARUS DI ATAS DULU - TIDAK BOLEH ADA CONDITIONAL RETURN SEBELUMNYA
  const router = useRouter();
  const params = useParams();
  const examId = params.id;

  // Load exam name from backend
  const [examName, setExamName] = useState('');
  const [nextNomorSoal, setNextNomorSoal] = useState(1);
  
  // Form state - Support File upload
  const [tipeSoal, setTipeSoal] = useState('Gambar');
  const [soal, setSoal] = useState('');
  const [soalGambar, setSoalGambar] = useState<File | null>(null);
  const [soalGambarPreview, setSoalGambarPreview] = useState<string>('');
  const [jawabanA, setJawabanA] = useState('');
  const [gambarA, setGambarA] = useState<File | null>(null);
  const [gambarAPreview, setGambarAPreview] = useState<string>('');
  const [jawabanB, setJawabanB] = useState('');
  const [gambarB, setGambarB] = useState<File | null>(null);
  const [gambarBPreview, setGambarBPreview] = useState<string>('');
  const [jawabanC, setJawabanC] = useState('');
  const [gambarC, setGambarC] = useState<File | null>(null);
  const [gambarCPreview, setGambarCPreview] = useState<string>('');
  const [jawabanD, setJawabanD] = useState('');
  const [gambarD, setGambarD] = useState<File | null>(null);
  const [gambarDPreview, setGambarDPreview] = useState<string>('');
  const [jawabanE, setJawabanE] = useState('');
  const [gambarE, setGambarE] = useState<File | null>(null);
  const [gambarEPreview, setGambarEPreview] = useState<string>('');
  const [jawabanBenar, setJawabanBenar] = useState('D');

  // Formatting states for toggle buttons
  const [activeFormats, setActiveFormats] = useState<{[key: string]: boolean}>({});

  // Alert modal state
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    type: 'info' as AlertType,
    title: '',
    message: '',
    confirmAction: null as (() => void) | null,
  });

  // Auth guard - redirect if not admin (SETELAH SEMUA STATE HOOKS)
  const { isLoading: authLoading, isAuthenticated } = useAdminGuard();
  
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
      // Failed to load exam data
    }
  };

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

  // Helper function for standard formatting with toggle state
  const applyStandardFormatting = (elementId: string, formatType: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    // Focus element first to ensure it's active
    element.focus();
    
    const key = `${elementId}-${formatType}`;
    
    // Apply formatting directly - execCommand works on current selection
    document.execCommand(formatType, false, undefined);
    
    // Toggle active state
    setActiveFormats(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    
    // Trigger input event to sync state with RichTextInput
    element.dispatchEvent(new Event('input', { bubbles: true }));
  };

  // Helper function for physics formatting with persistent toggle state
  const applyPhysicsFormatting = (elementId: string, formatType: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    element.focus();
    
    const key = `${elementId}-${formatType}`;
    const isCurrentlyActive = activeFormats[key];
    
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    
    // For superscript/subscript - check if we're inside one and handle toggle off
    if (formatType === 'superscript' || formatType === 'subscript') {
      let node = range.startContainer.parentElement;
      let formattedNode = null;
      
      // Find the SUP/SUB parent
      while (node && node !== element) {
        if ((formatType === 'superscript' && node.tagName === 'SUP') ||
            (formatType === 'subscript' && node.tagName === 'SUB')) {
          formattedNode = node;
          break;
        }
        node = node.parentElement;
      }
      
      if (formattedNode && isCurrentlyActive) {
        // We're toggling OFF - insert zero-width space after the formatted node to break out
        const zeroWidthSpace = document.createTextNode('\u200B');
        formattedNode.parentNode?.insertBefore(zeroWidthSpace, formattedNode.nextSibling);
        
        // Move cursor to after the zero-width space
        const newRange = document.createRange();
        newRange.setStartAfter(zeroWidthSpace);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
        
        // Toggle off the button
        setActiveFormats(prev => ({ ...prev, [key]: false }));
        element.dispatchEvent(new Event('input', { bubbles: true }));
        return;
      }
    }
    
    // For vector - similar handling
    if (formatType === 'vector') {
      let node = range.startContainer.parentElement;
      let vectorNode = null;
      
      // Find the overline span parent
      while (node && node !== element) {
        if (node.tagName === 'SPAN' && node.style.textDecoration === 'overline') {
          vectorNode = node;
          break;
        }
        node = node.parentElement;
      }
      
      if (vectorNode && isCurrentlyActive) {
        // We're toggling OFF - insert zero-width space after the vector node
        const zeroWidthSpace = document.createTextNode('\u200B');
        vectorNode.parentNode?.insertBefore(zeroWidthSpace, vectorNode.nextSibling);
        
        // Move cursor to after the zero-width space
        const newRange = document.createRange();
        newRange.setStartAfter(zeroWidthSpace);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
        
        // Toggle off the button
        setActiveFormats(prev => ({ ...prev, [key]: false }));
        element.dispatchEvent(new Event('input', { bubbles: true }));
        return;
      }
    }
    
    // Update persistent toggle state
    setActiveFormats(prev => ({
      ...prev,
      [key]: !isCurrentlyActive,
      // Turn off conflicting formats
      ...(formatType === 'superscript' && { [`${elementId}-subscript`]: false }),
      ...(formatType === 'subscript' && { [`${elementId}-superscript`]: false })
    }));
    
    switch (formatType) {
      case 'superscript':
        // Use native browser superscript command for immediate rendering
        document.execCommand('superscript', false);
        break;
      case 'subscript':
        // Use native browser subscript command for immediate rendering
        document.execCommand('subscript', false); 
        break;
      case 'vector':
        // Insert vector with data attribute for reliable CSS targeting
        const vectorHTML = '<span class="physics-vector" style="text-decoration: overline; display: inline-block;">v</span>&nbsp;';
        document.execCommand('insertHTML', false, vectorHTML);
        
        // Move cursor after the vector
        setTimeout(() => {
          const sel = window.getSelection();
          if (sel && sel.rangeCount > 0) {
            const range = sel.getRangeAt(0);
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
          }
        }, 0);
        break;
      case 'fraction':
        // Insert inline fraction - keep contenteditable for child spans
        const fractionHTML = `<span class="physics-fraction" style="display: inline-flex; flex-direction: column; vertical-align: middle; font-size: 0.85em; line-height: 1.2; margin: 0 3px; text-align: center;"><span contenteditable="true" style="border-bottom: 1px solid currentColor; padding: 2px 4px; text-align: center; display: block;">a</span><span contenteditable="true" style="padding: 2px 4px; text-align: center; display: block;">b</span></span>\u200B\u200B`;
        document.execCommand('insertHTML', false, fractionHTML);
        
        // Move cursor after the zero-width spaces
        setTimeout(() => {
          const sel = window.getSelection();
          if (sel && sel.rangeCount > 0) {
            const range = sel.getRangeAt(0);
            // Collapse to end of current range (should be after zero-width spaces)
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
          }
          element.dispatchEvent(new Event('input', { bubbles: true }));
        }, 10);
        break;
      default:
        return;
    }

    // Trigger input event to update state
    element.dispatchEvent(new Event('input', { bubbles: true }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!soal.trim()) {
      setAlertConfig({
        type: 'warning',
        title: 'Peringatan',
        message: 'Soal harus diisi',
        confirmAction: null,
      });
      setShowAlert(true);
      return;
    }

    if (!jawabanA || !jawabanB || !jawabanC || !jawabanD || !jawabanE) {
      setAlertConfig({
        type: 'warning',
        title: 'Peringatan',
        message: 'Semua jawaban (A-E) harus diisi',
        confirmAction: null,
      });
      setShowAlert(true);
      return;
    }

    try {
      // Validate files before submission

      // Create new soal via backend API with file upload support
      const result = await adminService.createSoal({
        ujian_id: parseInt(examId as string),
        nomor_soal: nextNomorSoal,
        tipe_soal: tipeSoal === 'Gambar' ? 'gambar' : 'text',
        pertanyaan: soal,
        media_soal: soalGambar || undefined,  // Send File object
        opsi_a: jawabanA,
        opsi_a_media: gambarA || undefined,   // Send File object
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

      // Soal created successfully
      
      // Show success alert
      setAlertConfig({
        type: 'success',
        title: 'Berhasil',
        message: 'Soal berhasil ditambahkan',
        confirmAction: () => {
          router.push(`/manajemen-soal/edit/${examId}?tab=soal`);
        },
      });
      setShowAlert(true);
    } catch (error) {
      // Error adding soal
      console.error('Error creating soal:', error);
      
      // Show error alert with detailed message
      let errorMessage = 'Gagal menambahkan soal';
      if (error?.response?.data?.message) {
        errorMessage += ': ' + error.response.data.message;
      } else if (error?.message) {
        errorMessage += ': ' + error.message;
      }
      
      setAlertConfig({
        type: 'error',
        title: 'Gagal',
        message: errorMessage,
        confirmAction: null,
      });
      setShowAlert(true);
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
                    <button type="button" onClick={() => { document.getElementById('soal-input')?.focus(); document.execCommand('insertUnorderedList'); }} className="rounded p-1 hover:bg-gray-200 transition-colors" title="Bullet List">
                      <span className="text-xs text-gray-700">⚏</span>
                    </button>
                    <button type="button" onClick={() => { document.getElementById('soal-input')?.focus(); document.execCommand('justifyLeft'); }} className="rounded p-1 hover:bg-gray-200 transition-colors" title="Align Left">
                      <span className="text-xs text-gray-700">≡</span>
                    </button>
                    <button type="button" onClick={() => { document.getElementById('soal-input')?.focus(); document.execCommand('justifyCenter'); }} className="rounded p-1 hover:bg-gray-200 transition-colors" title="Align Center">
                      <span className="text-xs text-gray-700">≣</span>
                    </button>
                    <button type="button" onClick={() => { document.getElementById('soal-input')?.focus(); document.execCommand('justifyRight'); }} className="rounded p-1 hover:bg-gray-200 transition-colors" title="Align Right">
                      <span className="text-xs text-gray-700">☰</span>
                    </button>
                    <button type="button" onClick={() => { document.getElementById('soal-input')?.focus(); document.execCommand('justifyFull'); }} className="rounded p-1 hover:bg-gray-200 transition-colors" title="Justify">
                      <span className="text-xs text-gray-700">⊞</span>
                    </button>
                    <button type="button" onClick={() => { document.getElementById('soal-input')?.focus(); document.execCommand('indent'); }} className="rounded p-1 hover:bg-gray-200 transition-colors" title="Indent">
                      <span className="text-xs text-gray-700">→</span>
                    </button>
                    <button type="button" onClick={() => { document.getElementById('soal-input')?.focus(); document.execCommand('outdent'); }} className="rounded p-1 hover:bg-gray-200 transition-colors" title="Outdent">
                      <span className="text-xs text-gray-700">←</span>
                    </button>
                    <div className="mx-0.5 h-4 w-px bg-gray-300"></div>
                    <button type="button" onClick={() => { document.getElementById('soal-input')?.focus(); document.execCommand('insertParagraph'); }} className="rounded p-1 hover:bg-gray-200 transition-colors" title="Paragraph">
                      <span className="text-xs text-gray-700">P</span>
                    </button>
                    <button type="button" onClick={() => applyStandardFormatting('soal-input', 'bold')} className={`rounded p-1 transition-colors ${activeFormats['soal-input-bold'] ? 'bg-blue-500 text-white border-2 border-blue-600' : 'text-gray-700 hover:bg-gray-200'}`} title="Bold">
                      <span className="text-xs font-bold">B</span>
                    </button>
                    <button type="button" onClick={() => applyCustomFormatting('soal-input', 'h3', 'font-size: 1.125rem; font-weight: 600;')} className="rounded p-1 hover:bg-gray-200 transition-colors" title="Heading">
                      <span className="text-xs text-gray-700">H</span>
                    </button>
                    <button type="button" onClick={() => applyStandardFormatting('soal-input', 'italic')} className={`rounded p-1 transition-colors ${activeFormats['soal-input-italic'] ? 'bg-blue-500 text-white border-2 border-blue-600' : 'text-gray-700 hover:bg-gray-200'}`} title="Italic">
                      <span className="text-xs italic">I</span>
                    </button>
                    <div className="mx-0.5 h-4 w-px bg-gray-300"></div>
                    <button type="button" onClick={() => applyPhysicsFormatting('soal-input', 'superscript')} className={`rounded p-1 transition-colors ${activeFormats['soal-input-superscript'] ? 'bg-blue-500 text-white border-2 border-blue-600' : 'text-gray-700 hover:bg-gray-200'}`} title="Superscript (Pangkat)">
                      <span className="text-xs font-semibold">x²</span>
                    </button>
                    <button type="button" onClick={() => applyPhysicsFormatting('soal-input', 'subscript')} className={`rounded p-1 transition-colors ${activeFormats['soal-input-subscript'] ? 'bg-blue-500 text-white border-2 border-blue-600' : 'text-gray-700 hover:bg-gray-200'}`} title="Subscript">
                      <span className="text-xs font-semibold">x₂</span>
                    </button>
                    <button type="button" onClick={() => applyPhysicsFormatting('soal-input', 'vector')} className="rounded p-1 text-gray-700 hover:bg-gray-200 transition-colors" title="Vector">
                      <span className="text-xs font-semibold" style={{textDecoration: 'overline'}}>v</span>
                    </button>
                    <button type="button" onClick={() => applyPhysicsFormatting('soal-input', 'fraction')} className="rounded p-1 text-gray-700 hover:bg-gray-200 transition-colors" title="Fraction (Pecahan)">
                      <span className="text-xs font-semibold">½</span>
                    </button>
                  </div>
                  {/* Rich Text Input - Larger */}
                  <RichTextInput
                    id="soal-input"
                    value={soal}
                    onChange={setSoal}
                    placeholder="Seorang siswa melakukan percobaan hukum Newton dengan cara menarik sebuah troli bermassa 4 kg menggunakan dinamometer di atas bidang datar licin."
                    className="min-h-[150px]"
                  />
                </div>
              </div>                {/* Soal Gambar (Optional) - File Upload with Preview - Hide when Teks */}
                <div style={{ display: tipeSoal === 'Teks' ? 'none' : 'block' }}>
                  <label className="mb-3 block font-inter text-base font-semibold text-gray-900">
                    Gambar Soal (Opsional)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSoalGambar(file);
                          // Create preview
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setSoalGambarPreview(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                      id="soal-gambar"
                    />
                    <label
                      htmlFor="soal-gambar"
                      className="flex w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-10 transition-all hover:border-[#41366E] hover:bg-purple-50"
                    >
                      {soalGambarPreview ? (
                        <div className="relative">
                          <img src={soalGambarPreview} alt="Preview" className="max-h-48 rounded-lg" />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setSoalGambar(null);
                              setSoalGambarPreview('');
                            }}
                            className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-200">
                            <ImageIcon className="h-7 w-7 text-gray-500" />
                          </div>
                          <p className="font-inter text-sm font-medium text-gray-700 mb-1">
                            {soalGambar ? soalGambar.name : 'Klik untuk upload gambar'}
                          </p>
                          <p className="font-inter text-xs text-gray-500">
                            PNG, JPG hingga 5MB
                          </p>
                        </div>
                      )}
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
                          <button type="button" onClick={() => applyStandardFormatting(`jawaban-${option.label}`, 'bold')} className={`rounded p-1 transition-colors ${activeFormats[`jawaban-${option.label}-bold`] ? 'bg-blue-500 text-white border-2 border-blue-600' : 'text-gray-700 hover:bg-gray-200'}`} title="Bold">
                            <span className="text-xs font-bold">B</span>
                          </button>
                          <button type="button" onClick={() => applyCustomFormatting(`jawaban-${option.label}`, 'h3', 'font-size: 1.125rem; font-weight: 600;')} className="rounded p-1 hover:bg-gray-200 transition-colors" title="Heading">
                            <span className="text-xs text-gray-700">H</span>
                          </button>
                          <button type="button" onClick={() => applyStandardFormatting(`jawaban-${option.label}`, 'italic')} className={`rounded p-1 transition-colors ${activeFormats[`jawaban-${option.label}-italic`] ? 'bg-blue-500 text-white border-2 border-blue-600' : 'text-gray-700 hover:bg-gray-200'}`} title="Italic">
                            <span className="text-xs italic">I</span>
                          </button>
                          <div className="mx-0.5 h-4 w-px bg-gray-300"></div>
                          <button type="button" onClick={() => applyPhysicsFormatting(`jawaban-${option.label}`, 'superscript')} className={`rounded p-1 transition-colors ${activeFormats[`jawaban-${option.label}-superscript`] ? 'bg-blue-500 text-white border-2 border-blue-600' : 'text-gray-700 hover:bg-gray-200'}`} title="Superscript (Pangkat)">
                            <span className="text-xs font-semibold">x²</span>
                          </button>
                          <button type="button" onClick={() => applyPhysicsFormatting(`jawaban-${option.label}`, 'subscript')} className={`rounded p-1 transition-colors ${activeFormats[`jawaban-${option.label}-subscript`] ? 'bg-blue-500 text-white border-2 border-blue-600' : 'text-gray-700 hover:bg-gray-200'}`} title="Subscript">
                            <span className="text-xs font-semibold">x₂</span>
                          </button>
                          <button type="button" onClick={() => applyPhysicsFormatting(`jawaban-${option.label}`, 'vector')} className="rounded p-1 text-gray-700 hover:bg-gray-200 transition-colors" title="Vector">
                            <span className="text-xs font-semibold" style={{textDecoration: 'overline'}}>v</span>
                          </button>
                          <button type="button" onClick={() => applyPhysicsFormatting(`jawaban-${option.label}`, 'fraction')} className="rounded p-1 text-gray-700 hover:bg-gray-200 transition-colors" title="Fraction (Pecahan)">
                            <span className="text-xs font-semibold">½</span>
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

                    {/* Gambar (Optional) - File Upload with Preview - Hide when Teks */}
                    <div style={{ display: tipeSoal === 'Teks' ? 'none' : 'block' }}>
                      <label className="mb-3 block font-inter text-base font-semibold text-gray-900">
                        Gambar {option.label} (Opsional)
                      </label>
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                option.setGambar(file);
                                // Create preview
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  option.setPreview(reader.result as string);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="hidden"
                            id={`gambar-${option.label}`}
                          />
                          <label
                            htmlFor={`gambar-${option.label}`}
                            className="flex w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white px-4 py-8 transition-all hover:border-[#41366E] hover:bg-purple-50"
                          >
                            {option.preview ? (
                              <div className="relative">
                                <img src={option.preview} alt={`Preview ${option.label}`} className="max-h-32 rounded-lg" />
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    option.setGambar(null);
                                    option.setPreview('');
                                  }}
                                  className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ) : (
                              <div className="text-center">
                                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                                  <ImageIcon className="h-5 w-5 text-gray-500" />
                                </div>
                                <p className="font-inter text-sm font-medium text-gray-700">
                                  {option.gambar ? option.gambar.name : 'Upload gambar'}
                                </p>
                              </div>
                            )}
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

      {/* Alert Modal */}
      <AlertModal
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        primaryButtonText="OK"
        onPrimaryClick={() => {
          setShowAlert(false);
          if (alertConfig.confirmAction) {
            alertConfig.confirmAction();
          }
        }}
      />
    </div>
  );
}
