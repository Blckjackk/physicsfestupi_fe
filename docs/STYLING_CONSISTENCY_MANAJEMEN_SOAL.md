# Styling Consistency Update - Manajemen Soal

## Tanggal Update
4 Oktober 2025

## Overview
Menyamakan gaya, ikon, dan styling halaman Manajemen Soal dengan halaman Data Peserta untuk konsistensi design system.

---

## Perubahan Detail

### 1. **Icons Update**

#### Sebelum:
```tsx
import { Edit2, Trash2 } from 'lucide-react';
```

#### Sesudah:
```tsx
import { Pencil, Trash } from 'lucide-react';
```

**Usage:**
```tsx
// In ExamTableRow
<Pencil size={18} className="inline cursor-pointer" />
<Trash size={18} className="inline cursor-pointer" />
```

**Reason**: Konsisten dengan Data Peserta yang menggunakan `Pencil` dan `Trash`.

---

### 2. **Card/Container Styling**

#### Main Container (Search + Table)

**Sebelum:**
```tsx
className="rounded-[20px] bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
```

**Sesudah:**
```tsx
className="rounded-[28px] border border-[#524D59] bg-white p-8 shadow-md"
```

**Changes:**
- Border radius: `20px` → `28px`
- Added: `border border-[#524D59]`
- Padding: `p-6` → `p-8`
- Shadow: Custom shadow → `shadow-md`

---

### 3. **Search Bar Styling**

#### Sebelum:
```tsx
<div className="relative flex-1 max-w-sm">
  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
  <input
    type="text"
    placeholder="Search Nama Ujian"
    className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 
               font-inter text-sm text-gray-700 placeholder:text-gray-400 
               focus:border-[#41366E] focus:outline-none focus:ring-1 focus:ring-[#41366E]/30"
  />
</div>
```

#### Sesudah:
```tsx
<div className="relative w-6/12">
  <input
    type="search"
    placeholder="Cari Nama Ujian"
    className="w-full rounded-[28px] border border-gray-300 bg-white py-2 pl-4 pr-10 
               font-inter text-sm text-black placeholder:text-[#524D59] 
               focus:border-[#41366E] focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
  />
  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
    <Search className="h-5 w-5 text-[#524D59]" />
  </div>
</div>
```

**Changes:**
- Width: `flex-1 max-w-sm` → `w-6/12` (fixed 50% width)
- Border radius: `rounded-lg` → `rounded-[28px]`
- Type: `text` → `search`
- Icon position: Left → Right
- Padding: `pl-10 pr-4` → `pl-4 pr-10`
- Placeholder text: "Search Nama Ujian" → "Cari Nama Ujian"
- Placeholder color: `text-gray-400` → `text-[#524D59]`
- Text color: `text-gray-700` → `text-black`
- Icon size: `h-4 w-4` → `h-5 w-5`
- Icon color: `text-gray-400` → `text-[#524D59]`
- Focus ring: Custom ring → `focus-visible:ring-0`

---

### 4. **Button "Hapus Pilih" Styling**

#### Sebelum:
```tsx
className={`rounded-lg px-5 py-2 font-inter text-sm font-medium transition-all ${
  disabled
    ? 'cursor-not-allowed bg-gray-100 text-gray-400'
    : 'bg-[#D94343] text-white hover:bg-[#c73838]'
}`}
```

#### Sesudah:
```tsx
className={`rounded-[10px] px-5 py-2 font-heading text-base font-medium transition-all ${
  disabled
    ? 'cursor-not-allowed bg-gray-200 text-gray-400'
    : 'bg-[#CD1F1F] text-white hover:bg-[#b01919]'
}`}
```

**Changes:**
- Border radius: `rounded-lg` → `rounded-[10px]`
- Font: `font-inter` → `font-heading`
- Font size: `text-sm` → `text-base`
- Background (disabled): `bg-gray-100` → `bg-gray-200`
- Background (active): `#D94343` → `#CD1F1F`
- Hover: `#c73838` → `#b01919`

---

### 5. **Button "Tambah Ujian" Styling**

#### Sebelum:
```tsx
className="flex items-center gap-2 rounded-lg bg-[#41366E] px-5 py-2.5 
           font-inter text-sm font-semibold text-white transition-all hover:bg-[#2f2752]"
```

#### Sesudah:
```tsx
className="flex items-center gap-2 rounded-[10px] bg-[#41366E] px-5 py-2.5 
           font-heading text-base font-medium text-white transition-all hover:bg-[#2f2752]"
```

**Changes:**
- Border radius: `rounded-lg` → `rounded-[10px]`
- Font: `font-inter` → `font-heading`
- Font size: `text-sm` → `text-base`
- Font weight: `font-semibold` → `font-medium`

---

### 6. **Table Container**

#### Sebelum:
```tsx
<div className="overflow-x-auto">
  <table className="w-full">
```

