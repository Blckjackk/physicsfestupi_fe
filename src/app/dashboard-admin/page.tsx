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
                <div className='pt-10'>
                    <span className='text-2xl text-black font-heading font-medium'>Statistik Peserta</span>
                </div>
                <div className='pt-5 grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <Card className='bg-white font-heading p-4 shadow-md'>
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex flex-col">
                                <p className="text-[#41366E] text-base font-semibold">Peserta Ujian</p>
                                <p className="text-[#41366E] text-[60px] font-bold leading-none">200</p>
                            </div>
                            <div>
                                <Image
                                    src="/images/peserta.png"
                                    alt="Logo Peserta Ujian"
                                    width={80}
                                    height={80}
                                    priority
                                />
                            </div>
                        </div>
                    </Card>
                    <Card className='bg-white font-heading p-4 shadow-md'>
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex flex-col">
                                <p className="text-[#FFAC27] text-base font-semibold">Belum Mulai</p>
                                <p className="text-[#FFAC27] text-[60px] font-bold leading-none">120</p>
                            </div>
                            <div>
                                <Image
                                    src="/images/belum-mulai.png"
                                    alt="Logo Belum Mulai"
                                    width={80}
                                    height={80}
                                    priority
                                />
                            </div>
                        </div>
                    </Card>
                    <Card className='bg-white font-heading p-4 shadow-md'>
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex flex-col">
                                <p className="text-[#CD1F1F] text-base font-semibold">Sedang Mengerjakan</p>
                                <p className="text-[#CD1F1F] text-[60px] font-bold leading-none">100</p>
                            </div>
                            <div>
                                <Image
                                    src="/images/sedang-mengerjakan.png"
                                    alt="Logo Sedang Mengerjakan"
                                    width={80}
                                    height={80}
                                    priority
                                />
                            </div>
                        </div>
                    </Card>
                    <Card className='bg-white font-heading p-4 shadow-md'>
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex flex-col">
                                <p className="text-[#749221] text-base font-semibold">Sudah Submit</p>
                                <p className="text-[#749221] text-[60px] font-bold leading-none">80</p>
                            </div>
                            <div>
                                <Image
                                    src="/images/sudah-submit.png"
                                    alt="Logo Sudah Submit"
                                    width={80}
                                    height={80}
                                    priority
                                />
                            </div>
                        </div>
                    </Card>
                </div>
                <hr className="my-8 border-black" />
                <div className=''>
                    <span className='text-2xl text-black font-heading font-medium'>Statistik Ujian</span>
                </div>
                <div className='pt-5 grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <Card className='bg-white font-heading p-4 shadow-md'>
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex flex-col">
                                <p className="text-[#41366E] text-base font-semibold">Jumlah Ujian</p>
                                <p className="text-[#41366E] text-[60px] font-bold leading-none">5</p>
                            </div>
                            <div>
                                <Image
                                    src="/images/peserta.png"
                                    alt="Logo Peserta Ujian"
                                    width={80}
                                    height={80}
                                    priority
                                />
                            </div>
                        </div>
                    </Card>
                </div>
                <div className='pt-5 grid grid-cols-1 md:grid-cols-1 gap-4'>
                    <Card className='bg-white font-heading p-4 shadow-md'>
                        <Table className='text-black'>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>No.</TableHead>
                                    <TableHead>Nama Ujian</TableHead>
                                    <TableHead>Jumlah Pendaftar</TableHead>
                                    <TableHead>Sedang Mengerjakan</TableHead>
                                    <TableHead>Selesai</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>1</TableCell>
                                    <TableCell>Ujian A</TableCell>
                                    <TableCell>200</TableCell>
                                    <TableCell>1</TableCell>
                                    <TableCell>199</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>2</TableCell>
                                    <TableCell>Ujian B</TableCell>
                                    <TableCell>111</TableCell>
                                    <TableCell>1</TableCell>
                                    <TableCell>199</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>3</TableCell>
                                    <TableCell>Ujian C</TableCell>
                                    <TableCell>200</TableCell>
                                    <TableCell>1</TableCell>
                                    <TableCell>199</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>4</TableCell>
                                    <TableCell>Ujian D</TableCell>
                                    <TableCell>131</TableCell>
                                    <TableCell>1</TableCell>
                                    <TableCell>199</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>5</TableCell>
                                    <TableCell>Ujian E</TableCell>
                                    <TableCell>12</TableCell>
                                    <TableCell>1</TableCell>
                                    <TableCell>199</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Card>
                </div>
            </main>
        </div>
    );
}