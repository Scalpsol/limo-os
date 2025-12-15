export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full h-screen lg:grid lg:grid-cols-2 overflow-hidden">
      
      {/* SOL TARAFA (%40 - Form Alanı) */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto grid w-[350px] gap-6">
          {children}
        </div>
      </div>

      {/* SAĞ TARAF (%60 - Görsel Alanı) */}
      <div className="hidden lg:block relative bg-muted">
        <div className="absolute inset-0 bg-zinc-900/20 z-10" /> {/* Karartma Efekti */}
        <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')" }}
        />
        <div className="relative z-20 flex h-full flex-col justify-end p-10 text-white">
            <h1 className="text-4xl font-bold mb-2">İşinizi Geleceğe Taşıyın.</h1>
            <p className="text-lg opacity-90">Limo OS ile tüm operasyonlarınızı, takviminizi ve ekibinizi tek bir yerden yönetin.</p>
        </div>
      </div>

    </div>
  )
}