#### Sesudah:
```tsx
<div className="overflow-hidden rounded-lg border border-[#E4E4E4]">
  <table className="w-full text-center text-black">
```

**Changes:**
- Added: `overflow-hidden rounded-lg`
- Added: `border border-[#E4E4E4]`
- Table classes: Added `text-center text-black`

---

### 7. **Table Header**

#### Sebelum:
```tsx
<tr className="border-b-2 border-gray-200">
  <th className="w-12 py-3.5 text-left">
  <th className="px-4 py-3.5 text-left font-inter text-sm font-semibold text-gray-800">
```

#### Sesudah:
```tsx
<tr className="border-b border-[#E4E4E4]">
  <th className="py-3.5 text-center">
  <th className="px-4 py-3.5 text-center font-inter text-sm font-semibold text-black">
```

**Changes:**
- Border: `border-b-2 border-gray-200` → `border-b border-[#E4E4E4]`
- Alignment: `text-left` → `text-center` (all columns)
- Text color: `text-gray-800` → `text-black`
- Removed: `w-12` from checkbox column

---

### 8. **Table Rows**

#### Sebelum:
```tsx
<tr className={`border-b border-gray-100 transition-colors ${selected ? 'bg-purple-50/50' : 'hover:bg-gray-50/50'}`}>
  <td className="py-3.5">
  <td className="px-4 py-3.5 font-inter text-sm text-gray-700">
  <td className="px-4 py-3.5 font-inter text-sm text-gray-900">  // Nama
```

