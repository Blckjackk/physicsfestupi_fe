# Layout Revision - Manajemen Soal

## Tanggal Revisi
4 Oktober 2025

## Update Terakhir
4 Oktober 2025 - Form Modal & Button Position Revision

## Overview
Revisi layout halaman Manajemen Soal dan form modal tambah ujian agar sesuai dengan desain mockup yang diberikan oleh user.

## Perubahan Utama

### 1. **Container Layout**
#### Sebelum:
- Search bar dan tombol hapus terpisah di luar container putih
- Tabel berada dalam container putih sendiri

#### Sesudah:
- Search bar, tombol hapus, dan tabel berada dalam **satu container putih** yang sama
- Container dengan rounded corners `rounded-[20px]`
- Shadow lebih soft: `shadow-[0_4px_20px_rgba(0,0,0,0.08)]`
- Padding container: `p-6`

### 2. **Search Bar**
#### Styling:
```tsx
- Border: border-gray-300 (lebih tegas)
- Rounded: rounded-lg (tidak full rounded)
- Padding: py-2 (lebih compact)
- Icon size: h-4 w-4 (lebih kecil)
- Max width: max-w-sm
- Focus ring: ring-1 ring-[#41366E]/30
```

### 3. **Tombol Hapus Pilih**
#### Styling:
```tsx
- Always shows count in format: "Hapus Pilih (X)"
- Padding: px-5 py-2 (lebih compact)
- Font: text-sm font-medium
- Color: bg-[#D94343] (merah)
- Disabled state: bg-gray-100 text-gray-400
```

### 4. **Tombol Tambah Ujian** *(UPDATED)*
#### Position & Styling:
```tsx
- Position: static, di atas container tabel
- Wrapper: flex justify-end mb-4
- Shape: rounded-lg (normal rounded)
- Padding: px-5 py-2.5
- Background: bg-[#41366E] (ungu)
- Font: text-sm font-semibold
- Hover: hover:bg-[#2f2752]
```
**Catatan**: Tombol ini sekarang di atas box tabel (tidak floating), align ke kanan.

### 5. **Exam Count Card**
#### Styling Update:
```tsx
- Background icon: bg-[#41366E] (ungu, bukan putih)
- Icon color: brightness-0 invert (putih)
- Icon size: h-10 w-10
- Card rounded: rounded-[16px]
- Card shadow: shadow-[0_2px_12px_rgba(0,0,0,0.08)]
- Icon container: h-[72px] w-[72px] rounded-[12px]
- Text spacing: mb-2
```

### 6. **Table Header**
#### Styling:
```tsx
- Border bottom: border-b-2 border-gray-200 (lebih tebal)
- Padding: py-3.5 (lebih compact)
- Font color: text-gray-800 (lebih gelap)
- Font size: text-sm font-semibold
```

### 7. **Table Rows**
#### Styling:
```tsx
- Border: border-b border-gray-100
- Padding: py-3.5 (lebih compact dari sebelumnya py-4)
- Selected state: bg-purple-50/50
- Hover state: hover:bg-gray-50/50
- Font colors:
  - Number: text-gray-700
  - Nama: text-gray-900 (paling gelap)
  - Other cells: text-gray-700
```

### 8. **Action Buttons (Edit & Delete)**
#### Styling:
```tsx
- Gap between buttons: gap-1.5 (lebih rapat)
- Button padding: p-1.5 (lebih kecil)
- Button rounded: rounded-md
- Icon color: text-gray-500
- Hover edit: hover:bg-gray-100 hover:text-[#41366E]
- Hover delete: hover:bg-red-50 hover:text-[#D94343]
```

### 9. **Checkbox**
#### Styling (unchanged, tetap bagus):
```tsx
- Size: h-5 w-5
- Border: border-2
- Unchecked: border-gray-300 bg-white
- Checked: border-[#41366E] bg-[#41366E]
- Checkmark: white color
```

### 10. **ExamFormModal Component** *(NEW DESIGN)*
#### Modal Container:
```tsx
- Max width: max-w-md (lebih kecil, sebelumnya max-w-2xl)
- Padding: p-6 (sebelumnya p-8)
- Rounded: rounded-2xl
- Shadow: shadow-2xl
- Background: bg-white
```

#### Header Section:
```tsx
- Layout: flex items-center justify-between
- Title: "Tambah Ujian" / "Edit Ujian"
- Font: font-poppins text-xl font-bold
- Close button: X icon di kanan atas
- Subtitle: "Silahkan Isi Data Ujian" (text-sm text-gray-600)
```

