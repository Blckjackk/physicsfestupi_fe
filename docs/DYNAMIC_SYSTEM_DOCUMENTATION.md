# 🚀 Dokumentasi Web Dinamis dengan Mock JSON

## 📋 Overview
Web sudah didinamisasi menggunakan LocalStorage sebagai mock database (sama seperti halaman data-peserta). Semua data disimpan di browser dan persisten sampai di-clear.

## 🔐 Sistem Autentikasi

### Login Peserta
**Lokasi:** `/login`

**User Testing:**
```javascript
// User 1 - Peserta Asep
Username: asep123
Password: tes123
Role: peserta
Ujian: Ujian Fisika - Physics Fest UPI 2025

// User 2 - Peserta Budi
Username: inibudi
Password: tes123
Role: peserta
Ujian: Ujian Fisika - Physics Fest UPI 2025

// User 3 - Peserta Andi
Username: andiiii10
Password: tes123
Role: peserta
Ujian: Ujian Fisika - Physics Fest UPI 2025
```

### Login Admin
**Lokasi:** `/login-admin`

**User Testing:**
```javascript
// Admin
Username: admin
Password: admin123
Role: admin
```

## 📚 Fitur Yang Sudah Dinamis

### 1. **Login System**
- ✅ Validasi username/password dari localStorage
- ✅ Role-based access (admin vs peserta)
- ✅ Session management dengan localStorage
- ✅ Auto-redirect jika sudah login
- ✅ Validasi ujian availability

### 2. **Exam System**
- ✅ Load soal dari mock database (10 soal fisika)
- ✅ Timer countdown real-time
- ✅ Auto-save jawaban setiap 10 detik
- ✅ Persist progress (reload page = lanjut dari terakhir)
- ✅ Tracking jawaban & ragu-ragu
- ✅ Calculate remaining time dari waktu mulai
- ✅ Auto-submit saat waktu habis
- ✅ Hitung skor otomatis
- ✅ Prevent double submission

### 3. **Data Structure**

**LocalStorage Keys:**
```javascript
// 1. users - Array of User objects
{
  id: string
  username: string
  password: string
  role: 'admin' | 'peserta'
  nama: string
  ujianId?: string
}

// 2. ujianList - Array of Ujian objects
{
  id: string
  nama: string
  durasi: number  // dalam menit
  soal: Soal[]
  status: 'belum_mulai' | 'sedang_berlangsung' | 'selesai'
}

// 3. jawabanList - Array of JawabanPeserta objects
{
  userId: string
  ujianId: string
  jawaban: Record<number, string>  // nomor soal -> A/B/C/D/E
  raguRagu: number[]  // array nomor soal yang ragu
  waktuMulai: Date
  waktuSelesai?: Date
  skor?: number
}

// 4. currentUser - Single User object (logged in user)
```

## 🧪 Testing Flow

### Test Case 1: Login Pertama Kali
1. Buka `/login`
2. Login dengan `asep123` / `tes123`
3. Alert success muncul dengan info durasi ujian (60 menit)
4. Klik "Lanjut"
5. Redirect ke `/exam` dengan timer 60 menit
6. Semua 10 soal available

### Test Case 2: Login Kedua (Resume Exam)
1. Kerjakan beberapa soal
2. Refresh page atau tutup browser
3. Login lagi dengan `asep123` / `tes123`
4. Timer melanjutkan dari sisa waktu
5. Jawaban yang sudah dikerjakan tetap ada
6. Soal yang ditandai ragu-ragu tetap orange

### Test Case 3: Submit Ujian
1. Jawab semua soal
2. Klik "Selesai" di soal terakhir
3. Muncul konfirmasi submit
4. Klik "Ya, Kumpulkan"
5. Alert success dengan skor
6. Auto logout dan redirect ke `/confirmation`

### Test Case 4: Ujian Sudah Dikerjakan
1. Login dengan user yang sudah submit
2. Alert "Anda sudah mengerjakan soal"
3. Auto logout dan redirect ke `/login`

