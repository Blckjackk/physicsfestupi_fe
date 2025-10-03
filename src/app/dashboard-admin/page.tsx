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

export default function DashboardPage() {
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
                                    5
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
                                    <TableRow className='border-[#E4E4E4]'>
                                        <TableCell>1</TableCell>
                                        <TableCell>Ujian A</TableCell>
                                        <TableCell>200</TableCell>
                                        <TableCell>1</TableCell>
                                        <TableCell>199</TableCell>
                                    </TableRow>
                                    <TableRow className='border-[#E4E4E4]'>
                                        <TableCell>2</TableCell>
                                        <TableCell>Ujian B</TableCell>
                                        <TableCell>111</TableCell>
                                        <TableCell>1</TableCell>
                                        <TableCell>199</TableCell>
                                    </TableRow>
                                    <TableRow className='border-[#E4E4E4]'>
                                        <TableCell>3</TableCell>
                                        <TableCell>Ujian C</TableCell>
                                        <TableCell>200</TableCell>
                                        <TableCell>1</TableCell>
                                        <TableCell>199</TableCell>
                                    </TableRow>
                                    <TableRow className='border-[#E4E4E4]'>
                                        <TableCell>4</TableCell>
                                        <TableCell>Ujian D</TableCell>
                                        <TableCell>131</TableCell>
                                        <TableCell>1</TableCell>
                                        <TableCell>199</TableCell>
                                    </TableRow>
                                    <TableRow className='border-[#E4E4E4]'>
                                        <TableCell>5</TableCell>
                                        <TableCell>Ujian E</TableCell>
                                        <TableCell>12</TableCell>
                                        <TableCell>1</TableCell>
                                        <TableCell>199</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </div>
            </main>
        </div>
    );
}