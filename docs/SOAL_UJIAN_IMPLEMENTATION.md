# Implementasi Soal Ujian - Manajemen Soal

## 📋 Overview

Dokumen ini menjelaskan implementasi lengkap fitur manajemen soal ujian yang mencakup:
- Tab "Soal Ujian" di halaman edit ujian
- Form tambah soal dengan rich text editor
- Tampilan daftar soal dengan gambar dan opsi jawaban
- Styling yang konsisten dengan desain aplikasi

## 🎯 Perubahan yang Diimplementasikan

### 1. **Checkbox Styling - Matching Data Peserta**

**File**: `/src/app/manajemen-soal/page.tsx`

**Perubahan**:
```tsx
// SEBELUM: Checkbox dengan rounded dan size 5x5
className="flex h-5 w-5 items-center justify-center rounded border-2"

// SESUDAH: Checkbox dengan rounded-sm dan size 4x4 (seperti Data Peserta)
className="flex h-4 w-4 items-center justify-center rounded-sm border"
```

**Detail**:
- Size diubah dari `h-5 w-5` menjadi `h-4 w-4`
- Border radius dari `rounded` (0.25rem) menjadi `rounded-sm` (0.125rem)
- Border dari `border-2` menjadi `border` (1px)
- Colors tetap: `border-[#41366E] bg-[#41366E]` saat checked

### 2. **Tab Layout - Left Aligned (Bukan 50/50)**

**File**: `/src/app/manajemen-soal/edit/[id]/page.tsx`

**Perubahan**:
```tsx
// SEBELUM: Tabs dengan flex-1 (split 50/50)
<div className="flex border-b border-[#E4E4E4]">
  <button className="flex-1 px-6 py-4...">Info Ujian</button>
  <button className="flex-1 px-6 py-4...">Soal Ujian</button>
</div>

// SESUDAH: Tabs dengan fixed padding (left-aligned)
<div className="flex border-b border-[#E4E4E4]">
  <button className="px-8 py-4...">Info Ujian</button>
  <button className="px-8 py-4...">Soal Ujian</button>
</div>
```

**Detail**:
- Removed `flex-1` dari tabs (tidak lagi 50/50 split)
- Tabs sekarang left-aligned dengan width otomatis berdasarkan content
- Padding tetap `px-8 py-4`

### 3. **Rounded Corners Fix - Square Corners for Active Tab**

**File**: `/src/app/manajemen-soal/edit/[id]/page.tsx`

**Perubahan**:
```tsx
// Main card dengan overflow-hidden
<div className="rounded-[28px] border border-[#524D59] bg-white shadow-md overflow-hidden">

// Active tab dengan rounded-tl-[28px] (hanya top-left)
<button
  className={`px-8 py-4 font-inter text-sm font-semibold transition-colors ${
    activeTab === 'info'
      ? 'bg-[#41366e] text-white rounded-tl-[28px]'
      : 'text-gray-600 hover:bg-gray-50'
  }`}
>
  Info Ujian
</button>
```

**Detail**:
- Added `overflow-hidden` pada main card untuk clip content
- Active tab (Info Ujian) memiliki `rounded-tl-[28px]` untuk match dengan card corner
- Tab kedua (Soal Ujian) tidak memiliki rounded corners
- Hasil: Saat Info Ujian active, top-left corner rounded sempurna
- Saat Soal Ujian active, tidak ada rounded corners (square)

### 4. **Update Button - Outside the Box**

**File**: `/src/app/manajemen-soal/edit/[id]/page.tsx`

**Perubahan**:
```tsx
// SEBELUM: Button di dalam form
<form onSubmit={handleSubmit} className="p-6">
  {/* form fields */}
  <div className="mt-8 flex justify-end">
    <button type="submit">Update Ujian</button>
  </div>
</form>

// SESUDAH: Button di luar card
{activeTab === 'info' && (
  <div className="mt-6 flex justify-end">
    <button onClick={handleSubmit}>Update Ujian</button>
  </div>
)}
```

