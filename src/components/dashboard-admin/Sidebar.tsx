// File: app/dashboard/Sidebar.tsx

import Link from 'next/link';
import Image from 'next/image';
import { LayoutDashboard, Users, FileText, ClipboardCheck, LogOut, ChartColumn, BookText, DoorClosed, DoorOpen } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="w-[314px] bg-[#ffffff] p-4 flex flex-col">
      
      {/* Logo + Judul */}
      <div className="mb-10 flex items-center justify-center gap-3">
        <Image 
          src="/images/logos/brand/logo-phyfest.png"
          alt="Physics Fest Logo"
          width={50}      
          height={50}     
          priority        
        />
        <h1 className="text-[#41366E] text-lg font-heading font-extrabold">Physics Fest UPI 2025</h1> 
      </div>

      {/* Profil Admin */}
      <div className="flex flex-col items-center gap-2 mb-10">
        <Image 
          src="/images/profile.png"
          alt="Physics Fest Logo"
          width={122}      
          height={115}     
          priority        
        />
        <p className="text-[#41366E] text-lg font-heading font-extrabold">Admin</p>
      </div>

      {/* Menu Navigasi */}
      <nav className="flex flex-col gap-2">
        <Link href="#" className="flex text-lg font-heading font-semibold items-center gap-3 bg-[#41366E] py-2 px-3 rounded-[10px]">
          <ChartColumn size={20} />
          <span>Dashboard</span>
        </Link>
        <Link href="#" className="flex text-lg font-heading font-semibold text-[#41366E] items-center gap-3 hover:bg-[#41366E] hover:text-[white] py-2 px-3 rounded-[10px]">
          <Users size={20} />
          <span>Data Peserta</span>
        </Link>
        <Link href="#" className="flex text-lg font-heading font-semibold text-[#41366E] items-center gap-3 hover:bg-[#41366E] hover:text-[white] py-2 px-3 rounded-[10px]">
          <BookText size={20} />
          <span>Manajemen Soal</span>
        </Link>
        <Link href="#" className="flex text-lg font-heading font-semibold text-[#41366E] items-center gap-3 hover:bg-[#41366E] hover:text-[white] py-2 px-3 rounded-[10px]">
          <ClipboardCheck size={20} />
          <span>Hasil Ujian</span>
        </Link>
        <Link href="#" className="flex text-lg font-heading font-semibold text-[#41366E] items-center gap-3 hover:bg-[#41366E] hover:text-[white] py-2 px-3 rounded-[10px]">
          <DoorOpen size={20} />
          <span>Log Out</span>
        </Link>
      </nav>
    </aside>
  );
}