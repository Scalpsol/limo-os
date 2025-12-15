'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function saveFileRecord(fileData: {
  name: string,
  type: string,
  size: number,
  path: string
}) {
  const supabase = createClient()

  // 1. Kim yüklüyor?
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Oturum açılmamış.' }

  // 2. Kullanıcının şirketi ne?
  const { data: profile } = await supabase
    .from('profiles')
    .select('company_id')
    .eq('id', user.id)
    .single()

  if (!profile?.company_id) return { error: 'Şirket bilgisi bulunamadı.' }

  // 3. Veritabanına kaydet
  const { error } = await supabase.from('files').insert({
    company_id: profile.company_id,
    name: fileData.name,
    file_type: fileData.type,
    size: fileData.size,
    storage_path: fileData.path,
    note: '' // İstersek sonra not ekleriz
  })

  if (error) {
    console.error('DB kayıt hatası:', error)
    return { error: error.message }
  }

  // 4. Sayfayı yenile (Yeni dosya görünsün)
  revalidatePath('/dashboard/files')
  return { success: true }
}

// ... (yukarıdaki importlar ve saveFileRecord fonksiyonu kalsın) ...

export async function deleteFile(fileId: string, storagePath: string) {
  const supabase = createClient()

  // 1. Önce Storage'dan (Depodan) Sil
  const { error: storageError } = await supabase
    .storage
    .from('limo-files')
    .remove([storagePath])

  if (storageError) {
    console.error('Storage silme hatası:', storageError)
    return { error: 'Dosya depodan silinemedi.' }
  }

  // 2. Sonra Veritabanından Sil
  const { error: dbError } = await supabase
    .from('files')
    .delete()
    .eq('id', fileId)

  if (dbError) {
    console.error('DB silme hatası:', dbError)
    return { error: 'Veritabanı kaydı silinemedi.' }
  }

  // 3. Sayfayı Yenile (Dosya listeden kaybolsun)
  revalidatePath('/dashboard/files')
  
  // Eğer detay açıksa URL'i temizlemek için redirect kullanabiliriz ama 
  // şimdilik kullanıcı manuel kapatır veya revalidate yeterli olur.
  return { success: true }
}