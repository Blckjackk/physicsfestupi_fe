// @ts-nocheck
'use client';

/**
 * ExamManagementPage Component
 * 
 * DEVELOPER NOTES:
 * - Toggle `showExamCountCard` boolean (line ~50) to show/hide the exam count card
 * - Sample data in `sampleExams` - replace with real API call
 * - Pagination size controlled by `ITEMS_PER_PAGE` constant
 * - Font families: Poppins (heading), Inter (body) - ensure imported in layout
 * 
 * QC NOTES IMPLEMENTED:
 * - Sidebar active state with left indicator bar
 * - Exam count card conditionally rendered based on showExamCountCard
 * - Delete selected with confirmation modal
 * - Responsive table with pagination
 */

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Sidebar from '@/components/dashboard-admin/Sidebar';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// Sample data
const sampleExams = [
  { id: 1, nama: 'Ujian A', durasi: 100, deskripsi: 'Ini adalah ujian chunnin', mulai: 'dd/mm/yy 20:00', akhir: 'dd/mm/yy 21:00', jumlahSoal: 100 },
  { id: 2, nama: 'Ujian A', durasi: 100, deskripsi: 'Ini adalah ujian chunnin', mulai: 'dd/mm/yy 20:00', akhir: 'dd/mm/yy 21:00', jumlahSoal: 100 },
  { id: 3, nama: 'Ujian A', durasi: 100, deskripsi: 'Ini adalah ujian chunnin', mulai: 'dd/mm/yy 20:00', akhir: 'dd/mm/yy 21:00', jumlahSoal: 100 },
  { id: 4, nama: 'Ujian A', durasi: 100, deskripsi: 'Ini adalah ujian chunnin', mulai: 'dd/mm/yy 20:00', akhir: 'dd/mm/yy 21:00', jumlahSoal: 100 },
  { id: 5, nama: 'Ujian A', durasi: 100, deskripsi: 'Ini adalah ujian chunnin', mulai: 'dd/mm/yy 20:00', akhir: 'dd/mm/yy 21:00', jumlahSoal: 100 },
  { id: 6, nama: 'Ujian A', durasi: 100, deskripsi: 'Ini adalah ujian chunnin', mulai: 'dd/mm/yy 20:00', akhir: 'dd/mm/yy 21:00', jumlahSoal: 100 },
  { id: 7, nama: 'Ujian A', durasi: 100, deskripsi: 'Ini adalah ujian chunnin', mulai: 'dd/mm/yy 20:00', akhir: 'dd/mm/yy 21:00', jumlahSoal: 100 },
];

const ITEMS_PER_PAGE = 7;

