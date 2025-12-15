'use client'

import { Button } from "@/components/ui/button"
import { Trash2, Loader2 } from "lucide-react"
import { useState } from "react"
import { deleteFile } from "./actions"

export default function DeleteButton({ fileId, storagePath }: { fileId: string, storagePath: string }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Bu dosyayı silmek istediğine emin misin?")
    if (!confirmDelete) return

    setIsDeleting(true)
    
    try {
      const result = await deleteFile(fileId, storagePath)
      if (result?.error) {
        alert("Hata: " + result.error)
      }
      // Başarılıysa zaten sayfa yenilenecek (revalidatePath sayesinde)
    } catch (e) {
      alert("Bir şeyler ters gitti.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Button 
        onClick={handleDelete}
        disabled={isDeleting}
        variant="outline" 
        className="w-full flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
    >
        {isDeleting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
            <Trash2 className="w-4 h-4" />
        )}
        {isDeleting ? 'Siliniyor...' : 'Sil'}
    </Button>
  )
}