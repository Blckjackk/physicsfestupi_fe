# Dokumentasi Dinamisasi Admin - Manajemen Soal

## Overview
Sistem manajemen soal admin telah berhasil didinamisasi menggunakan localStorage sebagai mock database, mengikuti pola yang sama dengan sistem login dan ujian peserta.

## 📋 Fitur yang Diimplementasikan

### 1. **Manajemen Ujian** (`/manajemen-soal`)
- ✅ List semua ujian dari localStorage
- ✅ Search ujian berdasarkan nama
- ✅ Pagination dengan 7 item per halaman
- ✅ Add ujian baru
- ✅ Edit ujian
- ✅ Delete ujian (single & bulk)
- ✅ Alert notifications (success/error)

### 2. **Edit Ujian** (`/manajemen-soal/edit/[id]`)
- ✅ Load data ujian dari localStorage
- ✅ Update info ujian (nama, deskripsi, durasi)
- ✅ Tab switching (Info Ujian / Soal Ujian)
- ✅ List soal yang sudah ada
- ✅ Jumlah soal otomatis terhitung

### 3. **Manajemen Soal dalam Ujian**
- ✅ List semua soal dalam ujian tertentu
- ✅ Tambah soal baru
- ✅ Edit soal existing
- ✅ Delete soal dengan re-numbering otomatis
- ✅ Empty state ketika belum ada soal

### 4. **Form Tambah Soal** (`/manajemen-soal/edit/[id]/tambah-soal`)
- ✅ Form dengan rich text editor placeholder
- ✅ Input untuk soal
- ✅ Input untuk 5 opsi jawaban (A-E)
- ✅ Dropdown pilihan jawaban benar
- ✅ Save ke localStorage
- ✅ Redirect ke tab Soal Ujian setelah berhasil

### 5. **Form Edit Soal** (`/manajemen-soal/edit/[id]/edit-soal/[questionId]`)
- ✅ Load data soal existing
- ✅ Pre-populate form dengan data soal
- ✅ Update soal ke localStorage
- ✅ Loading state saat load data
- ✅ Error handling jika soal tidak ditemukan

## 🔧 Technical Implementation

### Service Layer (`src/lib/mockData.ts`)

#### AdminUjianService
```typescript
AdminUjianService = {
  getAllUjian(): Ujian[]              // Get all ujian
  getUjianById(id): Ujian | null      // Get single ujian
  addUjian(ujian): Ujian              // Create new ujian
  updateUjian(id, data): Ujian | null // Update ujian
  deleteUjian(id): boolean            // Delete single ujian
  deleteMultipleUjian(ids): number    // Bulk delete
  
  // Soal Management
  addSoal(ujianId, soal): Soal | null
  updateSoal(ujianId, soalId, data): Soal | null
  deleteSoal(ujianId, soalId): boolean
  getSoalById(ujianId, soalId): Soal | null
}
```

### Data Flow

1. **Load Data**: Component → `AdminUjianService` → `localStorage.getItem('ujianList')` → Parse JSON → Return data
2. **Save Data**: Component → `AdminUjianService` → Modify data → `localStorage.setItem('ujianList', JSON.stringify(data))`
3. **Auto Re-numbering**: Saat delete soal, nomor soal otomatis di-update agar berurutan (1, 2, 3, ...)

### localStorage Structure

```json
{
  "ujianList": [
    {
      "id": "1",
      "nama": "Ujian Fisika - Physics Fest UPI 2025",
      "durasi": 60,
      "deskripsi": "Ujian fisika tingkat nasional",
      "status": "sedang_berlangsung",
      "soal": [
        {
          "id": "s1",
          "nomor": 1,
          "pertanyaan": "Sebuah benda...",
          "opsi": [
            { "label": "A", "teks": "3 : 2" },
            { "label": "B", "teks": "2 : 3" },
            // ... opsi C, D, E
          ],
          "jawabanBenar": "A"
        }
        // ... soal lainnya
      ]
    }
  ]
}
```

## 📁 File Structure

```
src/
├── lib/
│   └── mockData.ts                           # Service layer dengan AdminUjianService
├── app/
│   └── manajemen-soal/
│       ├── page.tsx                          # List ujian + CRUD
│       └── edit/
│           └── [id]/
│               ├── page.tsx                  # Edit ujian + List soal
│               ├── tambah-soal/
│               │   └── page.tsx              # Form tambah soal
│               └── edit-soal/
│                   └── [questionId]/
│                       └── page.tsx          # Form edit soal
```

## 🎯 Key Features

### 1. Auto Re-numbering
Ketika soal dihapus, sistem otomatis mengupdate nomor soal yang tersisa:
```typescript
// Before delete: Soal 1, 2, 3, 4, 5
// Delete soal nomor 3
// After delete: Soal 1, 2, 3, 4 (nomor 4 menjadi 3, nomor 5 menjadi 4)
```

### 2. Reactive State Management
- Setiap perubahan data langsung di-load ulang dari localStorage
- UI otomatis update setelah CRUD operation
- Loading states untuk better UX

### 3. Error Handling
- Validation form input
- Alert untuk success/error operations
- Redirect ke halaman yang sesuai jika data tidak ditemukan

### 4. URL Tab Navigation
- Support query parameter `?tab=soal` untuk langsung buka tab Soal Ujian
- Digunakan saat redirect dari tambah/edit soal

## 🧪 Testing Guide

### Test Case 1: Add Ujian Baru
1. Buka `/manajemen-soal`
2. Klik tombol "Tambah Ujian"
3. Isi form:
   - Nama: "Ujian Test"
   - Deskripsi: "Ini ujian test"