export default function ExamManagementPage() {
  // CONFIGURATION: Toggle this to show/hide exam count card
  const showExamCountCard = true;

  // State management
  const [exams, setExams] = useState(sampleExams);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Filtered and paginated data
  const filteredExams = useMemo(() => {
    return exams.filter(exam => 
      exam.nama.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [exams, searchQuery]);

  const totalPages = Math.ceil(filteredExams.length / ITEMS_PER_PAGE);
  const paginatedExams = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredExams.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredExams, currentPage]);

  // Handlers
  const handleSelectAll = () => {
    if (selectedIds.size === paginatedExams.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedExams.map(e => e.id)));
    }
  };

  const handleSelectOne = (id: number) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleDeleteSelected = () => {
    setExams(exams.filter(e => !selectedIds.has(e.id)));
    setSelectedIds(new Set());
    setShowDeleteModal(false);
  };

  const handleDeleteOne = (id: number) => {
    setExams(exams.filter(e => e.id !== id));
    selectedIds.delete(id);
    setSelectedIds(new Set(selectedIds));
  };

  const isAllSelected = paginatedExams.length > 0 && selectedIds.size === paginatedExams.length;

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

          {/* Search & Actions Bar */}
          <div className="mb-6 flex items-center justify-between gap-4">
            <SearchBar 
              value={searchQuery} 
              onChange={setSearchQuery} 
            />
            <div className="flex items-center gap-3">
              <DeleteSelectedButton 
                count={selectedIds.size}
                onClick={() => setShowDeleteModal(true)}
                disabled={selectedIds.size === 0}
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="relative">
            {/* Add Exam Button - Floating */}
            <AddExamButton onClick={() => setShowAddModal(true)} />

            {/* Table */}
            <div className="rounded-[14px] bg-white p-5 shadow-[0_10px_25px_rgba(15,15,15,0.06)]">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="w-12 py-4 text-left">
                        <Checkbox 
                          checked={isAllSelected}
                          onChange={handleSelectAll}
                          aria-label="Select all exams"
                        />
                      </th>
                      <th className="px-4 py-4 text-left font-inter text-sm font-semibold text-gray-700">No.</th>
                      <th className="px-4 py-4 text-left font-inter text-sm font-semibold text-gray-700">Nama Ujian</th>
                      <th className="px-4 py-4 text-left font-inter text-sm font-semibold text-gray-700">Durasi</th>
                      <th className="px-4 py-4 text-left font-inter text-sm font-semibold text-gray-700">Deskripsi</th>
                      <th className="px-4 py-4 text-left font-inter text-sm font-semibold text-gray-700">Waktu Mulai</th>
                      <th className="px-4 py-4 text-left font-inter text-sm font-semibold text-gray-700">Waktu Berakhir</th>
                      <th className="px-4 py-4 text-left font-inter text-sm font-semibold text-gray-700">Jumlah Soal</th>
                      <th className="px-4 py-4 text-center font-inter text-sm font-semibold text-gray-700">Aksi</th>
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

      {showAddModal && (
        <AddExamModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}

// ============ COMPONENTS ============

function ExamCountCard({ count }: { count: number }) {
  return (
    <div className="mb-6 inline-flex items-center gap-6 rounded-lg bg-white px-6 py-4 shadow-sm">
      <div>
        <p className="mb-1 font-inter text-sm text-gray-600">Jumlah Ujian</p>
        <p className="font-poppins text-5xl font-bold text-[#41366E]">{count}</p>
      </div>
      <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-[#fefefe]">
        <Image 
          src="/images/user-friends.png"
          alt="Jumlah Ujian Icon"
          width={64}
          height={64}
          className="h-12 w-12"
        />
      </div>
    </div>
  );
}

function SearchBar({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  return (
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder="Search Nama Ujian"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-full border border-gray-200 bg-white py-2.5 pl-12 pr-4 font-inter text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#41366E] focus:outline-none focus:ring-2 focus:ring-[#41366E]/20"
      />
    </div>
  );
}

function DeleteSelectedButton({ count, onClick, disabled }: { count: number; onClick: () => void; disabled: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg px-4 py-2.5 font-inter text-sm font-semibold transition-all ${
        disabled
          ? 'cursor-not-allowed bg-gray-200 text-gray-400'
          : 'bg-[#D94343] text-white shadow-md hover:bg-[#c73939] hover:shadow-lg'
      }`}
    >
      Hapus Pilih {count > 0 && `(${count})`}
    </button>
  );
}

function AddExamButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute -top-16 right-0 z-10 flex items-center gap-2 rounded-lg bg-[#41366E] px-5 py-2.5 font-inter text-sm font-semibold text-white shadow-lg transition-all hover:bg-[#2f2752] hover:shadow-xl"
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
      className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-all ${
        checked
          ? 'border-[#41366E] bg-[#41366E]'
          : 'border-gray-300 bg-white hover:border-[#41366E]'
      }`}
    >
      {checked && (
        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
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
  onDelete 
}: { 
  exam: any; 
  number: number; 
  selected: boolean; 
  onSelect: () => void; 
  onDelete: () => void;
}) {
  return (
    <tr className={`border-b border-gray-100 transition-all hover:-translate-y-0.5 hover:shadow-sm ${selected ? 'bg-purple-50/30' : ''}`}>
      <td className="py-4">
        <Checkbox checked={selected} onChange={onSelect} ariaLabel={`Select ${exam.nama}`} />
      </td>
      <td className="px-4 py-4 font-inter text-sm text-gray-600">{number}</td>
      <td className="px-4 py-4 font-inter text-sm text-gray-800">{exam.nama}</td>
      <td className="px-4 py-4 font-inter text-sm text-gray-600">{exam.durasi}</td>
      <td className="px-4 py-4 font-inter text-sm text-gray-600">{exam.deskripsi}</td>
      <td className="px-4 py-4 font-inter text-sm text-gray-600">{exam.mulai}</td>
      <td className="px-4 py-4 font-inter text-sm text-gray-600">{exam.akhir}</td>
      <td className="px-4 py-4 font-inter text-sm text-gray-600">{exam.jumlahSoal}</td>
      <td className="px-4 py-4">
        <div className="flex items-center justify-center gap-2">
          <button
            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-[#41366E]"
            aria-label="Edit exam"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-red-50 hover:text-[#D94343]"
            aria-label="Delete exam"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }: { currentPage: number; totalPages: number; onPageChange: (page: number) => void }) {
  return (
    <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
      <p className="font-inter text-sm text-gray-600">
        Halaman {currentPage} dari {totalPages}
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
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