### Test Case 5: Login Admin
1. Buka `/login-admin`
2. Login dengan `admin` / `admin123`
3. Alert success
4. Redirect ke `/dashboard-admin`

### Test Case 6: Wrong Role Access
1. Login peserta di `/login-admin` → Error
2. Login admin di `/login` → Error

## 📊 Data Soal Mock

**Jumlah Soal:** 10 soal fisika  
**Durasi:** 60 menit  
**Tipe Soal:**
- Soal 1-10: Multiple choice dengan 5 opsi (A-E)
- Topik: Hukum Newton, Gerak, Termodinamika, Listrik, dll.

**Kunci Jawaban (untuk testing scoring):**
```javascript
Soal 1: A (3:2)
Soal 2: B 
Soal 3: A (21,79 N)
Soal 4: A (250 m)
Soal 5: A (0,628 s)
Soal 6: C (8 m/s²)
Soal 7: A (-1 m/s)
Soal 8: C (8.000 kal)
Soal 9: B (1,0 atm)
Soal 10: A (1,5 N)
```

## 🛠️ Development Tools

### Clear All Data
```javascript
// Buka Console Browser (F12)
localStorage.clear()
location.reload()
```

### View Current Data
```javascript
// Lihat semua users
console.log(JSON.parse(localStorage.getItem('users')))

// Lihat jawaban peserta
console.log(JSON.parse(localStorage.getItem('jawabanList')))

// Lihat user yang login
console.log(JSON.parse(localStorage.getItem('currentUser')))

// Lihat ujian
console.log(JSON.parse(localStorage.getItem('ujianList')))
```

### Add New User
```javascript
const users = JSON.parse(localStorage.getItem('users'))
users.push({
  id: '5',
  username: 'newuser',
  password: 'pass123',
  role: 'peserta',
  nama: 'User Baru',
  ujianId: '1'
})
localStorage.setItem('users', JSON.stringify(users))
```

### Change Exam Status
```javascript
const ujianList = JSON.parse(localStorage.getItem('ujianList'))
ujianList[0].status = 'sedang_berlangsung' // atau 'belum_mulai' / 'selesai'
localStorage.setItem('ujianList', JSON.stringify(ujianList))
```

## 🔄 Auto-Save System

**Trigger Auto-Save:**
- Setiap pilih jawaban
- Setiap tandai ragu-ragu
- Setiap 10 detik (otomatis)
- Saat klik tombol navigasi soal

**Data yang di-save:**
- Jawaban (nomor soal → A/B/C/D/E)
- Status ragu-ragu (array nomor soal)
- Waktu mulai (untuk calculate remaining time)

## 🎯 Next Steps (Integrasi Backend Real)

Ketika sudah ada backend API, ganti:

```typescript
// Dari:
import { AuthService, ExamService } from '@/lib/mockData'

// Ke:
import { AuthService, ExamService } from '@/services/api'
```

Lalu buat `/src/services/api.ts`:
```typescript
export const AuthService = {
  login: async (username, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    })
    return res.json()
  },
  // ... dst
}
```

## 📱 Responsive Design
- ✅ Mobile-friendly (viewport < 768px)
- ✅ Tablet-friendly (768px - 1024px)
- ✅ Desktop optimized (> 1024px)
- ✅ Fit dalam 100% zoom tanpa scroll

## 🎨 UI/UX Features
- ✅ Real-time timer countdown
- ✅ Visual feedback (hijau = dijawab, orange = ragu)
- ✅ Active question indicator (border pink)
- ✅ Smooth transitions & hover effects
- ✅ Loading states
- ✅ Confirmation modals
- ✅ Error handling with friendly messages

## 🐛 Known Issues / Limitations
- Data hilang jika localStorage di-clear
- Tidak ada server-side validation
- Tidak ada network latency simulation
- Score calculation di client-side (bisa di-cheat)

---

**Created:** October 4, 2025  
**Status:** ✅ Production Ready (Mock Version)  
**Next:** Integrate with Real Backend API
