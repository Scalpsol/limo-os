export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Genel Bakış</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Örnek Kartlar */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Toplam Çalışan</h3>
          <p className="text-3xl font-bold mt-2">12</p>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Aktif Görevler</h3>
          <p className="text-3xl font-bold mt-2">5</p>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Bekleyen Dosyalar</h3>
          <p className="text-3xl font-bold mt-2">3</p>
        </div>
      </div>
    </div>
  )
}