**Detail**:
- Button dipindah keluar dari card (bukan di dalam form)
- Positioned tepat di bawah card dengan margin `mt-6`
- Button hanya muncul saat tab "Info Ujian" active
- Styling tetap: `rounded-[10px] bg-[#41366E] px-8 py-2.5 font-heading`

### 5. **Soal Ujian Tab - Full Implementation**

**File**: `/src/app/manajemen-soal/edit/[id]/page.tsx`

**Komponen Baru**:

#### A. SoalUjianTab Component
```tsx
function SoalUjianTab({ examId, examName }: { examId: string; examName: string }) {
  const [questions, setQuestions] = useState(sampleQuestions);
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="p-8">
      {/* Header with Tambah Soal Button */}
      <div className="mb-6 flex items-center justify-between">
        <h2>Daftar Soal</h2>
        <button onClick={() => setShowAddModal(true)}>
          <Plus /> Tambah Soal
        </button>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {questions.map((question, index) => (
          <QuestionCard key={question.id} question={question} number={index + 1} />
        ))}
      </div>
    </div>
  );
}
```

**Fitur**:
- Menampilkan daftar soal dengan numbering
- Button "Tambah Soal" di kanan atas
- Spacing antar soal: `space-y-6`
- Padding container: `p-8`

#### B. QuestionCard Component
```tsx
function QuestionCard({ question, number, onDelete }: { ... }) {
  return (
    <div className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
      {/* Header with Edit/Delete */}
      <div className="mb-4 flex items-center justify-between">
        <h3>Soal {number}</h3>
        <div className="flex items-center gap-2">
          <Pencil size={18} />
          <Trash size={18} onClick={onDelete} />
        </div>
      </div>

      {/* Question Text */}
      <p>{question.soal}</p>
      {question.jawaban && <ul>...</ul>}

      {/* Question Image (if exists) */}
      {question.gambar && <Image src={question.gambar} />}

      {/* Answer Options A-E */}
      <div className="space-y-3">
        {question.opsi.map((opsi) => (
          <div key={opsi.label} className="flex items-start gap-3">
            <span className={`h-8 w-8 rounded border ${
              question.opsiBenar.includes(opsi.label) 
                ? 'border-[#41366E] bg-[#41366E] text-white' 
                : 'border-gray-300 bg-white text-gray-700'
            }`}>
              {opsi.label}
            </span>
            <div>
              <p>{opsi.text}</p>
              {opsi.gambar && <Image src={opsi.gambar} />}
            </div>
          </div>
        ))}
      </div>

      {/* Correct Answer Label */}
      <div className="mt-4 rounded-lg bg-[#41366E] px-4 py-2 text-center">
        <span>Jawaban : {question.opsiBenar}</span>
      </div>
    </div>
  );
}
```

**Fitur**:
- Card dengan border dan shadow
- Header dengan nomor soal + action buttons (Edit, Delete)
- Text soal dengan support bullet points
- Gambar soal (optional)
- 5 opsi jawaban (A-E) dengan gambar optional
- Highlight opsi yang benar (purple background)
- Label jawaban benar di bawah (purple banner)

### 6. **Tambah Soal Modal - Google Form Style**

**File**: `/src/app/manajemen-soal/edit/[id]/page.tsx`

**Komponen**: `TambahSoalModal`

**Layout Structure**:
```
┌─────────────────────────────────────┐
│ Header (Fixed)                      │
│  ← Tambah Soal Ujian A              │
├─────────────────────────────────────┤
│ Form Content (Scrollable)           │
│  - Tipe Soal [Dropdown]            │
│  - Soal [Rich Text Editor]         │
│  - Soal Gambar (Optional) [Upload] │
│  - Jawaban A [Rich Text + Upload]  │
│  - Gambar A (Optional) [Upload]    │
│  - Jawaban B [Rich Text + Upload]  │
│  - Gambar B (Optional) [Upload]    │
│  - ... (C, D, E)                   │
│  - Jawaban Benar [Dropdown]        │
├─────────────────────────────────────┤
│ Footer Buttons (Fixed)              │
│           [Kembali] [Tambah]       │
└─────────────────────────────────────┘
```

