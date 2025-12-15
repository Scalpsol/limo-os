'use client'

import { Button } from "@/components/ui/button"
import { createBrowserClient } from "@supabase/ssr"
import { Upload, Loader2 } from "lucide-react"
import { useRef, useState } from "react"
import { saveFileRecord } from "./actions"

export default function UploadButton() {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Supabase Client (Browser için)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    try {
      // 1. Dosya ismini temizle ve benzersiz yap
      // (Türkçe karakterleri ve boşlukları temizler)
      const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, '_')
      const fileName = `${Date.now()}_${cleanName}`
      
      // 2. Supabase Storage'a Yükle
      const { data, error: uploadError } = await supabase
        .storage
        .from('limo-files')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // 3. Veritabanına Kaydet (Server Action)
      const result = await saveFileRecord({
        name: file.name,
        type: file.type,
        size: file.size,
        path: fileName
      })

      if (result.error) throw new Error(result.error)

      alert("Dosya başarıyla yüklendi! ✅")
      
    } catch (error: any) {
      console.error(error)
      alert("Hata oluştu: " + error.message)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      
      <Button 
        onClick={() => fileInputRef.current?.click()} 
        disabled={isUploading}
        className="gap-2 bg-blue-600 hover:bg-blue-700"
      >
        {isUploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Yükleniyor...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" />
            Dosya Yükle
          </>
        )}
      </Button>
    </>
  )
}