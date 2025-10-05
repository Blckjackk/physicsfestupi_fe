import Image from 'next/image';
import { Card } from "@/components/ui/card";

// const statsData = [
//   {
//     title: "Peserta Ujian",
//     value: "200",
//     color: "#41366E",
//     imageSrc: "/images/peserta.png",
//     alt: "Logo Peserta Ujian",
//   },
//   {
//     title: "Belum Mulai",
//     value: "120",
//     color: "#FFAC27",
//     imageSrc: "/images/belum-mulai.png",
//     alt: "Logo Belum Mulai",
//   },
//   {
//     title: "Sedang Mengerjakan",
//     value: "100",
//     color: "#CD1F1F",
//     imageSrc: "/images/sedang-mengerjakan.png",
//     alt: "Logo Sedang Mengerjakan",
//   },
//   {
//     title: "Sudah Submit",
//     value: "80",
//     color: "#749221",
//     imageSrc: "/images/sudah-submit.png",
//     alt: "Logo Sudah Submit",
//   },
// ];


interface StatistikData {
  peserta_ujian: number;
  belum_login: number;
  belum_mulai: number;
  sedang_mengerjakan: number;
  sudah_submit: number;
}




export default function StatistikPeserta({ data }: { data: StatistikData | null }) {
  if (!data) {
    return (
      <div className='pt-10'>
        <span className='text-2xl text-black font-heading font-medium'>Statistik Peserta</span>
        <p className="text-gray-500 mt-2">Memuat statistik...</p>
      </div>
    );
  }

  const dynamicStatsData = [
    {
      title: "Peserta Ujian",
      value: data.peserta_ujian.toString(),
      color: "#41366E",
      imageSrc: "/images/peserta.png",
      alt: "Logo Peserta Ujian",
    },
    {
      title: "Belum Mengerjakan",
      // Gabungkan 'belum_login' dan 'belum_mulai'
      value: (data.belum_login + data.belum_mulai).toString(),
      color: "#FFAC27",
      imageSrc: "/images/belum-mulai.png",
      alt: "Logo Belum Mulai",
    },
    {
      title: "Sedang Mengerjakan",
      value: data.sedang_mengerjakan.toString(),
      color: "#CD1F1F",
      imageSrc: "/images/sedang-mengerjakan.png",
      alt: "Logo Sedang Mengerjakan",
    },
    {
      title: "Sudah Submit",
      value: data.sudah_submit.toString(),
      color: "#749221",
      imageSrc: "/images/sudah-submit.png",
      alt: "Logo Sudah Submit",
    },
  ];

  function StatCard({ title, value, color, imageSrc, alt }: typeof dynamicStatsData[0]) {
    return (
      <Card className="bg-white py-4 px-8 shadow-md rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-sm" style={{ color }}>
              {title}
            </p>
            <p className="font-bold text-6xl leading-tight" style={{ color }}>
              {value}
            </p>
          </div>
          <div>
            <Image
              src={imageSrc}
              alt={alt}
              width={100}
              height={100}
              priority
            />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <div className='pt-10'>
        <span className='text-2xl text-black font-heading font-medium'>Statistik Peserta</span>
      </div>
      <div className='pt-5 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4'>
        {dynamicStatsData.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            color={stat.color}
            imageSrc={stat.imageSrc}
            alt={stat.alt}
          />
        ))}
      </div>
    </div>
  );
}