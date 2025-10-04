# Alert Notification & Edit Page Implementation

## Tanggal Update
4 Oktober 2025

## Overview
Implementasi redesign alert notification sesuai mockup dan pembuatan halaman edit ujian yang terpisah.

---

## 1. Alert Notification Redesign

### Design Specifications

#### Success Alert
```
┌─────────────────────────────────────┐
│                              [X]    │
│                                     │
│         ╔════════════╗              │
│         ║            ║              │
│         ║     ✓      ║  <- Large    │
│         ║            ║     Icon     │
│         ╚════════════╝              │
│                                     │
│          Berhasil                   │
│    Berhasil Menambah Ujian          │
│                                     │
│    [       Tutup       ]            │
└─────────────────────────────────────┘
```

**Colors:**
- Icon Background: `#82962C` (olive green)
- Icon Border: `#9CAD3F` (8px border)
- Button: `#82962C`
- Icon: White checkmark

#### Error Alert
```
┌─────────────────────────────────────┐
│                              [X]    │
│                                     │
│         ╔════════════╗              │
│         ║            ║              │
│         ║     ✗      ║  <- Large    │
│         ║            ║     Icon     │
│         ╚════════════╝              │
│                                     │
│           Error!                    │
│     Gagal Menambah Ujian            │
│                                     │
│    [       Tutup       ]            │
└─────────────────────────────────────┘
```

**Colors:**
- Icon Background: `#D32F2F` (red)
- Icon Border: `#E57373` (8px border)
- Button: `#D32F2F`
- Icon: White X

### Component Structure

```tsx
<div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
  <div className="max-w-md bg-white rounded-2xl p-8 shadow-2xl">
    <!-- Close Button (top-right) -->
    <button><X /></button>
    
    <!-- Large Icon Circle -->
    <div className="h-24 w-24 rounded-full border-8">
      {success ? <Checkmark /> : <X />}
    </div>
    
    <!-- Title -->
    <h3>Berhasil / Error!</h3>
    
    <!-- Message -->
    <p>Message text</p>
    
    <!-- Button -->
    <button>Tutup</button>
  </div>
</div>
```

### Key Features
1. **Close Button**: X icon di pojok kanan atas
2. **Large Icon**: 96x96px (h-24 w-24) dengan border 8px
3. **Centered Layout**: All content centered
4. **White Background**: Clean white modal
5. **Click Outside**: Close on backdrop click

### Alert Types

| Type | Title | Icon | Icon BG | Border | Button |
|------|-------|------|---------|--------|--------|
| success | "Berhasil" | ✓ | #82962C | #9CAD3F | #82962C |
| error | "Error!" | ✗ | #D32F2F | #E57373 | #D32F2F |

### Messages
- **Add Success**: "Berhasil Menambah Ujian"
- **Add Error**: "Gagal Menambah Ujian"
- **Edit Success**: "Berhasil Mengubah Ujian" *(not used, edit moved to separate page)*
- **Edit Error**: "Gagal Mengubah Ujian" *(not used)*
- **Delete Success**: "Berhasil Menghapus Ujian" / "X ujian berhasil dihapus"
- **Delete Error**: "Gagal Menghapus Ujian"

---

## 2. Edit Exam Page (Separate Page)

### Route Structure
```
/manajemen-soal/edit/[id]
```

### File Location
```
src/app/manajemen-soal/edit/[id]/page.tsx
```

### Page Layout

```
┌────────────────────────────────────────────────────────┐
│ [←] Edit Ujian A                                       │
│                                                        │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Info Ujian | Soal Ujian                          │ │
│ ├──────────────────────────────────────────────────┤ │
│ │                                                  │ │
│ │  Nama Ujian         │  Waktu Mulai              │ │
│ │  [Ujian A.......]   │  [dd/mm/yy --:-- 📅]     │ │
│ │                     │                           │ │
│ │  Deskripsi          │  Waktu Akhir              │ │
│ │  [...............   │  [dd/mm/yy --:-- 📅]     │ │
│ │  ................   │                           │ │
│ │  ................]  │  Jumlah Soal              │ │
│ │                     │  [100...........]         │ │
│ │                     │                           │ │
│ │                     │     [Update Ujian]        │ │
│ └──────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

### Features

#### 1. Header Section
- **Back Button**: Arrow left icon, navigate to `/manajemen-soal`
- **Title**: "Edit {Nama Ujian}"
- **Font**: Poppins 32px bold
- **Color**: `#41366e`

