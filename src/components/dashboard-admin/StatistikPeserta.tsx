import Image from 'next/image';
import { Card } from "@/components/ui/card";

const statsData = [
  {
    title: "Peserta Ujian",
    value: "200",
    color: "#41366E",
    imageSrc: "/images/peserta.png",
    alt: "Logo Peserta Ujian",
  },
  {
    title: "Belum Mulai",
    value: "120",
    color: "#FFAC27",
    imageSrc: "/images/belum-mulai.png",
    alt: "Logo Belum Mulai",
  },
  {
    title: "Sedang Mengerjakan",
    value: "100",
    color: "#CD1F1F",
    imageSrc: "/images/sedang-mengerjakan.png",
    alt: "Logo Sedang Mengerjakan",
  },
  {
    title: "Sudah Submit",
    value: "80",
    color: "#749221",
    imageSrc: "/images/sudah-submit.png",
    alt: "Logo Sudah Submit",
  },
];

function StatCard({ title, value, color, imageSrc, alt }: typeof statsData[0]) {
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


export default function StatistikPeserta() {
  return (
    <div>
      <div className='pt-10'>
        <span className='text-2xl text-black font-heading font-medium'>Statistik Peserta</span>
      </div>
      <div className='pt-5 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4'>
        {statsData.map((stat, index) => (
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