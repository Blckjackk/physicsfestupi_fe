// @ts-nocheck
"use client";

import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AlertModal, { AlertType } from "@/components/ui/alert-modal";
import { AuthService, ExamService, initializeLocalStorage } from "@/lib/mockData";

type FieldErrors = {
  username?: string;
  password?: string;
  form?: string;
};

type AlertState = {
  isOpen: boolean;
  type: AlertType;
  title: string;
  message: string;
  showTimer?: boolean;
  timerText?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryClick?: () => void;
};

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState<AlertState>({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });

  // Initialize localStorage on mount
  useEffect(() => {
    initializeLocalStorage();
    
    // Redirect jika sudah login
    if (AuthService.isAuthenticated()) {
      const user = AuthService.getCurrentUser();
      if (user?.role === 'peserta') {
        router.push('/exam');
      } else if (user?.role === 'admin') {
        router.push('/dashboard-admin');
      }
    }
  }, [router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: FieldErrors = {};

    if (!username.trim()) {
      nextErrors.username = "Username wajib diisi.";
    }
    if (!password.trim()) {
      nextErrors.password = "Password wajib diisi.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      // Simulasi API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Coba login menggunakan mock data
      const user = AuthService.login(username, password);

      if (!user) {
        // 1. Alert Error: Username atau Password Salah
        setAlert({
          isOpen: true,
          type: "error",
          title: "Error!",
          message: "Username atau Password Salah!",
          primaryButtonText: "Tutup",
        });
        return;
      }

      // Cek role user
      if (user.role !== 'peserta') {
        setAlert({
          isOpen: true,
          type: "error",
          title: "Error!",
          message: "Halaman ini hanya untuk peserta. Silakan gunakan halaman login admin.",
          primaryButtonText: "Tutup",
        });
        AuthService.logout();
        return;
      }

      // Cek apakah user punya ujian
      if (!user.ujianId) {
        setAlert({
          isOpen: true,
          type: "warning",
          title: "Peringatan",
          message: "Anda belum terdaftar dalam ujian manapun.",
          primaryButtonText: "Tutup",
        });
        AuthService.logout();
        return;
      }

      // Get ujian data
      const ujian = ExamService.getUjian(user.ujianId);
      
      if (!ujian) {
        setAlert({
          isOpen: true,
          type: "error",
          title: "Error!",
          message: "Data ujian tidak ditemukan.",
          primaryButtonText: "Tutup",
        });
        AuthService.logout();
        return;
      }

      // Cek status ujian
      if (ujian.status === 'belum_mulai') {
        setAlert({
          isOpen: true,
          type: "warning",
          title: "Peringatan",
          message: "Waktu Ujian Belum Dimulai",
          primaryButtonText: "Tutup",
        });
        AuthService.logout();
        return;
      }

      if (ujian.status === 'selesai') {
        setAlert({
          isOpen: true,
          type: "info",
          title: "Info",
          message: "Waktu ujian telah berakhir.",
          primaryButtonText: "Tutup",
        });
        AuthService.logout();
        return;
      }

      // Cek apakah sudah mengerjakan
      const existingJawaban = ExamService.getJawaban(user.id, ujian.id);
      if (existingJawaban && existingJawaban.waktuSelesai) {
        setAlert({
          isOpen: true,
          type: "info",
          title: "Info",
          message: "Anda Sudah Mengerjakan Soal!",
          primaryButtonText: "Tutup",
        });
        AuthService.logout();
        return;
      }

      // 2. Alert Success: Login Berhasil
      const durasiJam = Math.floor(ujian.durasi / 60);
      const durasiMenit = ujian.durasi % 60;
      const waktuText = durasiJam > 0 
        ? `${durasiJam} Jam ${durasiMenit > 0 ? durasiMenit + ' Menit' : ''}` 
        : `${durasiMenit} Menit`;

      setAlert({
        isOpen: true,
        type: "success",
        title: "Berhasil",
        message: `Selamat datang ${user.nama || user.username}! Ujian akan segera dimulai. Waktu Anda:`,
        showTimer: true,
        timerText: waktuText,
        primaryButtonText: "Lanjut",
        secondaryButtonText: "Kembali",
        onPrimaryClick: () => {
          setAlert({ ...alert, isOpen: false });
          router.push("/exam");
        },
      });

    } catch (error) {
      console.error('Login error:', error);
      setAlert({
        isOpen: true,
        type: "error",
        title: "Error!",
        message: "Terjadi kesalahan. Silakan coba lagi.",
        primaryButtonText: "Tutup",
      });
      AuthService.logout();
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeAlert = () => {
    setAlert({ ...alert, isOpen: false });
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-gradient-to-b from-[#7A5CB3] to-[#381F61] px-6 py-6 font-body md:px-20">
      {/* Logo + Text di pojok kiri atas */}
      <div className="absolute left-8 top-6 z-10 flex items-center gap-3 md:left-20">
        <Image
          src="/images/logo.png"
          alt="Logo Physics Fest UPI"
          width={48}
          height={48}
          className="h-12 w-12 select-none rounded-full"
          priority
        />
        <span className="font-heading text-[18px] font-bold text-white">
          Physics Fest UPI 2025
        </span>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="flex flex-1 items-center justify-center pt-20 md:pt-0">
        <div className="flex w-full max-w-[1200px] items-center justify-center gap-16">
          {/* Left Column - Mascot (hidden on mobile) */}
          <div className="hidden items-center justify-center md:flex">
            <Image
              src="/images/mascot.png"
              alt="Maskot Physics Fest UPI"
              width={420}
              height={420}
              className="h-[420px] w-auto drop-shadow-2xl"
              priority
            />
          </div>

          {/* Right Column - Login Card */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-[380px] rounded-xl bg-white/10 px-8 py-20 shadow-2xl backdrop-blur-md">
              <div className="flex flex-col gap-10">
                {/* Heading */}
                <div className="flex flex-col gap-3 text-left">
                  <h1 className="font-heading text-3xl font-bold text-white">
                    Login Peserta
                  </h1>
                  <p className="text-base text-gray-300">
                    Login menggunakan akun yang diberikan oleh panitia
                  </p>
                </div>

                {/* Error Alert */}
                {errors.form && (
                  <div className="rounded-lg border border-red-300 bg-red-100/10 px-4 py-2 text-xs text-red-200">
                    {errors.form}
                  </div>
                )}

                {/* Form */}
                <form className="flex flex-col gap-8" onSubmit={handleSubmit} noValidate>
                  {/* Username Input */}
                  <div className="flex flex-col gap-2 text-left">
                    <label htmlFor="username" className="sr-only">
                      Username
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      aria-invalid={Boolean(errors.username)}
                      aria-describedby={errors.username ? "username-error" : undefined}
                      className="w-full rounded-lg border border-[#ddd] bg-white px-5 py-3 text-base text-gray-800 placeholder:text-[#aaa] transition-all focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
                    />
                    {errors.username && (
                      <p id="username-error" className="text-xs text-red-300">
                        {errors.username}
                      </p>
                    )}
                  </div>

                  {/* Password Input */}
                  <div className="flex flex-col gap-2 text-left">
                    <label htmlFor="password" className="sr-only">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        aria-invalid={Boolean(errors.password)}
                        aria-describedby={errors.password ? "password-error" : undefined}
                        className="w-full rounded-lg border border-[#ddd] bg-white px-5 py-3 pr-12 text-base text-gray-800 placeholder:text-[#aaa] transition-all focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                        aria-pressed={showPassword}
                        className="absolute inset-y-0 right-3 flex items-center text-gray-500 transition hover:text-gray-700 focus:outline-none"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.password && (
                      <p id="password-error" className="text-xs text-red-300">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-4 flex h-12 w-full items-center justify-center rounded-lg bg-gradient-to-b from-[#7CB342] to-[#689F38] font-body text-base font-medium text-white shadow-md transition-all hover:from-[#689F38] hover:to-[#558B2F] focus:outline-none focus:ring-2 focus:ring-green-300 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? "Memproses..." : "Log in"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center text-xs text-white/70">
        © Physics Fest UPI 2025. All rights reserved
      </footer>

      {/* Alert Modal */}
      <AlertModal
        isOpen={alert.isOpen}
        onClose={closeAlert}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        showTimer={alert.showTimer}
        timerText={alert.timerText}
        primaryButtonText={alert.primaryButtonText}
        secondaryButtonText={alert.secondaryButtonText}
        onPrimaryClick={alert.onPrimaryClick}
        onSecondaryClick={closeAlert}
      />
    </div>
  );
}
