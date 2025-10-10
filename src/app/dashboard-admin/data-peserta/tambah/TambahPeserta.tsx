"use client"

import * as React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface UjianOption {
  ujian_id: number;
  nama_ujian: string;
}

interface TambahPesertaProps {
  onTambah: (data: { username: string; password: string; ujian_id: number; }) => Promise<boolean>;
}

export default function TambahPeserta({ onTambah }: TambahPesertaProps) {
  // 1. State untuk mengontrol kedua dialog
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = React.useState(false);
  const [isFailOpen, setIsFailOpen] = React.useState(false);

  // State untuk data dari form
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [selectedUjianId, setSelectedUjianId] = React.useState<number | null>(null);

  // State untuk menampung daftar ujian dari API
  const [ujianOptions, setUjianOptions] = React.useState<UjianOption[]>([]);
  const [isLoadingUjian, setIsLoadingUjian] = React.useState(false);

  // Ambil daftar ujian saat dialog pertama kali akan dibuka
  React.useEffect(() => {
    if (isFormOpen) {
      setIsLoadingUjian(true);
      const fetchUjianOptions = async () => {
        try {
          const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
          const response = await fetch(`${apiBaseUrl}/admin/ujian`); // Asumsi endpoint ini ada
          const result = await response.json();
          if (result.success) {
            setUjianOptions(result.data.ujian_dashboard || []);
          }
        } catch (error) {
          // Gagal mengambil daftar ujian
        } finally {
          setIsLoadingUjian(false);
        }
      };
      fetchUjianOptions();
    }
  }, [isFormOpen]); // Jalankan setiap kali dialog dibuka

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!username.trim() || password.length < 6 || !selectedUjianId) {
      if (!username.trim()) {
        alert("Username tidak boleh kosong.");
      } else if (password.length < 6) {
        alert("Password harus terdiri dari minimal 6 karakter.");
      } else if (!selectedUjianId) {
        alert("Harap pilih tipe ujian.");
      }
      return;
    }

    const formData = {
      username,
      password,
      ujian_id: selectedUjianId
    };

    const success = await onTambah(formData);
    // Cek hasilnya
    if (success) {
      // Jika berhasil, tampilkan dialog sukses
      setIsFormOpen(false);
      setIsSuccessOpen(true);
      // Reset form
      setUsername("");
      setPassword("");
      setSelectedUjianId(null);
    } else {
      // Jika gagal, tampilkan dialog gagal
      // Biarkan form tetap terbuka agar pengguna bisa memperbaiki
      setIsFormOpen(false); // Tutup form tambah
      setIsFailOpen(true); // Buka dialog gagal
    }
  };

  return (
    <>
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogTrigger asChild>
          <Button className='bg-[#41366E] mt-8 rounded-[10px] text-base font-heading font-bold py-6' size={"lg"}>
            <Image
              src="/images/tambah-peserta.png"
              alt="Simbol Tambah Peserta"
              width={24}
              height={24}
            />
            <span>Tambah Peserta</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="font-heading bg-white sm:max-w-[425px]" onOpenAutoFocus={(e) => e.preventDefault()}>
          <form onSubmit={handleSubmit}>
            <DialogHeader className="flex items-center justify-center">
              <DialogTitle className="text-[#41366E] text-xl font-bold">Tambah Peserta</DialogTitle>
              <DialogDescription className="text-base text-black font-medium">
                Silahkan Isi Data Peserta
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label className="text-black" htmlFor="username-1">Username</Label>
                <Input className="text-black" id="username-1" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div className="grid gap-3">
                <Label className="text-black" htmlFor="password-1">Password</Label>
                <Input className="text-black" id="password-1" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="grid gap-3 text-black">
                <Label className="text-black" htmlFor="ujian-1">Ujian</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="w-full justify-start" variant="outline" disabled={isLoadingUjian}>
                      {isLoadingUjian
                        ? "Memuat ujian..."
                        : selectedUjianId
                          // 2. Perbaiki find agar menggunakan ujian_id
                          ? ujianOptions.find(u => u.ujian_id === selectedUjianId)?.nama_ujian
                          : "Pilih Tipe Ujian"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 text-black bg-white">
                    <DropdownMenuLabel>Pilih Tipe</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={selectedUjianId?.toString()} onValueChange={(value) => setSelectedUjianId(Number(value))}>
                      {ujianOptions.map((ujian) => (
                        <DropdownMenuRadioItem key={ujian.ujian_id} value={ujian.ujian_id.toString()}>
                          {ujian.nama_ujian}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <DialogFooter className="grid grid-cols-2 gap-4 mt-4">
              <DialogClose asChild>
                <Button className="w-full text-white bg-[#565656]" variant="outline">
                  Kembali
                </Button>
              </DialogClose>
              <Button className="w-full bg-[#7A5CB3] text-white" type="submit">
                Tambah
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog >

      <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
        <DialogContent className="font-heading bg-white sm:max-w-[425px]">
          <DialogHeader className="flex items-center justify-center">
            <DialogTitle className="text-black text-xl font-semibold text-center">
              <Image
                src="/images/berhasil.png"
                alt="Logo Berhasil"
                width={80}
                height={80}
                priority
              />
              <div className="mt-2">Berhasil</div>
            </DialogTitle>
            <DialogDescription className="text-base text-black font-medium">
              Berhasil Tambah Peserta
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="grid grid-cols-1 gap-4">
            <DialogClose asChild>
              <Button className="w-full text-white bg-[#749221]" variant="outline">
                Tutup
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog >

      <Dialog open={isFailOpen} onOpenChange={setIsFailOpen}>
        <DialogContent className="font-heading bg-white sm:max-w-[425px]">
          <DialogHeader className="flex items-center justify-center">
            <DialogTitle className="text-black text-xl font-semibold text-center">
              <Image
                src="/images/gagal.png"
                alt="Logo Gagal"
                width={80}
                height={80}
                priority
              />
              <div className="mt-2">Error!</div>
            </DialogTitle>
            <DialogDescription className="text-base text-black font-medium">
              Gagal Tambah Peserta
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="grid grid-cols-1 gap-4">
            <DialogClose asChild>
              <Button className="w-full text-white bg-[#CD1F1F]" variant="outline">
                Tutup
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog >
    </>

  )
}