**Field Details**:

1. **Tipe Soal** - Dropdown
   - Options: Gambar, Teks, Video
   - Default: Gambar
   - Custom dropdown dengan ChevronDown icon

2. **Soal** - Rich Text Editor
   - Toolbar dengan 11 formatting buttons
   - Textarea dengan 5 rows
   - Placeholder text
   - Border dan rounded corners

3. **Soal Gambar (Optional)** - File Upload
   - Dashed border box
   - "No file chosen" placeholder
   - Hover effect: border purple + bg gray
   - Accept: image/*

4. **Jawaban A-E** - Rich Text Editor + Upload
   - Same toolbar sebagai Soal
   - Input text untuk jawaban
   - File upload untuk gambar (optional)
   - Each jawaban punya gambar terpisah

5. **Jawaban Benar** - Dropdown
   - Options: A, B, C, D, E
   - Default: D
   - Custom dropdown dengan ChevronDown icon

**Styling Details**:

```tsx
// Modal Container
className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm overflow-y-auto py-8"

// Modal Content
className="my-8 w-full max-w-3xl rounded-2xl bg-white shadow-2xl"

// Header
className="border-b border-gray-200 px-8 py-6"

// Scrollable Form
className="max-h-[calc(100vh-200px)] overflow-y-auto px-8 py-6"

// Footer
className="border-t border-gray-200 px-8 py-6"

// Rich Text Toolbar
className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-3 py-2"

// File Upload Box
className="flex w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-8 transition-colors hover:border-[#41366E] hover:bg-gray-100"
```

**Buttons**:
- **Kembali**: `bg-[#4a4a4a]` gray button
- **Tambah**: `bg-[#41366E]` purple button
- Both: `rounded-[10px] px-6 py-2.5 font-heading text-base font-medium`

## 📊 Mock Data Structure

```typescript
const sampleQuestions = [
  {
    id: 1,
    soal: 'Seorang siswa melakukan percobaan hukum Newton...',
    jawaban: ['Gaya yang ditunjukkan...', 'Setelah beberapa saat...'],
    opsiBenar: 'A. Rp8.250',
    gambar: '/images/example-chart.png',
    opsi: [
      { label: 'A', text: 'Rp8.250', gambar: '/images/graph-a.png' },
      { label: 'B', text: 'Rp8.250', gambar: '/images/graph-b.png' },
      { label: 'C', text: 'Rp8.250', gambar: '/images/graph-c.png' },
      { label: 'D', text: 'Rp8.250', gambar: null },
      { label: 'E', text: 'Rp8.250', gambar: null },
    ]
  }
];
```

## 🎨 Styling Standards

### Colors
- **Primary Purple**: `#41366E` - buttons, active states, correct answers
- **Border Dark**: `#524D59` - card borders, button borders
- **Border Light**: `#E4E4E4` - table borders, dividers
- **Gray Background**: `#4a4a4a` - secondary buttons
- **Delete Red**: `#CD1F1F` - delete buttons

### Border Radius
- **Cards**: `rounded-[28px]` - outer cards
- **Buttons**: `rounded-[10px]` - all buttons
- **Inputs**: `rounded-lg` - form inputs (0.5rem)
- **Small Elements**: `rounded` - checkboxes, small items

### Typography
- **Headings**: `font-heading` (Poppins) - buttons, titles
- **Body**: `font-inter` (Inter) - paragraphs, labels
- **Sizes**: 
  - Titles: `text-2xl` atau `text-xl`
  - Body: `text-sm` atau `text-base`
  - Labels: `text-sm font-semibold`

### Spacing
- **Card Padding**: `p-8` - main containers
- **Form Spacing**: `space-y-6` - between form groups
- **Button Gap**: `gap-3` - between buttons
- **Icon Gap**: `gap-2` - icon + text

## ✅ Testing Checklist

### Checkbox Styling
- [ ] Checkbox size 4x4 (bukan 5x5)
- [ ] Border radius rounded-sm (bukan rounded)
- [ ] Border 1px (bukan 2px)
- [ ] Color purple saat checked

### Tab Layout
- [ ] Tabs left-aligned (bukan 50/50)
- [ ] Tab width berdasarkan content
- [ ] Active tab punya purple background

### Rounded Corners
- [ ] Info Ujian tab: top-left corner rounded
- [ ] Soal Ujian tab: no rounded corners
- [ ] Card border tidak terlihat gap

### Update Button
- [ ] Button di luar card (bukan dalam form)
- [ ] Button 6px di bawah card (mt-6)
- [ ] Button hanya muncul di tab Info Ujian

### Soal Ujian Tab
- [ ] Header dengan "Daftar Soal" + "Tambah Soal" button
- [ ] Question cards dengan numbering (Soal 1, Soal 2, ...)
- [ ] Question text tampil dengan baik
- [ ] Gambar soal tampil (jika ada)
- [ ] 5 opsi jawaban (A-E) tampil
- [ ] Opsi yang benar highlighted purple
- [ ] Label "Jawaban : X" tampil di bawah
- [ ] Edit/Delete icons berfungsi

### Tambah Soal Modal
- [ ] Modal muncul saat klik "Tambah Soal"
- [ ] Header dengan back arrow + title
- [ ] Dropdown "Tipe Soal" berfungsi
- [ ] Rich text editor dengan toolbar
- [ ] File upload untuk Soal Gambar
- [ ] 5 jawaban (A-E) dengan rich text + upload
- [ ] Dropdown "Jawaban Benar" berfungsi
- [ ] Modal scrollable untuk konten panjang
- [ ] Footer buttons (Kembali, Tambah) berfungsi
- [ ] Modal close saat klik backdrop atau Kembali

## 🔄 API Integration (Future)

### Endpoints yang Diperlukan

1. **GET /api/exams/:id/questions**
   - Mengambil daftar soal untuk ujian tertentu
   - Response: Array of questions

2. **POST /api/exams/:id/questions**
   - Menambah soal baru
   - Request body: Question data + files
   - Response: Created question

3. **PUT /api/questions/:id**
   - Update soal
   - Request body: Updated question data
   - Response: Updated question

4. **DELETE /api/questions/:id**
   - Hapus soal
   - Response: Success message

5. **POST /api/upload**
   - Upload gambar soal/jawaban
   - Request: FormData with file
   - Response: File URL

## 📝 Component Dependencies

```
EditExamPage
├── Sidebar
├── SoalUjianTab
│   ├── QuestionCard
│   └── TambahSoalModal
└── (Form components for Info Ujian)
```

## 🎯 Next Steps

1. **Backend Integration**
   - Implement API endpoints untuk CRUD questions
   - Implement file upload untuk gambar
   - Add image storage (S3, Cloudinary, etc.)

2. **Rich Text Editor**
   - Integrate library seperti Quill, TinyMCE, atau Draft.js
   - Support formatting (bold, italic, underline, etc.)
   - Support math equations (optional)

3. **Image Management**
   - Image preview sebelum upload
   - Image compression
   - Image validation (size, format)
   - Image crop/resize

4. **Question Types**
   - Multiple choice (current)
   - Essay questions
   - True/False
   - Matching
   - Fill in the blank

5. **Validation & Error Handling**
   - Required field validation
   - File size/type validation
   - Error messages
   - Success confirmations

## 📚 References

- Design mockup: Provided images (Soal Ujian tab & Tambah Soal form)
- Data Peserta page: `/src/app/dashboard-admin/data-peserta/page.tsx`
- Styling guide: `/docs/STYLING_CONSISTENCY_MANAJEMEN_SOAL.md`

---

**Last Updated**: October 4, 2025
**Author**: Development Team
**Status**: ✅ Completed
