# Quick Reference - Admin Manajemen Soal

## 🔐 Login Credentials

### Admin
- Username: `admin`
- Password: `admin123`
- Route: `/login-admin`

## 🗺️ Routes

| Route | Deskripsi |
|-------|-----------|
| `/manajemen-soal` | List & manage ujian |
| `/manajemen-soal/edit/[id]` | Edit ujian & manage soal |
| `/manajemen-soal/edit/[id]/tambah-soal` | Form tambah soal baru |
| `/manajemen-soal/edit/[id]/edit-soal/[questionId]` | Form edit soal |

## 🎯 Quick Test Scenarios

### Scenario 1: Tambah Ujian Baru (1 menit)
```
1. Login sebagai admin
2. Klik "Tambah Ujian"
3. Isi:
   - Nama: "Ujian Kimia"
   - Deskripsi: "Ujian kimia dasar"
4. Klik "Tambah"
✅ Ujian baru muncul di tabel
```

### Scenario 2: Tambah Soal ke Ujian (2 menit)
```
1. Klik edit pada ujian pertama
2. Klik tab "Soal Ujian"
3. Klik "Tambah Soal"
4. Isi:
   - Soal: "Berapa hasil 2 + 2?"
   - Jawaban A: "3"
   - Jawaban B: "4"
   - Jawaban C: "5"
   - Jawaban D: "6"
   - Jawaban E: "7"
   - Jawaban Benar: B
5. Klik "Tambah"
✅ Soal baru muncul di list
✅ Nomor soal otomatis increment
```

### Scenario 3: Edit Soal (1 menit)
```
1. Di tab Soal Ujian, klik icon pensil pada soal
2. Ubah pertanyaan atau jawaban
3. Klik "Simpan Perubahan"
✅ Perubahan tersimpan
```

### Scenario 4: Delete Soal (30 detik)
```
1. Klik icon trash pada soal
2. Confirm delete
✅ Soal terhapus
✅ Nomor soal re-numbered otomatis
```

### Scenario 5: Delete Multiple Ujian (30 detik)
```
1. Di halaman manajemen soal, centang beberapa ujian
2. Klik "Hapus Pilih (n)"
3. Confirm
✅ Semua ujian terpilih terhapus
```

## 🔍 localStorage Inspection

### View Data di Browser Console
```javascript
// View semua ujian
JSON.parse(localStorage.getItem('ujianList'))

// View ujian pertama dengan semua soal
JSON.parse(localStorage.getItem('ujianList'))[0]

// Count soal di ujian pertama
JSON.parse(localStorage.getItem('ujianList'))[0].soal.length

// Clear all data (reset)
localStorage.clear()
// Refresh page untuk reload mock data
```

## 📊 Default Data

### Default Ujian
```javascript
{
  id: "1",
  nama: "Ujian Fisika - Physics Fest UPI 2025",
  durasi: 60,
  deskripsi: "",
  status: "sedang_berlangsung",
  soal: [10 soal fisika]
}
```

### Struktur Soal
```javascript
{
  id: "s1",
  nomor: 1,
  pertanyaan: "Pertanyaan...",
  opsi: [
    { label: "A", teks: "Jawaban A" },
    { label: "B", teks: "Jawaban B" },
    { label: "C", teks: "Jawaban C" },
    { label: "D", teks: "Jawaban D" },
    { label: "E", teks: "Jawaban E" }
  ],
  jawabanBenar: "A"
}
```

## 🐛 Common Issues & Solutions

### Issue 1: Data tidak tersimpan setelah refresh
**Cause**: localStorage belum di-initialize
**Solution**: 
```javascript
// Check apakah data ada
localStorage.getItem('ujianList')

// Jika null, initialize manual:
import { initializeLocalStorage } from '@/lib/mockData'
initializeLocalStorage()
```

### Issue 2: Ujian tidak muncul di list
**Cause**: Data corrupt atau format salah
**Solution**:
```javascript
// Clear dan reset
localStorage.clear()
location.reload()
```

### Issue 3: Error saat tambah soal
**Cause**: ujianId tidak valid
**Solution**: Pastikan di halaman edit ujian yang valid

### Issue 4: Nomor soal tidak urut
**Cause**: Bug di re-numbering
**Solution**: Delete dan re-create soal, atau manual fix di console:
```javascript
let ujian = JSON.parse(localStorage.getItem('ujianList'))[0]
ujian.soal.forEach((s, idx) => s.nomor = idx + 1)
localStorage.setItem('ujianList', JSON.stringify([ujian]))
```

## ⚡ Performance Tips

1. **Minimize localStorage reads**: Load data once, store in state
2. **Debounce search**: Don't search on every keystroke
3. **Paginate large lists**: Current limit 7 items per page
4. **Lazy load images**: Use Next.js Image component

## 🎨 Styling Reference

### Colors
- Primary Purple: `#41366E`
- Delete Red: `#CD1F1F`
- Success Green: `#82962C`
- Error Red: `#D32F2F`
- Gray Border: `#E4E4E4`

### Fonts
- Heading: `font-heading` (Poppins)
- Body: `font-inter` (Inter)

### Common Classes
```css
/* Button Primary */
className="rounded-lg bg-[#41366E] px-6 py-3 text-white hover:bg-[#2f2752]"

/* Button Delete */
className="rounded-lg bg-[#CD1F1F] px-6 py-3 text-white hover:bg-[#b01919]"

/* Input */
className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#41366E]"

/* Card */
className="rounded-2xl border border-gray-200 bg-white p-8 shadow-md"
```

## 📱 Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px
- Max Width Container: 1400px

## 🔗 API Endpoints (Future Backend)

```typescript
// When implementing backend, replace:

GET    /api/ujian              → AdminUjianService.getAllUjian()
GET    /api/ujian/:id          → AdminUjianService.getUjianById(id)
POST   /api/ujian              → AdminUjianService.addUjian(data)
PUT    /api/ujian/:id          → AdminUjianService.updateUjian(id, data)
DELETE /api/ujian/:id          → AdminUjianService.deleteUjian(id)
DELETE /api/ujian/bulk         → AdminUjianService.deleteMultipleUjian(ids)

GET    /api/ujian/:id/soal     → Load from ujian.soal
POST   /api/ujian/:id/soal     → AdminUjianService.addSoal(id, data)
PUT    /api/soal/:id           → AdminUjianService.updateSoal(ujianId, id, data)
DELETE /api/soal/:id           → AdminUjianService.deleteSoal(ujianId, id)
```

## 🧪 Testing Checklist

- [ ] Login sebagai admin
- [ ] View list ujian
- [ ] Search ujian
- [ ] Pagination works
- [ ] Add ujian baru
- [ ] Edit ujian
- [ ] Delete ujian
- [ ] Bulk delete ujian
- [ ] View soal list
- [ ] Add soal baru
- [ ] Edit soal
- [ ] Delete soal
- [ ] Verify re-numbering
- [ ] Check alerts (success/error)
- [ ] Test empty states
- [ ] Test loading states
- [ ] Test error handling

---

**Pro Tip**: Gunakan React DevTools untuk inspect component state & props saat debugging!
