import Sidebar from '@/components/dashboard-admin/Sidebar';

export default function DashboardPage() {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />

            {/*Area Konten Utama*/}
            <main className="flex-1 p-8">
                {/* Semua isi konten seperti card, tabel, dll. disokin */}
                <div className=''></div>
                <h1 className="text-4xl font-heading font-bold text-[#41366E]">Dashboard</h1>
            </main>
        </div>
    );
}