#### Form Fields:
1. **Nama Ujian**
   - Type: text input
   - Placeholder: "Ujian A"
   - Required: Ya

2. **Deskripsi**
   - Type: textarea
   - Rows: 4 (lebih besar dari sebelumnya)
   - Placeholder: "Ujian ini adalah ujian chunnin"
   - Required: Tidak

3. **Waktu Mulai Pengerjaan**
   - Type: text input dengan icon Calendar
   - Placeholder: "dd/mm/yy --:--"
   - Icon position: absolute right-3
   - Required: Tidak

4. **Waktu Akhir Pengerjaan**
   - Type: text input dengan icon Calendar
   - Placeholder: "dd/mm/yy --:--"
   - Icon position: absolute right-3
   - Required: Tidak

#### Fields yang DIHAPUS:
- ❌ Durasi (menit)
- ❌ Jumlah Soal

**Catatan**: Field durasi dan jumlahSoal tetap ada di ExamForm type dengan default value 0, tapi tidak ditampilkan di form.

#### Button Styling:
```tsx
Kembali:
- Background: bg-[#4a4a4a]
- Hover: hover:bg-[#3a3a3a]
- Text: text-white font-semibold
- Full width: flex-1

Tambah/Simpan:
- Background: bg-[#7C5FA7] (light purple)
- Hover: hover:bg-[#6b4f91]
- Text: text-white font-semibold
- Full width: flex-1
```

## Layout Structure

```
<main>
  <div className="mx-auto max-w-7xl px-8 py-8">
    <!-- Page Header -->
    <h1>Manajemen Soal</h1>
    <p>Statistik Ujian</p>

    <!-- Exam Count Card (conditional) -->
    <ExamCountCard /> 

    <!-- Add Exam Button -->
    <div className="mb-4 flex justify-end">
      <AddExamButton />
    </div>

    <!-- MAIN CONTAINER (Search + Table) -->
    <div className="rounded-[20px] bg-white p-6 shadow-[...]">
      
      <!-- Search Bar & Delete Button -->
      <div className="mb-6 flex justify-between">
        <SearchBar />
        <DeleteSelectedButton />
      </div>

      <!-- Table -->
      <table>
        <thead>...</thead>
        <tbody>...</tbody>
      </table>

      <!-- Pagination -->
      <Pagination />
    </div>
  </div>
</main>
```

## Color Palette

| Element | Color | Usage |
|---------|-------|-------|
| Primary Purple | `#41366E` | Buttons, checkboxes, focus states, icon bg |
| Hover Purple | `#2f2752` | Button hover states |
| Delete Red | `#D94343` | Delete button background |
| Delete Hover | `#c73838` | Delete button hover |
| Success Green | `#749221` | Success alerts |
| Border Gray | `#e5e7eb` (gray-200) | Table borders |
| Light Border | `#f3f4f6` (gray-100) | Row borders |
| Text Dark | `#111827` (gray-900) | Nama ujian |
| Text Medium | `#374151` (gray-700) | Labels, numbers |
| Text Light | `#6b7280` (gray-500) | Icons |

## Spacing Consistency

- Container padding: `p-6`
- Table cell padding: `px-4 py-3.5`
- Button padding: `px-5 py-2` (small), `px-6 py-3` (medium)
- Margin bottom sections: `mb-6`
- Icon gaps: `gap-1.5` to `gap-2`

## Responsive Considerations

- Container: `mx-auto max-w-7xl px-8 py-8`
- Search bar: `max-w-sm` untuk membatasi lebar
- Table: `overflow-x-auto` untuk scroll horizontal pada layar kecil
- Floating button: `fixed bottom-8 right-8` tetap terlihat

## Font Usage

- **Headings**: `font-poppins` (page title, numbers in cards)
- **Body**: `font-inter` (all table content, buttons, labels)
- **Sizes**:
  - Page title: `text-[36px] font-bold`
  - Card number: `text-5xl font-bold`
  - Table text: `text-sm`
  - Buttons: `text-sm font-medium/font-semibold`

## Latest Updates (4 Oktober 2025 - Revision 2)

### 1. **Button Position Change**
#### Sebelum:
- Tombol "Tambah Ujian" floating di pojok kanan bawah (fixed position)

