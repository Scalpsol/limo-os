import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, User, Building2, Phone, Mail } from "lucide-react"
import Link from "next/link"
import NewCustomerDialog from "./new-customer-dialog"

export default async function CustomersPage() {
  const supabase = createClient()

  // 1. Kullanıcının Şirket ID'sini bul
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from('profiles')
    .select('company_id')
    .eq('id', user?.id)
    .single()

  // 2. Müşterileri Çek
  const { data: customers } = await supabase
    .from('customers')
    .select('*')
    .eq('company_id', profile?.company_id)
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col h-full">
      
      {/* ÜST BAŞLIK ve BUTONLAR */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Müşteriler</h1>
          <p className="text-sm text-gray-500">Müşteri portföyünü yönet.</p>
        </div>
        <NewCustomerDialog />
      </div>

      {/* ARAMA ÇUBUĞU */}
      <div className="flex items-center gap-2 mb-6 bg-white p-2 rounded-lg border w-full md:w-1/3">
        <Search className="w-4 h-4 text-gray-400" />
        <Input 
            placeholder="İsim veya şirket ara..." 
            className="border-none shadow-none focus-visible:ring-0 h-8"
        />
      </div>

      {/* MÜŞTERİ LİSTESİ (Tablo Görünümü) */}
      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 font-medium border-b">
            <tr>
              <th className="px-6 py-4">Müşteri Adı</th>
              <th className="px-6 py-4">İletişim</th>
              <th className="px-6 py-4">Durum</th>
              <th className="px-6 py-4 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {customers?.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50 transition-colors group">
                
                {/* İsim ve Şirket */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                      {customer.full_name.substring(0,2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{customer.full_name}</p>
                      {customer.company_name && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                            <Building2 className="w-3 h-3" />
                            {customer.company_name}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* İletişim Bilgileri */}
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1 text-gray-600">
                    {customer.email && (
                        <div className="flex items-center gap-2">
                            <Mail className="w-3 h-3" /> {customer.email}
                        </div>
                    )}
                    {customer.phone && (
                        <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3" /> {customer.phone}
                        </div>
                    )}
                  </div>
                </td>

                {/* Durum (Badge) */}
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${customer.status === 'active' ? 'bg-green-100 text-green-800' : 
                      customer.status === 'potential' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}
                  `}>
                    {customer.status === 'active' ? 'Aktif' : customer.status === 'potential' ? 'Potansiyel' : 'Pasif'}
                  </span>
                </td>

                {/* İşlemler */}
                <td className="px-6 py-4 text-right">
                  <Button variant="ghost" size="sm" className="text-gray-400 group-hover:text-blue-600">
                    Düzenle
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Liste Boşsa */}
        {customers?.length === 0 && (
            <div className="p-12 text-center text-gray-400">
                Henüz kayıtlı müşteri yok.
            </div>
        )}
      </div>
    </div>
  )
}