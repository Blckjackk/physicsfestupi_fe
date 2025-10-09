"use client"

import * as React from "react"
import { use, useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';

import Sidebar from '@/components/dashboard-admin/Sidebar';
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { format } from "date-fns";
import { useAdminGuard } from "@/hooks/useAuthGuard";

interface DetailJawaban {
    peserta: { id: number; username: string; };
    ujian: { id: number; nama_ujian: string; };
    aktivitas: { status: string; waktu_login: string; waktu_submit: string; durasi: number | null; };
    statistik: { total_soal: number; dijawab: number; kosong: number; benar: number; salah: number; nilai: number; };
    soal_jawaban: {
        nomor_soal: number;
        pertanyaan: string;
        jawaban_benar: string;
        jawaban_peserta: string | null;
        is_correct: boolean | null;
    }[];
}

const data_peserta_initial = [
    { id: '1', no: 1, username: 'asep12345', nama_ujian: 'Ujian A', mulai: '01/10/2025 10:00:00', selesai: '01/10/2025 12:00:00', jumlah_soal: 100, terjawab: 100 },
    { id: '2', no: 2, username: 'asep124', nama_ujian: 'Ujian A', mulai: '03/10/2025 10:00:00', selesai: '03/10/2025 11:00:00', jumlah_soal: 100, terjawab: 100 },
    { id: '3', no: 3, username: 'asep125', nama_ujian: 'Ujian A', mulai: '02/10/2025 10:00:00', selesai: '02/10/2025 13:00:00', jumlah_soal: 100, terjawab: 100 },
    { id: '4', no: 4, username: 'ajam', nama_ujian: 'Ujian A', mulai: '05/09/2025 10:00:00', selesai: '05/09/2025 12:00:00', jumlah_soal: 100, terjawab: 100 },
    { id: '5', no: 5, username: 'asep127', nama_ujian: 'Ujian A', mulai: '15/10/2025 10:00:00', selesai: '15/10/2025 11:30:00', jumlah_soal: 100, terjawab: 100 },
    { id: '6', no: 6, username: 'asep128', nama_ujian: 'Ujian A', mulai: '20/08/2025 10:00:00', selesai: '20/08/2025 12:00:00', jumlah_soal: 100, terjawab: 100 },
    { id: '7', no: 7, username: 'asep129', nama_ujian: 'Ujian A', mulai: '01/01/2026 10:00:00', selesai: '01/01/2026 12:00:00', jumlah_soal: 100, terjawab: 100 },
];

export default function DetailHasilUjianPage({ params }: { params: Promise<{ peserta_id: string; ujian_id: string }> }) {
    const { isLoading: authLoading, isAuthenticated } = useAdminGuard();
    const resolvedParams = use(params);

    const { peserta_id, ujian_id } = resolvedParams;


    const [detailData, setDetailData] = useState<DetailJawaban | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!peserta_id || !ujian_id) return;

        const fetchDetail = async () => {
            try {
                const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
                const response = await fetch(`${apiBaseUrl}/admin/jawaban/peserta/${peserta_id}/ujian/${ujian_id}`);

                if (!response.ok) {
                    throw new Error('Gagal mengambil detail jawaban dari server.');
                }
                const result = await response.json();
                if (result.success) {
                    setDetailData(result.data);
                } else {
                    throw new Error(result.message || 'Data tidak ditemukan.');
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetail();
    }, [peserta_id, ujian_id]);

    // Fungsi untuk mengubah format tanggal ISO ke dd/mm/yy HH:mm
    const formatWaktu = (isoString: string | null) => {
        if (!isoString) {
            return '-'; // Kembalikan strip jika data tidak ada
        }
        try {
            const tanggal = new Date(isoString);
            return format(tanggal, 'dd/MM/yy HH:mm');
        } catch (error) {
            return 'Invalid Date'; // Tangani jika format tidak valid
        }
    };

    // Fungsi untuk mengubah TOTAL MENIT menjadi format "X Jam Y Menit"
    const formatDurasi = (totalMenit: number | null) => {
        // 1. Tangani jika data tidak ada atau nol
        if (!totalMenit || totalMenit <= 0) {
            return '-';
        }

        // 2. Hitung jam dan sisa menit
        const jam = Math.floor(totalMenit / 60);
        const menit = totalMenit % 60;

        // 3. Bangun string hasilnya
        let hasil = '';
        if (jam > 0) {
            hasil += `${jam} Jam `;
        }
        if (menit > 0) {
            hasil += `${menit} Menit`;
        }

        // Jika hasilnya kosong (misalnya durasi 0), kembalikan strip
        return hasil.trim() || '-';
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div className="flex min-h-screen"><Sidebar /><main className="flex-1 p-8"><p className="text-red-500">Error: {error}</p></main></div>
        );
    }

    if (!detailData) {
        return (
            <div className="flex min-h-screen"><Sidebar /><main className="flex-1 p-8"><p>Data tidak ditemukan.</p></main></div>
        );
    }

    const { peserta, ujian, aktivitas, statistik, soal_jawaban } = detailData;

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
                            <div className="col-span-2 mx-8 p-4">
                                <p className="text-start text-black font-medium text-base">Username</p>
                                <p className="text-start text-black font-medium text-base rounded-lg border mt-3 p-2 shadow-md">{peserta.username}</p>
                            </div>
                            <div className="col-span-2 mx-8 p-4">
                                <p className="text-start text-black font-medium text-base">Waktu Mulai</p>
                                <p className="text-start text-black font-medium text-base rounded-lg border mt-3 p-2 shadow-md">{formatWaktu(aktivitas.waktu_login)}</p>
                            </div>
                            <div className="col-span-2 mx-8 p-4">
                                <p className="text-start text-black font-medium text-base">Total Waktu</p>
                                <p className="text-start text-black font-medium text-base rounded-lg border mt-3 p-2 shadow-md">{(formatDurasi(aktivitas.durasi)) || '-'}</p>
                            </div>

                            {/* Baris Ketiga: 2 Div (Masing-masing mengambil 3 dari 6 kolom) */}
                            <div className="col-span-2 mx-8 p-4">
                                <p className="text-start text-black font-medium text-base">Nama Ujian</p>
                                <p className="text-start text-black font-medium text-base rounded-lg border mt-3 p-2 shadow-md">{ujian.nama_ujian}</p>
                            </div>
                            <div className="col-span-2 mx-8 p-4 mb-4">
                                <p className="text-start text-black font-medium text-base">Waktu Selesai</p>
                                <p className="text-start text-black font-medium text-base rounded-lg border mt-3 p-2 shadow-md">{formatWaktu(aktivitas.waktu_submit)}</p>
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
                                    {soal_jawaban.map((item) => (
                                        <TableRow key={item.nomor_soal} className="border-[#E4E4E4]">
                                            <TableCell className="text-start px-4">{item.nomor_soal}</TableCell>
                                            <TableCell className="text-start px-4 truncate">
                                                <div className="truncate">{item.pertanyaan}</div>
                                            </TableCell>
                                            <TableCell className={`text-start px-4 font-bold ${item.is_correct ? 'text-green-600' : 'text-red-600'}`}>
                                                {item.jawaban_peserta || '-'}
                                            </TableCell>
                                            {/* <TableCell className="text-center px-4">{item.jawaban_benar}</TableCell> */}
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