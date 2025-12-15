'use client'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Loader2 } from "lucide-react"
import { useState } from "react"
import { createCustomer } from "./actions"

export default function NewCustomerDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const result = await createCustomer(formData)

    setLoading(false)

    if (result.error) {
      alert("Hata: " + result.error)
    } else {
      setOpen(false) // Pencereyi kapat
      // alert("Müşteri eklendi!") // İstersen açabilirsin
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
          <Plus className="w-4 h-4" /> Yeni Müşteri
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Yeni Müşteri Ekle</DialogTitle>
          <DialogDescription>
            Müşterinin temel iletişim bilgilerini girin.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          
          <div className="grid gap-2">
            <Label htmlFor="fullName">Ad Soyad *</Label>
            <Input id="fullName" name="fullName" required placeholder="Örn: Ayşe Demir" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="companyName">Firma Adı</Label>
            <Input id="companyName" name="companyName" placeholder="Örn: Demir Lojistik" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
                <Label htmlFor="email">E-posta</Label>
                <Input id="email" name="email" type="email" placeholder="ayse@mail.com" />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input id="phone" name="phone" placeholder="0555..." />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status">Durum</Label>
            <select 
                name="status" 
                id="status" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
                <option value="active">Aktif</option>
                <option value="potential">Potansiyel</option>
                <option value="inactive">Pasif</option>
            </select>
          </div>

          <DialogFooter className="mt-4">
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Kaydet
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  )
}