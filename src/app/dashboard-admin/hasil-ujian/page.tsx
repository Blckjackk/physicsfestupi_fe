"use client"

import * as React from "react"
import * as XLSX from "xlsx";

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, FileCheck, Pencil, Search, Trash } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import Image from 'next/image';

import Sidebar from '@/components/dashboard-admin/Sidebar';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from "@/components/ui/input";

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
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { HapusPeserta } from "./hapus/page";
import Link from "next/link";

const data_peserta_initial = [
    { id: '1', no: 1, username: 'asep123', nama_ujian: 'Ujian A', mulai: '01/10/2025 10:00:00', selesai: '01/10/2025 12:00:00', jumlah_soal: 100, terjawab: 100 },
    { id: '2', no: 2, username: 'asep124', nama_ujian: 'Ujian A', mulai: '03/10/2025 10:00:00', selesai: '03/10/2025 11:00:00', jumlah_soal: 100, terjawab: 100 },
    { id: '3', no: 3, username: 'asep125', nama_ujian: 'Ujian A', mulai: '02/10/2025 10:00:00', selesai: '02/10/2025 13:00:00', jumlah_soal: 100, terjawab: 100 },
    { id: '4', no: 4, username: 'ajam', nama_ujian: 'Ujian A', mulai: '05/09/2025 10:00:00', selesai: '05/09/2025 12:00:00', jumlah_soal: 100, terjawab: 100 },
    { id: '5', no: 5, username: 'asep127', nama_ujian: 'Ujian A', mulai: '15/10/2025 10:00:00', selesai: '15/10/2025 11:30:00', jumlah_soal: 100, terjawab: 100 },
    { id: '6', no: 6, username: 'asep128', nama_ujian: 'Ujian A', mulai: '20/08/2025 10:00:00', selesai: '20/08/2025 12:00:00', jumlah_soal: 100, terjawab: 100 },
    { id: '7', no: 7, username: 'asep129', nama_ujian: 'Ujian A', mulai: '01/01/2026 10:00:00', selesai: '01/01/2026 12:00:00', jumlah_soal: 100, terjawab: 100 },
];

interface HasilUjian {
    no: number;
    username: string;
    nama_ujian: string;
    mulai: string;
    selesai: string;
    jumlah_soal: number;
    terjawab: number;
    progress: string;
    status: string;
    peserta_id: number;
    ujian_id: number;
    aktivitas_id: number;
}

