'use client';

import Sidebar from '@/components/dashboard-admin/Sidebar';

import Image from 'next/image';
import {
    Card,
} from "@/components/ui/card"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import StatistikPeserta from '@/components/dashboard-admin/StatistikPeserta';
import React from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Struct untuk Ujian
interface Ujian {
    id: number;
    nama_ujian: string;
    // Tambahkan properti lain yang mungkin Anda butuhkan
    // pendaftar: number; (Ini sepertinya perlu di-query terpisah di backend)
    // sedang_mengerjakan: number;
    // selesai: number;
}

export default function DashboardPage() {
    const [ujianData, setUjianData] = React.useState<Ujian[]>([]); // Beri tahu TypeScript ini adalah array of Ujian
    const [isLoading, setIsLoading] = React.useState(true); // Mulai dengan loading
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const fetchUjianData = async () => {
            try {
                const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
                const response = await fetch(`${apiBaseUrl}/api/admin/ujian`); // Ganti dengan endpoint Anda jika berbeda

                if (!response.ok) {
                    throw new Error('Gagal mengambil data dari server');
                }

                const result = await response.json();

                if (result.success) {
                    setUjianData(result.data); // Simpan data ke state
                } else {
                    throw new Error(result.message || 'Gagal memuat data');
                }

            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false); // Hentikan loading
            }
        };
        fetchUjianData();
    }, []); // Array dependensi kosong agar useEffect hanya berjalan sekali

    // Pengecekan loading sebelum generate tampilan
    if (isLoading) {
        // return (
        //     <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        //         <p className="text-xl font-medium text-gray-500">Memuat Dashboard...</p>
        //         {/* Anda bisa ganti dengan komponen Spinner jika ada */}
        //     </div>
        // );
        return <LoadingSpinner />; // 2. Gunakan komponen di sini
    }

    // Pengecekan error
    if (error) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-100">
                <p className="text-xl font-medium text-red-500">Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />

            {/*Konten Utama*/}
            <main className="flex-1 p-8">
                {/* Semua isi konten seperti card, tabel, dll. disokin */}
                <div className=''>
                    <h1 className="text-4xl font-heading font-bold text-[#41366E]">Dashboard</h1>
                </div>

                {/* Komponen Statistik Peserta biar tinggal panggil euy */}
                <StatistikPeserta />

                <hr className="my-8 border-black" />

                <div className=''>
                    <span className='text-2xl text-black font-heading font-medium'>Statistik Ujian</span>
                </div>

                <div className='pt-5 grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <Card className="bg-white py-4 px-8 shadow-md rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[#41366E] font-semibold text-sm">
                                    Jumlah Ujian
                                </p>
                                <p className="text-[#41366E] font-bold text-6xl leading-tight">
                                    {ujianData.length}
                                </p>
                            </div>
                            <div>
                                <Image
                                    src="/images/jumlah-ujian.png"
                                    alt="Logo Jumlah Ujian"
                                    width={100}
                                    height={100}
                                    priority
                                />
                            </div>
                        </div>
                    </Card>
                </div>

                <div className='pt-5 grid grid-cols-1 md:grid-cols-1 gap-4 font-heading'>
                    <Card className='bg-white p-8 shadow-md'>
                        <div className="border border-[#E4E4E4] rounded-lg overflow-hidden">
                            <Table className='text-black text-center'>
                                <TableHeader>
                                    <TableRow className='border-[#E4E4E4] text-center'>
                                        <TableHead className='text-center'>No.</TableHead>
                                        <TableHead className='text-center'>Nama Ujian</TableHead>
                                        <TableHead className='text-center'>Jumlah Pendaftar</TableHead>
                                        <TableHead className='text-center'>Sedang Mengerjakan</TableHead>
                                        <TableHead className='text-center'>Selesai</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center">Memuat data...</TableCell>
                                        </TableRow>
                                    ) : error ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center text-red-500">{error}</TableCell>
                                        </TableRow>
                                    ) : (
                                        ujianData.map((ujian, index) => (
                                            <TableRow key={ujian.id} className='border-[#E4E4E4]'>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{ujian.nama_ujian}</TableCell>
                                                <TableCell>Belum Dapet Endpoint</TableCell>
                                                <TableCell>Belum Dapet Endpoint</TableCell>
                                                <TableCell>Belum Dapet Endpoint</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </div>
            </main>
        </div>
    );
}