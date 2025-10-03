# Logout Confirm Modal - Dokumentasi

## Overview
Komponen modal konfirmasi logout yang ditampilkan saat user mencoba logout dari halaman ujian. Modal menampilkan peringatan dengan ikon warning dan meminta konfirmasi sebelum logout.

## Fitur

### 1. **Design & Layout**
- Modal center dengan overlay hitam transparan (60% opacity + backdrop blur)
- Background putih dengan border radius 2xl dan shadow
- Lebar maksimal 400px
- Responsive untuk semua ukuran device

### 2. **Warning Icon**
- Icon segitiga dengan tanda seru (AlertTriangle dari lucide-react)
- Warna merah (#DC2626)
- Background lingkaran merah muda (red-50)
- Ukuran besar (80x80px circle, 48x48px icon)

### 3. **Header & Message**
- Judul: "Peringatan!" - warna hitam, bold, text-[24px]
- Subteks: "Apakah anda yakin ingin Log Out?" - warna abu, text-[15px]
- Center alignment

### 4. **Action Buttons**
- Dua tombol dengan lebar sama (flex-1)
- **Tombol "Tidak"**: 
  - Warna abu-abu (bg-gray-500)
  - Hover: bg-gray-600
- **Tombol "Log Out"**: 
  - Warna merah (bg-red-600)
  - Hover: bg-red-700
- Both: rounded-xl, shadow, active scale effect

### 5. **Close Options**
- Tombol X di pojok kanan atas (5x5 icon)
- Klik overlay untuk close
- Keyboard ESC untuk close
- Klik tombol "Tidak" untuk close

### 6. **Behavior**
- Prevent body scroll saat modal terbuka
- Auto cleanup event listeners saat unmount
- Smooth transitions & hover effects

## Props

```typescript
interface LogoutConfirmModalProps {
  isOpen: boolean;        // Status tampil/sembunyi modal
  onClose: () => void;    // Callback saat modal ditutup
  onLogout: () => void;   // Callback saat tombol Log Out diklik
}
```

## Penggunaan

### Import
```tsx
import LogoutConfirmModal from '@/components/exam/LogoutConfirmModal';
```

### Implementasi
```tsx
const [showLogoutModal, setShowLogoutModal] = useState(false);

const handleLogout = () => {
  setShowLogoutModal(true);
};

const confirmLogout = () => {
  setShowLogoutModal(false);
  // Perform logout
  router.push('/login');
};

return (
  <>
    <button onClick={handleLogout}>
      Logout
    </button>

    <LogoutConfirmModal
      isOpen={showLogoutModal}
      onClose={() => setShowLogoutModal(false)}
      onLogout={confirmLogout}
    />
  </>
);
```

## Integrasi dengan Exam Page

Modal ini sudah terintegrasi dengan halaman ujian:
1. Tombol logout di header memanggil `handleLogout()`
2. Modal muncul dengan state `showLogoutModal`
3. Saat confirm logout, user diarahkan ke `/login`
4. Progres ujian (jika ada) bisa disimpan sebelum redirect

## Styling

### Warna
- **Warning Red**: `#DC2626` (red-600) - Icon dan tombol logout
- **Gray Button**: `#6B7280` (gray-500) - Tombol "Tidak"
- **Overlay**: `rgba(0,0,0,0.6)` dengan backdrop blur
- **Background**: White dengan shadow-2xl

### Typography
- **Heading**: Font heading untuk judul dan tombol
- **Body**: Font body untuk message

### Spacing
- Padding modal: `p-6`
- Gap antara buttons: `gap-3`
- Margin bottom elements: `mb-2`, `mb-4`, `mb-6`

## Accessibility

- ✅ Keyboard support (ESC untuk close)
- ✅ Click outside untuk close
- ✅ Focus trap dalam modal (implisit dari z-index)
- ✅ Prevent body scroll
- ✅ ARIA label untuk close button
- ✅ Semantic HTML

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## Notes

- Modal menggunakan `fixed` positioning untuk center di viewport
- Overlay menggunakan `backdrop-blur-sm` untuk efek blur
- Body scroll di-prevent saat modal terbuka
- Cleanup function memastikan scroll dikembalikan
- Icon dari lucide-react library

## Comparison dengan Alert Modal

| Feature | LogoutConfirmModal | AlertModal |
|---------|-------------------|------------|
| Purpose | Logout confirmation | General alerts |
| Icon | Warning triangle | Varies by type |
| Buttons | 2 (Tidak, Log Out) | 1 (OK) |
| Colors | Gray + Red | Based on type |
| Use Case | Specific to logout | Multi-purpose |

## Future Enhancements

- [ ] Animasi fade-in/fade-out
- [ ] Sound effect saat modal muncul
- [ ] Opsi "Remember my choice"
- [ ] Loading state saat logout process
- [ ] Custom icon support