export default function HasilUjian() {
    // const [peserta, setPeserta] = React.useState(data_peserta_initial);
    const [hasilUjian, setHasilUjian] = useState<HasilUjian[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State buat nyimpen ID baris dari data yang terpilih (yang dicentang)
    const [selectedRows, setSelectedRows] = useState<string[]>([]);

    const [position, setPosition] = React.useState("Urut Berdasarkan");

    // Ref buat checkbox di header (untuk state indeterminate)
    const headerCheckboxRef = useRef<HTMLButtonElement>(null);

    // State buat nyimpen teks dari input search
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchHasilUjian = async () => {
            try {
                const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
                const response = await fetch(`${apiBaseUrl}/api/admin/jawaban/peserta`);

                if (!response.ok) {
                    throw new Error('Gagal mengambil data hasil ujian');
                }

                const result = await response.json();
                if (result.success) {
                    setHasilUjian(result.data);
                } else {
                    throw new Error(result.message || 'Gagal memuat data');
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchHasilUjian();
    }, []);

    const sortedAndFilteredData = React.useMemo(() => {
        let dataToProcess = hasilUjian.filter(item =>
            item.username.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (position === "Urut Berdasarkan") {
            return dataToProcess;
        }

        return [...dataToProcess].sort((a, b) => {
            const parseDate = (dateString: string) => {
                if (dateString === '-') return new Date(0); // Handle non-date strings
                const [datePart, timePart] = dateString.split(' ');
                const [day, month, year] = datePart.split('/');
                return new Date(`${year}-${month}-${day}T${timePart}`);
            };
            const dateA = parseDate(a.selesai);
            const dateB = parseDate(b.selesai);
            return position === "Terlama" ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
        });
    }, [searchQuery, position, hasilUjian]);

    // Ngitung jumlah baris yg kepilih dan total baris dari data asli
    const numSelected = selectedRows.length;
    const rowCount = sortedAndFilteredData.length;

    // Efek buat ngatur state indeterminate pada checkbox header
    useEffect(() => {
        if (headerCheckboxRef.current) {
            const state = numSelected > 0 && numSelected < rowCount
                ? 'indeterminate'
                : (rowCount > 0 && numSelected === rowCount)
                    ? 'checked'
                    : 'unchecked';

            headerCheckboxRef.current.dataset.state = state;
        }
    }, [selectedRows, rowCount, numSelected]);

    // Fungsi buat kasus klik "select all" di header table
    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            const allRowIds = sortedAndFilteredData.map((row) => row.aktivitas_id.toString());
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

    const [isSuccessOpen, setIsSuccessOpen] = React.useState(false);
    const handleHapusPeserta = (pesertaId: string) => {
        // Hapus data dari state peserta
        setHasilUjian(prevHasilUjian => prevHasilUjian.filter(p => p.aktivitas_id.toString() !== pesertaId));

        // Buka dialog sukses
        setIsSuccessOpen(true);
    };

    const [isConfirmHapusPilihOpen, setIsConfirmHapusPilihOpen] = React.useState(false);
    const [isSuccessHapusPilihOpen, setIsSuccessHapusPilihOpen] = React.useState(false);
    const handleHapusPilih = () => {
        // Filter state 'peserta'
        setHasilUjian(prevHasilUjian => prevHasilUjian.filter(p => !selectedRows.includes(p.aktivitas_id.toString())));

        // Kosongkan kembali daftar baris yang terpilih
        setSelectedRows([]);

        // Buka dialog sukses
        setIsSuccessHapusPilihOpen(true);
    };

    const handleExportExcel = () => {
        // 1. Siapkan nama kolom untuk header di Excel
        const headers = [
            "No.",
            "Username",
            "Nama Ujian",
            "Waktu Mulai",
            "Waktu Selesai",
            "Jumlah Soal",
            "Soal Terjawab"
        ];

        // 2. Format ulang data `sortedAndFilteredData` agar sesuai dengan header
        const dataToExport = sortedAndFilteredData.map(row => ({
            "No.": row.no,
            "Username": row.username,
            "Nama Ujian": row.nama_ujian,
            "Waktu Mulai": row.mulai,
            "Waktu Selesai": row.selesai,
            "Jumlah Soal": row.jumlah_soal,
            "Soal Terjawab": row.terjawab
        }));

        // 3. Buat worksheet dari data
        const worksheet = XLSX.utils.json_to_sheet(dataToExport, { header: headers });

        // 4. (Opsional) Atur lebar kolom agar tidak terlalu sempit
        const columnWidths = [
            { wch: 5 },   // No.
            { wch: 20 },  // Username
            { wch: 15 },  // Nama Ujian
            { wch: 20 },  // Waktu Mulai
            { wch: 20 },  // Waktu Selesai
            { wch: 12 },  // Jumlah Soal
            { wch: 12 },  // Soal Terjawab
        ];
        worksheet["!cols"] = columnWidths;

        // 5. Buat workbook baru dan tambahkan worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Hasil Ujian");

        // 6. Generate file Excel dan trigger download
        XLSX.writeFile(workbook, "Hasil_Ujian_Peserta.xlsx");
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />

            <main className="flex-1 p-8">
                {/* Semua isi konten seperti card, tabel, dll. disokin */}
                <div className=''>
                    <h1 className="text-4xl font-heading font-bold text-[#41366E]">Hasil Ujian</h1>
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
                                            <p className="pr-12">{position}</p>
                                            <ChevronDown size={16} />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="bg-white w-56 text-black">
                                        <DropdownMenuLabel>Filter Data</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
                                            <DropdownMenuRadioItem value="Urut Berdasarkan">Default (No.)</DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value="Terbaru">Terbaru</DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value="Terlama">Terlama</DropdownMenuRadioItem>
                                        </DropdownMenuRadioGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
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
                                        <TableHead className='text-center'>Nama Ujian</TableHead>
                                        <TableHead className='text-center'>Mulai</TableHead>
                                        <TableHead className='text-center'>Selesai</TableHead>
                                        <TableHead className='text-center'>Jumlah Soal</TableHead>
                                        <TableHead className='text-center'>Terjawab</TableHead>
                                        <TableHead className='text-center'>Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow><TableCell colSpan={9} className="h-24 text-center">Memuat data hasil ujian...</TableCell></TableRow>
                                    ) : error ? (
                                        <TableRow><TableCell colSpan={9} className="h-24 text-center text-red-500">Error: {error}</TableCell></TableRow>
                                    ) : (
                                        sortedAndFilteredData.map((row) => (
                                            <TableRow key={row.aktivitas_id} className='border-[#E4E4E4]'>
                                                <TableCell><Checkbox /></TableCell>
                                                <TableCell>{row.no}</TableCell>
                                                <TableCell>{row.username}</TableCell>
                                                <TableCell>{row.nama_ujian}</TableCell>
                                                <TableCell>{row.mulai}</TableCell>
                                                <TableCell>{row.selesai}</TableCell>
                                                <TableCell>{row.jumlah_soal}</TableCell>
                                                <TableCell>{row.terjawab}</TableCell>
                                                <TableCell className='text-center'>
                                                    <Link href={`/dashboard-admin/hasil-ujian/detail/${row.peserta_id}/${row.ujian_id}`}>
                                                        <FileCheck size={18} className="inline mr-2 cursor-pointer" />
                                                    </Link>
                                                    {/* Hapus di sini menggunakan aktivitas_id */}

                                                    <HapusPeserta pesertaId={row.aktivitas_id.toString()} onHapus={handleHapusPeserta} /></TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </div>
                <div className='flex justify-end'>
                    <Button className='bg-[#41366E] mt-8 rounded-[10px] text-base font-heading font-bold py-6 pr-12 cursor-pointer' size={"lg"} onClick={handleExportExcel}>
                        <Image
                            src="/images/export.png"
                            alt="Simbol Export"
                            width={24}
                            height={24}
                        />
                        <span>Export Hasil</span>
                    </Button>
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