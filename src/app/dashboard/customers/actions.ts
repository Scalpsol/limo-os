'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createCustomer(formData: FormData) {
  const supabase = createClient()

  // 1. Oturum kontrolü
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Oturum açılmamış.' }

  // 2. Şirket ID'sini bul
  const { data: profile } = await supabase
    .from('profiles')
    .select('company_id')
    .eq('id', user.id)
    .single()

  if (!profile?.company_id) return { error: 'Şirket bilgisi yok.' }

  // 3. Form verilerini al
  const fullName = formData.get('fullName') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const companyName = formData.get('companyName') as string
  const status = formData.get('status') as string

  // 4. Veritabanına kaydet
  const { error } = await supabase.from('customers').insert({
    company_id: profile.company_id,
    full_name: fullName,
    email: email,
    phone: phone,
    company_name: companyName,
    status: status || 'active'
  })

  if (error) {
    console.error('Kayıt hatası:', error)
    return { error: 'Müşteri oluşturulamadı.' }
  }

  // 5. Sayfayı yenile
  revalidatePath('/dashboard/customers')
  return { success: true }
}