#### Sesudah:
- Tombol "Tambah Ujian" di atas container tabel (static position)
- Position: Di atas box putih tabel, align ke kanan
- Styling: Regular button (tidak floating)

### 2. **Form Modal Redesign**
#### Fields yang Dihapus:
- ❌ Durasi (menit) - field dihapus dari form
- ❌ Jumlah Soal - field dihapus dari form

#### Layout Baru:
```
Modal: max-w-md (lebih kecil dari sebelumnya)

┌─────────────────────────────────┐
│ Tambah Ujian              [X]   │
│ Silahkan Isi Data Ujian         │
│                                 │
│ Nama Ujian                      │
│ [Ujian A........................]│
│                                 │
│ Deskripsi                       │
│ [Ujian ini adalah ujian...     ]│
│ [........................       ]│
│ [........................       ]│
│                                 │
│ Waktu Mulai Pengerjaan          │
│ [dd/mm/yy --:--         📅]     │
│                                 │
│ Waktu Akhir Pengerjaan          │
│ [dd/mm/yy --:--         📅]     │
│                                 │
│ [Kembali]  [Tambah]             │
└─────────────────────────────────┘
```

#### Form Changes:
- **Header**: "Tambah Ujian" dengan close button (X) di kanan atas
- **Subtitle**: "Silahkan Isi Data Ujian" (gray text)
- **Nama Ujian**: Single line input
- **Deskripsi**: Textarea 4 rows (lebih besar)
- **Waktu Fields**: Input dengan icon Calendar di sebelah kanan
- **Buttons**:
  - Kembali: Gray background `bg-[#4a4a4a]`
  - Tambah: Purple background `bg-[#7C5FA7]`

### 3. **Form Validation Update**
#### Sebelum:
- Required: Nama Ujian, Waktu Mulai, Waktu Akhir

#### Sesudah:
- Required: **Hanya Nama Ujian**
- Optional: Deskripsi, Waktu Mulai, Waktu Akhir

### 4. **Button Colors**
- **Kembali**: `#4a4a4a` (dark gray)
- **Tambah/Simpan**: `#7C5FA7` (light purple, bukan `#41366E`)

## Testing Checklist

- [x] Search bar di dalam container putih
- [x] Tombol hapus di sebelah kanan search bar
- [x] Tabel di bawah search bar dalam container yang sama
- [x] **Tombol tambah ujian di atas container tabel (bukan floating)**
- [x] Exam count card dengan icon background ungu
- [x] Checkbox ungu saat selected
- [x] Spacing tabel lebih compact
- [x] Row hover effect subtle
- [x] Action buttons dengan hover states
- [x] Pagination di bawah tabel dalam container
- [x] **Form modal tidak ada field durasi dan jumlah soal**
- [x] **Form modal ada icon calendar pada waktu fields**
- [x] **Form modal ada close button (X) di header**
- [x] **Form modal ada subtitle "Silahkan Isi Data Ujian"**

## Comparison

### Before (Old Layout):
```
[Search Bar] [Delete Button]  <-- Separate from table

┌─────────────────────────────┐
│         TABLE               │
│                             │
└─────────────────────────────┘

[Add Button] <-- Above table, absolute positioned
```

### After (New Layout - Final):
```
                           [Tambah Ujian] <-- Button di atas

┌─────────────────────────────────────┐
│  [Search Bar]     [Delete Button]   │
│                                     │
│  ┌───────────────────────────────┐ │
│  │        TABLE                  │ │
│  └───────────────────────────────┘ │
│                                     │
│  [Pagination]                       │
└─────────────────────────────────────┘
```

## Benefits

1. **Better Visual Hierarchy**: Semua elemen terkait dalam satu container
2. **Cleaner Layout**: Mengurangi visual clutter
3. **Better UX**: User tahu semua kontrol ada dalam satu area
4. **Modern Design**: Floating action button pattern yang umum digunakan
5. **Consistent Spacing**: Padding dan margin yang konsisten
6. **Professional Look**: Shadow dan rounded corners yang subtle

## Files Modified

- `/src/app/manajemen-soal/page.tsx`

## Dependencies

- React
- Next.js Image
- Tailwind CSS
- Lucide React Icons

## Notes

- Layout sekarang 100% sesuai dengan mockup design yang diberikan
- All CRUD functionality tetap berfungsi (Create, Read, Update, Delete)
- Responsive design maintained
- Accessibility attributes preserved
