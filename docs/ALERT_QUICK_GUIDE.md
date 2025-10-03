# 🚨 Quick Guide: Alert Modal Component

## Testing Cepat

Jalankan dev server dan coba login dengan username berikut untuk melihat berbagai jenis alert:

```bash
npm run dev
```

Buka: `http://localhost:3000/login`

| Username | Alert yang Muncul |
|----------|-------------------|
| `salah` | ❌ **Error**: Username atau Password Salah |
| `belum` | ⚠️ **Warning**: Waktu Ujian Belum Dimulai |
| `sudah` | ℹ️ **Info**: Soal Sudah Dikerjakan |
| (apapun selain di atas) | ✅ **Success**: Login Berhasil + Timer |

Password: (isi apa saja)

---

## 4 Jenis Alert

### 1️⃣ Error (Merah)
```tsx
setAlert({
  isOpen: true,
  type: "error",
  title: "Error!",
  message: "Username atau Password Salah!",
});
```

### 2️⃣ Success (Hijau + Timer)
```tsx
setAlert({
  isOpen: true,
  type: "success",
  title: "Berhasil!",
  message: "Login berhasil! Ujian akan segera dimulai. Waktu Anda:",
  showTimer: true,
  timerText: "1 Jam 30 Menit",
  secondaryButtonText: "Kembali",
  onPrimaryClick: () => router.push("/exam"),
});
```

### 3️⃣ Warning (Orange)
```tsx
setAlert({
  isOpen: true,
  type: "warning",
  title: "Peringatan!",
  message: "Waktu Ujian Belum Dimulai",
});
```

### 4️⃣ Info (Ungu)
```tsx
setAlert({
  isOpen: true,
  type: "info",
  title: "Info!",
  message: "Anda Sudah Mengerjakan Soal!",
});
```

---

## File Locations

- **Component**: `src/components/ui/alert-modal.tsx`
- **Usage Example**: `src/app/(auth)/login/page.tsx`
- **Full Docs**: `docs/ALERT_MODAL.md`

---

## Screenshot Match

✅ Alert Error → Sesuai dengan screenshot error merah  
✅ Alert Success → Sesuai dengan screenshot berhasil (hijau + timer + 2 tombol)  
✅ Alert Warning → Sesuai dengan screenshot peringatan orange  
✅ Alert Info → Sesuai dengan screenshot info ungu  

Semua styling, warna, icon, dan layout sudah disesuaikan dengan desain yang Anda lampirkan! 🎨
