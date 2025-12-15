'use server'

import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js' // Admin için saf kütüphane
import { redirect } from 'next/navigation'

// --- LOGIN İŞLEMİ (Burası Aynı) ---
export async function login(formData: FormData) {
  const supabase = createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/dashboard')
}

// --- KAYIT OLMA (REGISTER) - GÜNCELLENDİ 🔥 ---
export async function signup(formData: FormData) {
  // 1. Standart Auth işlemi için normal client
  const supabase = createClient()

  // 2. Veritabanı işlemleri için ADMIN client (RLS'i bypass eder)
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // .env.local'a eklediğin key
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const firstName = formData.get('first-name') as string
  const lastName = formData.get('last-name') as string
  const companyName = formData.get('company') as string

  // 3. Kullanıcıyı Auth sistemine kaydet (Burası standart kalır)
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) {
    console.error("Auth Hatası:", authError)
    return { error: authError.message }
  }

  if (authData.user) {
    // 4. Şirketi Oluştur (ADMIN YETKİSİYLE) 🛡️
    const { data: companyData, error: companyError } = await supabaseAdmin
      .from('companies')
      .insert([{ name: companyName }])
      .select()
      .single()

    if (companyError) {
        console.error("Şirket Hatası:", companyError)
        return { error: 'Şirket oluşturulamadı: ' + companyError.message }
    }

    // 5. Profil Oluştur (ADMIN YETKİSİYLE) 🛡️
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert([
        {
          id: authData.user.id,
          company_id: companyData.id,
          full_name: `${firstName} ${lastName}`,
          email: email,
          role: 'admin'
        }
      ])
      
      if (profileError) {
        console.error("Profil Hatası:", profileError)
        return { error: 'Profil oluşturulamadı: ' + profileError.message }
      }
  }

  redirect('/dashboard')
}