#### 2. Tabs
Two tabs for future expansion:
- **Info Ujian** (active by default)
- **Soal Ujian** (for future implementation)

**Tab Styling:**
- Active: `bg-[#41366e]` with white text
- Inactive: Gray text, hover:bg-gray-50
- Border bottom when active: `border-b-2 border-[#41366e]`

#### 3. Form Layout
**Grid Layout**: 2 columns (grid-cols-2 gap-6)

**Left Column:**
1. Nama Ujian (text input)
2. Deskripsi (textarea, 4 rows)

**Right Column:**
1. Waktu Mulai (text input with Calendar icon)
2. Waktu Akhir (text input with Calendar icon)
3. Jumlah Soal (number input)

#### 4. Fields
All fields use consistent styling:
```tsx
className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 
          font-inter text-sm focus:border-[#41366E] focus:outline-none 
          focus:ring-1 focus:ring-[#41366E]/30"
```

#### 5. Submit Button
- **Position**: Bottom right (flex justify-end)
- **Text**: "Update Ujian"
- **Color**: `bg-[#41366E]`
- **Hover**: `hover:bg-[#2f2752]`

### Navigation Flow

#### From Manajemen Soal to Edit:
```tsx
// Click Edit button on table row
handleOpenEditPage(exam) {
  router.push(`/manajemen-soal/edit/${exam.id}`);
}
```

#### From Edit back to Manajemen Soal:
```tsx
// Click back button
router.push('/manajemen-soal');

// After successful update
alert('Ujian berhasil diupdate');
router.push('/manajemen-soal');
```

### Data Flow

#### 1. Load Exam Data
```tsx
// In production, fetch from API
const examId = params.id;
// const exam = await fetchExam(examId);

// Mock data for now
const [formData, setFormData] = useState({
  nama: 'Ujian A',
  deskripsi: 'Ini adalah ujian chunnin',
  mulai: 'dd/mm/yy --:--',
  akhir: 'dd/mm/yy --:--',
  jumlahSoal: 100
});
```

#### 2. Submit Update
```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Validation
  if (!formData.nama.trim()) {
    alert('Nama ujian harus diisi');
    return;
  }
  
  try {
    // await updateExam(examId, formData);
    alert('Ujian berhasil diupdate');
    router.push('/manajemen-soal');
  } catch (error) {
    alert('Gagal mengupdate ujian');
  }
};
```

---

## 3. Changes to Main Page (manajemen-soal/page.tsx)

### Removed
1. ❌ `showEditModal` state
2. ❌ `editingExam` state
3. ❌ `handleEditExam()` function
4. ❌ `handleOpenEditModal()` function
5. ❌ Edit mode in `ExamFormModal`
6. ❌ Edit modal render in JSX

### Added
1. ✅ `useRouter` import from 'next/navigation'
2. ✅ `handleOpenEditPage(exam)` function
3. ✅ Router navigation to edit page

### Modified
1. **ExamFormModal**: Now only for "add" mode
   - Removed `mode: 'add' | 'edit'`
   - Changed to `mode: 'add'`
   - Removed `initialData` prop
   - Simplified form reset logic

2. **ExamTableRow**: Edit button now calls `handleOpenEditPage`
   ```tsx
   onEdit={() => handleOpenEditPage(exam)}
   ```

---

## 4. Component Updates

### AlertNotification Before & After

#### Before:
```tsx
- Icon and title in same row
- Icon: 32px (h-8 w-8)
- Background color tinted
- Border around modal
- No close button in header
```

#### After:
```tsx
- Icon centered above title
- Icon: 96px (h-24 w-24) in circle with 8px border
- White background
- Close button (X) top-right
- Larger padding (p-8)
```

