import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold text-blue-600">Limo.</h1>
        <h2 className="text-2xl font-bold">Tekrar Hoşgeldiniz</h2>
        <p className="text-balance text-muted-foreground">
          Hesabınıza erişmek için bilgilerinizi girin.
        </p>
      </div>
      
      <div className="grid gap-4 mt-4">
        <div className="grid gap-2">
          <Label htmlFor="email">E-posta</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@ornek.com"
            required
            className="bg-gray-50"
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Şifre</Label>
            <Link
              href="#"
              className="ml-auto inline-block text-sm underline text-blue-600"
            >
              Şifremi unuttum?
            </Link>
          </div>
          <Input id="password" type="password" required className="bg-gray-50" />
        </div>
        
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
          Giriş Yap
        </Button>
      </div>

      <div className="mt-4 text-center text-sm">
        Hesabınız yok mu?{" "}
        <Link href="/register" className="underline text-blue-600 font-medium">
          Hemen Kayıt Ol
        </Link>
      </div>
    </div>
  )
}