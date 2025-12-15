import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function RegisterPage() {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold text-blue-600">Limo.</h1>
        <h2 className="text-2xl font-bold">Hesap Oluştur</h2>
        <p className="text-balance text-muted-foreground">
          Ekibinizi yönetmeye başlamak için katılın.
        </p>
      </div>
      
      <div className="grid gap-4 mt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="first-name">Ad</Label>
            <Input id="first-name" placeholder="Adınız" required className="bg-gray-50" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="last-name">Soyad</Label>
            <Input id="last-name" placeholder="Soyadınız" required className="bg-gray-50" />
          </div>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="company">Şirket Adı</Label>
          <Input id="company" placeholder="Şirketiniz" required className="bg-gray-50" />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">E-posta</Label>
          <Input id="email" type="email" placeholder="m@ornek.com" required className="bg-gray-50" />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="password">Şifre</Label>
          <Input id="password" type="password" required className="bg-gray-50" />
        </div>
        
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
          Kayıt Ol ve Başla
        </Button>
      </div>

      <div className="mt-4 text-center text-sm">
        Zaten hesabınız var mı?{" "}
        <Link href="/login" className="underline text-blue-600 font-medium">
          Giriş Yap
        </Link>
      </div>
    </div>
  )
}