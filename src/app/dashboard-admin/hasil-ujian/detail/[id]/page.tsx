"use client"

import * as React from "react"
import { use } from 'react';
import { ArrowLeft } from 'lucide-react';

import Sidebar from '@/components/dashboard-admin/Sidebar';
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const data_peserta_initial = [
    { id: '1', no: 1, username: 'asep12345', nama_ujian: 'Ujian A', mulai: '01/10/2025 10:00:00', selesai: '01/10/2025 12:00:00', jumlah_soal: 100, terjawab: 100 },
    { id: '2', no: 2, username: 'asep124', nama_ujian: 'Ujian A', mulai: '03/10/2025 10:00:00', selesai: '03/10/2025 11:00:00', jumlah_soal: 100, terjawab: 100 },
    { id: '3', no: 3, username: 'asep125', nama_ujian: 'Ujian A', mulai: '02/10/2025 10:00:00', selesai: '02/10/2025 13:00:00', jumlah_soal: 100, terjawab: 100 },
    { id: '4', no: 4, username: 'ajam', nama_ujian: 'Ujian A', mulai: '05/09/2025 10:00:00', selesai: '05/09/2025 12:00:00', jumlah_soal: 100, terjawab: 100 },
    { id: '5', no: 5, username: 'asep127', nama_ujian: 'Ujian A', mulai: '15/10/2025 10:00:00', selesai: '15/10/2025 11:30:00', jumlah_soal: 100, terjawab: 100 },
    { id: '6', no: 6, username: 'asep128', nama_ujian: 'Ujian A', mulai: '20/08/2025 10:00:00', selesai: '20/08/2025 12:00:00', jumlah_soal: 100, terjawab: 100 },
    { id: '7', no: 7, username: 'asep129', nama_ujian: 'Ujian A', mulai: '01/01/2026 10:00:00', selesai: '01/01/2026 12:00:00', jumlah_soal: 100, terjawab: 100 },
];

export default function DetailHasilUjian({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params); // <-- 2. "Buka" promise-nya
    const id = resolvedParams.id;      // <-- 3. Baru akses propertinya
    const data = data_peserta_initial.find(item => item.id === id);

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <main className="flex-1 p-8">
                {/* Semua isi konten seperti card, tabel, dll. disokin */}
                <div className=''>
                    <h1 className="flex items-center gap-x-4 text-4xl font-heading font-bold text-[#41366E]">
                        <Link href="/dashboard-admin/hasil-ujian">
                            <ArrowLeft className="cursor-pointer" size={32} />
                        </Link>
                        <span>Detail Hasil Ujian</span>
                    </h1>
                </div>

                <div className='pt-8 grid grid-cols-1 md:grid-cols-1 gap-4 font-heading'>
                    <div className="border border-[#E4E4E4] rounded-lg overflow-hidden bg-white shadow-md">
                        <div className="grid grid-cols-6">
                            {/* Baris Pertama: 1 Div (Mengambil 6 dari 6 kolom) */}
                            <div className="col-span-6 rounded-t-lg bg-[#41366E] p-4">
                                <p className="text-start font-bold text-base pl-8">Hasil Ujian</p>
                            </div>

                            {/* Baris Kedua: 3 Div (Masing-masing mengambil 2 dari 6 kolom) */}
                            <div className="col-span-2 mx-8 p-4 mt-4">
                                <p className="text-start text-black font-medium text-base">Username</p>
                                <p className="text-start text-black font-medium text-base rounded-lg border mt-3 p-2 shadow-md">{data?.username}</p>
                            </div>
                            <div className="col-span-2 mx-8 p-4">
                                <p className="text-start text-black font-medium text-base">Waktu Mulai</p>
                                <p className="text-start text-black font-medium text-base rounded-lg border mt-3 p-2 shadow-md">dd/mm/yy --:--</p>
                            </div>
                            <div className="col-span-2 mx-8 p-4">
                                <p className="text-start text-black font-medium text-base">Total Waktu</p>
                                <p className="text-start text-black font-medium text-base rounded-lg border mt-3 p-2 shadow-md">1 Jam 30 Menit</p>
                            </div>

                            {/* Baris Ketiga: 2 Div (Masing-masing mengambil 3 dari 6 kolom) */}
                            <div className="col-span-2 mx-8 p-4">
                                <p className="text-start text-black font-medium text-base">Nama Ujian</p>
                                <p className="text-start text-black font-medium text-base rounded-lg border mt-3 p-2 shadow-md">{data?.nama_ujian}</p>
                            </div>
                            <div className="col-span-2 mx-8 p-4 mb-4">
                                <p className="text-start text-black font-medium text-base">Username</p>
                                <p className="text-start text-black font-medium text-base rounded-lg border mt-3 p-2 shadow-md">dd/mm/yy --:--</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='pt-5 grid grid-cols-1 md:grid-cols-1 gap-4 font-heading'>
                    <Card className='bg-white p-8 shadow-md'>
                        <div className="border border-[#E4E4E4] rounded-lg overflow-hidden">
                            <Table className='table-fixed w-full text-black text-start'>
                                <TableHeader>
                                    <TableRow className='border-[#E4E4E4] text-start'>
                                        <TableHead className='w-[10%] text-start px-4'>No.</TableHead>
                                        <TableHead className='w-[40%] text-start'>Soal</TableHead>
                                        <TableHead className='w-[50%] text-start'>Jawaban</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {Array.from({ length: 10 }, (_, index) => index + 1).map((nomor) => (
                                        <TableRow key={nomor} className='border-[#E4E4E4]'>
                                            <TableCell className="px-4">{nomor}</TableCell> {/* <-- Nomor dinamis */}
                                            <TableCell>Seorang siswa melakukan...</TableCell>
                                            <TableCell>A</TableCell>
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