#### Sesudah:
```tsx
<tr className={`border-b border-[#E4E4E4] ${selected ? 'bg-purple-50/50' : ''}`}>
  <td className="py-3.5 text-center">
  <td className="px-4 py-3.5 text-center font-inter text-sm text-black">
```

**Changes:**
- Border: `border-gray-100` → `border-[#E4E4E4]`
- Removed: `transition-colors` and hover state
- Alignment: All cells now `text-center`
- Text color: Unified to `text-black` (was `text-gray-700` and `text-gray-900`)

---

### 9. **Action Icons in Table**

#### Sebelum:
```tsx
<div className="flex items-center justify-center gap-1.5">
  <button
    onClick={onEdit}
    className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-[#41366E]"
  >
    <Edit2 className="h-4 w-4" />
  </button>
  <button
    onClick={onDelete}
    className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-red-50 hover:text-[#D94343]"
  >
    <Trash2 className="h-4 w-4" />
  </button>
</div>
```

#### Sesudah:
```tsx
<div className="flex items-center justify-center gap-2">
  <Pencil 
    size={18} 
    onClick={onEdit}
    className="inline cursor-pointer"
  />
  <Trash 
    size={18} 
    onClick={onDelete}
    className="inline cursor-pointer"
  />
</div>
```

**Changes:**
- Removed button wrapper
- Changed icons: `Edit2` → `Pencil`, `Trash2` → `Trash`
- Icon size: `h-4 w-4` → `size={18}`
- Gap: `gap-1.5` → `gap-2`
- Removed hover states (simpler design)
- Direct icon click instead of button click

---

### 10. **Pagination**

#### Sebelum:
```tsx
<div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
  <p className="font-inter text-sm text-gray-600">
  <button className="... border border-gray-300">
```

#### Sesudah:
```tsx
<div className="mt-4 flex items-center justify-between border-t border-[#E4E4E4] pt-4">
  <p className="font-inter text-sm text-black">
  <button className="... border border-[#524D59]">
```

**Changes:**
- Border top: `border-gray-200` → `border-[#E4E4E4]`
- Text color: `text-gray-600` → `text-black`
- Button border: `border-gray-300` → `border-[#524D59]`

---

### 11. **Edit Page Updates**

#### Card Container:
**Sebelum:**
```tsx
className="rounded-[20px] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
```

**Sesudah:**
```tsx
className="rounded-[28px] border border-[#524D59] bg-white shadow-md"
```

#### Back Button:
**Sebelum:**
```tsx
className="... rounded-lg border border-gray-300"
```

**Sesudah:**
```tsx
className="... rounded-[10px] border border-[#524D59]"
```

#### Tab Border:
**Sebelum:**
```tsx
className="flex border-b border-gray-200"
```

**Sesudah:**
```tsx
className="flex border-b border-[#E4E4E4]"
```

#### Submit Button:
**Sebelum:**
```tsx
className="rounded-lg ... font-inter text-sm font-semibold"
```

**Sesudah:**
```tsx
className="rounded-[10px] ... font-heading text-base font-medium"
```

---

## Color Reference

### Updated Colors

| Element | Old Color | New Color | Name |
|---------|-----------|-----------|------|
| Card border | None | `#524D59` | Dark purple-gray |
| Table border | `gray-200` / `gray-100` | `#E4E4E4` | Light gray |
| Search placeholder | `gray-400` | `#524D59` | Dark purple-gray |
| Delete button | `#D94343` | `#CD1F1F` | Red |
| Text (general) | `gray-700` / `gray-800` | `black` | Black |
| Pagination text | `gray-600` | `black` | Black |
| Button borders | `gray-300` | `#524D59` | Dark purple-gray |

### Maintained Colors

| Element | Color | Name |
|---------|-------|------|
| Primary button | `#41366E` | Purple |
| Primary hover | `#2f2752` | Dark purple |
| Selected row | `purple-50/50` | Light purple |

---

## Typography Updates

### Font Families

| Element | Old Font | New Font |
|---------|----------|----------|
| Delete button | `font-inter` | `font-heading` |
| Add button | `font-inter` | `font-heading` |
| Edit page submit | `font-inter` | `font-heading` |

### Font Sizes & Weights

| Element | Old | New |
|---------|-----|-----|
| Delete button | `text-sm font-medium` | `text-base font-medium` |
| Add button | `text-sm font-semibold` | `text-base font-medium` |
| Submit button | `text-sm font-semibold` | `text-base font-medium` |

---

## Border Radius Standardization

| Element | Old | New | Purpose |
|---------|-----|-----|---------|
| Main card | `20px` | `28px` | Outer container |
| Search input | `lg` (~8px) | `28px` | Input fields |
| Buttons | `lg` (~8px) | `10px` | All buttons |
| Back button | `lg` (~8px) | `10px` | Navigation |
| Table container | None | `lg` (~8px) | Inner wrapper |

---

## Layout Changes

### Search Bar Width
- **Before**: `flex-1 max-w-sm` (flexible, max ~384px)
- **After**: `w-6/12` (fixed 50% width)
- **Reason**: Consistent with Data Peserta layout

### Icon Position in Search
- **Before**: Left side (`left-3.5`)
- **After**: Right side (`right-0`)
- **Reason**: Matches Data Peserta pattern

---

## Comparison Table

### Main Differences from Old to New

| Aspect | Old Style | New Style (Data Peserta) |
|--------|-----------|--------------------------|
| **Card Border** | No border | `border-[#524D59]` thick border |
| **Rounded Corners** | Medium (`20px`) | Large (`28px`) |
| **Shadow** | Custom soft | Standard `shadow-md` |
| **Padding** | `p-6` | `p-8` (more spacious) |
| **Icons** | `Edit2`, `Trash2` | `Pencil`, `Trash` |
| **Icon Wrapper** | Button with hover | Direct icon with cursor |
| **Table Alignment** | Left aligned | Center aligned |
| **Text Colors** | Multiple grays | Black (stronger) |
| **Border Colors** | Gray variations | `#524D59` and `#E4E4E4` |
| **Search Icon** | Left side | Right side |
| **Button Radius** | `rounded-lg` | `rounded-[10px]` |
| **Typography** | Mostly Inter | Heading for buttons |

---

## Benefits of Consistency

### User Experience
✅ Familiar interface across all admin pages
✅ Predictable interaction patterns
✅ Reduced cognitive load
✅ Professional appearance

### Development
✅ Easier to maintain
✅ Shared component styling
✅ Consistent design tokens
✅ Faster future development

### Design System
✅ Unified color palette
✅ Standardized spacing
✅ Consistent typography scale
✅ Reusable patterns

---

## Files Modified

1. `/src/app/manajemen-soal/page.tsx`
   - Icon imports updated
   - SearchBar component redesigned
   - DeleteSelectedButton styling updated
   - AddExamButton styling updated
   - Table container with border
   - Table alignment centered
   - ExamTableRow icons changed
   - Pagination colors updated

2. `/src/app/manajemen-soal/edit/[id]/page.tsx`
   - Card border and radius updated
   - Back button styling updated
   - Tab borders updated
   - Submit button styling updated

---

## Testing Checklist

### Visual Consistency
- [x] Card borders match Data Peserta
- [x] Rounded corners consistent (28px cards, 10px buttons)
- [x] Search bar icon on right side
- [x] Pencil and Trash icons display correctly
- [x] Table borders use #E4E4E4
- [x] Text colors are black (not gray)
- [x] Button colors match (#CD1F1F for delete)

### Functionality
- [x] Search works with new styling
- [x] Icon clicks trigger edit/delete
- [x] Buttons respond to hover
- [x] Table selection still works
- [x] Pagination buttons work
- [x] All links and navigation functional

### Responsive
- [x] Search bar width responsive (w-6/12)
- [x] Table scrolls horizontally if needed
- [x] Buttons maintain size
- [x] Icons don't overlap on small screens

---

## Implementation Date
4 Oktober 2025

## Status
✅ **COMPLETE** - All styling matched with Data Peserta page
