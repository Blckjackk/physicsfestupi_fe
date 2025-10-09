// @ts-nocheck
'use client';

/**
 * ExamManagementPage Component
 * 
 * FULLY INTEGRATED WITH LARAVEL BACKEND API
 * 
 * FEATURES:
 * - CRUD ujian (Create, Read, Update, Delete)
 * - Search ujian by nama
 * - Pagination
 * - Bulk delete dengan confirmation
 * - Alert notifications
 */

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/dashboard-admin/Sidebar';
import AlertModal, { AlertType } from '@/components/ui/alert-modal';
import { adminService, type Ujian } from '@/services/admin.service';
import { ApiError } from '@/lib/api';
import { useAdminGuard } from '@/hooks/useAuthGuard';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import {
  Search,
  Plus,
  Pencil,
  Trash,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Calendar
} from 'lucide-react';

type ExamForm = {
  nama_ujian: string;
  deskripsi: string;
  waktu_mulai_pengerjaan: string;
  waktu_akhir_pengerjaan: string;
};

type AlertState = {
  show: boolean;
  type: 'success' | 'error';
  title: string;
  message: string;
};

const ITEMS_PER_PAGE = 7;

export default function ExamManagementPage() {
  // CONFIGURATION: Toggle this to show/hide exam count card
  const showExamCountCard = true;
  const router = useRouter();

  // State management - HARUS DI ATAS AUTH GUARD
  const [exams, setExams] = useState<Ujian[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [alert, setAlert] = useState<AlertState>({ show: false, type: 'success', title: '', message: '' });

  // Auth guard - redirect if not admin (HARUS SETELAH SEMUA STATE)
  const { isLoading: authLoading, isAuthenticated } = useAdminGuard();

  // Alert modal states for single delete confirmation
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    type: 'info' as AlertType,
    title: '',
    message: '',
    confirmAction: null as (() => void) | null,
  });

  // Load ujian data on mount
  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      const data = await adminService.getUjian();
      setExams(data);
    } catch (error) {
      console.error('Failed to load exams:', error);
      setAlert({
        show: true,
        type: 'error',
        title: 'Error!',
        message: 'Gagal memuat data ujian'
      });
    }
  };

  // Filtered and paginated data
  const filteredExams = useMemo(() => {
    return exams.filter(exam =>
      exam.nama_ujian.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [exams, searchQuery]);

  const totalPages = Math.ceil(filteredExams.length / ITEMS_PER_PAGE);
  const paginatedExams = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredExams.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredExams, currentPage]);

  // Handlers
  // Handlers
  const handleSelectAll = () => {
    if (selectedIds.size === paginatedExams.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedExams.map(e => e.id)));
    }
  };

  const handleSelectOne = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleDeleteSelected = async () => {
    try {
      const idsArray = Array.from(selectedIds);
      let deletedCount = 0;

      // Delete each ujian individually
      for (const id of idsArray) {
        try {
          await adminService.deleteUjian(Number(id));
          deletedCount++;
        } catch (err) {
          console.error(`Failed to delete ujian ${id}:`, err);
        }
      }

      if (deletedCount > 0) {
        loadExams();
        setSelectedIds(new Set());
        setShowDeleteModal(false);
        setAlert({
          show: true,
          type: 'success',
          title: 'Berhasil',
          message: `Berhasil menghapus ${deletedCount} ujian`
        });
      } else {
        setAlert({
          show: true,
          type: 'error',
          title: 'Error!',
          message: 'Tidak ada ujian yang dihapus'
        });
      }
    } catch (error) {
      setAlert({
        show: true,
        type: 'error',
        title: 'Error!',
        message: 'Gagal menghapus ujian'
      });
    }
  };

  const handleDeleteOne = (id: string) => {
    setAlertConfig({
      type: 'warning' as AlertType,
      title: 'Konfirmasi Hapus',
      message: 'Apakah Anda yakin ingin menghapus ujian ini? Semua soal dalam ujian ini juga akan dihapus. Tindakan ini tidak dapat dibatalkan.',
      confirmAction: () => confirmDeleteOne(id),
    });
    setShowAlert(true);
  };

  const confirmDeleteOne = async (id: string) => {
    try {
      await adminService.deleteUjian(Number(id));
      loadExams();
      selectedIds.delete(id);
      setSelectedIds(new Set(selectedIds));
      setAlertConfig({
        type: 'success' as AlertType,
        title: 'Berhasil!',
        message: 'Ujian berhasil dihapus!',
        confirmAction: null,
      });
      setShowAlert(true);
    } catch (error) {
      console.error('Failed to delete ujian:', error);
      setAlertConfig({
        type: 'error' as AlertType,
        title: 'Error!',
        message: error instanceof ApiError ? error.message : 'Gagal menghapus ujian',
        confirmAction: null,
      });
      setShowAlert(true);
    }
  };

  const handleAddExam = async (formData: ExamForm) => {
    try {
      // Calculate durasi from waktu_mulai and waktu_akhir
      const start = new Date(formData.waktu_mulai_pengerjaan);
      const end = new Date(formData.waktu_akhir_pengerjaan);
      const durasi = Math.round((end.getTime() - start.getTime()) / (1000 * 60)); // in minutes

      await adminService.createUjian({
        nama_ujian: formData.nama_ujian,
        durasi: durasi,
        deskripsi: formData.deskripsi,
        waktu_mulai_pengerjaan: formData.waktu_mulai_pengerjaan,
        waktu_akhir_pengerjaan: formData.waktu_akhir_pengerjaan
      });

      loadExams();
      setShowAddModal(false);
      setAlert({
        show: true,
        type: 'success',
        title: 'Berhasil',
        message: 'Berhasil menambah ujian'
      });
    } catch (error) {
      console.error('Failed to create ujian:', error);
      setAlert({
        show: true,
        type: 'error',
        title: 'Error!',
        message: error instanceof ApiError ? error.message : 'Gagal menambah ujian'
      });
    }
  };

  const handleOpenEditPage = (exam: Ujian) => {
    // Redirect to edit page
    router.push(`/manajemen-soal/edit/${exam.id}`);
  };

  const closeAlert = () => {
    setShowAlert(false);
  };

  const isAllSelected = paginatedExams.length > 0 && selectedIds.size === paginatedExams.length;

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
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="font-poppins text-[36px] font-bold text-[#41366e] mb-1">
              Manajemen Soal
            </h1>
            <p className="font-inter text-base text-gray-600">Statistik Ujian</p>
          </div>

          {/* Exam Count Card - Conditional */}
          {showExamCountCard && exams.length > 1 && (
            <ExamCountCard count={exams.length} />
          )}

          {/* Add Exam Button - Above Table */}
          <div className="mb-4 flex justify-end">
            <AddExamButton onClick={() => setShowAddModal(true)} />
          </div>

          {/* Main Container - Search + Table */}
          <div className="rounded-[28px] border border-[#524D59] bg-white p-8 shadow-md">
            {/* Search Bar and Delete Button */}
            <div className="mb-6 flex items-center gap-4">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
              />
              <DeleteSelectedButton
                count={selectedIds.size}
                onClick={() => setShowDeleteModal(true)}
                disabled={selectedIds.size === 0}
              />
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-lg border border-[#E4E4E4]">
              <table className="w-full text-center text-black">
                <thead>
                  <tr className="border-b border-[#E4E4E4]">
                    <th className="py-3.5 text-center">
                      <Checkbox
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                        aria-label="Select all exams"
                      />
                    </th>
                    <th className="px-4 py-3.5 text-center font-inter text-sm font-semibold text-black">No.</th>
                    <th className="px-4 py-3.5 text-center font-inter text-sm font-semibold text-black">Nama Ujian</th>
                    <th className="px-4 py-3.5 text-center font-inter text-sm font-semibold text-black">Durasi</th>
                    <th className="px-4 py-3.5 text-center font-inter text-sm font-semibold text-black">Deskripsi</th>
                    <th className="px-4 py-3.5 text-center font-inter text-sm font-semibold text-black">Waktu Mulai</th>
                    <th className="px-4 py-3.5 text-center font-inter text-sm font-semibold text-black">Waktu Berakhir</th>
                    <th className="px-4 py-3.5 text-center font-inter text-sm font-semibold text-black">Jumlah Soal</th>
                    <th className="px-4 py-3.5 text-center font-inter text-sm font-semibold text-black">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedExams.map((exam, index) => (
                    <ExamTableRow
                      key={exam.id}
                      exam={exam}
                      number={(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                      selected={selectedIds.has(exam.id)}
                      onSelect={() => handleSelectOne(exam.id)}
                      onEdit={() => handleOpenEditPage(exam)}
                      onDelete={() => handleDeleteOne(exam.id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      {showDeleteModal && (
        <DeleteConfirmModal
          count={selectedIds.size}
          onConfirm={handleDeleteSelected}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

      {/* Add Exam Modal */}
      <ExamFormModal
        show={showAddModal}
        mode="add"
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddExam}
      />

      {/* Alert Notification */}
      <AlertNotification
        show={alert.show}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onClose={() => setAlert({ ...alert, show: false })}
      />

      {/* Alert Modal for Delete Confirmation */}
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

// ============ COMPONENTS ============

function ExamCountCard({ count }: { count: number }) {
  return (
    <div className="mb-6 inline-flex items-center gap-5 rounded-[16px] bg-white px-6 py-5 shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
      <div>
        <p className="mb-2 font-inter text-sm font-medium text-gray-600">Jumlah Ujian</p>
        <p className="font-poppins text-5xl font-bold text-[#41366E]">{count}</p>
      </div>
      <div className="flex h-[72px] w-[72px] items-center justify-center rounded-[12px] bg-[#41366E]">
        <Image
          src="/images/user-friends.png"
          alt="Jumlah Ujian Icon"
          width={64}
          height={64}
          className="h-10 w-10 brightness-0 invert"
        />
      </div>
    </div>
  );
}

function SearchBar({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  return (
    <div className="relative w-6/12">
      <input
        type="search"
        placeholder="Cari Nama Ujian"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-[28px] border border-gray-300 bg-white py-2 pl-4 pr-10 font-inter text-sm text-black placeholder:text-[#524D59] focus:border-[#41366E] focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <Search className="h-5 w-5 text-[#524D59]" />
      </div>
    </div>
  );
}

function DeleteSelectedButton({ count, onClick, disabled }: { count: number; onClick: () => void; disabled: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-[10px] px-5 py-2 font-heading text-base font-medium transition-all ${disabled
        ? 'cursor-not-allowed bg-gray-200 text-gray-400'
        : 'bg-[#CD1F1F] text-white hover:bg-[#b01919]'
        }`}
    >
      Hapus Pilih ({count})
    </button>
  );
}

function AddExamButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-[10px] bg-[#41366E] px-5 py-2.5 font-heading text-base font-medium text-white transition-all hover:bg-[#2f2752]"
    >
      <Plus className="h-5 w-5" />
      Tambah Ujian
    </button>
  );
}

function Checkbox({ checked, onChange, ariaLabel }: { checked: boolean; onChange: () => void; ariaLabel?: string }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={onChange}
      className={`flex h-4 w-4 items-center justify-center rounded-sm border transition-all ${checked
        ? 'border-[#41366E] bg-[#41366E]'
        : 'border-input bg-background hover:border-[#41366E]'
        }`}
    >
      {checked && (
        <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
    </button>
  );
}

function ExamTableRow({
  exam,
  number,
  selected,
  onSelect,
  onEdit,
  onDelete
}: {
  exam: Ujian;
  number: number;
  selected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  // Format dates for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '-';
    }
  };

  return (
    <tr className={`border-b border-[#E4E4E4] ${selected ? 'bg-purple-50/50' : ''}`}>
      <td className="py-3.5 text-center">
        <Checkbox checked={selected} onChange={onSelect} ariaLabel={`Select ${exam.nama_ujian}`} />
      </td>
      <td className="px-4 py-3.5 text-center font-inter text-sm text-black">{number}</td>
      <td className="px-4 py-3.5 text-center font-inter text-sm text-black">{exam.nama_ujian}</td>
      <td className="px-4 py-3.5 text-center font-inter text-sm text-black">{exam.durasi} menit</td>
      <td className="px-4 py-3.5 text-center font-inter text-sm text-black">{exam.deskripsi || '-'}</td>
      <td className="px-4 py-3.5 text-center font-inter text-sm text-black">{formatDate(exam.waktu_mulai_pengerjaan)}</td>
      <td className="px-4 py-3.5 text-center font-inter text-sm text-black">{formatDate(exam.waktu_akhir_pengerjaan)}</td>
      <td className="px-4 py-3.5 text-center font-inter text-sm text-black">{exam.jumlah_soal ?? 0}</td>
      <td className="px-4 py-3.5 text-center">
        <div className="flex items-center justify-center gap-2">
          <Pencil
            size={18}
            onClick={onEdit}
            className="inline cursor-pointer hover:text-[#41366E] transition-colors"
            aria-label="Edit exam"
          />
          <Trash
            size={18}
            onClick={onDelete}
            className="inline cursor-pointer hover:text-red-600 transition-colors"
            aria-label="Delete exam"
          />
        </div>
      </td>
    </tr>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }: { currentPage: number; totalPages: number; onPageChange: (page: number) => void }) {
  return (
    <div className="mt-4 flex items-center justify-between border-t border-[#E4E4E4] pt-4">
      <p className="font-inter text-sm text-black">
        Halaman {currentPage} dari {totalPages}
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#524D59] transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#524D59] transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function DeleteConfirmModal({ count, onConfirm, onCancel }: { count: number; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-poppins text-xl font-bold text-gray-900">
            Hapus Pilih ({count})
          </h3>
          <button
            onClick={onCancel}
            className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mb-6 font-inter text-sm text-gray-600">
          Apakah Anda yakin ingin menghapus {count} ujian yang dipilih? Tindakan ini tidak dapat dibatalkan.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border-2 border-gray-300 bg-white px-4 py-2.5 font-inter text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-lg bg-[#D94343] px-4 py-2.5 font-inter text-sm font-semibold text-white transition-colors hover:bg-[#c73939]"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

function AddExamModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-poppins text-xl font-bold text-gray-900">
            Tambah Ujian
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mb-6 font-inter text-sm text-gray-600">
          Fitur tambah ujian akan diimplementasikan dengan integrasi backend API.
        </p>
        <button
          onClick={onClose}
          className="w-full rounded-lg bg-[#41366E] px-4 py-2.5 font-inter text-sm font-semibold text-white transition-colors hover:bg-[#2f2752]"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}

// ExamFormModal Component (Add Only - Edit uses separate page)
function ExamFormModal({
  show,
  mode,
  onClose,
  onSubmit
}: {
  show: boolean;
  mode: 'add';
  onClose: () => void;
  onSubmit: (data: ExamForm) => void;
}) {
  const [formData, setFormData] = React.useState<ExamForm>({
    nama_ujian: '',
    deskripsi: '',
    waktu_mulai_pengerjaan: '',
    waktu_akhir_pengerjaan: ''
  });

  React.useEffect(() => {
    // Reset form when modal opens
    if (show) {
      setFormData({
        nama_ujian: '',
        deskripsi: '',
        waktu_mulai_pengerjaan: '',
        waktu_akhir_pengerjaan: ''
      });
    }
  }, [show]);

  if (!show) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.nama_ujian.trim()) {
      alert('Nama ujian harus diisi');
      return;
    }
    if (!formData.waktu_mulai_pengerjaan) {
      alert('Waktu mulai pengerjaan harus diisi');
      return;
    }
    if (!formData.waktu_akhir_pengerjaan) {
      alert('Waktu akhir pengerjaan harus diisi');
      return;
    }

    onSubmit(formData);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Close Button */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-poppins text-xl font-bold text-gray-900">
            Tambah Ujian
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mb-6 font-inter text-sm text-gray-600">
          Silahkan Isi Data Ujian
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama Ujian */}
          <div>
            <label className="mb-2 block font-inter text-sm font-semibold text-gray-700">
              Nama Ujian
            </label>
            <input
              type="text"
              value={formData.nama_ujian}
              onChange={(e) => setFormData({ ...formData, nama_ujian: e.target.value })}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-inter text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:border-[#41366E] focus:outline-none focus:ring-1 focus:ring-[#41366E]/30"
              placeholder="Ujian A"
              required
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="mb-2 block font-inter text-sm font-semibold text-gray-700">
              Deskripsi
            </label>
            <textarea
              value={formData.deskripsi}
              onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
              rows={3}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-inter text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:border-[#41366E] focus:outline-none focus:ring-1 focus:ring-[#41366E]/30"
              placeholder="Deskripsi ujian (opsional)"
            />
          </div>

          {/* Waktu Mulai Pengerjaan */}
          <div>
            <label className="mb-2 block font-inter text-sm font-semibold text-gray-700">
              Waktu Mulai Pengerjaan
            </label>
            <input
              type="datetime-local"
              value={formData.waktu_mulai_pengerjaan}
              onChange={(e) => setFormData({ ...formData, waktu_mulai_pengerjaan: e.target.value })}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-inter text-sm text-gray-900 transition-colors focus:border-[#41366E] focus:outline-none focus:ring-1 focus:ring-[#41366E]/30"
              required
            />
          </div>

          {/* Waktu Akhir Pengerjaan */}
          <div>
            <label className="mb-2 block font-inter text-sm font-semibold text-gray-700">
              Waktu Akhir Pengerjaan
            </label>
            <input
              type="datetime-local"
              value={formData.waktu_akhir_pengerjaan}
              onChange={(e) => setFormData({ ...formData, waktu_akhir_pengerjaan: e.target.value })}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-inter text-sm text-gray-900 transition-colors focus:border-[#41366E] focus:outline-none focus:ring-1 focus:ring-[#41366E]/30"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg bg-[#4a4a4a] px-4 py-2.5 font-inter text-sm font-semibold text-white transition-colors hover:bg-[#3a3a3a]"
            >
              Kembali
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-[#7C5FA7] px-4 py-2.5 font-inter text-sm font-semibold text-white transition-colors hover:bg-[#6b4f91]"
            >
              Tambah
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// AlertNotification Component
function AlertNotification({
  show,
  type,
  title,
  message,
  onClose
}: {
  show: boolean;
  type: 'success' | 'error';
  title: string;
  message: string;
  onClose: () => void;
}) {
  if (!show) return null;

  const config = {
    success: {
      iconBgColor: 'bg-[#82962C]',
      iconBorderColor: 'border-[#9CAD3F]',
      buttonBg: 'bg-[#82962C]',
      buttonHover: 'hover:bg-[#6d7d25]'
    },
    error: {
      iconBgColor: 'bg-[#D32F2F]',
      iconBorderColor: 'border-[#E57373]',
      buttonBg: 'bg-[#D32F2F]',
      buttonHover: 'hover:bg-[#b02525]'
    }
  };

  const { iconBgColor, iconBorderColor, buttonBg, buttonHover } = config[type];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className={`flex h-24 w-24 items-center justify-center rounded-full border-8 ${iconBorderColor} ${iconBgColor}`}>
            {type === 'success' ? (
              <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <X className="h-12 w-12 text-white" strokeWidth={3} />
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="mb-3 text-center font-poppins text-xl font-bold text-gray-900">
          {title}
        </h3>

        {/* Message */}
        <p className="mb-6 text-center font-inter text-sm text-gray-600">
          {message}
        </p>

        {/* Button */}
        <button
          onClick={onClose}
          className={`w-full rounded-lg ${buttonBg} px-4 py-3 font-inter text-sm font-semibold text-white transition-colors ${buttonHover}`}
        >
          Tutup
        </button>
      </div>
    </div>
  );
}
