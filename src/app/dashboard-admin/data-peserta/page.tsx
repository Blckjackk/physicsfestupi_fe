"use client"

import * as React from "react"


import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Pencil, Search, Trash } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox"

import Sidebar from '@/components/dashboard-admin/Sidebar';
import StatistikPeserta from '@/components/dashboard-admin/StatistikPeserta';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
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

import { TambahPeserta } from "./tambah/page";
import { EditPeserta } from "./edit/page";
import { HapusPeserta } from "./hapus/page";
import Image from "next/image";

type Checked = DropdownMenuCheckboxItemProps["checked"]

// Definisikan tipe data untuk satu peserta
export interface Peserta {
    id: string;
    no: number;
    username: string;
    password_hash?: string; // Password mungkin tidak selalu ada dari API
    ujian: string;
    status: string;
}

export type PesertaUpdatePayload = {
    username: string;
    password?: string; // Dibuat opsional jika password tidak selalu diubah
    ujian_id: number;
};

export default function DashboardPage() {
    const [peserta, setPeserta] = React.useState<Peserta[]>([]);
    const [isLoading, setIsLoading] = React.useState(true); // State untuk loading
    const [error, setError] = React.useState<string | null>(null); // State untuk error

    React.useEffect(() => {
        const fetchPeserta = async () => {
            try {
                const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
                const response = await fetch(`${apiBaseUrl}/api/admin/peserta`);

                if (!response.ok) {
                    throw new Error('Gagal mengambil data peserta dari server');
                }

                const result = await response.json();
                console.log('Response from API:', result); // Debugging log

                if (result.success) {
                    setPeserta(result.data); // Simpan data dari API ke state
                } else {
                    throw new Error(result.message || 'Gagal memuat data peserta');
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false); // Hentikan loading, baik berhasil maupun gagal
            }
        };

        fetchPeserta();
    }, []); // Array kosong berarti efek ini hanya berjalan sekali

    // State buat nyimpen ID baris dari data yang terpilih (yang dicentang)
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showStatusBar, setShowStatusBar] = React.useState<Checked>(true)
    const [showActivityBar, setShowActivityBar] = React.useState<Checked>(true)
    const [showPanel, setShowPanel] = React.useState<Checked>(true)

    const activeStatuses: string[] = [];
    if (showPanel) activeStatuses.push('Belum Login');
    if (showStatusBar) activeStatuses.push('Sedang Ujian');
    if (showActivityBar) activeStatuses.push('Sudah Submit');

    // Gabungkan filter pencarian dan filter status
    const filteredData = peserta.filter(item => {
        // Cek apakah username cocok dengan pencarian (jika ada)
        const matchesSearch = item.username.toLowerCase().includes(searchQuery.toLowerCase());

        // Cek apakah status item ada di dalam daftar status yang aktif
        const matchesStatus = activeStatuses.includes(item.status);

        // Tampilkan baris hanya jika kedua kondisi terpenuhi
        return matchesSearch && matchesStatus;
    });

    // Ref buat checkbox di header (untuk state indeterminate)
    const headerCheckboxRef = useRef<HTMLButtonElement>(null);

    // Ngitung jumlah baris yg kepilih dan total baris dari data asli
    const numSelected = selectedRows.length;
    const rowCount = filteredData.length;

    // Efek buat ngatur state indeterminate pada checkbox header
    useEffect(() => {
        if (headerCheckboxRef.current) {
            headerCheckboxRef.current.dataset.state =
                numSelected > 0 && numSelected < rowCount ? 'indeterminate' :
                    numSelected === rowCount ? 'checked' : 'unchecked';
        }
    }, [selectedRows, rowCount, numSelected]);

    // Fungsi buat kasus klik "select all" di header table
    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            // Ambil ID hanya dari data yang sedang ditampilkan (sudah terfilter)
            const allRowIds = filteredData.map((row) => row.id);
            setSelectedRows(allRowIds);
        } else {
            setSelectedRows([]);
        }
    };

    // Fungsi buat kasus klik checkbox di setiap baris
    const handleSelectRow = (rowId: string, checked: boolean) => {
        if (checked) {
            setSelectedRows((prev) => [...prev, rowId]);
        } else {
            setSelectedRows((prev) => prev.filter((id) => id !== rowId));
        }
    };

    const handleTambahPeserta = async (formData: { username: string; password: string; ujian_id: number }) => {
        try {
            const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

            const response = await fetch(`${apiBaseUrl}/api/admin/peserta`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok) {
                // Cek jika ada error validasi dari Laravel
                if (response.status === 422) {
                    // Ambil pesan error pertama
                    const errors = result.errors;
                    // Beri tahu TypeScript bahwa 'errors' adalah objek dengan key string dan value array of string
                    const errorMessages = Object.values(errors as Record<string, string[]>);

                    // Gunakan optional chaining (?.) untuk keamanan jika tidak ada error
                    const firstError = errorMessages[0]?.[0];

                    throw new Error(firstError || 'Data yang dimasukkan tidak valid.');
                }
                throw new Error(result.message || 'Gagal menambahkan peserta.');
            }

            // console.log('Success Response Body:', result);

            // Jika berhasil, tambahkan data baru dari server ke state 'peserta'
            // Ini lebih baik daripada menambah data mentah dari form
            const newPesertaFromServer = result.data.peserta;
            const assignedUjian = result.data.ujian_assigned;

            // Kita perlu membuat format data baru agar sesuai dengan state 'peserta'
            const formattedNewPeserta: Peserta = {
                id: newPesertaFromServer.id.toString(),
                no: peserta.length + 1, // Ini mungkin perlu disesuaikan jika ada paginasi
                username: newPesertaFromServer.username,
                password_hash: formData.password,
                ujian: assignedUjian.nama_ujian,
                status: 'Belum Login', // Sesuai dengan status awal dari API
            };

            setPeserta(prevPeserta => [formattedNewPeserta, ...prevPeserta]);
            return true;

        } catch (error: any) {
            // console.error('Error:', error);
            // alert(`Gagal: ${error.message}`);
            return false;
        }
    };

    const handleEditPeserta = async (pesertaId: string, dataUpdate: PesertaUpdatePayload): Promise<boolean> => {
        try {
            // Hanya kirim password jika diisi (tidak kosong)
            const payload = { ...dataUpdate };
            if (!payload.password) {
                delete payload.password;
            }

            console.log('Payload to be sent:', payload);

            const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
            console.log(payload);
            const response = await fetch(`${apiBaseUrl}/api/admin/peserta/${pesertaId}`, {
                method: 'PUT', // Gunakan method PUT
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (!response.ok) {
                if (response.status === 422) {
                    const errors = result.errors;
                    const errorMessages = Object.values(errors as Record<string, string[]>);
                    const firstError = errorMessages[0]?.[0];
                    throw new Error(firstError || 'Data yang dimasukkan tidak valid.');
                }
                throw new Error(result.message || 'Gagal mengupdate peserta.');
            }

            // Ambil nama ujian dari response server
            const updatedUjianNama = result.data?.ujian_assigned?.nama_ujian || 'Tidak diketahui';


            // Jika sukses, update data di state frontend
            setPeserta(prevPeserta =>
                prevPeserta.map(p => {
                    if (p.id === pesertaId) {
                        return {
                            ...p,
                            username: dataUpdate.username,
                            password_hash: dataUpdate.password ? dataUpdate.password : p.password_hash,
                            ujian: updatedUjianNama, // ✅ sekarang benar
                        };
                    }
                    return p;
                })
            );
            return true; // Beri tahu child bahwa proses sukses

        } catch (error: any) {
            // console.error('Error:', error);
            // alert(`Gagal: ${error.message}`);
            return false; // Beri tahu child bahwa proses gagal
        }
    };

    const [isSuccessOpen, setIsSuccessOpen] = React.useState(false);
    const handleHapusPeserta = async (pesertaId: string): Promise<boolean> => {
        try {
            const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
            const response = await fetch(`${apiBaseUrl}/api/admin/peserta/${pesertaId}`, {
                method: 'DELETE', // Gunakan method DELETE
                headers: {
                    'Accept': 'application/json',
                },
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Gagal menghapus peserta.');
            }

            // Jika API sukses menghapus, baru update state di frontend
            setPeserta(prevPeserta => prevPeserta.filter(p => p.id !== pesertaId));

            setIsSuccessOpen(true); // Buka dialog sukses

            return true;

        } catch (error: any) {
            console.error('Error:', error);
            alert(`Gagal: ${error.message}`);
            return false;
        }
    };

    const [isConfirmHapusPilihOpen, setIsConfirmHapusPilihOpen] = React.useState(false);
    const [isSuccessHapusPilihOpen, setIsSuccessHapusPilihOpen] = React.useState(false);
    const handleHapusPilih = () => {
        // Filter state 'peserta'
        setPeserta(prevPeserta =>
            prevPeserta.filter(p => !selectedRows.includes(p.id))
        );

        // Kosongkan kembali daftar baris yang terpilih
        setSelectedRows([]);

        // Buka dialog sukses
        setIsSuccessHapusPilihOpen(true); // <-- TAMBAHKAN INI
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />

            <main className="flex-1 p-8">
                {/* Semua isi konten seperti card, tabel, dll. disokin */}
                <div className=''>
                    <h1 className="text-4xl font-heading font-bold text-[#41366E]">Data Peserta</h1>
                </div>

                {/* Komponen Statistik Peserta biar tinggal panggil euy */}
                <StatistikPeserta />

                <div className='flex justify-end'>
                    <TambahPeserta onTambah={handleTambahPeserta} />
                </div>

                <div className='pt-5 grid grid-cols-1 md:grid-cols-1 gap-4 font-heading'>
                    <Card className='bg-white p-8 shadow-md'>
                        <div className="flex items-center gap-4">
                            <div className="w-6/12">
                                <div className="relative w-full">
                                    <Input
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}

                                        type="search"
                                        placeholder="Cari Nama Peserta"
                                        className="pr-10 text-black placeholder:text-[#524D59] focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none rounded-[28px]"
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <Search className="h-5 w-5 text-[#524D59]" />
                                    </div>
                                </div>
                            </div>
                            <div className="w-3/12">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild className="shadow-md border border-[#524D59] rounded-[10px] text-[#524D59] focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none">
                                        <Button variant="outline">
                                            <p className="pr-12">Status</p>
                                            <ChevronDown size={16} />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="bg-white w-56 text-black">
                                        <DropdownMenuCheckboxItem
                                            checked={showPanel}
                                            onCheckedChange={setShowPanel}
                                        >
                                            Belum Login
                                        </DropdownMenuCheckboxItem>
                                        <DropdownMenuCheckboxItem
                                            checked={showStatusBar}
                                            onCheckedChange={setShowStatusBar}
                                        >
                                            Sedang Ujian
                                        </DropdownMenuCheckboxItem>
                                        <DropdownMenuCheckboxItem
                                            checked={showActivityBar}
                                            onCheckedChange={setShowActivityBar}
                                        >
                                            Sudah Submit
                                        </DropdownMenuCheckboxItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            {/* <div className="w-3/12 justify-end flex">
                                    <Button className='bg-[#CD1F1F] rounded-[10px] text-lg text-base font-heading font-medium'>
                                        <span>Hapus Pilih ({numSelected})</span>
                                    </Button>
                                </div> */}
                            <div className="w-3/12 justify-end flex">
                                <Dialog open={isConfirmHapusPilihOpen} onOpenChange={setIsConfirmHapusPilihOpen}>
                                    <DialogTrigger asChild>
                                        <Button
                                            className='bg-[#CD1F1F] rounded-[10px] text-lg text-base font-heading font-medium'
                                            disabled={numSelected === 0}
                                        >
                                            Hapus Pilih ({numSelected})
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="font-heading bg-white sm:max-w-lg">
                                        {/* Menggunakan form agar strukturnya sama persis */}
                                        <form onSubmit={(e) => {
                                            e.preventDefault(); // Mencegah reload halaman
                                            handleHapusPilih(); // Panggil fungsi hapus
                                            setIsConfirmHapusPilihOpen(false); // Tutup dialog
                                        }}>
                                            <DialogHeader className="flex items-center justify-center">
                                                <DialogTitle className="flex flex-col items-center text-black text-xl font-semibold">
                                                    <Image
                                                        src="/images/hapus.png"
                                                        alt="Logo Hapus"
                                                        width={80}
                                                        height={80}
                                                    />
                                                    <div className="mt-2 text-center">Peringatan!</div>
                                                </DialogTitle>
                                                <DialogDescription className="text-base text-black font-medium text-center">
                                                    {/* Pesan dibuat dinamis sesuai jumlah data */}
                                                    Apakah Anda yakin ingin menghapus {numSelected} peserta terpilih?
                                                </DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter className="grid grid-cols-2 gap-4 mt-4">
                                                <DialogClose asChild>
                                                    <Button type="button" className="w-full text-white bg-[#565656]" variant="outline">
                                                        Tidak
                                                    </Button>
                                                </DialogClose>
                                                <Button className="w-full bg-[#CD1F1F] text-white" type="submit">
                                                    Hapus
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>

                        <div className="border border-[#E4E4E4] rounded-lg overflow-hidden">
                            <Table className='text-black text-center'>
                                <TableHeader>
                                    <TableRow className='border-[#E4E4E4]'>
                                        <TableHead className='text-center'>
                                            <Checkbox
                                                ref={headerCheckboxRef}
                                                onCheckedChange={handleSelectAll}
                                                checked={rowCount > 0 && numSelected === rowCount}
                                            />
                                        </TableHead>
                                        <TableHead className='text-center'>No.</TableHead>
                                        <TableHead className='text-center'>Username</TableHead>
                                        <TableHead className='text-center'>Password</TableHead>
                                        <TableHead className='text-center'>Ujian</TableHead>
                                        <TableHead className='text-center'>Status</TableHead>
                                        <TableHead className='text-center'>Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow><TableCell colSpan={7} className="h-24 text-center">Memuat data...</TableCell></TableRow>
                                    ) : error ? (
                                        <TableRow><TableCell colSpan={7} className="h-24 text-center text-red-500">Error: {error}</TableCell></TableRow>
                                    ) : (
                                        filteredData.map((row) => (
                                            <TableRow key={row.id} className='border-[#E4E4E4]'>
                                                <TableCell><Checkbox onCheckedChange={(checked) => handleSelectRow(row.id, checked as boolean)} checked={selectedRows.includes(row.id)} /></TableCell>
                                                <TableCell>{row.no}</TableCell>
                                                <TableCell>{row.username}</TableCell>
                                                <TableCell>{row.password_hash}</TableCell>
                                                <TableCell>{row.ujian}</TableCell>
                                                <TableCell>{row.status}</TableCell>
                                                <TableCell className="flex justify-center gap-2">
                                                    <EditPeserta peserta={row} onEdit={handleEditPeserta} />
                                                    <HapusPeserta pesertaId={row.id} onHapus={handleHapusPeserta} />
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </div>
                <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
                    <DialogContent className="font-heading bg-white sm:max-w-[425px]">
                        <DialogHeader className="flex items-center justify-center">
                            <DialogTitle className="flex flex-col items-center text-black text-xl font-semibold text-center">
                                <Image
                                    src="/images/berhasil.png"
                                    alt="Logo Berhasil"
                                    width={80}
                                    height={80}
                                />
                                <div className="mt-2">Berhasil</div>
                            </DialogTitle>
                            <DialogDescription className="text-base text-black font-medium">
                                Berhasil Hapus Peserta
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
                </Dialog>
                <Dialog open={isSuccessHapusPilihOpen} onOpenChange={setIsSuccessHapusPilihOpen}>
                    <DialogContent className="font-heading bg-white sm:max-w-[425px]">
                        <DialogHeader className="flex items-center justify-center">
                            <DialogTitle className="flex flex-col items-center text-black text-xl font-semibold text-center">
                                <Image
                                    src="/images/berhasil.png"
                                    alt="Logo Berhasil"
                                    width={80}
                                    height={80}
                                />
                                <div className="mt-2">Berhasil</div>
                            </DialogTitle>
                            <DialogDescription className="text-base text-black font-medium">
                                {/* Sedikit modifikasi pesan agar lebih sesuai */}
                                Berhasil Hapus Peserta Terpilih
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
                </Dialog>
            </main>
        </div>
    );
}