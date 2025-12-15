'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

// --- LOGIN İŞLEMİ ---
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

// --- KAYIT OLMA (REGISTER) İŞLEMİ ---
export async function signup(formData: FormData) {
  const supabase = createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const firstName = formData.get('first-name') as string
  const lastName = formData.get('last-name') as string
  const companyName = formData.get('company') as string

  // 1. Kullanıcıyı Auth sistemine kaydet
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) {
    return { error: authError.message }
  }

  if (authData.user) {
    // 2. Şirketi Oluştur
    const { data: companyData, error: companyError } = await supabase
      .from('companies')
      .insert([{ name: companyName }])
      .select()
      .single()

    if (companyError) {
        // Hata olursa kullanıcıya bildir (Gerçek hayatta auth kaydını da silmek gerekebilir)
        return { error: 'Şirket oluşturulamadı: ' + companyError.message }
    }

    // 3. Profil Oluştur (Kullanıcıyı şirkete bağla)
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: authData.user.id, // Auth ID ile aynı olmalı
          company_id: companyData.id,
          full_name: `${firstName} ${lastName}`,
          email: email,
          role: 'admin' // İlk kaydolan admin olur
        }
      ])
      
      if (profileError) {
        return { error: 'Profil oluşturulamadı: ' + profileError.message }
      }
  }

  redirect('/dashboard')
}