4. Klik "Tambah"
5. ✅ Ujian baru muncul di tabel
6. ✅ Alert success ditampilkan

### Test Case 2: Edit Ujian
1. Klik icon edit (pensil) pada ujian
2. Ubah nama ujian
3. Klik "Update Ujian"
4. ✅ Nama ujian terupdate di tabel
5. ✅ Alert success ditampilkan

### Test Case 3: Delete Ujian
1. Klik icon delete (trash) pada ujian
2. Confirm delete
3. ✅ Ujian terhapus dari tabel
4. ✅ Alert success ditampilkan

### Test Case 4: Bulk Delete Ujian
1. Centang beberapa ujian
2. Klik "Hapus Pilih (n)"
3. Confirm delete
4. ✅ Semua ujian terpilih terhapus
5. ✅ Alert success dengan jumlah yang dihapus

### Test Case 5: Tambah Soal
1. Edit ujian → Tab "Soal Ujian"
2. Klik "Tambah Soal"
3. Isi form:
   - Soal: "Pertanyaan test"
   - Jawaban A-E: "Jawaban A", "Jawaban B", dst
   - Jawaban Benar: pilih salah satu
4. Klik "Tambah"
5. ✅ Redirect ke tab Soal Ujian
6. ✅ Soal baru muncul di list
7. ✅ Nomor soal auto-increment

### Test Case 6: Edit Soal
1. Klik icon edit pada soal
2. Ubah pertanyaan atau jawaban
3. Klik "Simpan Perubahan"
4. ✅ Redirect ke tab Soal Ujian
5. ✅ Soal terupdate

### Test Case 7: Delete Soal
1. Klik icon delete pada soal
2. Confirm delete
3. ✅ Soal terhapus
4. ✅ Nomor soal re-numbered
5. ✅ Alert success ditampilkan

### Test Case 8: Search Ujian
1. Ketik nama ujian di search bar
2. ✅ Tabel filter sesuai keyword
3. ✅ Pagination update sesuai hasil filter

### Test Case 9: Pagination
1. Jika ada lebih dari 7 ujian
2. ✅ Pagination muncul
3. ✅ Klik next/prev untuk navigasi
4. ✅ Indicator "Halaman X dari Y"

### Test Case 10: Empty State Soal
1. Edit ujian baru yang belum punya soal
2. Buka tab "Soal Ujian"
3. ✅ Tampil empty state dengan message
4. ✅ Tombol "Tambah Soal Pertama"

## 🔄 Integration dengan Sistem Lain

### 1. Ujian Peserta
- Data ujian dari `AdminUjianService` digunakan oleh `ExamService`
- Soal yang ditambahkan admin akan muncul di ujian peserta
- Perubahan soal langsung terrefleksikan di ujian aktif

### 2. Authentication
- Halaman admin harus diakses setelah login sebagai admin
- Data ujian tersimpan per-instance (localStorage per browser)

## 📝 Notes untuk Development

### Limitations Current Implementation
- File upload (gambar soal/jawaban) belum terimplementasi
- Rich text editor masih placeholder (toolbar tidak fungsional)
- Waktu mulai/akhir ujian belum diimplementasikan
- Status ujian (belum_mulai/sedang_berlangsung/selesai) belum dimanage

### Migration ke Backend
Saat backend API siap, replace:
```typescript
// From:
AdminUjianService.getAllUjian()

// To:
await fetch('/api/ujian').then(res => res.json())
```

Pattern yang sama untuk semua CRUD operations.

## 🎨 UI Components

### Main Components
- `Sidebar`: Navigation sidebar dengan active state
- `ExamCountCard`: Card statistik jumlah ujian
- `SearchBar`: Input search dengan icon
- `ExamTableRow`: Row tabel ujian dengan actions
- `Pagination`: Pagination controls
- `DeleteConfirmModal`: Modal konfirmasi delete
- `ExamFormModal`: Modal form tambah ujian
- `AlertNotification`: Alert success/error
- `QuestionCard`: Card display soal dengan opsi

### Styling
- Tailwind CSS dengan custom colors
- Font: Poppins (heading), Inter (body)
- Purple theme: `#41366E` (primary)
- Red theme: `#CD1F1F` (delete)
- Consistent spacing, shadows, dan transitions

## ✅ Checklist Features

### Manajemen Ujian
- [x] List ujian from localStorage
- [x] Add ujian
- [x] Edit ujian
- [x] Delete ujian (single)
- [x] Delete ujian (bulk)
- [x] Search ujian
- [x] Pagination
- [x] Alert notifications

### Manajemen Soal
- [x] List soal dalam ujian
- [x] Add soal
- [x] Edit soal
- [x] Delete soal
- [x] Auto re-numbering
- [x] Empty state
- [x] Loading states

### UI/UX
- [x] Responsive design
- [x] Loading indicators
- [x] Error handling
- [x] Confirmation modals
- [x] Success/error alerts
- [x] Tab navigation
- [x] URL query params support

## 🚀 Next Steps (Opsional)

1. Implement file upload untuk gambar soal/jawaban
2. Implement rich text editor fungsional
3. Implement waktu mulai/akhir ujian dengan date picker
4. Implement status management ujian
5. Implement preview ujian
6. Implement duplicate ujian/soal
7. Implement export/import soal
8. Backend API integration

---

**Status**: ✅ Fully Implemented & Tested
**Last Updated**: 2025-10-04
**Version**: 1.0.0
