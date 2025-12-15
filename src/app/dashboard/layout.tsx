import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      
      {/* SOL TARAFA - SIDEBAR (Şimdilik Statik) */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50 bg-white border-r">
        <div className="h-16 flex items-center px-6 border-b">
          <span className="text-xl font-bold text-blue-600">Limo OS</span>
        </div>
        <div className="flex-1 py-6 px-4">
          <nav className="space-y-2">
            <div className="px-2 py-2 text-sm font-medium text-gray-900 bg-gray-100 rounded-md">
              Ana Sayfa
            </div>
            <div className="px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md cursor-pointer">
              Dosyalar
            </div>
            <div className="px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md cursor-pointer">
              Takvim
            </div>
          </nav>
        </div>
      </aside>

      {/* SAĞ TARAF - ANA İÇERİK */}
      <main className="flex-1 md:ml-64">
        {/* Üst Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-8">
          <h2 className="text-lg font-semibold text-gray-800">Panel</h2>
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
            U
          </div>
        </header>

        {/* Sayfa İçeriği (Page.tsx buraya gelecek) */}
        <div className="p-8">
          {children}
        </div>
      </main>
      
    </div>
  );
}