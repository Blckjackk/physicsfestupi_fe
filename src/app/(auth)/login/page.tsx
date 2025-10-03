// @ts-nocheck
"use client";

import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import AlertModal, { AlertType } from "@/components/ui/alert-modal";

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
      // Simulasi API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // ===== SIMULASI KONDISI LOGIN (Ganti dengan API response sesungguhnya) =====
      const loginStatus = simulateLoginCondition(username, password);

      switch (loginStatus) {
        case "error":
          // 1. Alert Error: Username atau Password Salah
          setAlert({
            isOpen: true,
            type: "error",
            title: "Error!",
            message: "Username atau Password Salah!",
            primaryButtonText: "Tutup",
          });
          break;

        case "success":
          // 2. Alert Success: Login Berhasil
          setAlert({
            isOpen: true,
            type: "success",
            title: "Berhasil!",
            message: "Login berhasil! Ujian akan segera dimulai. Waktu Anda:",
            showTimer: true,
            timerText: "1 Jam 30 Menit",
            primaryButtonText: "Lanjut",
            secondaryButtonText: "Kembali",
            onPrimaryClick: () => {
              setAlert({ ...alert, isOpen: false });
              router.push("/exam");
            },
          });
          break;

        case "warning":
          // 3. Alert Warning: Waktu Ujian Belum Dimulai
          setAlert({
            isOpen: true,
            type: "warning",
            title: "Peringatan!",
            message: "Waktu Ujian Belum Dimulai",
            primaryButtonText: "Tutup",
          });
          break;

        case "done":
          // 4. Alert Info: Soal Sudah Dikerjakan
          setAlert({
            isOpen: true,
            type: "info",
            title: "Info!",
            message: "Anda Sudah Mengerjakan Soal!",
            primaryButtonText: "Tutup",
          });
          break;

        default:
          break;
      }
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

  // ===== SIMULASI KONDISI LOGIN (Hapus setelah integrasi API) =====
  const simulateLoginCondition = (username: string, password: string) => {
    // Contoh logic untuk testing:
    if (username === "salah" || password === "salah") {
      return "error"; // Username/password salah
    } else if (username === "belum") {
      return "warning"; // Waktu ujian belum dimulai
    } else if (username === "sudah") {
      return "done"; // Soal sudah dikerjakan
    } else {
      return "success"; // Login berhasil
    }
  };

  const closeAlert = () => {
    setAlert({ ...alert, isOpen: false });
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-gradient-to-br from-[#7a5cb3] to-[#381f61] px-6 py-10 font-body text-[16px] text-[var(--white)] md:px-12 lg:px-20">
      {/* Logo + Text di pojok kiri atas */}
      <div className="absolute left-8 top-8 z-10 flex items-center gap-4 md:left-12 md:top-10 lg:left-20 lg:top-12">
        <Image
          src="/images/logo.png"
          alt="Logo Physics Fest UPI"
          width={72}
          height={72}
          className="h-14 w-14 select-none md:h-[72px] md:w-[72px]"
          priority
        />
        <span className="hidden font-heading text-[22px] font-bold tracking-tight text-white drop-shadow-lg md:inline-block">
          Physics Fest UPI 2025
        </span>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="mx-auto flex w-full max-w-[1440px] flex-1 items-center justify-center pt-24 md:pt-0">
        <div className="grid w-full grid-cols-1 items-center gap-16 lg:grid-cols-[58fr_42fr] lg:gap-20">
          {/* Left Column - Mascot */}
          <div className="order-2 flex items-center justify-center lg:order-1 lg:justify-start lg:pl-8">
            <div className="relative flex w-full max-w-[560px] justify-center lg:justify-start">
              <div className="absolute -inset-20 rounded-full bg-[radial-gradient(circle_at_center,_rgba(182,228,241,0.25),_rgba(139,111,196,0.15)_50%,_transparent_75%)] blur-2xl" />
              <Image
                src="/images/mascot.png"
                alt="Maskot Physics Fest UPI memegang tablet"
                width={560}
                height={560}
                className="relative z-[1] h-auto w-[380px] drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] sm:w-[460px] lg:w-[540px]"
                priority
              />
            </div>
          </div>

          {/* Right Column - Login Card */}
          <div className="order-1 flex w-full justify-center lg:order-2 lg:justify-end lg:pr-8">
            <div className="w-full max-w-[590px] min-h-[776px] rounded-[40px] bg-gradient-to-br from-[rgba(159,135,201,0.45)] via-[rgba(139,111,184,0.38)] to-[rgba(104,86,140,0.32)] p-10 shadow-[0_20px_60px_rgba(15,10,35,0.4),0_10px_30px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-lg sm:max-w-[590px] sm:p-12 lg:p-16">
              <div className="flex min-h-full flex-col justify-center gap-8">
                {/* Heading */}
                <div className="flex flex-col gap-3 text-left">
                  <h1 className="font-heading text-[44px] font-bold leading-[1.05] tracking-tight text-white drop-shadow-md sm:text-[48px] lg:text-[50px]">
                    Login Peserta
                  </h1>
                  <p className="font-body text-[16px] leading-relaxed text-[rgba(255,255,255,0.92)]">
                    Login menggunakan akun yang diberikan oleh panitia
                  </p>
                </div>

                {/* Error Alert */}
                {errors.form && (
                  <div className="rounded-xl border border-[rgba(253,164,175,0.3)] bg-[rgba(254,202,202,0.15)] px-4 py-3 text-[14px] leading-relaxed text-[#fecaca]">
                    {errors.form}
                  </div>
                )}

                {/* Form */}
                <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
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
                      className="w-full rounded-[10px] border-2 border-transparent bg-[#fefefe] px-5 py-[14px] font-body text-[16px] text-[#41366e] placeholder:text-[#9ca3af] shadow-sm transition-all focus:border-[#b6e4f1] focus:outline-none focus:ring-4 focus:ring-[rgba(182,228,241,0.25)]"
                    />
                    {errors.username && (
                      <p id="username-error" className="text-[13px] text-[#fca5a5]">
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
                        className="w-full rounded-[10px] border-2 border-transparent bg-[#fefefe] px-5 py-[14px] pr-14 font-body text-[16px] text-[#41366e] placeholder:text-[#9ca3af] shadow-sm transition-all focus:border-[#b6e4f1] focus:outline-none focus:ring-4 focus:ring-[rgba(182,228,241,0.25)]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                        aria-pressed={showPassword}
                        className="absolute inset-y-0 right-4 flex items-center text-[#41366e] transition hover:text-[#7a5cb3] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b6e4f1] focus-visible:ring-offset-2"
                      >
                        {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                      </button>
                    </div>
                    {errors.password && (
                      <p id="password-error" className="text-[13px] text-[#fca5a5]">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-3 flex w-full items-center justify-center rounded-[10px] bg-gradient-to-b from-[#7fa828] to-[#689220] px-6 py-[18px] font-heading text-[18px] font-semibold uppercase tracking-[0.02em] text-white shadow-[0_4px_14px_rgba(116,146,33,0.4),0_2px_6px_rgba(0,0,0,0.2)] transition-all duration-200 hover:translate-y-[-3px] hover:shadow-[0_8px_20px_rgba(116,146,33,0.5),0_4px_10px_rgba(0,0,0,0.25)] focus:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(127,168,40,0.5)] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 disabled:shadow-none"
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
      <footer className="relative z-10 mt-12 pb-6 text-center text-[15px] font-medium text-[rgba(255,255,255,0.85)]">
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
