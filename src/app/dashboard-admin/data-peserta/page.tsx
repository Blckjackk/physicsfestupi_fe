"use client"

import * as React from "react"


import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Pencil, Search, Trash } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import Image from 'next/image';

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

const data_peserta = [
    { id: '1', no: 1, username: 'asep123', password: 'tes123', ujian: 'Ujian A', status: 'Sedang Ujian' },
    { id: '2', no: 2, username: 'inibudi', password: 'tes123', ujian: 'Ujian B', status: 'Sedang Ujian' },
    { id: '3', no: 3, username: 'andiiii10', password: 'tes123', ujian: 'Ujian C', status: 'Selesai' },
    { id: '4', no: 4, username: 'dimas09', password: 'tes123', ujian: 'Ujian A', status: 'Belum Mulai' },
    { id: '5', no: 5, username: 'alfidingin', password: 'tes123', ujian: 'Ujian E', status: 'Sedang Ujian' },
    { id: '6', no: 6, username: 'azampkez', password: 'tes123', ujian: 'Ujian A', status: 'Sedang Ujian' },
    { id: '7', no: 7, username: 'muklisss', password: 'tes123', ujian: 'Ujian A', status: 'Sedang Ujian' },
];

type Checked = DropdownMenuCheckboxItemProps["checked"]

export default function DashboardPage() {
    // State buat nyimpen ID baris dari data yang terpilih (yang dicentang)
    const [selectedRows, setSelectedRows] = useState<string[]>([]);

    // Ref buat checkbox di header (untuk state indeterminate)
    const headerCheckboxRef = useRef<HTMLButtonElement>(null);

    // Ngitung jumlah baris yg kepilih dan total baris dari data asli
    const numSelected = selectedRows.length;
    const rowCount = data_peserta.length;

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
            const allRowIds = data_peserta.map((row) => row.id);
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

    // State buat nyimpen teks dari input search
    const [searchQuery, setSearchQuery] = useState('');
    // State buat nyimpen data yang udah difilter dan akan ditampilkan
    const [filteredData, setFilteredData] = useState(data_peserta);

    useEffect(() => {
        // Kalo query kosong, tampilkan semua data
        if (searchQuery === '') {
            setFilteredData(data_peserta);
        } else {
            // Kalo ada query, filter data
            const newFilteredData = data_peserta.filter(item =>
                // Ubah username dan query ke huruf kecil agar case-insensitive
                item.username.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredData(newFilteredData);
        }
    }, [searchQuery]);

    const [showStatusBar, setShowStatusBar] = React.useState<Checked>(true)
    const [showActivityBar, setShowActivityBar] = React.useState<Checked>(true)
    const [showPanel, setShowPanel] = React.useState<Checked>(true)

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />

            <main className="flex-1 p-8">
                {/* Semua isi konten seperti card, tabel, dll. disokin */}
                <div className=''>
                    <h1 className="text-4xl font-heading font-bold text-[#41366E]">Dashboard</h1>
                </div>

                {/* Komponen Statistik Peserta biar tinggal panggil euy */}
                <StatistikPeserta />

                <div className='flex justify-end'>
                    <Button className='bg-[#41366E] mt-8 rounded-[10px] text-base font-heading font-bold py-6' size={"lg"}>
                        <Image
                            src="/images/tambah-peserta.png"
                            alt="Simbol Tambah Peserta"
                            width={24}
                            height={24}
                        />
                        <span>Tambah Peserta</span>
                    </Button>
                </div>

                <div className='pt-5 grid grid-cols-1 md:grid-cols-1 gap-4 font-heading'>
                    <Card className='bg-white p-8 shadow-md border border-[#524D59] rounded-[28px]'>
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
                                            Belum Ujian
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
                                            Selesai
                                        </DropdownMenuCheckboxItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <div className="w-3/12 justify-end flex">
                                <Button className='bg-[#CD1F1F] rounded-[10px] text-lg text-base font-heading font-medium'>
                                    <span>Hapus Pilih ({numSelected})</span>
                                </Button>
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
                                    {filteredData.map((row) => (
                                        <TableRow key={row.id} className='border-[#E4E4E4]'>
                                            <TableCell className='text-center'>
                                                <Checkbox
                                                    onCheckedChange={(checked) => handleSelectRow(row.id, checked as boolean)}
                                                    checked={selectedRows.includes(row.id)}
                                                />
                                            </TableCell>
                                            <TableCell>{row.no}</TableCell>
                                            <TableCell>{row.username}</TableCell>
                                            <TableCell>{row.password}</TableCell>
                                            <TableCell>{row.ujian}</TableCell>
                                            <TableCell>{row.status}</TableCell>
                                            <TableCell className='text-center'>
                                                <Pencil size={18} className="inline mr-2 cursor-pointer" />
                                                <Trash size={18} className="inline mr-2 cursor-pointer" />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </div>
            </main>
        </div>
    );
}