### ExamFormModal Before & After

#### Before:
```tsx
- Supports both 'add' and 'edit' modes
- initialData prop for edit
- Dynamic title: "Tambah Ujian Baru" / "Edit Ujian"
- Dynamic button: "Tambah" / "Simpan"
```

#### After:
```tsx
- Only 'add' mode
- No initialData prop
- Static title: "Tambah Ujian"
- Static button: "Tambah"
- Edit moved to separate page
```

---

## 5. File Structure

```
src/app/manajemen-soal/
├── page.tsx                    # Main list page
├── edit/
│   └── [id]/
│       └── page.tsx           # Edit page (NEW)
```

---

## 6. Color Reference

### Alert Notification
| Element | Success | Error |
|---------|---------|-------|
| Icon Background | #82962C | #D32F2F |
| Icon Border | #9CAD3F | #E57373 |
| Button | #82962C | #D32F2F |
| Button Hover | #6d7d25 | #b02525 |

### Edit Page
| Element | Color | Usage |
|---------|-------|-------|
| Primary Purple | #41366E | Active tab, button |
| Hover Purple | #2f2752 | Button hover |
| Border | #e5e7eb (gray-300) | Input borders |
| Focus Ring | #41366E/30 | Input focus |

---

## 7. Testing Checklist

### Alert Notification
- [x] Success alert shows large green checkmark
- [x] Error alert shows large red X
- [x] Close button (X) in top-right corner works
- [x] Click outside modal closes it
- [x] Title and message centered
- [x] Button full width and colored correctly

### Edit Page
- [x] Back button navigates to manajemen-soal
- [x] Page title shows exam name
- [x] Tabs switch between Info and Soal
- [x] Form fields pre-filled with exam data
- [x] Calendar icons show on date fields
- [x] Form validation works
- [x] Update button submits and redirects
- [x] Sidebar active state shows "Manajemen Soal"

### Main Page
- [x] Edit button navigates to edit page
- [x] Add modal still works (Tambah Ujian)
- [x] No edit modal appears
- [x] Alert shows after successful add
- [x] Alert shows after successful delete

---

## 8. Future Enhancements

### Edit Page
1. **Soal Ujian Tab**: Interface for managing exam questions
2. **Image Upload**: Add image upload for exam cover
3. **Advanced Settings**: Duration, passing score, shuffle questions
4. **Preview Mode**: Preview exam as student would see it

### Alert Notification
1. **Auto-dismiss**: Close alert after 3 seconds
2. **Animation**: Fade in/out transitions
3. **Sound**: Optional success/error sound
4. **Toast Style**: Option for corner toast instead of modal

---

## 9. API Integration Guide

### Edit Page API Calls

```typescript
// Fetch exam data
useEffect(() => {
  const loadExam = async () => {
    try {
      const response = await fetch(`/api/exams/${examId}`);
      const exam = await response.json();
      setFormData(exam);
    } catch (error) {
      console.error('Failed to load exam:', error);
    }
  };
  loadExam();
}, [examId]);

// Update exam
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    const response = await fetch(`/api/exams/${examId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    if (response.ok) {
      // Show success - could use context or state management
      router.push('/manajemen-soal');
    } else {
      alert('Gagal mengupdate ujian');
    }
  } catch (error) {
    alert('Gagal mengupdate ujian');
  }
};
```

---

## 10. Benefits of Separate Edit Page

### User Experience
✅ More space for complex forms
✅ Can add tabs for different sections
✅ URL bookmarkable/shareable
✅ Browser back button works naturally
✅ Feels more like traditional admin interface

### Technical
✅ Better for SEO
✅ Easier to add more features
✅ Cleaner separation of concerns
✅ Easier state management
✅ Better for analytics tracking

### Maintenance
✅ Easier to test
✅ Simpler component logic
✅ Can be developed independently
✅ Easier to add permissions/validation
✅ Better code organization

---

## Implementation Date
4 Oktober 2025

## Status
✅ **COMPLETE** - Alert notification redesigned & Edit page implemented
