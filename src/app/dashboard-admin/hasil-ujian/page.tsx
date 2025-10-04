"use client"

import * as React from "react"


import { useState, useEffect, useRef } from 'react';
import { ChevronDown, FileCheck, Pencil, Search, Trash } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import Image from 'next/image';

import Sidebar from '@/components/dashboard-admin/Sidebar';

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


export default function HasilUjian() {
    const [peserta, setPeserta] = React.useState(data_peserta_initial);

    // State buat nyimpen ID baris dari data yang terpilih (yang dicentang)
    const [selectedRows, setSelectedRows] = useState<string[]>([]);

    const [position, setPosition] = React.useState("Urut Berdasarkan");

    // Ref buat checkbox di header (untuk state indeterminate)
    const headerCheckboxRef = useRef<HTMLButtonElement>(null);

    // Ngitung jumlah baris yg kepilih dan total baris dari data asli
    const numSelected = selectedRows.length;
    const rowCount = peserta.length;

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
            const allRowIds = peserta.map((row) => row.id);
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
        setPeserta(prevPeserta => prevPeserta.filter(p => p.id !== pesertaId));

        // Buka dialog sukses
        setIsSuccessOpen(true);
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
        setIsSuccessHapusPilihOpen(true);
    };

    // State buat nyimpen teks dari input search
    const [searchQuery, setSearchQuery] = useState('');

    const sortedAndFilteredData = React.useMemo(() => {
        let dataToProcess = peserta.filter(item =>
            item.username.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (position === "Urut Berdasarkan") {
            return dataToProcess; // Langsung kembalikan data yang sudah difilter tanpa di-sort
        }

        // Jika ada pilihan sorting, baru jalankan logika .sort()
        const sorted = [...dataToProcess].sort((a, b) => {
            const parseDate = (dateString: string) => {
                const [datePart, timePart] = dateString.split(' ');
                const [day, month, year] = datePart.split('/');
                const time = timePart.replace(/\./g, ':');
                return new Date(`${year}-${month}-${day}T${time}`);
            };

            const dateA = parseDate(a.selesai);
            const dateB = parseDate(b.selesai);

            if (position === "Terlama") {
                return dateA.getTime() - dateB.getTime();
            }
            return dateB.getTime() - dateA.getTime(); // Default 'Terbaru'
        });

        return sorted;
    }, [searchQuery, position, peserta]);

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
                                    {sortedAndFilteredData.map((row) => (
                                        <TableRow key={row.id} className='border-[#E4E4E4]'>
                                            <TableCell className='text-center'>
                                                <Checkbox
                                                    onCheckedChange={(checked) => handleSelectRow(row.id, checked as boolean)}
                                                    checked={selectedRows.includes(row.id)}
                                                />
                                            </TableCell>
                                            <TableCell>{row.no}</TableCell>
                                            <TableCell>{row.username}</TableCell>
                                            <TableCell>{row.nama_ujian}</TableCell>
                                            <TableCell>{row.mulai}</TableCell>
                                            <TableCell>{row.selesai}</TableCell>
                                            <TableCell>{row.jumlah_soal}</TableCell>
                                            <TableCell>{row.terjawab}</TableCell>
                                            <TableCell className='text-center'>
                                                <Link href={`/dashboard-admin/hasil-ujian/detail/${row.id}`}>
                                                    <FileCheck size={18} className="inline mr-2 cursor-pointer" />
                                                </Link>
                                                <HapusPeserta pesertaId={row.id} onHapus={handleHapusPeserta} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </div>
                <div className='flex justify-end'>
                    <Button className='bg-[#41366E] mt-8 rounded-[10px] text-base font-heading font-bold py-6 pr-12' size={"lg"}>
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