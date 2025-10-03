// File: app/dashboard/Sidebar.tsx

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, FileText, ClipboardCheck, LogOut, ChartColumn, BookText, DoorClosed, DoorOpen } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
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
        <Link
          href="/dashboard-admin"
          aria-current={pathname === '/dashboard-admin' ? 'page' : undefined}
          className={`relative flex text-lg font-heading font-semibold items-center gap-3 py-2 px-3 rounded-[10px] transition-colors ${pathname === '/dashboard-admin'
            ? 'bg-[#41366E] text-white before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:rounded-r-sm before:bg-[#41366E]'
            : 'text-[#41366E] hover:bg-[#41366E] hover:text-white'
            }`}
        >
          <ChartColumn size={20} />
          <span>Dashboard</span>
        </Link>
        <Link
          href="/data-peserta"
          aria-current={pathname === '/data-peserta' ? 'page' : undefined}
          className={`relative flex text-lg font-heading font-semibold items-center gap-3 py-2 px-3 rounded-[10px] transition-colors ${pathname === '/data-peserta'
            ? 'bg-[#41366E] text-white before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:rounded-r-sm before:bg-[#41366E]'
            : 'text-[#41366E] hover:bg-[#41366E] hover:text-white'
            }`}
        >
          <Users size={20} />
          <span>Data Peserta</span>
        </Link>
        <Link
          href="/manajemen-soal"
          aria-current={pathname === '/manajemen-soal' ? 'page' : undefined}
          className={`relative flex text-lg font-heading font-semibold items-center gap-3 py-2 px-3 rounded-[10px] transition-colors ${pathname === '/manajemen-soal'
            ? 'bg-[#41366E] text-white before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:rounded-r-sm before:bg-[#41366E]'
            : 'text-[#41366E] hover:bg-[#41366E] hover:text-white'
            }`}
        >
          <BookText size={20} />
          <span>Manajemen Soal</span>
        </Link>
        <Link
          href="/hasil-ujian"
          aria-current={pathname === '/hasil-ujian' ? 'page' : undefined}
          className={`relative flex text-lg font-heading font-semibold items-center gap-3 py-2 px-3 rounded-[10px] transition-colors ${pathname === '/hasil-ujian'
            ? 'bg-[#41366E] text-white before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:rounded-r-sm before:bg-[#41366E]'
            : 'text-[#41366E] hover:bg-[#41366E] hover:text-white'
            }`}
        >
          <ClipboardCheck size={20} />
          <span>Hasil Ujian</span>
        </Link>
        <Link
          href="/login-admin"
          className="relative flex text-lg font-heading font-semibold text-[#41366E] items-center gap-3 hover:bg-red-600 hover:text-white py-2 px-3 rounded-[10px] transition-colors"
        >
          <DoorOpen size={20} />
          <span>Log Out</span>
        </Link>
      </nav>
    </aside>
  );
}