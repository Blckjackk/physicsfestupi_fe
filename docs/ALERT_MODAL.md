# Alert Modal Component - Dokumentasi

Komponen alert modal yang reusable untuk menampilkan berbagai jenis notifikasi pada aplikasi CBT Physics Fest UPI 2025.

## 📁 Lokasi File

- **Komponen**: `src/components/ui/alert-modal.tsx`
- **Implementasi**: `src/app/(auth)/login/page.tsx`

## 🎨 Jenis Alert

### 1. **Error Alert** (Merah)
Digunakan untuk menampilkan error login atau kesalahan lainnya.
```tsx
{
  type: "error",
  title: "Error!",
  message: "Username atau Password Salah!",
  primaryButtonText: "Tutup"
}
```

### 2. **Success Alert** (Hijau/Ungu)
Digunakan untuk menampilkan login berhasil dengan informasi waktu ujian.
```tsx
{
  type: "success",
  title: "Berhasil!",
  message: "Login berhasil! Ujian akan segera dimulai. Waktu Anda:",
  showTimer: true,
  timerText: "1 Jam 30 Menit",
  primaryButtonText: "Lanjut",
  secondaryButtonText: "Kembali"
}
```

### 3. **Warning Alert** (Orange)
Digunakan untuk peringatan waktu ujian belum dimulai atau sudah selesai.
```tsx
{
  type: "warning",
  title: "Peringatan!",
  message: "Waktu Ujian Belum Dimulai",
  primaryButtonText: "Tutup"
}
```

### 4. **Info Alert** (Ungu)
Digunakan untuk informasi bahwa soal sudah dikerjakan.
```tsx
{
  type: "info",
  title: "Info!",
  message: "Anda Sudah Mengerjakan Soal!",
  primaryButtonText: "Tutup"
}
```

## 🚀 Cara Menggunakan

### 1. Import Komponen
```tsx
import AlertModal, { AlertType } from "@/components/ui/alert-modal";
```

### 2. Setup State
```tsx
const [alert, setAlert] = useState({
  isOpen: false,
  type: "info" as AlertType,
  title: "",
  message: "",
});
```

### 3. Tampilkan Alert
```tsx
// Contoh: Tampilkan error alert
setAlert({
  isOpen: true,
  type: "error",
  title: "Error!",
  message: "Username atau Password Salah!",
  primaryButtonText: "Tutup",
});
```

### 4. Render Komponen
```tsx
<AlertModal
  isOpen={alert.isOpen}
  onClose={() => setAlert({ ...alert, isOpen: false })}
  type={alert.type}
  title={alert.title}
  message={alert.message}
  primaryButtonText={alert.primaryButtonText}
/>
```

## 📝 Props API

| Prop | Type | Required | Default | Deskripsi |
|------|------|----------|---------|-----------|
| `isOpen` | `boolean` | ✅ | - | Kontrol tampil/tutup modal |
| `onClose` | `() => void` | ✅ | - | Fungsi untuk menutup modal |
| `type` | `"error" \| "success" \| "warning" \| "info"` | ✅ | - | Jenis alert (menentukan warna & icon) |
| `title` | `string` | ✅ | - | Judul alert |
| `message` | `string` | ✅ | - | Pesan utama alert |
| `showTimer` | `boolean` | ❌ | `false` | Tampilkan box timer (untuk success) |
| `timerText` | `string` | ❌ | - | Teks waktu (e.g., "1 Jam 30 Menit") |
| `primaryButtonText` | `string` | ❌ | `"Tutup"` | Teks tombol utama |
| `secondaryButtonText` | `string` | ❌ | - | Teks tombol kedua (opsional) |
| `onPrimaryClick` | `() => void` | ❌ | `onClose` | Handler klik tombol utama |
| `onSecondaryClick` | `() => void` | ❌ | `onClose` | Handler klik tombol kedua |

## 🧪 Testing Simulasi Login

Pada halaman login saat ini, terdapat **simulasi kondisi** untuk testing:

| Username | Password | Hasil |
|----------|----------|-------|
| `salah` | (apapun) | ❌ Error Alert |
| `belum` | (apapun) | ⚠️ Warning Alert (ujian belum dimulai) |
| `sudah` | (apapun) | ℹ️ Info Alert (soal sudah dikerjakan) |
| (lainnya) | (apapun) | ✅ Success Alert |

**Cara testing:**
1. Jalankan `npm run dev`
2. Buka `http://localhost:3000/login`
3. Coba login dengan username di atas
4. Lihat alert yang muncul

## 🔗 Integrasi dengan API Backend

Hapus fungsi `simulateLoginCondition` dan ganti dengan API call sesungguhnya:

```tsx
const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  
  // Validasi form...
  
  setIsSubmitting(true);
  
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    
    // Tampilkan alert berdasarkan response
    if (data.status === "success") {
      setAlert({
        isOpen: true,
        type: "success",
        title: "Berhasil!",
        message: "Login berhasil! Ujian akan segera dimulai. Waktu Anda:",
        showTimer: true,
        timerText: data.examDuration, // dari API
        primaryButtonText: "Lanjut",
        secondaryButtonText: "Kembali",
        onPrimaryClick: () => router.push("/exam"),
      });
    } else if (data.status === "exam_not_started") {
      setAlert({
        isOpen: true,
        type: "warning",
        title: "Peringatan!",
        message: "Waktu Ujian Belum Dimulai",
        primaryButtonText: "Tutup",
      });
    }
    // dst...
    
  } catch (error) {
    setAlert({
      isOpen: true,
      type: "error",
      title: "Error!",
      message: "Terjadi kesalahan. Silakan coba lagi.",
      primaryButtonText: "Tutup",
    });
  } finally {
    setIsSubmitting(false);
  }
};
```

## ✨ Fitur Tambahan

- ✅ **Responsive**: Otomatis menyesuaikan ukuran layar
- ✅ **Accessible**: Support keyboard (ESC to close), ARIA labels
- ✅ **Animation**: Smooth fade-in & zoom-in animation
- ✅ **Backdrop blur**: Efek blur pada background
- ✅ **Click outside**: Klik di luar modal untuk menutup
- ✅ **Body scroll lock**: Mencegah scroll saat modal terbuka

## 🎨 Customization

Jika perlu mengubah warna atau style, edit konfigurasi di `alertConfig`:

```tsx
const alertConfig = {
  error: {
    icon: AlertCircle,
    iconBgColor: "bg-red-100",      // Background icon
    iconColor: "text-red-600",      // Warna icon
    buttonBgColor: "bg-red-600 hover:bg-red-700",  // Warna tombol
    borderColor: "border-red-200",  // Border modal
  },
  // ... konfigurasi lainnya
};
```

---

**Dibuat untuk**: Physics Fest UPI 2025 - CBT Application  
**Tech Stack**: Next.js 15 + React 19 + Tailwind CSS + TypeScript
